---
id: fx_adr003_test
title: ADR 003 – Test Scenarios for Authentication for Dataspaces
sidebar_label: ADR 003 – Test Scenarios
description: BDD Gherkin test scenarios derived from the normative requirements of ADR 003 (Authentication for Dataspaces).
tags: [architecture_decision_records, network_adr, security, testing, gherkin]
---

## Test Scenarios

The following Gherkin scenarios are derived from the normative requirements of [ADR 003](./README.md).

Coverage:

| Tag | Scope |
|-----|-------|
| `@smoke` | Critical happy-path scenarios |
| `@edge` | Boundary and equivalence class cases |
| `@negative` | Error handling and failure scenarios |

```gherkin
Feature: ADR 003 – Authentication for Dataspaces
  As a dataspace participant
  I want to authenticate and verify other participants using decentralized identity standards
  So that secure, trust-verified service-to-service communication is possible without a central authority

  # ─────────────────────────────────────────────
  # SMOKE – Happy Path
  # ─────────────────────────────────────────────

  @smoke @ADR-003
  Scenario: Participant claims a DID using the did:web method
    Given a dataspace participant with a registered domain
    When the participant's DID is resolved using the did:web method
    Then the resolved DID Document is a valid W3C DID Document
    And the DID Document contains at least one public key

  @smoke @ADR-003
  Scenario: DID Document exposes services per Decentralized Claims Protocol v1.0
    Given a participant's DID has been resolved to a DID Document
    When the DID Document is validated against DCP v1.0 chapters 4.3.3, 5.2, 5.4.3 and 6.2
    Then the DID Document contains a "service" array with at least one entry
    And the required DCP service endpoints are present and reachable

  @smoke @ADR-003
  Scenario: Participant presents credentials as Verifiable Presentation in vc11-sl2021/jwt profile
    Given a participant holds a valid Verifiable Credential issued by a trusted issuer
    When the participant presents its credentials during authentication
    Then the presentation is formatted as a Verifiable Presentation
    And the presentation uses the "vc11-sl2021/jwt" profile
    And the JWT signature can be verified using the participant's DID-bound public key

  @smoke @ADR-003
  Scenario: STS-Token is issued after successful DID-based authentication
    Given two participants have exchanged and validated each other's DID Documents
    And both hold valid Verifiable Credentials accepted by the other party
    When the authentication handshake completes
    Then the accepting party issues an STS-Token to the requesting participant
    And the STS-Token can be used as the access token per ADR 002

  # ─────────────────────────────────────────────
  # EDGE – Boundary / Equivalence Cases
  # ─────────────────────────────────────────────

  @edge @ADR-003
  Scenario: Participant trusts multiple independent VC issuers
    Given a participant has configured trust for two independent VC issuers (Issuer-A and Issuer-B)
    When a counterpart presents a Verifiable Presentation signed by Issuer-B
    Then the participant resolves Issuer-B's DID and validates the credential
    And authentication succeeds without requiring a central trust registry

  @edge @ADR-003
  Scenario: DID Document contains multiple public keys (key rotation scenario)
    Given a participant has rotated their signing key
    And the DID Document contains both the old (revoked) and the new (active) key
    When a Verifiable Presentation signed with the new key is verified
    Then verification succeeds using the active key
    And a presentation signed with the revoked key is rejected

  @edge @ADR-003
  Scenario Outline: DCP v1.0 mandatory section compliance per chapter
    Given a participant's DID Document has been resolved
    When the DID Document is checked against DCP v1.0 <chapter>
    Then the DID Document satisfies all normative requirements of <chapter>

    Examples:
      | chapter |
      | 4.3.3   |
      | 5.2     |
      | 5.4.3   |
      | 6.2     |

  # ─────────────────────────────────────────────
  # NEGATIVE – Failure / Error Cases
  # ─────────────────────────────────────────────

  @negative @ADR-003
  Scenario: Authentication fails when DID Document is not resolvable
    Given a participant advertises a DID that cannot be resolved via did:web
    When a counterpart attempts to verify the participant's identity
    Then the resolution fails with an appropriate error
    And the authentication attempt is rejected (HTTP 401)

  @negative @ADR-003
  Scenario: Credential presented in unsupported profile
    Given a participant holds a Verifiable Credential
    When the participant presents the credential using profile "vc20/jwt" instead of "vc11-sl2021/jwt"
    Then the verifier rejects the presentation
    And authentication fails with a profile-mismatch error

  @negative @ADR-003
  Scenario: Verifiable Presentation with invalid JWT signature
    Given a participant constructs a Verifiable Presentation as a JWT
    When the JWT signature does not match any public key in the participant's DID Document
    Then the verifier rejects the presentation
    And the session is not established

  @negative @ADR-003
  Scenario: Participant uses a non-did:web DID method
    Given a participant claims a DID using the "did:key" method instead of "did:web"
    When a counterpart attempts to authenticate using the DID
    Then the authentication is rejected
    And an error is returned indicating the unsupported DID method
```
