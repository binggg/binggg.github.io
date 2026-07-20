import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import Reveal from '../components/Reveal'

const featuredProjects = [
  {
    name: 'CloudBase-MCP',
    tagline: translate({ id: 'project.cb-mcp.tagline', message: 'Connect CloudBase to your AI Agent. 从 AI prompt 到上线应用。' }),
    url: 'https://github.com/TencentCloudBase/CloudBase-MCP',
    year: '2025',
  },
  {
    name: 'CloudBase Framework',
    tagline: translate({ id: 'project.cb-framework.tagline', message: '腾讯云开发云原生一体化部署工具，一键部署，不限框架语言。' }),
    url: 'https://github.com/Tencent/cloudbase-framework',
    year: '2020',
  },
  {
    name: 'MRN',
    tagline: translate({ id: 'project.mrn.tagline', message: 'A Material Design style React Native component library with 1.7k stars.' }),
    url: 'https://github.com/binggg/mrn',
    year: '2015',
  },
]

export default function Home(): ReactNode {
  return (
    <Layout
      title="Booker Zhao"
      description="Booker Zhao - Software Engineer, AI Enthusiast"
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto" style={{ maxWidth: '1400px', padding: '4rem 1.5rem 5rem' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: 500 }}>
            <Reveal delay={100}>
              <span style={{ display: 'block', color: 'var(--ifm-heading-color)' }}>
                {translate({ id: 'homepage.hero.line1', message: 'I build quiet' })}
              </span>
            </Reveal>
            <Reveal delay={200}>
              <span style={{ display: 'block', color: 'var(--ink-700)' }} className="serif-italic">
                {translate({ id: 'homepage.hero.line2', message: 'tools for thinkers' })}<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </Reveal>
            <Reveal delay={300}>
              <span style={{ display: 'block', color: 'var(--ifm-heading-color)' }}>
                {translate({ id: 'homepage.hero.line3', message: 'sometimes I write about it' })}
                <span className="cursor-blink" />
              </span>
            </Reveal>
          </h1>
        </div>
      </section>

      {/* WRITING PREVIEW */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '5rem 1.5rem' }}>
        <div className="grid md:grid-cols-12 gap-10 md:gap-20">
          <div className="md:col-span-4 md:sticky md:top-32 self-start">
            <Reveal>
              <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--ink-500)' }}>
                <span className="inline-block w-8 h-px align-middle mr-3" style={{ backgroundColor: 'var(--ink-400)' }} />
                {translate({ id: 'homepage.writing.eyebrow', message: 'Writing' })}
              </p>
              <Heading as="h2" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', fontWeight: 500 }}>
                {translate({ id: 'homepage.writing.title', message: 'Long-form thoughts' })}<span style={{ color: 'var(--accent)' }}>.</span>
              </Heading>
              <p className="mt-6 leading-relaxed" style={{ color: 'var(--ink-600)' }}>
                {translate({ id: 'homepage.writing.desc', message: '写得不多，但每篇都有分量。关于 AI、工程、开源，以及一个技术人的思考。' })}
              </p>
              <Link to="/blog" className="mt-8 inline-block link-underline text-sm" style={{ color: 'var(--ink-800)' }}>
                {translate({ id: 'homepage.writing.link', message: 'Browse all essays →' })}
              </Link>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <Link
                to="/blog/2026/07/18/open-plugins-standard"
                className="writing-card"
              >
                <article>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--ink-500)' }}>
                    <span style={{ color: 'var(--accent)' }}>●</span>
                    <span>{translate({ id: 'homepage.writing.card.tag', message: 'Engineering' })}</span>
                    <span style={{ color: 'var(--ink-300)' }}>·</span>
                    <span className="tabular">{translate({ id: 'homepage.writing.card.date', message: '2026-07-18' })}</span>
                    <span style={{ color: 'var(--ink-300)' }}>·</span>
                    <span>{translate({ id: 'homepage.writing.card.readtime', message: '30 min read' })}</span>
                  </div>
                  <h3 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.025em', fontWeight: 500, marginBottom: '0.75rem', color: 'var(--ifm-heading-color)' }}>
                    {translate({ id: 'homepage.writing.card.title', message: 'Open Plugins：AI 编程助手的插件标准' })}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--ink-600)', maxWidth: '36rem' }}>
                    {translate({ id: 'homepage.writing.card.desc', message: 'Vercel Labs 维护的开放标准——一个插件，七种工具，一次编写到处运行。从协议规范到 CloudBase MCP 改造实战，一文讲透。' })}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-sm" style={{ color: 'var(--ink-500)' }}>
                    <span className="link-underline" style={{ color: 'var(--ink-800)' }}>Read essay →</span>
                  </div>
                </article>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="mx-auto" style={{ maxWidth: '1400px', padding: '5rem 1.5rem', borderTop: '1px solid var(--ifm-hr-border-color)' }}>
        <div className="flex items-end justify-between mb-12 md:mb-20">
          <Reveal>
            <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--ink-500)' }}>
              <span className="inline-block w-8 h-px align-middle mr-3" style={{ backgroundColor: 'var(--ink-400)' }} />
              {translate({ id: 'homepage.projects.subtitle', message: 'Selected work — 2015 / 2025' })}
            </p>
            <Heading as="h2" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', letterSpacing: '-0.025em', fontWeight: 500 }}>
              {translate({ id: 'homepage.projects.title', message: "Things I've built" })}<span style={{ color: 'var(--accent)' }}>.</span>
            </Heading>
          </Reveal>
          <Reveal delay={200}>
            <Link to="/projects" className="hidden md:inline-block link-underline text-sm">
              {translate({ id: 'homepage.projects.link', message: 'All projects →' })}
            </Link>
          </Reveal>
        </div>

        <div style={{ border: '1px solid var(--ifm-hr-border-color)' }}>
          {featuredProjects.map((p, i) => (
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

      {/* CTA STRIP */}
      <section style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper)' }}>
        <div className="mx-auto" style={{ maxWidth: '1400px', padding: '5rem 1.5rem' }}>
          <Reveal>
            <p className="font-display italic" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', letterSpacing: '-0.03em', lineHeight: '1.0', maxWidth: '50rem' }}>
              {translate({ id: 'homepage.cta.line1', message: "I don't update often" })}<span style={{ color: 'var(--accent)' }}>.</span>
              <br />
              {translate({ id: 'homepage.cta.line2', message: "But when I do, it's worth reading" })}<span style={{ color: 'var(--accent)' }}>.</span>
            </p>
            <div className="flex flex-wrap gap-4" style={{ marginTop: '3rem' }}>
              <Link to="/blog" className="cta-btn">
                {translate({ id: 'homepage.cta.read', message: 'Read the latest →' })}
              </Link>
              <Link to="/about" className="cta-btn">
                {translate({ id: 'homepage.cta.about', message: 'About me →' })}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
