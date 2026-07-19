import type { ReactNode } from 'react'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import Reveal from '../components/Reveal'

const projects = [
  {
    name: 'CloudBase-MCP',
    tagline: translate({ id: 'project.cb-mcp.tagline', message: 'Connect CloudBase to your AI Agent. 从 AI prompt 到上线应用。' }),
    url: 'https://github.com/TencentCloudBase/CloudBase-MCP',
    year: '2025',
    role: 'Creator',
    stack: ['TypeScript', 'MCP', 'AI', 'CloudBase'],
  },
  {
    name: 'CloudBase Framework',
    tagline: translate({ id: 'project.cb-framework.tagline', message: '腾讯云开发云原生一体化部署工具，一键部署，不限框架语言。' }),
    url: 'https://github.com/Tencent/cloudbase-framework',
    year: '2020',
    role: 'Core Contributor',
    stack: ['TypeScript', 'Node.js', 'Serverless'],
  },
  {
    name: 'MRN',
    tagline: translate({ id: 'project.mrn.tagline', message: 'A Material Design style React Native component library with 1.7k stars.' }),
    url: 'https://github.com/binggg/mrn',
    year: '2015',
    role: 'Creator',
    stack: ['TypeScript', 'React Native', 'Material Design'],
  },
]

const allStacks = [...new Set(projects.flatMap((p) => p.stack))]

export default function Projects(): ReactNode {
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

      {/* Project rows */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '0 1.5rem 6rem' }}>
        <div style={{ border: '1px solid var(--ifm-hr-border-color)' }}>
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 50}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-row"
              >
                <div className="grid md:grid-cols-12 gap-4 items-center px-8 md:px-16 py-8 md:py-14" style={{ borderTop: i > 0 ? '1px solid var(--ifm-hr-border-color)' : 'none' }}>
                  <span className="md:col-span-1 tabular text-sm pgi">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="md:col-span-4 font-display" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', letterSpacing: '-0.025em', fontWeight: 500 }}>
                    {p.name}
                  </h3>
                  <p className="md:col-span-5 leading-relaxed text-sm md:text-base pgd">
                    {p.tagline}
                  </p>
                  <span className="md:col-span-2 text-right text-sm tabular pgy">
                    {p.year} →
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stack footer */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '0 1.5rem 6rem' }}>
        <Reveal>
          <div className="grid md:grid-cols-12 gap-6" style={{ borderTop: '1px solid var(--ifm-hr-border-color)', paddingTop: '2.5rem' }}>
            <div className="md:col-span-4">
              <p className="font-display text-2xl italic">{translate({ id: 'projects.footer.title', message: 'More on GitHub →' })}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink-500)' }}>
                {translate({ id: 'projects.footer.desc', message: '所有开源项目都在 github.com/binggg。也曾用 xunleif2e 写过一些 Vue 组件。' })}
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
