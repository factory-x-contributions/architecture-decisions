---
id: fx_adr002_0.2.0
title: ADR 002 – Cross-Company Authorization and Discovery - version 0.2.0
date: 2025-08-21
tags: [architecture_decision_records, network_adr, security]
---

### Problem to be solved

Cross-Company data transfer requires discovery and fine grained authorization for access to resources. At the same time,
there is a requirement to agree on the terms & conditions of data access. Such data offers must be discoverable,
understandable and executable by each dataspace participant, thus based on a single and common description language.

### Solution description **(normative)**

All Data Providers who provision data across participant boundaries MUST expose it via Dataspace Protocol 2025-1 [1] 
and accept STS-Tokens (see [ADR 003, 0.2.0](../adr003-authentication/README.md)) as access tokens.

For exposure of HTTP-based transfers, Data Providers MUST set the following properties:
- A Provider MUST set the relevant `Distribution` objects' `"format":"HttpData-PULL"` in the `Catalog` response.
- A Consumer MUST send a `TransferRequestMessage` with `"format":"HttpData-PULL"`.
- A Provider MUST send a `TransferStartMessage` with sufficient information in the `dataAddress` property so
that an HTTP request to the `endpoint` may succeed. The `endpointType` property MUST be
`https://w3id.org/idsa/v4.1/HTTP`. The following `endpointProperties` are to be added to the object as specified in the
table below:

| Name                                             |          | description                                                                                                                                          |
|--------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `https://w3id.org/edc/v0.0.1/ns/authorization`   | REQUIRED | The access token to access data. To be included in the `Authorization` header.                                                                       |
| `https://w3id.org/edc/v0.0.1/ns/authType`        | REQUIRED | Prefix for the `Authorization` header's content.                                                                                                     |
| `https://w3id.org/tractusx/auth/refreshEndpoint` | REQUIRED | Endpoint to refresh the access token using the `refreshToken`. It behaves as defined in RFC6749 [1] section 6 using an STS-token for authentication. |
| `https://w3id.org/tractusx/auth/refreshToken`    | REQUIRED | The refresh token to present to the `refreshEndpoint` in conjunction with the old access token.                                                      |
| `https://w3id.org/tractusx/auth/expiresIn`       | REQUIRED | Time to live for the access token after issuance.                                                                                                    |

### Context

The Dataspace Protocol (DSP) defines a set of API-endpoints, processes, and messages that allow and regulate discovery
and negotiation processes for a data exchange between Data Providers and Consumers.

Following the DSP definitions, a data provider creates a “Data Offer” for the data it wishes to share with consumers.
The offer includes a binding to a set of contractual terms that specify how the data may be used. Moreover, the DSP
API-endpoints can be used by the provider to expose the data offers and advertise them to potential data consumers in a
discoverable manner.

With the common understanding of the DSP authorization processes, parties can leverage the well-defined endpoints to
exchange messages signifying an agreement to the provider’s set of contractual terms for the specified specific data
offer.

### Expected business consequences

The DSP provides a straightforward and well-defined way for data providers to offer their data under specified
conditions to potential consumers. This process will introduce some consequences (in both directions) for dataspace
participants using the DSP:

Providers do not need to define the processes for authentication and data provisioning - all is handled by DSP.

Some existing systems and business process must be adapted/adjusted to allow for the integration of the additional
needed components for the DSP integration. However, as this process was done numerous times, experience from previous
trials can be utilized for a smooth transition.

### Alternatives evaluated

No common authz-stack: This would necessitate all participants of the ecosystem to do point-to-point integration between
all data sources and sinks for each use case. There'd be no unified discovery, there'd by no way to know for the
consumer what proof of identity to present.

AAS Discovery + ABAC: Not feasible for Non-AAS-Resources, no consideration of terms of Data Exchange, unclear trust
model and authentication mechanisms

### References

[1] https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol
[2] https://www.rfc-editor.org/rfc/rfc6749.html