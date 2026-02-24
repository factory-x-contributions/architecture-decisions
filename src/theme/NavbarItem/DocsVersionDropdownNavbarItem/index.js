import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import { useLocation } from '@docusaurus/router';

export default function DocsVersionDropdownNavbarItemWrapper(props) {
  const location = useLocation();

  // Check if we're on the ADR Graph page
  const isADRGraphPage = location.pathname.includes('/adr-graph');

  // If on ADR Graph page, intercept the version change
  if (isADRGraphPage) {
    // Override the docsPluginId behavior to prevent navigation
    const modifiedProps = {
      ...props,
      docsPluginId: props.docsPluginId || 'default',
    };

    // Intercept clicks on version dropdown items
    React.useEffect(() => {
      const handleVersionChange = (e) => {
        // Check if click is on a version dropdown item
        const versionLink = e.target.closest('a[class*="dropdown__link"]');
        if (versionLink && versionLink.href) {
          const url = new URL(versionLink.href);

          // If it's a version change link, prevent default navigation
          if (url.pathname.includes('/docs/')) {
            e.preventDefault();

            // Extract version from the URL
            const pathParts = url.pathname.split('/');
            const docsIndex = pathParts.indexOf('docs');
            const version = pathParts[docsIndex + 1];

            // Update localStorage to trigger graph reload
            if (version && version !== 'current') {
              localStorage.setItem('docs-preferred-version-default', version);
            } else {
              localStorage.setItem('docs-preferred-version-default', 'current');
            }

            // Dispatch custom event to notify the graph
            window.dispatchEvent(new Event('storage'));
          }
        }
      };

      document.addEventListener('click', handleVersionChange, true);
      return () => {
        document.removeEventListener('click', handleVersionChange, true);
      };
    }, []);

    return <DocsVersionDropdownNavbarItem {...modifiedProps} />;
  }

  // For other pages, use default behavior
  return <DocsVersionDropdownNavbarItem {...props} />;
}
