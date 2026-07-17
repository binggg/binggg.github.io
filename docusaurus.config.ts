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

  themeConfig: {
    image: 'img/docusaurus.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Booker Zhao',
      logo: {
        alt: 'Booker Zhao',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/blog', label: 'Blog', position: 'left' },
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
          title: 'Content',
          items: [
            { label: 'Blog', to: '/blog' },
            { label: 'Projects', to: '/projects' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/binggg' },
            { label: 'X', href: 'https://x.com/being99' },
          ],
        },
        {
          title: 'More',
          items: [
            {
              html: '<a href="/llms.txt" target="_blank" rel="noopener noreferrer">llms.txt</a>',
            },
            {
              html: '<a href="/llms-full.txt" target="_blank" rel="noopener noreferrer">llms-full.txt</a>',
            },
            {
              html: '<a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Booker Zhao. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

};

export default config;
