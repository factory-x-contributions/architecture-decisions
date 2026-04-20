---
id: fx_adr002_test
title: ADR 002 – Test Scenarios for Cross-Company Authorization and Discovery
sidebar_label: ADR 002 – Test Scenarios
description: BDD Gherkin test scenarios derived from the normative requirements of ADR 002 (Cross-Company Authorization and Discovery).
tags: [architecture_decision_records, network_adr, security, testing, gherkin]
---

## Test Scenarios

The following Gherkin scenarios are derived from the normative requirements of [ADR 002](./README.md).

Coverage:

| Tag | Scope |
|-----|-------|
| `@smoke` | Critical happy-path scenarios |
| `@edge` | Boundary and equivalence class cases |
| `@negative` | Error handling and failure scenarios |

```gherkin
Feature: ADR 002 – Cross-Company Authorization and Discovery
  As a dataspace participant
  I want to discover and access data offers across company boundaries using DSP 2025-1
  So that I can exchange data under agreed contractual terms without point-to-point integrations

  # ─────────────────────────────────────────────
  # SMOKE – Happy Path
  # ─────────────────────────────────────────────

  @smoke @ADR-002
  Scenario: Provider exposes data offer via DSP Catalog
    Given a Data Provider has a data asset to share across participant boundaries
    When a Data Consumer requests the DSP Catalog from the Provider's protocol endpoint
    Then the Catalog response contains a Data Offer with a "Distribution" object
    And the "Distribution" object has "format" set to "HttpData-PULL"

  @smoke @ADR-002
  Scenario: Consumer initiates transfer using HttpData-PULL
    Given a Data Consumer has received a valid Catalog with an HttpData-PULL Distribution
    When the Consumer sends a "TransferRequestMessage" with "format" set to "HttpData-PULL"
    Then the Provider responds with a "TransferStartMessage"
    And the "TransferStartMessage" contains a "dataAddress" property

  @smoke @ADR-002
  Scenario: TransferStartMessage contains all required endpointProperties
    Given a Provider has received a valid TransferRequestMessage with format "HttpData-PULL"
    When the Provider sends the "TransferStartMessage"
    Then the "dataAddress.endpointType" equals "https://w3id.org/idsa/v4.1/HTTP"
    And "endpointProperties" contains "https://w3id.org/edc/v0.0.1/ns/authorization"
    And "endpointProperties" contains "https://w3id.org/edc/v0.0.1/ns/authType"
    And "endpointProperties" contains "https://w3id.org/tractusx/auth/refreshEndpoint"
    And "endpointProperties" contains "https://w3id.org/tractusx/auth/refreshToken"
    And "endpointProperties" contains "https://w3id.org/tractusx/auth/expiresIn"

  @smoke @ADR-002
  Scenario: Provider accepts STS-Token as access token
    Given a Consumer has completed contract negotiation and holds a valid STS-Token
    When the Consumer makes an HTTP request to the Provider's data endpoint
    And includes the STS-Token in the "Authorization" header using the prefix from "authType"
    Then the Provider returns HTTP 200 with the requested data

  # ─────────────────────────────────────────────
  # EDGE – Boundary / Equivalence Cases
  # ─────────────────────────────────────────────

  @edge @ADR-002
  Scenario: Access token is at the boundary of its TTL (expiresIn)
    Given a Consumer holds an access token that expires in exactly 1 second
    When the Consumer sends a data request before the token expires
    Then the Provider returns HTTP 200 with the requested data
    And a new access token can be obtained via the refreshEndpoint

  @edge @ADR-002
  Scenario: Token refresh using refreshToken at refreshEndpoint
    Given a Consumer's access token has expired
    And the Consumer holds a valid "refreshToken"
    When the Consumer sends the refreshToken to the "refreshEndpoint" with an STS-Token for authentication
    Then the refreshEndpoint returns a new access token per RFC 6749 Section 6
    And the new token can be used to access the Provider's data endpoint

  @edge @ADR-002
  Scenario: Catalog contains multiple Data Offers with different formats
    Given a Provider exposes multiple assets including non-HttpData-PULL distributions
    When a Consumer requests the Catalog
    Then each HttpData-PULL Distribution explicitly sets "format" to "HttpData-PULL"
    And non-HttpData-PULL entries do not interfere with HttpData-PULL processing

  # ─────────────────────────────────────────────
  # NEGATIVE – Failure / Error Cases
  # ─────────────────────────────────────────────

  @negative @ADR-002
  Scenario: Consumer sends TransferRequestMessage with wrong format
    Given a Consumer has negotiated a contract for an HttpData-PULL asset
    When the Consumer sends a "TransferRequestMessage" with "format" set to "HttpData-PUSH"
    Then the Provider rejects the request
    And returns an error response indicating format mismatch

  @negative @ADR-002
  Scenario: Access attempt with expired token
    Given a Consumer holds an access token past its "expiresIn" deadline
    When the Consumer attempts to access the Provider's data endpoint without refreshing
    Then the Provider returns HTTP 401 Unauthorized

  @negative @ADR-002
  Scenario: TransferStartMessage is missing a required endpointProperty
    Given a Provider's implementation omits the "authorization" endpointProperty
    When a Consumer receives the TransferStartMessage
    Then the Consumer cannot construct a valid HTTP request to the data endpoint
    And the data transfer fails with an appropriate error

  @negative @ADR-002
  Scenario: Access attempt without prior contract negotiation
    Given a Consumer has not negotiated a contract with the Provider
    When the Consumer attempts to access a data endpoint directly
    Then the Provider returns HTTP 403 Forbidden
```
