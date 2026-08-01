---
slug: github-device-flow-deep-dive
title: 你的 Agent 在云端需要认证？Device Flow 协议拆解
description: 没有浏览器、没有 sudo，怎么在一台裸机上完成 GitHub 认证？这篇文章从一次踩坑出发拆了 RFC 8628 全协议。
tags: [GitHub, OAuth, Device Flow, CLI, RFC]
date: 2026-02-26
image: /og/github-device-flow-deep-dive.png
authors: [booker]
---

前阵子在一台 TencentOS 服务器上配 GitHub CLI——AI Agent 跑在上面，需要通过手机 IM 跟它对话。遇到了一个经典场景：

- 没有浏览器（远程服务器，没图形界面）
- 没有 sudo 权限（只能装到自己 `~/bin`）
- 需要 `gh` 能正常认证、创建 PR
- **关键：不能把 Token 直接发给 Agent**——不管走什么通道，Token 一旦进了 Agent 的上下文就会被记录、可能被写入日志、甚至出现在训练数据里

传统 OAuth 流程要在浏览器里跳转。这里行不通。

第一个直觉是手动生成 Personal Access Token，`gh auth login --with-token` 灌进去。能用，但很麻烦——你要打开 GitHub 设置页、找到 Token 生成页面、选权限、复制、回到终端粘贴。隔几个月 Token 过期了，再来一遍。

我翻了翻 GitHub CLI 文档，发现它默认走的是一条不同的路：**Device Flow**（设备授权流）。执行 `gh auth login --web`，终端打印一串验证码，你去另外一台设备上打开 `github.com/login/device` 输入它，这边自动完成认证。

整个流程不到两分钟。当时觉得——这东西挺聪明的，值得拆开看看里面怎么跑的。

{/* truncate */}

![](./images/cover.png)
*图：文章配图*

## 部署场景：无 sudo 装 gh

先把环境搭起来。这台服务器的情况很典型：

```bash
# 无 sudo，手动装 gh
mkdir -p ~/bin
cd /tmp
curl -fsSL https://github.com/cli/cli/releases/download/v2.62.0/gh_2.62.0_linux_amd64.tar.gz -o gh.tar.gz
tar -xzf gh.tar.gz
cp gh_2.62.0_linux_amd64/bin/gh ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/bin:$PATH"
gh --version
```

装完之后跑认证：

```bash
gh auth login --web --hostname github.com --git-protocol https
```

终端输出：

```
! First copy your one-time code: BFEE-895F
Open this URL to continue in your web browser: https://github.com/login/device
```

我在笔记本上打开链接，输入验证码，点击授权。回到终端按回车——

```
✓ Authentication complete.
✓ Logged in as binggg
```

结束了。没有配 SSH 密钥，没有手动填 Token，没有 `sudo`。

但这里有个细节我盯了很久：**终端只是打印了一串验证码然后开始轮询，是怎么知道我在浏览器上完成了授权的？** 这一段通信完全发生在客户端和 GitHub 服务器之间，浏览器全程没跟终端说过一句话。

这就是 Device Flow 有意思的地方。

---

## 设备授权：把"登录"从设备上抽走

Device Flow 的核心想法其实很简单。

传统 OAuth 授权码流程假设用户有一个浏览器，应用可以重定向用户到授权页面再跳回来。但智能电视、CLI 工具、IoT 设备——这些设备根本没有浏览器，或者有浏览器但输入 URL 极其痛苦。

解决方式：**让用户在另一台设备上完成授权，设备自己轮询等结果。**

我后来翻了 RFC 8628 标准文档，发现整个流程可以拆成四个步骤：

### Step 1：设备请求验证码

CLI 向授权服务器发一个 POST，告诉它"我想走设备流认证"：

```
POST https://github.com/login/device/code
client_id=xxx&scope=repo,gist
```

服务器返回一堆东西：

```json
{
  "device_code": "3584d83530557fdd1f46af8289938c8ef79f9dc5",
  "user_code": "BFEE-895F",
  "verification_uri": "https://github.com/login/device",
  "expires_in": 900,
  "interval": 5
}
```

关键就三个字段：
- **`user_code`**（BFEE-895F）— 你要手动输入的那个验证码，8 字符，人类友好
- **`device_code`**（40 字符）— 客户端内部用的，不展示给用户
- **`interval`**（5 秒）— 服务器建议的轮询间隔

### Step 2：你去浏览器干活

终端打印验证码，你在手机上打开 `github.com/login/device`，输入它。这时候浏览器和 GitHub 服务器之间走了完整的 OAuth 授权——你登录、看权限、点 Authorize。

注意：**这一步跟终端没有任何直接通信**。你手机浏览器不知道终端的存在，终端也不知道你在手机上干了什么。

### Step 3：设备不断轮询

这是最巧妙的一步。终端不知道你什么时候点完授权，所以它每隔 5 秒问一次服务器："他点了吗？"

```
POST /login/oauth/access_token
device_code=xxx&grant_type=urn:ietf:params:oauth:grant-type:device_code
```

没点完：

```json
{"error": "authorization_pending"}
```

你点了：

```json
{"access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a", "scope": "repo,gist"}
```

轮询不是无线循环。`device_code` 只有 15 分钟有效期，超时了要重新来。客户端收到 `expired_token` 错误就必须停下来报错。

### Step 4：拿着 Token 干活

拿到 token 之后就跟普通 OAuth 一样了：

```bash
curl -H "Authorization: Bearer gho_xxx" https://api.github.com/user
```

---

## 轮询策略：客户端的"礼貌"有多重要？

实际写轮询代码时，`interval` 和错误处理上有一些我没想到的门道。

RFC 8628 定义了 5 种错误码，每个对应不同的客户端行为：

| 错误码 | 含义 | 客户端该怎么处理 |
|---|---|---|
| `authorization_pending` | 用户还没点 | 等 `interval` 秒再试 |
| `slow_down` | 你问太快了 | **额外等 5 秒**，后续用新间隔 |
| `expired_token` | 15 分钟超时 | 停下来，告诉用户要重新开始 |
| `access_denied` | 用户点了拒绝 | 停下来，别继续了 |
| `invalid_grant` | 设备码无效 | 可能是 bug，报错 |

`slow_down` 是我觉得最体贴的设计——很多协议限流就直接 429 断连接了，Device Flow 专门留了一个错误码告诉客户端"不是不让你问，是慢一点问"。实现时收到这个错误要在当前间隔基础上加 5 秒。

正确的轮询代码大概长这样：

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
            interval += 5  # 加 5 秒
            time.sleep(interval)
            elapsed += interval
        elif err in ("expired_token", "access_denied"):
            raise Exception(f"授权失败: {err}")
        else:
            raise Exception(f"未知错误: {err}")
    
    raise Exception("授权超时")
```

有两个点容易被忽略：
1. **收到 `slow_down` 后，新增的 5 秒是永久累加的**。不是恢复原来的间隔，而是从 `interval + 5` 开始。这是 RFC 8628 的要求。
2. **轮询期间理论上可以展示进度反馈**。`gh auth login` 默认是在等，实现里可以加个 spinner 或者倒计时，至少让人知道程序还在跑。

---

## Device Flow vs 传统 OAuth

读完 RFC 8628 后我画了一张对比表：

| | 授权码流程 | Device Flow |
|---|---|---|
| 适用场景 | Web/移动 App | CLI / IoT / 无头设备 |
| 要不要浏览器 | 必须，在同一台设备 | 不需要，可在另一台设备 |
| 授权方式 | 浏览器自动跳转 | 用户手动输入验证码 |
| 回调机制 | 服务器接 code 参数 | 客户端轮询 |
| `client_secret` | 必需 | 不需要（公开客户端） |
| 用户体验 | 流畅，无感 | 多设备切换，需手动输入 |

GitHub CLI 选择 Device Flow 的理由很实际：CLI 可能跑在 Docker 容器、CI 环境、跳板机——这些地方没有浏览器，配回调 URL 也麻烦。Device Flow 不需要注册回调地址，也不需要保管 `client_secret`（CLI 二进制的 `client_secret` 本来也保不住），对 CLI 工具来说是最省心的方案。

## 安全问题：验证码只有 8 位，够吗？

第一反应是觉得 8 位验证码太短了。但读了 RFC 8628 的设计理由之后，理解了这个长度的权衡。

8 位字符的熵是 20^8 ≈ 2^34.5 位（字符集只用了大写字母去掉易混淆字符，共 20 个）。单独看不算高，但配合几个限制就够用了：

1. **有效期 15 分钟** — 窗口很短
2. **提交限流** — 每小时最多 50 次验证码尝试
3. **`device_code` 一次性** — 一个设备码对应一个令牌，用完即废

真正的安全风险不在验证码长度，而在**远程钓鱼**。攻击者可以伪造一个页面让人输入验证码，然后用自己的账号完成授权。GitHub 的缓解方式是授权页面上显示设备类型、IP 地址、权限列表，让用户有信息做判断。

Token 存储是另一个容易被忽略的点。`gh` 把 Token 存到 `~/.config/gh/hosts.yml`，权限设 `chmod 600`。如果你自己写工具调用 Device Flow，不要往 shell 历史里塞 token，也不要明文存文件。macOS 可以用 Keychain，Linux 可以用 Secret Service：

```bash
# macOS
security add-generic-password -a "$USER" -s "github_token" -w "gho_xxx"

# Linux
secret-tool store --label="GitHub Token" service github user "$USER"
```



## Device Flow 为什么是 AI Agent 的最佳认证方案

写这篇文章的时候我其实在解决另一个问题：Agent 跑在远端服务器上，我通过微信跟它对话。Agent 要调用 GitHub API 来操作仓库、创建 PR、管理 issues——但怎么安全地给它授权？

最直觉的做法是把 Token 发到微信聊天里。这也是最危险的。

```
IM 发 Token 的路径：
  你 → [ 微信服务器 ] → [ 聊天记录 ] → [ Agent 上下文 ]
                                            ↓
                                     每一层都能看到你的 Token
```

Token 一旦进了聊天记录，IM 服务器有一份、本地聊天记录有一份、Agent 的消息上下文里也有一份。而且 Token 不会过期——拿到一次就能一直用。

Device Flow 解决了这个问题：**你的机器从不接触 Token。**

它的思路是这样的：

1. Agent 打印一串验证码（`BFEE-895F`）到聊天里
2. 你打开 `github.com/login/device`——这是 GitHub 的官方授权页，不是 Agent 给你的链接
3. 输入验证码，在 GitHub 的页面上完成授权
4. Token 直接从 GitHub 服务器发给 Agent（server-to-server）

```
Device Flow 的路径：
  Agent 打印验证码 → 你看到
        ↓
  你打开 github.com/login/device → 输入验证码 → 完成 OAuth
        ↓
  Token 直接从 GitHub 到 Agent（server-to-server，不经过任何中间层）
```

你的 IM 里只有一段 8 位验证码（15 分钟有效，用完作废）。Token 从头到尾没有经过你的聊天记录。

后来想想，如果你的 Agent 也需要在远端认证——Device Flow 差不多是唯一不用把密钥喂进聊天记录的办法了。

---

## 🥚 彩蛋

如果你也经常需要配远程服务器的 GitHub 认证，我写了一段脚本——一条命令走完"下载 gh + 认证 + 配置 git 用户"全流程：

```bash
# remote-gh-setup.sh
# 在远程服务器上跑：curl -fsSL https://gist.github.com/binggg/xxx/remote-gh-setup.sh | bash
# 然后在你自己的电脑上打开 https://github.com/login/device 输入验证码

set -e

# 1. 装 gh 到 ~/bin
mkdir -p ~/bin
curl -fsSL https://github.com/cli/cli/releases/latest/download/gh_*_linux_amd64.tar.gz \
  | tar -xz -C /tmp
cp /tmp/gh_*/bin/gh ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/bin:$PATH"

# 2. 启动 Device Flow 认证
gh auth login --web --git-protocol https

# 3. 配 git user
gh api user --jq '.login' | xargs -I{} git config --global user.name "{}"
gh api user --jq '.email // .login + "@users.noreply.github.com"' | xargs -I{} git config --global user.email "{}"

echo "✅ Done! Logged in as $(gh api user --jq '.login')"
```

这个脚本覆盖了我上一篇踩坑的全部流程。如果你那里还有我没遇到过的环境限制，评论区聊聊。

---

你的 Agent 在远端怎么认证的？是自己配的 Token 还是走了 Device Flow？评论区聊聊 👇

*全文基于 GitHub CLI v2.62.0、RFC 8628（2019年8月发布）和一次实际部署验证。*
