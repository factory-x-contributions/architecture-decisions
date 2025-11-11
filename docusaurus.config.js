import {themes as prismThemes} from 'prism-react-renderer';

const organizationName = "janiskre";
const projectName = "architecture-decisions";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Factory-X Architecture Decision Records',
  tagline: 'This webpage presents the architecture decisions made by the Factory-X consoritum. They are the foundation for cross-use-case, cross-dataspace interoperability.',
  favicon: 'https://factory-x.org/wp-content/uploads//factory-x-logo.svg',

  baseUrl: `/${projectName}/`,
  url: `https://${organizationName}.github.io`,
  organizationName, 
  projectName, 
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  future: {
    v4: true,
  },



  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'https://factory-x.org/wp-content/uploads//factory-x-logo.svg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Factory-X Architecture Decision Records',
        logo: {
          alt: 'Factory-X Logo',
          src: 'https://factory-x.org/wp-content/uploads//factory-x-logo.svg',
        },
        items: [
          {to: 'docs/hercules/adr002-authorization-discovery/', label: 'Hercules', position: 'left'},
          {to: 'docs/leo/leo_placeholder', label: 'Leo', position: 'left'},
          {to: 'docs/orion/orion_placeholder', label: 'Orion', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/factory-x-contributions/architecture-decisions',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Hercules',
                to: 'docs/hercules/adr002-authorization-discovery/',
              },
              {
                label: 'Leo',
                to: 'docs/leo/leo_placeholder',
              },
              {
                label: 'Orion',
                to: 'docs/orion/orion_placeholder',
              },
            ],
          },
          {
            title: 'General Information',
            items: [
              {
                label: 'Legal Notice',
                href: 'https://factory-x.org/de/impressum/',
              },
              {
                label: 'Privacy Policy',
                href: 'https://factory-x.org/privacy-policy/',
              },
              {
                label: 'Contact',
                href: 'https://factory-x.org/contact/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/factory-x-contributions',
              },
              {
                label: 'Website',
                href: 'https://factory-x.org/de/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Factory-X, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;