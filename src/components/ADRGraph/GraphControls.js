import React, { useState } from 'react';
import styles from './ADRGraph.module.css';

// Category display config
const CATEGORY_CONFIG = {
  network: { label: 'Network ADRs', color: '#386FB3', project: 'hercules' },
  usecase: { label: 'Use Case ADRs', color: '#27AE60', project: 'hercules' },
  leo: { label: 'Leo ADRs', color: '#E67E22', project: 'leo' },
  orion: { label: 'Orion ADRs', color: '#9B59B6', project: 'orion' }
};

const PROJECT_CONFIG = {
  hercules: { label: 'Hercules', color: '#386FB3' },
  leo: { label: 'Leo', color: '#E67E22' },
  orion: { label: 'Orion', color: '#9B59B6' }
};

export default function GraphControls({
  availableProjects = [],
  availableCategories = [],
  selectedProjects = [],
  selectedCategories = [],
  onProjectFilterChange,
  onCategoryFilterChange,
  onSearchChange,
  currentVersion,
  availableVersions = [],
  onVersionChange
}) {
  const [searchValue, setSearchValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleProjectChange = (project) => {
    const newSelected = selectedProjects.includes(project)
      ? selectedProjects.filter((p) => p !== project)
      : [...selectedProjects, project];
    onProjectFilterChange(newSelected);
  };

  const handleCategoryChange = (category) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoryFilterChange(newSelected);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onProjectFilterChange(['hercules', 'leo', 'orion']);
    onCategoryFilterChange(['network', 'usecase', 'leo', 'orion']);
    onSearchChange('');
  };

  // Get Hercules categories from available ones
  const herculesCategories = availableCategories.filter(c => c === 'network' || c === 'usecase');

  return (
    <div className={styles.controlPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <h2>ADR Graph</h2>
          <p>Dependencies between Architecture Decision Records</p>
        </div>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.controlsContent}>
          {availableVersions.length > 0 && (
            <div className={styles.controlSection}>
              <label className={styles.controlLabel}>Version</label>
              <select
                value={currentVersion || 'current'}
                onChange={(e) => onVersionChange(e.target.value)}
                className={styles.versionSelect}
              >
                <option value="current">Upcoming 🤫🚧</option>
                {availableVersions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.controlSection}>
            <label className={styles.controlLabel}>Search</label>
            <input
              type="text"
              placeholder="Title or number..."
              value={searchValue}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>

          {availableProjects.length > 0 && (
            <div className={styles.controlSection}>
              <label className={styles.controlLabel}>Projects</label>
              <div className={styles.checkboxGroup}>
                {availableProjects.map((project) => {
                  const config = PROJECT_CONFIG[project] || { label: project, color: '#666' };
                  return (
                    <label key={project} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project)}
                        onChange={() => handleProjectChange(project)}
                      />
                      <span className={styles.legendDot} style={{ background: config.color }} />
                      <span>{config.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {herculesCategories.length > 0 && selectedProjects.includes('hercules') && (
            <div className={styles.controlSection}>
              <label className={styles.controlLabel}>Hercules Categories</label>
              <div className={styles.checkboxGroup}>
                {herculesCategories.map((category) => {
                  const config = CATEGORY_CONFIG[category] || { label: category, color: '#666' };
                  return (
                    <label key={category} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className={styles.legendDot} style={{ background: config.color }} />
                      <span>{config.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={clearAllFilters} className={styles.clearButton}>
            Reset Filters
          </button>

          <div className={styles.legend}>
            <h4>Legend</h4>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#386FB3' }} />
              <span>Hercules Network</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#27AE60' }} />
              <span>Hercules Use Case</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#E67E22' }} />
              <span>Leo</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#9B59B6' }} />
              <span>Orion</span>
            </div>
            <p className={styles.legendHint}>Larger nodes = more references</p>
          </div>
        </div>
      )}
    </div>
  );
}
