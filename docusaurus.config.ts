import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Booker Zhao',
  tagline: 'Software Engineer, AI Enthusiast, Father of Two',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://binggg.github.io',
  baseUrl: '/',

  organizationName: 'binggg',
  projectName: 'binggg.github.io',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': { label: '中文' },
      en: { label: 'English' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          showReadingTime: true,
          postsPerPage: 10,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/binggg/binggg.github.io/tree/develop/blog/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },

  plugins: [
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        includeBlog: true,
        title: 'Booker Zhao',
        description: 'Software Engineer, AI Enthusiast — AI full-stack developer, creator of CloudBase AI Toolkit & CloudBase Framework.',
        llmsTxtFilename: 'llms.txt',
        llmsFullTxtFilename: 'llms-full.txt',
        pathTransformation: {
          ignorePaths: ['blog'],
        },
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/blog/2025/07/21/kiro-spec-workflow',
            to: '/blog/kiro-spec-workflow',
          },
          {
            from: '/blog/2026/01/13/ai-image-deoiling-guide',
            to: '/blog/ai-image-deoiling-guide',
          },
          {
            from: '/blog/2026/01/22/agent-skills-practice',
            to: '/blog/agent-skills-practice',
          },
          {
            from: '/blog/2026/07/18/open-plugins-standard',
            to: '/blog/open-plugins-standard',
          },
          {
            from: '/blog/2025/08/05/sbe-methodology',
            to: '/blog/sbe-methodology',
          },
          {
            from: '/blog/2025/11/27/ai-toy-to-product',
            to: '/blog/ai-toy-to-product',
          },
          {
            from: '/blog/2026/01/09/vibe-coding',
            to: '/blog/vibe-coding-non-technical',
          },
          {
            from: '/blog/2026/02/26/github-device-flow',
            to: '/blog/github-device-flow-deep-dive',
          },
          {
            from: '/blog/2026/06/26/miniprogram-ai-cloudbase-getting-started',
            to: '/blog/miniprogram-ai-cloudbase-getting-started',
          },
          {
            from: '/blog/2026/06/28/codex-cloudbase',
            to: '/blog/codex-getting-started-cloudbase',
          },
          {
            from: '/blog/2026/07/06/claude-code-mechanisms',
            to: '/blog/claude-code-five-mechanisms',
          },
          {
            from: '/blog/2026/07/07/ai-miniprogram-dev-guide',
            to: '/blog/ai-miniprogram-dev-guide',
          },
        ],
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/og-default.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Booker',
      logo: {
        alt: 'Booker Zhao',
        src: 'img/logo.svg',
        style: { display: 'none' },
      },
      items: [
        { to: '/blog', label: 'Writing', position: 'left' },
        { to: '/agent-resources', label: 'AI Agents', position: 'left' },
        { to: '/projects', label: 'Projects', position: 'left' },
        {
          href: 'https://github.com/binggg',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://x.com/being99',
          label: 'X',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Site',
          items: [
            { label: 'Writing', to: '/blog' },
            { label: 'Projects', to: '/projects' },
            { label: 'About', to: '/about' },
          ],
        },
        {
          title: 'Elsewhere',
          items: [
            { label: 'GitHub', href: 'https://github.com/binggg' },
            { label: 'X', href: 'https://x.com/being99' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Booker Zhao. Made with care.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

};

export default config;
