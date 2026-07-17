import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const projects = [
  {
    title: 'CloudBase AI ToolKit',
    description: 'AI Agent 与云开发的桥梁，让 LLM 能力无缝接入云开发基础设施。',
    url: 'https://github.com/binggg/CloudBase-AI-ToolKit',
    stars: '927',
  },
  {
    title: 'CloudBase Framework',
    description: '云原生一体化部署工具，支持全栈应用一键部署。',
    url: 'https://github.com/binggg/cloudbase-framework',
    stars: '2k',
  },
  {
    title: 'Material React Native',
    description: 'React Native Material Design 组件库，提供高质量的跨平台 UI 组件。',
    url: 'https://github.com/binggg/material-react-native',
    stars: '1.7k',
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
