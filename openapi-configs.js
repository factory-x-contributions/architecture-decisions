/**
 * OpenAPI configurations for ADR documentation
 *
 * This file contains all OpenAPI/Swagger API configurations for use-case ADRs.
 * Each ADR with an API should have its configuration defined here.
 */

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/factory-x-contributions/architecture-decisions/main";

/**
 * Creates an OpenAPI configuration for a use-case ADR
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
 * All OpenAPI configurations for use-case ADRs
 * Add new ADR APIs here following the pattern below
 */
const apiConfigs = {
  // ADR 101 - Energy consumption & Load Management
  "adr101-forecast-service": createApiConfig(
    "adr101-load-management",
    "forecast-service-openapi.yaml"
  ),

  // Add future ADR APIs here:
  // "adr102-service-name": createApiConfig("adr102-folder", "service-openapi.yaml"),
};

module.exports = apiConfigs;
