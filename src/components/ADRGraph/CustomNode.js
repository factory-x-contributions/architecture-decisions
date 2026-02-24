import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Link from '@docusaurus/Link';
import styles from './ADRGraph.module.css';

function CustomNode({ data }) {
  const { number, title, category, tags, referenceCount, path, isHighlighted } = data;

  const categoryColor = category === 'network' ? '#386FB3' : '#C4D042';

  return (
    <div className={`${styles.bubbleNode} ${isHighlighted ? styles.highlighted : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Handle type="target" position={Position.Right} className={styles.handle} />

      <Link to={path} className={styles.bubbleContent} title={title}>
        <div className={styles.bubbleCenter}>
          <div className={styles.adrNumberBubble}>
            {number}
          </div>
          {referenceCount > 0 && (
            <div className={styles.referenceBadgeBubble}>
              {referenceCount}
            </div>
          )}
        </div>
        <div className={styles.bubbleTitle}>
          {title}
        </div>
      </Link>

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Left} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}

export default memo(CustomNode);
