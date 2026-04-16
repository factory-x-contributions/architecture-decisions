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
import { useVersions, useDocsPreferredVersion } from '@docusaurus/plugin-content-docs/client';

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
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const { colorMode } = useColorMode();
  const location = useLocation();

  const baseUrl = useBaseUrl('/');

  // Get versions and user preference from Docusaurus plugin
  const allVersions = useVersions('default');
  const latestReleasedVersion = allVersions.find(v => v.isLast);
  const latestVersion = latestReleasedVersion ? latestReleasedVersion.name : null;

  // useDocsPreferredVersion is reactive: updates automatically when the user
  // changes the version in the navbar, no polling needed.
  const { preferredVersion } = useDocsPreferredVersion('default');

  // Determine which version's graph data to load.
  // Priority: URL param > Docusaurus preferred version > 'current' (Upcoming)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const versionParam = params.get('version');
    if (versionParam) {
      setCurrentVersion(versionParam);
      return;
    }
    // preferredVersion is null on first render (SSR-safe), then resolves to the
    // stored value. Default to 'current' (Upcoming) so new ADRs are always visible.
    setCurrentVersion(preferredVersion ? preferredVersion.name : 'current');
  }, [location.search, preferredVersion]);

  // Load graph data based on docs version
  useEffect(() => {
    // Wait until version is determined
    if (currentVersion === null) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);

    // Determine which data file to load
    const dataFile = currentVersion === 'current'
      ? 'adr-graph-data.json'
      : `adr-graph-data-${currentVersion}.json`;

    const fullUrl = `${baseUrl}${dataFile}`;

    fetch(fullUrl, { signal })
      .then((response) => {
        if (!response.ok) {
          // Fallback to current version if versioned file doesn't exist
          return fetch(`${baseUrl}adr-graph-data.json`, { signal });
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('[ADR Graph] Error loading ADR graph data:', error);
        setLoading(false);
      });

    return () => controller.abort();
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

      // Build complete path with version prefix and baseUrl
      // Paths in JSON are like: /hercules_network_adr/adr002-...
      // We need to add baseUrl + /docs/{version}/ prefix
      let adjustedPath;
      if (currentVersion === 'current') {
        // For current/upcoming version, use /docs/next/ path
        adjustedPath = `${baseUrl}docs/next${node.path}`;
      } else if (currentVersion === latestVersion) {
        // For the default/latest version, use /docs/ without version prefix
        adjustedPath = `${baseUrl}docs${node.path}`;
      } else {
        // For other versioned pages, use /docs/{version}/ path
        adjustedPath = `${baseUrl}docs/${currentVersion}${node.path}`;
      }

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
          path: adjustedPath,
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
          justifyContent: 'center',
          transition: 'opacity 0.2s ease'
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
          strokeWidth: 3,
          transition: 'opacity 0.2s ease, stroke-width 0.2s ease'
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
  }, [graphData, filteredProjects, filteredCategories, searchTerm, colorMode, currentVersion, latestVersion, baseUrl]);

  // Hover impact analysis — lightweight style-only update, no layout recalculation
  useEffect(() => {
    if (!graphData.edges) return;

    const connectedNodeIds = new Set();
    if (hoveredNodeId) {
      connectedNodeIds.add(hoveredNodeId);
      for (const edge of graphData.edges) {
        if (edge.source === hoveredNodeId) connectedNodeIds.add(edge.target);
        if (edge.target === hoveredNodeId) connectedNodeIds.add(edge.source);
      }
    }

    setNodes(nds => nds.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: hoveredNodeId && !connectedNodeIds.has(node.id) ? 0.2 : 1
      }
    })));

    setEdges(eds => eds.map(edge => {
      const isConnected = hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId);
      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: hoveredNodeId && !isConnected ? 0.1 : 1,
          strokeWidth: isConnected ? 5 : 3
        }
      };
    }));
  }, [hoveredNodeId, graphData.edges]);

  const handleProjectFilterChange = useCallback((projects) => {
    setFilteredProjects(projects);
  }, []);

  const handleCategoryFilterChange = useCallback((categories) => {
    setFilteredCategories(categories);
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const onNodeMouseEnter = useCallback((_, node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
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
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
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
