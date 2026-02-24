import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import GraphControls from './GraphControls';
import styles from './ADRGraph.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from '@docusaurus/router';
import { useVersions } from '@docusaurus/plugin-content-docs/client';

const nodeTypes = {
  custom: CustomNode
};

// Category colors
const CATEGORY_COLORS = {
  network: { light: '#386FB3', dark: '#4a7bc8' },
  usecase: { light: '#27AE60', dark: '#2ECC71' },
  leo: { light: '#E67E22', dark: '#F39C12' },
  orion: { light: '#9B59B6', dark: '#A569BD' }
};

// Force-directed layout
const getForceLayoutedElements = (nodes, edges) => {
  const nodeCount = nodes.length;
  const centerX = 600;
  const centerY = 400;
  const radius = Math.max(300, nodeCount * 80);

  nodes.forEach((node, index) => {
    const angle = (index / nodeCount) * 2 * Math.PI;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    node.position = {
      x: x - node.style.width / 2,
      y: y - node.style.height / 2
    };
  });

  return { nodes, edges };
};

// Calculate bubble diameter based on reference count
const getBubbleDimensions = (referenceCount) => {
  const baseDiameter = 200;
  const maxDiameter = 320;
  const diameter = Math.min(baseDiameter + referenceCount * 50, maxDiameter);
  return { width: diameter, height: diameter };
};

export default function ADRGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [filteredProjects, setFilteredProjects] = useState(['hercules', 'leo', 'orion']);
  const [filteredCategories, setFilteredCategories] = useState(['network', 'usecase', 'leo', 'orion']);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentVersion, setCurrentVersion] = useState(null);
  const { colorMode } = useColorMode();
  const location = useLocation();

  const baseUrl = useBaseUrl('/');

  // Get versions from Docusaurus plugin (works in both dev and production)
  const allVersions = useVersions('default');
  // Filter to only released versions (not "current"/upcoming)
  const availableVersions = allVersions
    .filter(v => !v.isLast)
    .map(v => v.name);
  // Get the latest released version (first non-current version)
  const latestVersion = availableVersions.length > 0 ? availableVersions[0] : null;

  // Get current version from URL parameter or detect from global context
  const getVersion = useCallback(() => {
    // Check URL parameter first (e.g., /adr-graph?version=2025-12)
    const params = new URLSearchParams(location.search);
    const versionParam = params.get('version');
    if (versionParam) {
      return versionParam;
    }

    // Try to get version from localStorage (set by docs version switcher)
    try {
      const preferredVersion = localStorage.getItem('docs-preferred-version-default');
      if (preferredVersion && preferredVersion !== 'current') {
        return preferredVersion;
      }
    } catch (e) {
      // localStorage might not be available
    }

    // Default to the latest released version, same as Docusaurus navbar
    if (latestVersion) {
      return latestVersion;
    }

    // Fallback to current version only if no versions available
    return 'current';
  }, [location.search, latestVersion]);

  // Initialize version
  useEffect(() => {
    const version = getVersion();
    console.log('[ADR Graph] Initial version detected:', version);
    setCurrentVersion(version);
  }, [getVersion]);

  // Listen for storage changes (when version is changed in navbar)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'docs-preferred-version-default' || e.key === null) {
        setCurrentVersion(getVersion());
      }
    };

    // Also listen for custom event (Docusaurus might use this)
    const handleVersionChange = () => {
      setCurrentVersion(getVersion());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('docusaurus.versionChange', handleVersionChange);

    // Poll for changes as fallback (storage event doesn't fire in same tab)
    const pollInterval = setInterval(() => {
      const newVersion = getVersion();
      setCurrentVersion(prev => {
        if (prev !== newVersion) {
          return newVersion;
        }
        return prev;
      });
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('docusaurus.versionChange', handleVersionChange);
      clearInterval(pollInterval);
    };
  }, [getVersion]);

  // Load graph data based on docs version
  useEffect(() => {
    // Wait until version is determined
    if (currentVersion === null) {
      return;
    }

    setLoading(true);

    // Determine which data file to load
    const dataFile = currentVersion === 'current'
      ? 'adr-graph-data.json'
      : `adr-graph-data-${currentVersion}.json`;

    const fullUrl = `${baseUrl}${dataFile}`;
    console.log('[ADR Graph] Loading data for version:', currentVersion);
    console.log('[ADR Graph] Fetching URL:', fullUrl);

    fetch(fullUrl)
      .then((response) => {
        console.log('[ADR Graph] Response status:', response.status, response.ok);
        if (!response.ok) {
          console.warn('[ADR Graph] Failed to load versioned data, falling back to current');
          // Fallback to current version if versioned file doesn't exist
          return fetch(`${baseUrl}adr-graph-data.json`);
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('[ADR Graph] Loaded data:', data.nodes.length, 'nodes,', data.edges.length, 'edges');
        setGraphData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('[ADR Graph] Error loading ADR graph data:', error);
        setLoading(false);
      });
  }, [baseUrl, currentVersion]);

  // Process and layout graph data
  useEffect(() => {
    if (!graphData.nodes || graphData.nodes.length === 0) return;

    // Filter nodes
    const filteredNodes = graphData.nodes.filter((node) => {
      const projectMatch = filteredProjects.includes(node.project);
      const categoryMatch = filteredCategories.includes(node.category);
      const searchMatch = searchTerm === '' ||
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.number.includes(searchTerm);

      return projectMatch && categoryMatch && searchMatch;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredEdges = graphData.edges.filter((edge) => {
      return filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);
    });

    const isDark = colorMode === 'dark';

    const reactFlowNodes = filteredNodes.map((node) => {
      const { width, height } = getBubbleDimensions(node.referenceCount);
      const isHighlighted = searchTerm !== '' &&
        (node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         node.number.includes(searchTerm));

      const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.network;
      const categoryColor = isDark ? colors.dark : colors.light;

      return {
        id: node.id,
        type: 'custom',
        data: {
          number: node.number,
          title: node.title,
          project: node.project,
          category: node.category,
          tags: node.tags,
          referenceCount: node.referenceCount,
          path: node.path,
          isHighlighted
        },
        style: {
          width,
          height,
          background: categoryColor,
          border: isHighlighted ? '3px solid #ff4444' : `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      };
    });

    const reactFlowEdges = filteredEdges.map((edge) => {
      const edgeColor = isDark ? '#6b8ec8' : '#4a7bc8';

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'default',
        animated: true,
        style: {
          stroke: edgeColor,
          strokeWidth: 3
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 25,
          height: 25
        }
      };
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getForceLayoutedElements(
      reactFlowNodes,
      reactFlowEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [graphData, filteredProjects, filteredCategories, searchTerm, colorMode]);

  const handleProjectFilterChange = useCallback((projects) => {
    setFilteredProjects(projects);
  }, []);

  const handleCategoryFilterChange = useCallback((categories) => {
    setFilteredCategories(categories);
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading ADR Graph...</p>
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div className={styles.error}>
        <p>No ADR data found for this version.</p>
      </div>
    );
  }

  // Get available projects from data
  const availableProjects = [...new Set(graphData.nodes.map(n => n.project))];
  const availableCategories = [...new Set(graphData.nodes.map(n => n.category))];

  return (
    <div className={styles.container}>
      <GraphControls
        availableProjects={availableProjects}
        availableCategories={availableCategories}
        selectedProjects={filteredProjects}
        selectedCategories={filteredCategories}
        onProjectFilterChange={handleProjectFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onSearchChange={handleSearchChange}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        className={styles.reactFlow}
      >
        <Background color={colorMode === 'dark' ? '#333' : '#aaa'} gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colors = CATEGORY_COLORS[node.data.category] || CATEGORY_COLORS.network;
            return colorMode === 'dark' ? colors.dark : colors.light;
          }}
          maskColor={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
        />
      </ReactFlow>
    </div>
  );
}
