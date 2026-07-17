import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const projects = [
  {
    title: 'CloudBase-MCP',
    description: 'CloudBase MCP — Connect CloudBase to your AI Agent. 从 AI prompt 到上线应用。',
    url: 'https://github.com/TencentCloudBase/CloudBase-MCP',
    stars: '1.1k',
  },
  {
    title: 'CloudBase Framework',
    description: '腾讯云开发云原生一体化部署工具，一键部署，不限框架语言。',
    url: 'https://github.com/Tencent/cloudbase-framework',
    stars: '2k',
  },
  {
    title: 'Material React Native (MRN)',
    description: 'A Material Design style React Native component library.',
    url: 'https://github.com/binggg/mrn',
    stars: '1.7k',
  },
  {
    title: 'CloudBase AI ToolKit',
    description: 'AI Agent 与云开发的桥梁，让 LLM 能力无缝接入云开发基础设施。',
    url: 'https://github.com/TencentCloudBase/CloudBase-AI-ToolKit',
    stars: '927',
  },
  {
    title: 'Awesome CloudBase Examples',
    description: '腾讯云开发案例合集，涵盖全栈、AI、小程序等多种场景。',
    url: 'https://github.com/TencentCloudBase/awesome-cloudbase-examples',
    stars: '410',
  },
];

export default function Projects(): ReactNode {
  return (
    <Layout title="Projects" description="Booker Zhao's open source projects">
      <main className="container" style={{padding: '3rem 0'}}>
        <Heading as="h1">Projects</Heading>
        <div style={{display: 'grid', gap: '1.5rem', marginTop: '2rem'}}>
          {projects.map((p) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '1.5rem',
                border: '1px solid var(--ifm-color-emphasis-300)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <Heading as="h2" style={{margin: 0, fontSize: '1.3rem'}}>
                {p.title}
              </Heading>
              <p style={{margin: '0.5rem 0 0', color: 'var(--ifm-color-emphasis-600)'}}>
                {p.description}
              </p>
              <span style={{fontSize: '0.85rem', color: 'var(--ifm-color-primary)'}}>
                ⭐ {p.stars}
              </span>
            </a>
          ))}
        </div>
      </main>
    </Layout>
  );
}
