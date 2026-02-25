module.exports = function () {
  return {
    name: 'docusaurus-seo-plugin',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: { type: 'application/ld+json' },
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Factory-X",
              "url": "https://factory-x.org/",
              "logo": "https://factory-x.org/wp-content/uploads/factory-x-logo.svg",
              "description": "Factory-X consortium - enabling cross-use-case, cross-dataspace interoperability in manufacturing",
              "sameAs": [
                "https://github.com/factory-x-contributions"
              ]
            }),
          },
          {
            tagName: 'script',
            attributes: { type: 'application/ld+json' },
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Factory-X Architecture Decision Records",
              "url": "https://factory-x-contributions.github.io/architecture-decisions/",
              "description": "Architecture decisions made by the Factory-X consortium for cross-use-case, cross-dataspace interoperability",
              "publisher": {
                "@type": "Organization",
                "name": "Factory-X",
                "url": "https://factory-x.org/"
              }
            }),
          },
        ],
      };
    },
  };
};
