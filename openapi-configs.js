/**
 * OpenAPI configurations for ADR documentation
 *
 * This file contains all OpenAPI/Swagger API configurations for use-case ADRs.
 * Each ADR with an API should have its configuration defined here.
 *
 * Versioned API docs are automatically generated for all Docusaurus versions
 * where the YAML spec file exists in versioned_docs/.
 */

const fs = require("fs");
const path = require("path");

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/factory-x-contributions/architecture-decisions/main";

/**
 * Creates an OpenAPI configuration for a use-case ADR (current/upcoming version)
 * @param {string} adrPath - The ADR folder path (e.g., "adr101-load-management")
 * @param {string} yamlFileName - The OpenAPI YAML file name
 * @param {object} options - Optional configuration overrides
 * @returns {object} Complete OpenAPI plugin configuration
 */
const createApiConfig = (adrPath, yamlFileName, options = {}) => ({
  specPath: `docs/hercules_use_case_adr/${adrPath}/resources/${yamlFileName}`,
  outputDir: `docs/hercules_use_case_adr/${adrPath}/api`,
  downloadUrl: `${GITHUB_RAW_BASE}/docs/hercules_use_case_adr/${adrPath}/resources/${yamlFileName}`,
  sidebarOptions: {
    groupPathsBy: "tag",
    sidebarCollapsed: false,
    ...options.sidebarOptions,
  },
  hideSendButton: false,
  ...options,
});

/**
 * Creates an OpenAPI configuration for a versioned use-case ADR
 * @param {string} version - The Docusaurus version (e.g., "2026-3")
 * @param {string} adrPath - The ADR folder path (e.g., "adr101-load-management")
 * @param {string} yamlFileName - The OpenAPI YAML file name
 * @param {object} options - Optional configuration overrides
 * @returns {object} Complete OpenAPI plugin configuration for versioned docs
 */
const createVersionedApiConfig = (version, adrPath, yamlFileName, options = {}) => ({
  specPath: `versioned_docs/version-${version}/hercules_use_case_adr/${adrPath}/resources/${yamlFileName}`,
  outputDir: `versioned_docs/version-${version}/hercules_use_case_adr/${adrPath}/api`,
  downloadUrl: `${GITHUB_RAW_BASE}/versioned_docs/version-${version}/hercules_use_case_adr/${adrPath}/resources/${yamlFileName}`,
  sidebarOptions: {
    groupPathsBy: "tag",
    sidebarCollapsed: false,
    ...options.sidebarOptions,
  },
  hideSendButton: false,
  ...options,
});

/**
 * Reads Docusaurus versions from versions.json
 * @returns {string[]} Array of version strings, or empty array if file doesn't exist
 */
function getDocusaurusVersions() {
  const versionsPath = path.resolve(__dirname, "versions.json");
  if (!fs.existsSync(versionsPath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(versionsPath, "utf-8"));
  } catch {
    return [];
  }
}

/**
 * Checks if a YAML spec file exists for a given version
 * @param {string} version - The Docusaurus version
 * @param {string} adrPath - The ADR folder path
 * @param {string} yamlFileName - The YAML file name
 * @returns {boolean}
 */
function versionHasSpec(version, adrPath, yamlFileName) {
  const specPath = path.resolve(
    __dirname,
    "versioned_docs",
    `version-${version}`,
    "hercules_use_case_adr",
    adrPath,
    "resources",
    yamlFileName
  );
  return fs.existsSync(specPath);
}

/**
 * Registry of all ADR API specifications.
 * Add new ADR APIs here following the pattern below.
 * Each entry: { configKey, adrPath, yamlFileName, options? }
 */
const adrApiRegistry = [
  // ADR 101 - Energy consumption & Load Management
  {
    configKey: "adr101-forecast-service",
    adrPath: "adr101-load-management",
    yamlFileName: "forecast-service-openapi.yaml",
  },

  // Add future ADR APIs here:
  // {
  //   configKey: "adr102-service-name",
  //   adrPath: "adr102-folder",
  //   yamlFileName: "service-openapi.yaml",
  // },
];

/**
 * Builds the complete API config object including versioned entries.
 * For each ADR API in the registry, creates a config for the current (upcoming)
 * version and additional configs for each Docusaurus version where the spec exists.
 */
function buildApiConfigs() {
  const configs = {};
  const versions = getDocusaurusVersions();

  for (const entry of adrApiRegistry) {
    const { configKey, adrPath, yamlFileName, options } = entry;

    // Current/Upcoming version (docs/)
    configs[configKey] = createApiConfig(adrPath, yamlFileName, options);

    // Versioned entries (versioned_docs/version-X/)
    for (const version of versions) {
      if (versionHasSpec(version, adrPath, yamlFileName)) {
        const versionedKey = `${configKey}-v${version}`;
        configs[versionedKey] = createVersionedApiConfig(
          version,
          adrPath,
          yamlFileName,
          options
        );
      }
    }
  }

  return configs;
}

module.exports = buildApiConfigs();
