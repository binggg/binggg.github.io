import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Booker Zhao - Software Engineer, AI Enthusiast">
      <header className={styles.heroBanner}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/blog">
              Read Blog
            </Link>
            <Link className="button button--secondary button--lg" to="/projects">
              Projects
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className="container">
          <p className={styles.bio}>
            15年 AI 全栈工程师，CloudBase AI ToolKit & Framework 作者，2个孩子的爸爸，喜欢运动健身，深圳人。
          </p>
        </div>
      </main>
    </Layout>
  );
}
