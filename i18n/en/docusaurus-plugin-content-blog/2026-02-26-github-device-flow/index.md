---
slug: github-device-flow-deep-dive
title: "Your remote AI agent needs auth? A Device Flow protocol deep-dive"
description: "No browser, no sudo — how do you authenticate on a bare-metal machine? This article starts from a real pain point and dismantles the entire RFC 8628 protocol."
tags: [GitHub, OAuth, Device Flow, CLI, RFC]
date: 2026-02-26
authors: [booker]
---

I was setting up GitHub CLI on a TencentOS server recently — an AI agent was running on it, and I needed to talk to it via phone IM. Classic authentication puzzle:

- No browser (remote server, no GUI)
- No sudo (can only install to my `~/bin`)
- Needed `gh` to authenticate and create PRs
- **Critical: couldn't send a Token through the IM chat** (IM servers, chat history, agent context — every layer sees it)

Traditional OAuth requires browser redirects. Not an option here.

First instinct: generate a Personal Access Token manually, pipe it in with `gh auth login --with-token`. It works, but it's painful — open GitHub settings, find the token page, select permissions, copy, paste in terminal. Months later when the token expires, repeat everything.

I dug through GitHub CLI's docs and found it uses a different path by default: **Device Flow** (device authorization grant). Running `gh auth login --web` prints a verification code. You open `github.com/login/device` on another device, enter the code, and the terminal auto-completes auth.

The whole process takes under two minutes. I thought — this is clever. Worth taking apart to see how it works under the hood.

{/* truncate */}

## Installing the CLI without sudo

First, the environment. This server is a typical setup:

```bash
# No sudo, manual gh install
mkdir -p ~/bin
cd /tmp
curl -fsSL https://github.com/cli/cli/releases/download/v2.62.0/gh_2.62.0_linux_amd64.tar.gz -o gh.tar.gz
tar -xzf gh.tar.gz
cp gh_2.62.0_linux_amd64/bin/gh ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/bin:$PATH"
gh --version
```

Then authentication:

```bash
gh auth login --web --hostname github.com --git-protocol https
```

Terminal output:

```
! First copy your one-time code: BFEE-895F
Open this URL to continue in your web browser: https://github.com/login/device
```

I opened the link on my laptop, entered the code, clicked Authorize. Back in the terminal, hit Enter—

```
✓ Authentication complete.
✓ Logged in as binggg
```

Done. No SSH keys, no manual token entry, no `sudo`.

But one detail caught my eye: **the terminal just printed a code and started polling — how did it know I completed authorization on my browser?** The communication happened entirely between the CLI and GitHub's servers. The browser never talked to the terminal.

That's what makes Device Flow interesting.

---

## Device authorization: decoupling "login" from the device

Device Flow's core idea is simple.

Traditional OAuth authorization code flow assumes the user has a browser — the app can redirect to an auth page and back. But smart TVs, CLI tools, IoT devices — these don't have a browser, or typing a URL is painfully impractical.

The solution: **let the user authorize on a different device, while the device polls for the result.**

I later read the RFC 8628 spec and found the whole flow breaks down into four steps:

### Step 1: Device requests a verification code

The CLI sends a POST to the authorization server:

```
POST https://github.com/login/device/code
client_id=xxx&scope=repo,gist
```

The server responds:

```json
{
  "device_code": "3584d83530557fdd1f46af8289938c8ef79f9dc5",
  "user_code": "BFEE-895F",
  "verification_uri": "https://github.com/login/device",
  "expires_in": 900,
  "interval": 5
}
```

Three key fields:
- **`user_code`** (BFEE-895F) — the code you type manually, 8 characters, human-friendly
- **`device_code`** (40 chars) — used internally by the client, never shown to the user
- **`interval`** (5 seconds) — suggested polling interval from the server

### Step 2: You work in the browser

The terminal prints the verification code. You open `github.com/login/device` on your phone, enter it. At this point the browser and GitHub's server complete the full OAuth authorization — you log in, review permissions, click Authorize.

Note: **This step has zero direct communication with the terminal.** Your phone's browser doesn't know the terminal exists, and the terminal doesn't know what you did on your phone.

### Step 3: Device polls continuously

This is the cleverest part. The terminal doesn't know when you'll finish authorizing, so it asks the server every 5 seconds: "Did they click yet?"

```
POST /login/oauth/access_token
device_code=xxx&grant_type=urn:ietf:params:oauth:grant-type:device_code
```

Not yet:

```json
{"error": "authorization_pending"}
```

Authorized:

```json
{"access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a", "scope": "repo,gist"}
```

The polling isn't infinite. The `device_code` expires in 15 minutes. If it times out, the client must stop and error. On `expired_token`, the client should tell the user to restart.

### Step 4: Use the token

Once you have the token, it's standard OAuth:

```bash
curl -H "Authorization: Bearer gho_xxx" https://api.github.com/user
```

---

## Polling strategy: how important is client "politeness"?

When actually writing polling code, there are subtleties around `interval` and error handling that I didn't expect.

RFC 8628 defines 5 error codes, each with different client behavior:

| Error | Meaning | Client action |
|---|---|---|
| `authorization_pending` | User hasn't clicked | Wait `interval` seconds, retry |
| `slow_down` | You're polling too fast | **Add 5 extra seconds**, use new interval going forward |
| `expired_token` | 15-minute timeout | Stop. Tell user to restart. |
| `access_denied` | User declined | Stop. Don't continue. |
| `invalid_grant` | Device code invalid | Probably a bug. Report error. |

`slow_down` is the most thoughtful design decision — many protocols just 429 and disconnect. Device Flow has a dedicated error code telling the client "I'm not saying don't ask, just ask more slowly." When you receive this, add 5 seconds to your current interval.

A correct polling implementation looks like:

```python
import time, requests

def poll_for_token(device_code, client_id, interval=5):
    timeout = 900
    elapsed = 0
    
    while elapsed < timeout:
        r = requests.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": client_id,
                "device_code": device_code,
                "grant_type": "urn:ietf:params:oauth:grant-type:device_code"
            },
            headers={"Accept": "application/json"}
        )
        data = r.json()
        
        if "access_token" in data:
            return data["access_token"]
        
        err = data.get("error")
        if err == "authorization_pending":
            time.sleep(interval)
            elapsed += interval
        elif err == "slow_down":
            interval += 5  # permanent increase
            time.sleep(interval)
            elapsed += interval
        elif err in ("expired_token", "access_denied"):
            raise Exception(f"Authorization failed: {err}")
        else:
            raise Exception(f"Unknown error: {err}")
    
    raise Exception("Authorization timeout")
```

Two easy-to-miss points:
1. **On `slow_down`, the 5-second increase is permanent.** You don't revert to the original interval. RFC 8628 requires this.
2. **You can show progress feedback during polling.** `gh auth login` just waits silently — a spinner or countdown would tell the user the program is still running.

---

## Device Flow vs traditional OAuth: not a replacement, a complement

After reading RFC 8628, I put together this comparison:

| | Authorization Code Flow | Device Flow |
|---|---|---|
| Use case | Web / Mobile apps | CLI / IoT / Headless devices |
| Browser required | Yes, on the same device | No, can be on a different device |
| Auth method | Automatic browser redirect | Manual code entry |
| Callback | Server receives code param | Client polls |
| `client_secret` | Required | Not needed (public client) |
| UX | Smooth, seamless | Multi-device, manual entry |

GitHub CLI's choice of Device Flow makes practical sense: CLI might run in Docker containers, CI environments, or jump boxes — none of which have browsers, and configuring callback URLs is painful. Device Flow doesn't need a registered callback URL, doesn't need `client_secret` (which a CLI binary couldn't keep secret anyway). It's the simplest approach for CLI tools.

---

## Security: is an 8-character code enough?

My first reaction was that 8 characters is too short. Reading RFC 8628's design rationale helped me understand the trade-off.

8 characters from a 20-character alphabet (uppercase with ambiguous characters removed) gives 20⁸ ≈ 2³⁴·⁵ bits of entropy. Not high on its own, but combined with several constraints it's sufficient:

1. **15-minute expiry** — short time window
2. **Rate limiting** — max 50 code attempts per hour
3. **One-time `device_code`** — one device code, one token, consumed immediately

The real security risk isn't code length — it's **remote phishing**. An attacker could fake a page asking for the code and then authorize with their own account. GitHub mitigates this by showing device type, IP address, and permission scope on the authorization page, giving the user information to make a judgment.

Token storage is another easy-to-miss issue. `gh` stores tokens in `~/.config/gh/hosts.yml` with `chmod 600`. If you're writing your own Device Flow tooling, don't leak tokens to shell history or store them in plain text. macOS users can use Keychain, Linux users can use Secret Service:

```bash
# macOS
security add-generic-password -a "$USER" -s "github_token" -w "gho_xxx"

# Linux
secret-tool store --label="GitHub Token" service github user "$USER"
```

---

## Why Device Flow is the best auth method for AI Agents

I was actually solving another problem when I wrote this article: an AI agent runs on a remote server, I talk to it via phone IM. The agent needs GitHub API access to manage repos, create PRs, handle issues — but how do you give it credentials securely?

The most intuitive approach is sending the Token through the IM chat. It's also the most dangerous one.

```
IM Token path:
  You → [ IM Server ] → [ Chat History ] → [ Agent Context ]
                                                ↓
                                          Every layer sees your Token
```

Once the Token enters the chat, the IM server has it, your local chat history has it, and the agent's message context has it. And Tokens don't expire on their own — obtain it once, use it forever.

Device Flow solves this differently: **your machine never touches the Token.**

1. The agent prints a verification code (`BFEE-895F`) in the chat
2. You open `github.com/login/device` — GitHub's official auth page, not a link the agent gave you
3. Enter the code and authorize on GitHub's page
4. The Token goes directly from GitHub's server to the agent (server-to-server)

```
Device Flow path:
  Agent prints code → you see it
        ↓
  You open github.com/login/device → enter code → complete OAuth
        ↓
  Token goes from GitHub to agent (server-to-server, no middle layers)
```

Your IM only ever sees an 8-character verification code (15-minute validity, single-use). The Token never passes through your chat history.

Looking back, if your agent needs remote auth — Device Flow is about the only way to keep secrets out of your chat logs.

---

## 🥚 Easter egg

If you frequently set up GitHub auth on remote servers, here's a script that does the whole thing in one command — download `gh` + authenticate + configure git user:

```bash
# remote-gh-setup.sh
# Run on the remote server: curl -fsSL https://gist.github.com/binggg/xxx/remote-gh-setup.sh | bash
# Then open https://github.com/login/device on your own machine and enter the code

set -e

# 1. Install gh to ~/bin
mkdir -p ~/bin
curl -fsSL https://github.com/cli/cli/releases/latest/download/gh_*_linux_amd64.tar.gz \
  | tar -xz -C /tmp
cp /tmp/gh_*/bin/gh ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/bin:$PATH"

# 2. Start Device Flow auth
gh auth login --web --git-protocol https

# 3. Configure git user
gh api user --jq '.login' | xargs -I{} git config --global user.name "{}"
gh api user --jq '.email // .login + "@users.noreply.github.com"' | xargs -I{} git config --global user.email "{}"

echo "✅ Done! Logged in as $(gh api user --jq '.login')"
```

This script covers the whole pipeline from my previous article. If you've run into environmental constraints I haven't encountered, drop a comment.

---

How does your remote agent handle auth? DIY Token setup or Device Flow? Comments below 👇

*Based on GitHub CLI v2.62.0, RFC 8628 (published August 2019), and one real deployment verification.*
