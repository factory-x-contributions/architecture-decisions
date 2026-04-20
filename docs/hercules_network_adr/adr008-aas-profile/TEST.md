---
id: fx_adr008_test
title: ADR 008 – Test Scenarios for AAS Profile for Factory-X
sidebar_label: ADR 008 – Test Scenarios
description: BDD Gherkin test scenarios derived from the normative requirements of ADR 008 (Asset Administration Shell Profile for Factory-X).
tags: [architecture_decision_records, network_adr, aas, testing, gherkin]
---

## Test Scenarios

The following Gherkin scenarios are derived from the normative requirements of [ADR 008](./README.md).

Coverage:

| Tag | Scope |
|-----|-------|
| `@smoke` | Critical happy-path scenarios |
| `@edge` | Boundary and equivalence class cases |
| `@negative` | Error handling and failure scenarios |

```gherkin
Feature: ADR 008 – Asset Administration Shell Profile for Factory-X
  As a Data Consumer
  I want to discover and retrieve AAS Submodels from a Data Provider following a defined profile
  So that I can access asset-centric data without prior knowledge of every service endpoint

  # ─────────────────────────────────────────────
  # SMOKE – Happy Path
  # ─────────────────────────────────────────────

  @smoke @ADR-008
  Scenario: Provider exposes AAS Registry and Discovery from a common URL path
    Given a Data Provider has deployed AAS services
    When the Provider's base URL is queried
    Then both the "AssetAdministrationShellRegistryServiceSpecification-SSP2" and
      the "DiscoveryServiceSpecification-SSP1" endpoints are served from the same URL path
    And both endpoints respond with HTTP 200

  @smoke @ADR-008
  Scenario: AAS Descriptor contains SubmodelDescriptors with semanticId
    Given a Data Consumer has obtained the AAS Registry endpoint of a Provider
    When the Consumer requests the AssetAdministrationShellDescriptor for a known globalAssetId
    Then the response contains at least one "SubmodelDescriptor" object
    And each "SubmodelDescriptor" includes a "semanticId" property

  @smoke @ADR-008
  Scenario: SubmodelDescriptor contains endpoint linking to the GetSubmodel interface
    Given a Consumer has retrieved a SubmodelDescriptor from the Provider's AAS Registry
    When the Consumer inspects the "Endpoint" objects within the SubmodelDescriptor
    Then at least one Endpoint has a valid URL serving the "GetSubmodel" interface
    And the Endpoint responds with the Submodel payload

  @smoke @ADR-008
  Scenario: GetSubmodel interface complies with IDTA-01002-3-0-3 HTTP binding
    Given a Consumer has obtained an Endpoint URL for a Submodel via the SubmodelDescriptor
    When the Consumer requests the Submodel via HTTP GET
    Then the response body is a valid Submodel per IDTA-01002-3-0-3
    And the response Content-Type is "application/json"

  # ─────────────────────────────────────────────
  # EDGE – Boundary / Equivalence Cases
  # ─────────────────────────────────────────────

  @edge @ADR-008
  Scenario: AAS Descriptor contains the minimum required number of SubmodelDescriptors (exactly one)
    Given a Provider has an AAS with exactly one registered Submodel
    When the Consumer requests the AssetAdministrationShellDescriptor
    Then exactly one "SubmodelDescriptor" is returned
    And it contains a "semanticId" and at least one "Endpoint" object

  @edge @ADR-008
  Scenario: AAS Descriptor contains multiple SubmodelDescriptors
    Given a Provider has an AAS with three Submodels of different semanticIds
    When the Consumer requests the AssetAdministrationShellDescriptor
    Then three "SubmodelDescriptor" objects are returned
    And each contains a distinct "semanticId"
    And each contains a valid Endpoint URL

  @edge @ADR-008
  Scenario: Discovery using specificAssetId when globalAssetId is not known
    Given a Consumer knows only a "specificAssetId" of an asset (not the globalAssetId)
    When the Consumer queries the DiscoveryServiceSpecification-SSP1 endpoint with the specificAssetId
    Then the Discovery Service returns the matching "globalAssetId"
    And the Consumer can subsequently look up the AAS Descriptor using that globalAssetId

  @edge @ADR-008
  Scenario: SubmodelDescriptor contains all SubmodelDescriptors as part of AASDescriptor (no separate registry)
    Given a Provider embeds all SubmodelDescriptors inside the AssetAdministrationShellDescriptor
    When a Consumer fetches the AAS Descriptor
    Then all SubmodelDescriptors are accessible without querying a separate Submodel Registry

  # ─────────────────────────────────────────────
  # NEGATIVE – Failure / Error Cases
  # ─────────────────────────────────────────────

  @negative @ADR-008
  Scenario: SubmodelDescriptor is missing the semanticId property
    Given a Provider publishes a SubmodelDescriptor without a "semanticId" field
    When a Consumer queries the AAS Registry for Submodels
    Then the Consumer cannot identify the Submodel type
    And processing fails with a validation error

  @negative @ADR-008
  Scenario: AAS Registry and Discovery endpoints are served from different URL paths (non-compliant)
    Given a Provider serves the AAS Registry at "/registry" and Discovery at "/discovery"
    When a Consumer attempts to use the consolidated URL-path assumption from ADR 008
    Then the Consumer fails to discover the Discovery endpoint from the Registry base URL
    And an integration error is reported

  @negative @ADR-008
  Scenario: GetSubmodel endpoint returns a non-compliant response body
    Given a Provider's Submodel endpoint returns a payload that does not conform to IDTA-01002-3-0-3
    When a Consumer fetches the Submodel
    Then the Consumer's validation of the response fails
    And an appropriate schema violation error is raised
```
