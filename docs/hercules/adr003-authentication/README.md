---
id: fx_adr003_0.2.0
title: ADR 003 – Authentication for Dataspaces, version 0.2.0
date: 2025-08-21
tags: [architecture_decision_records, network_adr, security]
---

### Problem to be solved

Participants need a secure way to judge one another's authenticity and the claims made about them. That includes the
ability to
R1) verify signatures based on an infrastructure to discover each other's public cryptographic material.
R2) integrate in ecosystems with multiple independent sources of trust,
R3) access, parse and understand claims made about a participant based on an established common set of attributes (such
as roles).

### Solution description (normative)

Every participant MUST claim a did according to the did:web method [1,2]. 
Every participant MUST expose a did document indicating public keys and services according to Decentralized Claims
Protocol v1.0 [4] chapters 4.3.3, 5.2, 5.4.3 and 6.2.
Every participant MUST present its credentials according to Decentralized Claims Protocol's Verifiable Presentation
Protocol in the profile `vc11-sl2021/jwt`.

### Context

Each participant is free to trust the Verifiable Credential issuers of their choice. The protocol stack unifies the
possibility of peer-to-peer relationships and the integration of a third-party source of trust. This ADR leaves open the
design of a common set of Factory-X credential claims to be exchanged, extending the W3C Verifiable Credential (VC)
Standard [3]

### Expected business consequences

Apps integrate against decentralized authentication services directly or via mediation element.

### Alternatives evaluated

A1. No common Authentication stack (then data exchange will always fail with HTTP 401, even with knowledge of the
relevant endpoint)

A2. Federated OIDC/SAML Servers (unfit for service-to-service communication)

A3. Use OAuth2 token-exchange for gateway (unclear how to integrate multiple sources of trust in the sense of the
issuer-holder-verifier triangle)

### References

[1] [w3c/did-core: W3C Decentralized Identifier Specification v1.0 (github.com)](https://www.w3.org/TR/did/)

[2] [did:web Method Specification (w3c-ccg.github.io)](https://w3c-ccg.github.io/did-method-web/)

[3] [Verifiable Credentials Data Model v1.1 (w3.org)](https://www.w3.org/TR/2022/REC-vc-data-model-20220303/)

[4] [Eclipse Decentralized Claims Protocol (eclipse-dataspace-dcp.github.io)](https://eclipse-dataspace-dcp.github.io/decentralized-claims-protocol/)