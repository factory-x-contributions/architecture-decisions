import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import versions from '../../versions.json';

// Set the ADR slug you want to open for each version.
const ADR_SLUG = 'hercules/adr002-authorization-discovery/';

// Helpers to build version-aware routes:
function linkToVersionADR(version, index) {
  return index === 0 ? `/docs/${ADR_SLUG}` : `/docs/${version}/${ADR_SLUG}`;
}
function linkToNextADR() {
  return `/docs/next/${ADR_SLUG}`;
}

export default function VersionsPage() {
  const latest = versions && versions.length ? versions[0] : null;
  const pastVersions = versions && versions.length > 1 ? versions.slice(1) : [];

  return (
    <Layout title="Versions Overview" description="All documentation versions for this site">
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Versions Overview</h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Browse all ADR releases and the canary ADR's.
          </p>
        </header>

        {/* Current versions (Current + Latest) */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Current versions</h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {/* Latest */}
            <div className="card" style={{ flex: '1 1 280px' }}>
              <div className="card__header">
                <h3 style={{ marginBottom: 0 }}>Latest Release</h3>
              </div>
              <div className="card__body">
                {latest ? (
                  <>
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>{latest}</strong>
                    </p>
                    <p style={{ marginBottom: 0 }}>
                      Latest versioned ADR release from <code>/versioned_docs</code>.
                    </p>
                  </>
                ) : (
                  <p>No released versions yet.</p>
                )}
              </div>
              <div className="card__footer">
                <div className="button-group button-group--block">
                  {latest ? (
                    <Link className="button button--primary" to={linkToVersionADR(latest, 0)}>
                      Open {latest} ADR
                    </Link>
                  ) : (
                    <Link className="button button--primary button--disabled" to="#">
                      Open docs
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Next */}
            <div className="card" style={{ flex: '1 1 280px' }}>
              <div className="card__header">
                <h3 style={{ marginBottom: 0 }}>Canary 🚧</h3>
              </div>
              <div className="card__body">
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Code in development</strong>
                </p>
                <p style={{ marginBottom: 0 }}>
                  Latest changes from <code>/docs</code> without a release.
                </p>
              </div>
              <div className="card__footer">
                <div className="button-group button-group--block">
                  <Link className="button button--secondary" to={linkToNextADR()}>
                    Open Next ADR
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Past versions */}
        <section>
          <h2>Past versions</h2>
          {pastVersions.length === 0 ? (
            <p>No past versions yet.</p>
          ) : (
            <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {pastVersions.map((v, idx) => (
                    <tr key={v}>
                      <td>
                        <code>{v}</code>
                      </td>
                      <td>
                        <Link to={linkToVersionADR(v, idx + 1)}>Open {v} ADR</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
