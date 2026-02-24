import React from 'react';
import Layout from '@theme/Layout';
import ADRGraph from '@site/src/components/ADRGraph/ADRGraph';
import styles from './adr-graph.module.css';

export default function ADRGraphPage() {
  return (
    <Layout
      title="ADR Graph"
      description="Interactive visualization of architecture decision relationships in the Factory-X ecosystem"
    >
      <main className={styles.main}>
        <ADRGraph />
      </main>
    </Layout>
  );
}
