---
id: fx_adr104-2
title: ADR 104-2 – Fault Diagnosis & Correction
date: 2026-03-12
tags:
  - architecture_decision_records
  - API
---
## Purpose

This Architecture Decision Record (ADR) provides normative guidance for the use case **"Autonomous Operation as a Service (AOaaS)"**.
These guidelines enable standardized, secure, and interoperable data exchange via the MX-Port Hercules and ensure data sovereignty for the AOaaS use case.
The vision of AOaaS is to enable resilient, highly efficient production operations through a digital ecosystem that allows remote, assisted and appropriate autonomous operation of highly automated manufacturing equipment.
Our goal is to design, implement and validate a modular architecture and operational processes that adhere to established standards to allow manufacturers, machine builders and service providers to share models, telemetry and data processing services across company boundaries.
This ADR is designed to demonstrate the exchange of fault-related data and fault correction data, to enable autonomous operation.

As **"Autonomous Operation as a Service"** provides different scenarios, the ADRs are separated. 
This ADR provides **"Part2: Fault Diagnosis and Correction"**.

## Roles

- **Machine Owner** acts as _Data Provider_ via the Portal
- **Machine Builder** acts as _Data Provider_ via the Portal
- **Component Supplier** acts as _Data Provider_ via the Portal
- **Machine (Remote) Operator** acts as _Data Consumer_

## API Structure

### Data Provider

**Hostname:** `fault-data-provider`  
**URL Prefix:** `https://provider.example.com/data-provider`

Each Data Provider MUST expose the following public endpoints:

| Service             | Path         | Full URL Example                                       | Description                                                |
| ------------------- | ------------ | ------------------------------------------------------ | ---------------------------------------------------------- |
| **AAS Services**    |              |                                                        | As specified in ADR-008 and ADR-009                        |
| AAS Repository      | `/shells/`   | `https://provider.example.com/data-provider/shells/`   | AAS Repository according to ADR-009                        |
| Submodel Repository | `/submodel/` | `https://provider.example.com/data-provider/submodel/` | Submodel Repository according to ADR-009                   |
| **Dataspace**       |              |                                                        |                                           | Service           | Path         | Full URL 
| Protocol Endpoint   | `/protocol/` | `https://provider.example.com/data-provider/protocol/` | Dataspace Protocol Endpoint (DSP), based on ADR 002        |

If a Data Provider provides streaming data, the Data Provider MUST provide the streaming data according to [fx_adr104-1](../adr104-1-video-streaming/Readme.md).

### Data Consumer

**Hostname:** `machine-remote-operator`  
**URL Prefix:** `https://consumer.example.com/data-consumer`

The Data Consumer MUST expose the following public endpoints:

| Service           | Path         | Full URL Example                                       | Description                       |
| ----------------- | ------------ | ------------------------------------------------------ | --------------------------------- |
| **Dataspace**     |              |                                                        |                                   |
| Protocol Endpoint | `/protocol/` | `https://consumer.example.com/data-consumer/protocol/` | Dataspace Protocol Endpoint (DSP) |

> **Note:** Internal management endpoints are implementation-specific and not part of this specification.

## Data Models

The required `Asset` is a bundle of data necessary to perform a fault diagnosis and derive a fault correction strategy recommended by the Machine (Remote) Operator to the Machine Owner.

At least one provider MUST expose a Submodel with the status `required`. 
Data providers may expose arbitrary additional Submodels according to the need of their business processes.
These Submodels may help to perform a fault diagnosis and derive a fault correction strategy.

### Required Submodels

The following Submodels are used to categorize fault data. 
- A respective `Situation Log` contextualizes a fault by providing a set of all occurred symptoms in a specific context that is related to a monitored error.
- To analyze an occurring `Situation Log` at least one provider MUST expose a `Fault Descriptions` that contains the detailed description of the fault itself, including its contextual information, and references the associated symptoms without duplicating their data. `Fault Descriptions` contains references to associated `Fault Corrections`.

A Machine (Remote) Operator can use the `Situation Log` and `Fault Descriptions` to compare the current fault with previously documented faults. 
- The Machine (Remote) Operator MUST save the analyze and the comparison in a `Similarity Analysis` that can be used to derive a appropriate `Fault Correction`.

A Machine (Remote) Operator can use the `Similarity Analysis` and `SituationLog` to derive a fault correction strategy based on previous executed data: 
- `Similarity Analysis` is used to fetch a structured list of `Fault Descriptions`.
- `Fault Correction` provides step-by-step instructions on how to resolve a `Situation`.
- `SituationLog` is used to compare the current `Situation` with the parameters of the previous executed `Fault Correction`.

Additional models can be provided to support fault diagnosis:
- `Asset Interface Description` can be used to  verify streaming data, `Asset Interface Description` according to [fx_adr104-1](../adr104-1-video-streaming/Readme.md).
- `Time Series Data`  can be used to verify real-time and historical sensor and process data.
- `Handover Documentation` can be used to understand system configuration and operational constraints and provide information about commissioning, setup and instructions.
- `Technical Data` can be used to verify machine configurations, parameters and technical specifications.
- `Capabilities` can be used to indicate , what the machine is capable of performing to derive appropriate operational strategies or actions, supporting flexible and autonomous operation.

| Submodel                   | Version | Reference                                                                                                              | Status   | Role |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |-------- | 
| Situation Log          | 1.0   | [AOaaS Submodel Template (TBD)]() | Required | Machine Owner | 
| Fault Description          | 1.0   | [AOaaS Submodel Template (TBD)]() | Required | Machine Owner, Machine Builder, Component Supplier |
| Similarity Analysis | 1.0 | [AOaaS Submodel Template (TBD)]() | Required | Machine (Remote) Operator |
| Fault Correction          | 1.0   | [AOaaS Submodel Template (TBD)]() | Required | Machine Owner, Machine Builder, Component Supplier |
| Asset Interface Description          | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description) | Optional | Machine Builder, Component Supplier according to [fx_adr104-1](../adr104-1-video-streaming/Readme.md) |
| Time Series Data | 1.1 | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1) | Optional | Machine Owner |
| Handover Documentation | 2.0.1 | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/2/0/1) | Optional | Machine Owner, Machine Builder, Component Supplier  |
| Technical Data | 2.0 | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0) | Optional | Machine Owner, Machine Builder, Component Supplier  |
| Capability Description | 1.0 | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/development/Capability/1/0) | Optional | Machine Owner, Machine Builder, Component Supplier  |


## Authentication and Authorization

The Data Provider MUST expose the APIs mandated in ADR-002 and ADR-003. AAS resources MUST be exposed according to ADR-008 and ADR-009.

The Dataspace Connector implementation is not prescribed; any connector compliant with the Dataspace Protocol (DSP) specification MAY be used.
