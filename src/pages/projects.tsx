import { useState, type ReactNode } from 'react'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import Reveal from '../components/Reveal'

const projects = [
  {
    name: 'CloudBase-MCP',
    tagline: 'Connect CloudBase to your AI Agent. 从 AI prompt 到上线应用。',
    url: 'https://github.com/TencentCloudBase/CloudBase-MCP',
    category: '开源',
    year: '2025',
    role: 'Creator',
    stack: ['TypeScript', 'MCP', 'AI'],
  },
  {
    name: 'CloudBase Framework',
    tagline: '腾讯云开发云原生一体化部署工具，一键部署，不限框架语言。',
    url: 'https://github.com/Tencent/cloudbase-framework',
    category: '开源',
    year: '2022',
    role: 'Core Contributor',
    stack: ['TypeScript', 'Node.js', 'Serverless'],
  },
  {
    name: 'Material React Native',
    tagline: 'A Material Design style React Native component library with 1.7k stars.',
    url: 'https://github.com/binggg/mrn',
    category: '开源',
    year: '2022',
    role: 'Creator',
    stack: ['TypeScript', 'React Native', 'Material Design'],
  },
  {
    name: 'CloudBase AI ToolKit',
    tagline: 'AI Agent 与云开发的桥梁，让 LLM 能力无缝接入云开发基础设施。',
    url: 'https://github.com/TencentCloudBase/CloudBase-AI-ToolKit',
    category: '开源',
    year: '2024',
    role: 'Creator',
    stack: ['TypeScript', 'AI', 'CloudBase'],
  },
  {
    name: 'Awesome CloudBase Examples',
    tagline: '腾讯云开发案例合集，涵盖全栈、AI、小程序等多种场景。',
    url: 'https://github.com/TencentCloudBase/awesome-cloudbase-examples',
    category: '开源',
    year: '2022',
    role: 'Maintainer',
    stack: ['JavaScript', 'CloudBase', 'Serverless'],
  },
  {
    name: 'AI-Workspace',
    tagline: '个人 AI 工作台操作系统。统一的 AI 开发环境管理。',
    url: 'https://github.com/binggg/AI-Workspace',
    category: '个人作品',
    year: '2025',
    role: 'Creator',
    stack: ['Claude', 'MCP', 'Shell'],
  },
]

const categories = ['全部', '开源', '个人作品'] as const

const allStacks = [...new Set(projects.flatMap((p) => p.stack))]

export default function Projects(): ReactNode {
  const [active, setActive] = useState<string>('全部')
  const filtered = active === '全部' ? projects : projects.filter((p) => p.category === active)

  return (
    <Layout title="Projects" description="Booker Zhao's open source projects">
      {/* PageHeader */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '4rem 1.5rem 2.5rem' }}>
        <Reveal delay={100}>
          <Heading as="h1" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: '1.0', letterSpacing: '-0.035em', fontWeight: 500, maxWidth: '50rem' }}>
            {translate({ id: 'projects.page.title', message: '我做的东西。' })}
          </Heading>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 leading-relaxed text-lg" style={{ color: 'var(--ink-600)', maxWidth: '36rem', lineHeight: '1.8' }}>
            {translate({ id: 'projects.page.desc', message: '包括在工作内外维护的开源项目、产品尝试和实验。我喜欢做那些会被反复使用的小东西。' })}
          </p>
        </Reveal>
      </section>

      {/* Filter */}
      <div className="mx-auto" style={{ maxWidth: '1400px', padding: '0 1.5rem 3rem' }}>
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3" style={{ borderTop: '1px solid var(--ifm-hr-border-color)', borderBottom: '1px solid var(--ifm-hr-border-color)', padding: '1.25rem 0' }}>
            <span className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--ink-400)' }}>{translate({ id: 'projects.filter.type', message: 'Type' })}</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="text-sm transition-colors"
                style={{
                  color: active === c ? 'var(--ink-800)' : 'var(--ink-500)',
                  fontFamily: active === c ? "'Fraunces', serif" : "'Inter', sans-serif",
                  fontStyle: active === c ? 'italic' : 'normal',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {translate({
                  id: `projects.filter.${c === '全部' ? 'all' : c === '开源' ? 'oss' : 'personal'}`,
                  message: c,
                })}
                <span className="ml-2 tabular text-xs" style={{ color: 'var(--ink-400)' }}>
                  ({c === '全部' ? projects.length : projects.filter((p) => p.category === c).length})
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Mosaic grid */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '0 1.5rem 6rem' }}>
        <div className="grid md:grid-cols-12 gap-px" style={{ border: '1px solid var(--ifm-hr-border-color)' }}>
          {filtered.map((p, i) => {
            const isFeature = i % 5 === 0
            return (
              <Reveal
                key={p.name}
                delay={Math.min(i * 40, 300)}
                className={`${isFeature ? 'md:col-span-7' : 'md:col-span-5'}`}
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mosaic-card block h-full p-8 md:p-12"
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] mb-6">
                    <span style={{ color: 'var(--accent)' }}>●</span>
                    <span style={{ color: 'var(--ink-500)' }}>{p.category}</span>
                    <span style={{ color: 'var(--ink-300)' }}>·</span>
                    <span className="tabular" style={{ color: 'var(--ink-500)' }}>{p.year}</span>
                  </div>

                  <h3 className="font-display tracking-tight" style={{
                    fontSize: isFeature ? 'clamp(2rem, 5vw, 4rem)' : 'clamp(1.5rem, 3.5vw, 3rem)',
                    fontWeight: 500,
                  }}>
                    {p.name}
                  </h3>
                  <p className="mt-4 leading-relaxed max-w-2xl" style={{
                    fontSize: isFeature ? '1.125rem' : '1rem',
                    color: 'var(--ink-600)',
                  }}>
                    {p.tagline}
                  </p>

                  <div className="mt-8 pt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em]" style={{ borderTop: '1px solid var(--ifm-hr-border-color)' }}>
                    <span className="tabular" style={{ color: 'var(--ink-500)' }}>{p.role}</span>
                    <span style={{ color: 'var(--accent)' }}>View →</span>
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Stack footer */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '0 1.5rem 6rem' }}>
        <Reveal>
          <div className="grid md:grid-cols-12 gap-6" style={{ borderTop: '1px solid var(--ifm-hr-border-color)', paddingTop: '2.5rem' }}>
            <div className="md:col-span-4">
              <p className="font-display text-2xl italic">{translate({ id: 'projects.footer.title', message: 'More on GitHub →' })}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink-500)' }}>
                {translate({ id: 'projects.footer.desc', message: '所有开源项目都在 github.com/binggg。' })}
              </p>
            </div>
            <div className="md:col-span-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {allStacks.slice(0, 12).map((s) => (
                <span key={s} style={{ color: 'var(--ink-500)' }}>
                  <span style={{ color: 'var(--accent)' }}>·</span> {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </Layout>
  )
}
