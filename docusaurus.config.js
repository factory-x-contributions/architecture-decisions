import {themes as prismThemes} from 'prism-react-renderer';

// https://github.com/eclipse-tractusx/tractusx-edc/blob/main/.github/dependabot.yml

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Factory-X Contributions',
  tagline: 'We are creating an open and collaborative digital ecosystem for factory outfitters and operators, built on the foundations of Catena‑X and the principles of Plattform Industrie 4.0.',
  favicon: 'https://factory-x.org/wp-content/uploads//factory-x-logo.svg',

  baseUrl: '/architecture-decisions/',
  url: 'https://janiskre.github.io',
  organizationName: 'janiskre', 
  projectName: 'architecture-decisions', 
  
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
        title: 'Factory-X Contributions',
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
            href: 'https://github.com/factory-x-contributions',
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