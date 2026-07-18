import type { ReactNode } from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import Heading from '@theme/Heading'
import Reveal from '../components/Reveal'

function Star() {
  return (
    <svg width="0.9em" height="0.9em" viewBox="0 0 16 16" fill="currentColor" style={{ display: 'inline', verticalAlign: '-0.1em' }}>
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.82 6.364a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
    </svg>
  )
}

const timeline: { year: string; items: ReactNode[] }[] = [
  { year: '2025', items: [
    'CloudBase-MCP 发布，AI Agent 与云开发正式打通。',
    '开始认真地把 prompt 当作 DSL 来设计。',
  ]},
  { year: '2024', items: [
    <>CloudBase AI ToolKit 发布 (927<Star />)。</>,
    '钻研 LLM 与云原生的结合方案。',
  ]},
  { year: '2022', items: [
    'MRN (Material React Native) 达到 1.7k stars。',
    'CloudBase Framework 达到 2k stars。',
  ]},
  { year: '2021', items: [
    '开始用 Obsidian 记笔记，构建第二大脑。',
    '深入 CloudBase 生态，开发多个开源项目。',
  ]},
  { year: '2019', items: [
    'Material React Native 第一个版本发布。',
    '开始在 GitHub 上活跃开源。',
  ]},
]

export default function About(): ReactNode {
  return (
    <Layout title="About" description="关于 Booker Zhao">
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '5rem 1.5rem 5rem' }}>
        <Reveal delay={100}>
          <Heading as="h1" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: '1.0', letterSpacing: '-0.035em', fontWeight: 500, maxWidth: '55rem' }}>
            {translate({ id: 'about.page.title1', message: '我是 ' })}
            <span className="serif-italic">Booker</span>。
            <br />
            {translate({ id: 'about.page.title2', message: '15年 AI 全栈工程师，' })}
            <br />
            <span style={{ color: 'var(--ink-500)' }}>{translate({ id: 'about.page.title3', message: '偶尔写写代码。' })}</span>
          </Heading>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-10" style={{ marginTop: '5rem' }}>
          <div className="md:col-span-5 md:col-start-1">
            <Reveal>
              <div className="aspect-portrait grain relative overflow-hidden" style={{ backgroundColor: 'var(--ink-200)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display italic" style={{ color: 'var(--ink-300)', fontSize: '14rem', lineHeight: 1 }}>B.</span>
                </div>
              </div>
              <p className="mt-3 text-xs tabular" style={{ color: 'var(--ink-500)' }}>Shenzhen, 2025</p>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div style={{ fontSize: '1.0625rem', lineHeight: '1.85', color: 'var(--ink-700)' }} className="space-y-6">
              <Reveal>
                <p>
                  {translate({ id: 'about.bio.p1', message: '目前在腾讯云开发（CloudBase）团队工作，负责 AI ToolKit 和 MCP 生态建设。我喜欢做那种「被反复使用的小东西」。' })}
                </p>
              </Reveal>
              <Reveal delay={50}>
                <p>
                  {translate({ id: 'about.bio.p2', message: '在工作之外，维护着 github.com/binggg 上的一些开源项目。对 AI Agent、Serverless 架构、开发者工具比较感兴趣。' })}
                  {' '}
                  <a href="https://github.com/binggg" className="link-underline" style={{ color: 'var(--ink-800)' }}>github.com/binggg</a>。
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p>
                  {translate({ id: 'about.bio.p3', message: '两个孩子的爸爸。好代码和好身体一样靠长期积累。深圳是我的家。' })}
                </p>
              </Reveal>
              <Reveal delay={150}>
                <p>
                  {translate({ id: 'about.bio.contact', message: '如果你想聊聊——关于项目合作、CloudBase 使用，或只是对某个开源项目的想法——欢迎联系。' })}
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="grid grid-cols-2 gap-6 text-sm" style={{ borderTop: '1px solid var(--ifm-hr-border-color)', paddingTop: '2rem', marginTop: '1rem' }}>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--ink-400)' }}>{translate({ id: 'about.location', message: 'Location' })}</p>
                    <p style={{ color: 'var(--ink-700)' }}>Shenzhen, China</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--ink-400)' }}>{translate({ id: 'about.working', message: 'Working with' })}</p>
                    <p style={{ color: 'var(--ink-700)' }}>TypeScript · Rust · CloudBase · AI</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--ink-400)' }}>{translate({ id: 'about.social', message: 'Social' })}</p>
                    <p style={{ color: 'var(--ink-700)' }}>
                      <a href="https://x.com/being99" className="link-underline" style={{ color: 'var(--ink-700)' }}>X</a>
                      {' · '}
                      <a href="https://github.com/binggg" className="link-underline" style={{ color: 'var(--ink-700)' }}>GitHub</a>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--ink-400)' }}>{translate({ id: 'about.reading', message: 'Reading' })}</p>
                    <p style={{ color: 'var(--ink-700)', fontStyle: 'italic' }}>《System Design Interview》— A. Xu</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto" style={{ borderTop: '1px solid var(--ifm-hr-border-color)' }}>
        <div style={{ maxWidth: '1400px', padding: '5rem 1.5rem' }}>
          <Reveal>
            <Heading as="h2" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', fontWeight: 500, marginBottom: '4rem' }}>
              {translate({ id: 'about.timeline.title', message: '最近几年。' })}
            </Heading>
          </Reveal>

          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-3">
              <Reveal>
                <p className="font-display italic leading-relaxed text-lg" style={{ color: 'var(--ink-500)' }}>
                  {translate({ id: 'about.timeline.note', message: '这不是一个完整的简历，只是一些值得记住的时间点。' })}
                </p>
              </Reveal>
            </div>

            <div className="md:col-span-9">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={i * 50}>
                    <div className="grid grid-cols-12 gap-6" style={{ borderTop: '1px solid var(--ifm-hr-border-color)', paddingTop: '1.5rem' }}>
                      <span className="col-span-3 md:col-span-2 tabular font-display tracking-tight" style={{ fontSize: '1.75rem', color: 'var(--accent)' }}>
                        {t.year}
                      </span>
                      <ul className="col-span-9 md:col-span-10 space-y-3" style={{ color: 'var(--ink-700)', lineHeight: '1.7' }}>
                        {t.items.map((item, j) => (
                          <li key={j} className="flex gap-3">
                            <span className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>●</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper)' }}>
        <div className="mx-auto" style={{ maxWidth: '1400px', padding: '6rem 1.5rem' }}>
          <Reveal>
            <p className="font-display italic" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: '1.05', maxWidth: '45rem' }}>
              {translate({ id: 'about.cta.line', message: 'If you made it this far, we should probably talk.' })}
            </p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: '2.5rem' }}>
              <a href="https://x.com/being99" className="cta-btn">
                {translate({ id: 'about.cta.message', message: 'Send a message →' })}
              </a>
              <Link to="/blog" className="cta-btn">
                {translate({ id: 'about.cta.read', message: 'Read writing →' })}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
