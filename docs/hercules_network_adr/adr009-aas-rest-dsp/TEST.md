---
id: fx_adr009_test
title: ADR 009 – Test Scenarios for Discovery of AAS Services via DSP
sidebar_label: ADR 009 – Test Scenarios
description: BDD Gherkin test scenarios derived from the normative requirements of ADR 009 (Discovery of AAS Services via DSP).
tags: [architecture_decision_records, network_adr, aas, testing, gherkin]
---

## Test Scenarios

The following Gherkin scenarios are derived from the normative requirements of [ADR 009](./README.md).

Coverage:

| Tag | Scope |
|-----|-------|
| `@smoke` | Critical happy-path scenarios |
| `@edge` | Boundary and equivalence class cases |
| `@negative` | Error handling and failure scenarios |

```gherkin
Feature: ADR 009 – Discovery of AAS Services via DSP
  As a Data Consumer
  I want to discover AAS Digital Twin Registries and Submodels through the Dataspace Protocol
  So that I can access AAS data without prior out-of-band knowledge of endpoints or credentials

  # ─────────────────────────────────────────────
  # SMOKE – Happy Path
  # ─────────────────────────────────────────────

  @smoke @ADR-009
  Scenario: Provider advertises Digital Twin Registry as Dataset in DSP Catalog
    Given a Data Provider has a Digital Twin Registry (DTR)
    When a Consumer requests the Provider's DSP Catalog
    Then the Catalog contains a "Dataset" representing the Digital Twin Registry
    And the Dataset has annotation "http://purl.org/dc/terms/type" equal to
      "https://w3id.org/catenax/taxonomy#DigitalTwinRegistry"

  @smoke @ADR-009
  Scenario: Consumer obtains DTR URL after successful authentication
    Given a Consumer has negotiated access to the Provider's DTR Dataset via DSP
    And authentication per ADR 003 has succeeded
    When the Consumer uses the granted access
    Then the Provider yields a URL that serves as the base for "/shell-descriptors" and "/lookup"

  @smoke @ADR-009
  Scenario: SubmodelDescriptor endpoint contains DSP subprotocol information
    Given a Consumer has retrieved a SubmodelDescriptor from the Provider's DTR
    When the Consumer inspects the "endpoints" array of the SubmodelDescriptor
    Then at least one endpoint has "protocolInformation.subprotocol" set to "DSP"
    And "protocolInformation.subprotocolBody" contains the key "id" (Dataset ID in Provider Catalog)
    And "protocolInformation.subprotocolBody" contains the key "dspEndpoint"
    And "protocolInformation.href" points to the submodel's accessible URL

  @smoke @ADR-009
  Scenario: Consumer accesses Submodel via DSP using subprotocolBody metadata
    Given a Consumer has parsed the "subprotocolBody" from a SubmodelDescriptor endpoint
    And extracted the "id" and "dspEndpoint" values
    When the Consumer negotiates access to that Dataset at the given "dspEndpoint"
    Then the Provider grants access and the Consumer can retrieve the Submodel via the "href" URL

  # ─────────────────────────────────────────────
  # EDGE – Boundary / Equivalence Cases
  # ─────────────────────────────────────────────

  @edge @ADR-009
  Scenario: Access to shell-descriptors is enforced at granular level
    Given a Consumer has access to the DTR
    And the DTR contains Shell Descriptors for two different assets (Asset-A and Asset-B)
    And the Consumer's contract only grants access to Asset-A
    When the Consumer queries "/shell-descriptors" for Asset-A
    Then the response includes Asset-A's Shell Descriptor
    When the Consumer queries "/shell-descriptors" for Asset-B
    Then the response is HTTP 403 Forbidden

  @edge @ADR-009
  Scenario: Catalog contains multiple DTR Datasets from different organizational units
    Given a Provider's Catalog includes two Dataset entries both typed as DigitalTwinRegistry
    When a Consumer queries the Catalog
    Then both Datasets are returned with the correct "dc:type" annotation
    And a Consumer can negotiate access to either independently

  @edge @ADR-009
  Scenario: subprotocolBody key-value pairs are correctly parsed with "=" assignment and ";" separator
    Given a SubmodelDescriptor endpoint has a "subprotocolBody" value
      "id=my-dataset-id;dspEndpoint=https://provider.example.com/protocol"
    When a Consumer parses the subprotocolBody
    Then the "id" is extracted as "my-dataset-id"
    And the "dspEndpoint" is extracted as "https://provider.example.com/protocol"

  # ─────────────────────────────────────────────
  # NEGATIVE – Failure / Error Cases
  # ─────────────────────────────────────────────

  @negative @ADR-009
  Scenario: DTR Dataset missing the required dc:type annotation
    Given a Provider's Catalog contains a Dataset for the DTR without the taxonomy annotation
    When a Consumer attempts to identify the DTR Dataset programmatically
    Then the Consumer cannot discover the DTR automatically
    And a discovery failure is reported

  @negative @ADR-009
  Scenario: SubmodelDescriptor endpoint missing DSP subprotocol information
    Given a SubmodelDescriptor endpoint has no entry with "protocolInformation.subprotocol" set to "DSP"
    When a Consumer tries to access the Submodel via DSP
    Then the Consumer cannot derive the DSP endpoint or Dataset ID
    And access fails with an appropriate error

  @negative @ADR-009
  Scenario: Consumer requests DTR before completing authentication
    Given a Consumer has not yet completed DSP authentication per ADR 003
    When the Consumer requests the DTR URL from the Provider
    Then the Provider returns HTTP 401 Unauthorized
    And the DTR URL is not disclosed

  @negative @ADR-009
  Scenario: subprotocolBody is malformed (missing required key)
    Given a SubmodelDescriptor endpoint has subprotocolBody "dspEndpoint=https://provider.example.com"
      (missing the "id" key)
    When a Consumer parses the subprotocolBody
    Then the Consumer detects the missing "id" key
    And reports a configuration error for the SubmodelDescriptor
```
