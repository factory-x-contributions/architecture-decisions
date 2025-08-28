## ADR003 - Authentication for Dataspace

### Problem to be solved

Participants need a secure way to judge one another's authenticity and the claims made about them. That includes the
ability to
R1) verify signatures based on an infrastructure to discover each other's public cryptographic material.
R2) integrate in ecosystems with multiple independent sources of trust,
R3) access, parse and understand claims made about a participant based on an established common set of attributes (such
as roles).

### Solution description

S1) identification via DIDs, public key resolution via DID documents and did:web [1,2]

S2) leave it up to each participant what issuers to trust for what claims.

S3) Design a common set of Factory-X credential claims to be exchanged, extending the W3C Verifiable Credential (VC)
Standard [3], exchanged via the Verifiable Presentation Protocol that is part of the Decentralized Claims Protocol [4].

### How requirements are addressed

The PR places focus on preserving existing identity systems in participant-internal realms (see REQ 006) but does NOT
propagate those external identities into the Dataspace.

It places significant focus on decentralization to comply with REQ 001.

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