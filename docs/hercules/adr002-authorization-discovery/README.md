## ADR 002 – Cross-Company Authorization and Discovery

### Problem to be solved

Cross-Company data transfer requires discovery and fine grained authorization for access to resources. At the same time,
there is a requirement to agree on the terms & conditions of data access. Such data offers must be discoverable,
understandable and executable by each dataspace participant, thus based on a single and common description language.

### Solution description

**All Data Providers who provision data across participant boundaries MUST expose it via Dataspace Protocol [1] and accept
STS-Tokens (see [ADR 003](../adr003-authentication/README.md)) as access tokens.**

Factory-X will create specializations of the DSP with regards to terms and means of data exchange.

The Dataspace Protocol (DSP) defines a set of API-endpoints, processes, and messages that allow and regulate discovery
and negotiation processes for a data exchange between Data Providers and Consumers.

Following the DSP definitions, a data provider creates a “Data Offer” for the data it wishes to share with consumers.
The offer includes a binding to a set of contractual terms the specify how the data may be used. Moreover, the DSP
API-endpoints can be used by the provider to expose the data offers and advertise them to potential data consumers in a
discoverable manner.

With the common understanding of the DSP authorization processes, parties can leverage the well-defined endpoints to
exchange messages signifying an agreement to the provider’s set of contractual terms for the specified specific data
offer.

### Expected business consequences

The DSP provides a straightforward and well defined way for data providers to offer their data under specified
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

[1] https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol