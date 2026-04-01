---
slug: Release 2026-3
title: Announcing Release 2026-3
authors: [ arnoweiss, janiskretschmann ]
tags: [ architecture_decision_records, factory-x ]
---

This release extends the Factory-X specification portfolio with two new use-case ADRs. The network-level specifications
are proven as foundation and remained stable.

{/* truncate */}

### New Use-Case ADRs

This release 2026-3 introduces the first two use-case ADRs targeting the MX-Port Hercules configuration. Both use-cases
specify how the network-ADRs from the Hercules baseline are composed into end-to-end data exchange scenarios.

#### ADR-101 – Energy Consumption & Load Management (0.1.0)

[ADR-101](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr101-load-management)
specifies normative guidance for the **Energy Consumption & Load Management** use-case. It enables the exchange of
energy production and consumption forecasts between Energy Companies (Data Providers) and Factory Operators (Data
Consumers). The ADR defines a dedicated Forecast Service API (specified as an OpenAPI document), required AAS submodels
(`Digital Nameplate 3.0.1`, `EnergyFlexibilityDataModel 1.0.0`, `Time Series Data 1.1`), and Shell Descriptor
requirements for energy meter time series assets. It builds on the Hercules network-ADRs.

#### ADR-102 – Manufacturing as a Service (0.1.0)

[ADR-102](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr/adr102-maas)
specifies normative guidance for the **Manufacturing as a Service (MaaS)** use-case. It covers three end-to-end
scenarios — Supplier Capability Notification, Search/Request/Offer/Order, and Order Execution & Quality Control —
and defines which IDTA submodel templates must be used for each. Suppliers act as Data Providers; platform
applications and buyers act as Data Consumers. Both parties build on the Hercules network-ADRs (ADR-002, ADR-003,
ADR-008, ADR-009).

### Implementation report

| Conforming Implementation                                                                  | Artifact                                                                                                   | ADRs                                                             | Description                                                                                                                                                                                                                                                                                                                    |
|--------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Factory-X EDC](https://github.com/factory-x-contributions/factoryx-edc)                   | [`0.3.0`](https://github.com/factory-x-contributions/factoryx-edc/releases/tag/0.3.0)                      | ADR-002 0.2.0, ADR-003 0.2.0                                     | The new release mainly saw internal refactorings and the removal of legacy features. As such, support for DSP 0.8 was removed.                                                                                                                                                                                                 |
| [DSP-native Basyx](https://github.com/factory-x-contributions/dsp-native-basyx)            | [`0.1.0`](https://github.com/factory-x-contributions/dsp-native-basyx/releases/tag/dsp-native-basyx-0.1.0) | ADR-002 0.2.0, ADR-003 0.2.0, ADR-008 (only the Repository-APIs) | The project extends on the Basyx Java Server SDK and the Dataspace Protocol Lib to ship an AAS-server (ADR-008) that is natively secured with the Dataspace APIs (ADR-002, ADR-003). No API-level changes were shipped since the last release                                                                                  |
| [fa3st-service (Factory-X fork)](https://github.com/factory-x-contributions/fa3st-service) | [`0.2.0`](https://github.com/factory-x-contributions/fa3st-service/releases/tag/0.2.0)                     | ADR-008 0.2.0 (Only the Repository-APIs), ADR-009, ADR-011       | The development fork of the FAAAST AAS framework implements a set of features that transcend the current upstream. It is the first implementation of the specification of messaging with AAS as specified in ADR 011. The 0.2.0 release saw implementation of a feature that simplifies Data Providers to conform with ADR-009 |

Other full or partial implementations may already exist in commercial or open-source repositories. Certifying such
components may in the future be the activity of a Conformity Assessment Body or Certification Program.

### Website Improvements

#### ADR Graph Visualization

The specification website now ships an interactive
[ADR Graph](https://factory-x-contributions.github.io/architecture-decisions/adr-graph) that renders the dependency
network between all ADRs. The graph defaults to the latest released version and is synchronized with the Docusaurus
version selector in the navbar. This makes it easier to understand how network- and use-case-ADRs compose into a
coherent specification stack at a glance.

![ADR Graph showing dependencies between Network and Use Case ADRs](/img/2026-03-adr-graph.png)

#### OpenAPI Rendering

ADRs that reference an OpenAPI specification — like ADR-101 — now render the API contract directly on the
documentation page. This removes the need to open the raw YAML file and makes the API surface immediately visible
to readers.

### Contributor Experience

#### ADR Contribution Guide and Templates

A new [CONTRIBUTING.md](https://github.com/factory-x-contributions/architecture-decisions/blob/main/CONTRIBUTING.md)
provides step-by-step instructions for authoring both network-ADRs and use-case-ADRs, including a ready-to-use
template and guidance on how to integrate OpenAPI specifications. The
[README.md](https://github.com/factory-x-contributions/architecture-decisions/blob/main/README.md) has been updated
with a contributor overview, and a `CODE_OF_CONDUCT.md` has been added.

#### REUSE 3.3 Compliance

The repository is now compliant with the [REUSE 3.3 specification](https://reuse.software/). All source files carry
SPDX copyright and license headers. Code is licensed under **Apache-2.0**; documentation is licensed under
**CC-BY-4.0**. The `LICENSES/` directory ships the full license texts, and `REUSE.toml` captures the per-path
license annotations.
