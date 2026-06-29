---
slug: Release 2026-6
title: Announcing Release 2026-6
authors: [ arnoweiss ]
tags: [ architecture_decision_records, factory-x ]
---

Release 2026-6 is the final cut of the Factory-X Architecture Decision Records. It rounds out the use-case
ADR portfolio with five new specifications and
ships several authoring and visualization improvements introduced over this cycle.

As the publicly funded project is ending, this repository is now [archived](https://github.com/factory-x-contributions/architecture-decisions). The
specifications remain published and can be forked and continued independently by interested parties.

{/* truncate */}

### New Use-Case ADRs

This release adds five use-case ADRs to the Hercules portfolio.

#### ADR-103 – Product Carbon Footprint Exchange (0.1.0)

[ADR-103](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr103-Carbon%20Footprint%20Management)
provides normative guidance for **Product Carbon Footprint (PCF)** data exchange. The ADR adopts the
Catena-X / Tractus-X PCF exchange specification — the "standardization triangle" of mandatory components,
data models, APIs, and registration procedures — so that Factory-X participants can interoperate with
Catena-X-aligned partners on a verifiable conformance basis. Upstream partners act as Data Providers of
PCF values; downstream partners act as Data Consumers.

#### ADR-104 – AOaaS Video Streaming (0.1.0)

[ADR-104](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr104-aoaas-video)
specifies the **Video Streaming** scenario of the **Autonomous Operation as a Service (AOaaS)** use case.
It defines how credentials and endpoint information for dashcam-style video segments and live streams are
exchanged between Machine Operators and remote diagnostic services. Access to the video payload itself
remains out of scope; the ADR focuses on the discovery and authorization handshake over the MX-Port.

#### ADR-105 – AOaaS Fault Diagnosis & Correction (0.1.0)

[ADR-105](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr105-aoaas-fault-pipeline)
specifies the **Fault Diagnosis & Correction** scenario of AOaaS. It documents the fault-to-solution
pipeline by which a Machine Operator combines machine data and historical fault knowledge to diagnose
faulty situations remotely, and defines the AAS submodels and APIs required to participate in that
pipeline.

#### ADR-106 – Traceability (0.1.0)

[ADR-106](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr106-traceability)
provides normative guidance for the **Traceability** use case — the exchange of part, material, and data
traceability records between supply-chain partners. Suppliers act as Data Providers exposing traceability
data for goods they produced; Factory Operators act as Data Consumers requesting that data for goods they
received. The ADR builds on the Hercules network-ADRs and aligns terminology with Catena-X.

#### ADR-107 – Condition Monitoring Led Services (0.1.0)

[ADR-107](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr107-condition-monitoring-led-services)
provides normative guidance for **Collaborative Condition Monitoring Led Services (CMLS)**. The ADR
identifies three roles — Factory Operator (main Data Provider of machine and process condition data),
Machine Builder (Data Consumer using operational data for predictive maintenance and performance
improvement), and Component Supplier (contributing expert knowledge and maintenance recommendations) — and
specifies the API structure, data models, and authentication required for standardized, sovereign data
exchange over the MX-Port.

### Closing the Repository

This is the final release from this repository. The Factory-X consortium has decided to archive the
`factory-x-contributions` github organization; it will receive no further development or
maintenance. The specifications and their version history remain available, and interested parties are
invited to fork the repository and continue the work independently.

The architecture-decisions repository and the corresponding process were designed to provide the reader with
a comprehensive overview over all Factory-X specification documents. It was envisioned as a precursor to a proper 
standardization process as it's carried out by Dataspaces like Catena-X. Unfortunalely, this has never
been common practice which explains the many blank pages on this website. Factory-X ends, some activities
may find shelter or even thrive in other organizations, reuse of the project results on this website is
encouraged.

Thank you to everyone who contributed ADRs, reviews, implementations, and feedback over the lifetime of
this repository.
