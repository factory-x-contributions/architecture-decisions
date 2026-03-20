---
id: fx_adr105
title: ADR 105 – Fault Diagnosis & Correction
date: 2026-03-12
tags:
  - architecture_decision_records
  - API
---

## Purpose

This Architecture Decision Record (ADR) provides normative guidance for the use case **"Autonomous Operation as a Service (AOaaS)"**. As **"Autonomous Operation as a Service"** provides different scenarios, the ADRs are separated.

This ADR provides guidance about **Fault Diagnosis and Correction**.

Autonomous Operation as a Service aims at keeping machine downtime minimal by accelerating the process to solve a faulty situation using knowledge of prior events as well as human ingenuity.
One of the main "fault-to-solution" paths within AOaaS involves a Machine Operator diagnosing faulty situations remotely while only using machine data and video information.

The provided machine data needs to be in standardized formats, which is defined in this document.
The main chain of thought here is:

- Something goes wrong, the situation and the faults are described and transmitted to the remote operator
- the remote operator uses this information to deduct possible corrections and documents them
- the corrections are recommended/executed

## Roles

- **Machine Owner** acts as _Fault Data Provider_
- **Machine Builder / Component Supplier** acts as _Fault Resolution Expert_
- **Machine (Remote) Operator** acts as _Solution Provider_

## API Structure

### Fault Data Provider

The Fault Data Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                       | Version | Link                                                                                                                      |
| ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery |
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication          |
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile             |
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp            |
| ADR 011 – Eventing with AAS Payloads Version 0.2.0                       | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr011-eventing-with-aas-payloads         |
| ADR 012 – MQTT over DSP Version 0.2.0                                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr012-mqtt-over-dsp            |

> Note: This would also contain video data as defined in ADR104 if needed

### Fault Resolution Expert

The Fault Resolution Expert MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                       | Version | Link                                                                                                                      |
| ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery |
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication          |
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile             |
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp            |

### Solution Provider

The Solution Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                | Version | Link                                                                                                                      |
| ----------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery |
| ADR 003 – Authentication for Dataspaces Version 0.2.0             | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication          |

> Note: The Solution Provider is also expected to write to AAS data of the Fault Data Provider to provide solutions

## Data Models

The following submodels are required:

| Submodel            | Version | Reference                         | Status   | Role                             |
| ------------------- | ------- | --------------------------------- | -------- | -------------------------------- |
| Situation Log       | 1.0     | [AOaaS Submodel Template (TBD)] | Required | Fault Data Provider                |
| Fault Description   | 1.0     | [AOaaS Submodel Template (TBD)] | Required | Fault Resolution Expert            |
| Similarity Analysis | 1.0     | [AOaaS Submodel Template (TBD)] | Required | Solution Provider |
| Fault Correction    | 1.0     | [AOaaS Submodel Template (TBD)] | Required | Solution Provider |

The following submodels might be also used (mostly to provide additional information to the remote machine operator):

| Submodel                    | Version | Reference                                                                                                                           | Status   | Role          |
| --------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| Asset Interface Description | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description) | Optional | Fault Data Provider  |
| Time Series Data            | 1.1     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1)         | Optional | Fault Data Provider  |
| Handover Documentation      | 2.0.1   | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/2/0/1)   | Optional | Fault Data Provider, Fault Resolution Expert  |
| Technical Data              | 2.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0)               | Optional | Fault Data Provider, Fault Resolution Expert |
| Hierarchical Structures enabling Bills of Material | 1.1       | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material) | Optional  | Fault Data Provider, Fault Resolution Expert |
| Capability Description      | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/development/Capability/1/0)                 | Optional | Fault Data Provider, Fault Resolution Expert |

> Note: Asset Interface Description might be used to get access to video data according to ADR 104

### The Fault Solution Pipeline

The submodels are used in a basic process that has the following steps:

1. `Machine Owner`: A faulty situation within a system or machine is detected: `Situation Log` is created.
2. The `Solution Provider` is notified via an AAS event
3. The `Solution Provider` investigates the `Situation Log` and retrieves `Fault Descriptions` for faulty components/machines from the `Fault Resolution Expert`
4. The `Solution Provider` uses `Situation Log`, `Fault Description` as well as any optional submodels from the list above to diagnose the faulty situation (also taking into effect previous situations and their solutions)
5. The `Solution Provider` captures his diagnosis within `Similarity Analysis` for future reference
6. The `Solution Provider` provides `Fault Correction` to solve the faulty situation

> Note: A `Solution Provider` may already have `Fault Descriptions` available and does not always need to retrieve this data from a `Fault Resolution Expert`

#### Situation Log

The `Situation Log` submodel is used to capture the context of a faulty situation by providing a set of all occured symptoms that were present within a certain timeframe around the time of fault detection. 
One might think of it as a "symptom dashcam".

#### Fault Description

The `Fault Description` submodel contains detailed description of a fault that lead to a faulty situation. It also contains contextual information as well as references to associated symptoms (without duplicating data). Furthermore it contains references to associated `Fault Corrections`.

#### Similarity Analysis

The `Similarity Analysis` submodel contains a comparison of various situations from the SituationLog with existing faults to determine the degree of similarity between the current situation and specific faults.

#### Fault Correction

The `Fault Correction` submodel contains recommended corrective actions, including predefined strategies and workflows, to address specific faults, with options for both automated and operator-initiated interventions.

#### Optional Submodels

- `Asset Interface Description` can be used to verify streaming data, `Asset Interface Description` according to ADR 104.
- `Time Series Data` can be used to verify real-time and historical sensor and process data.
- `Handover Documentation` can be used to understand system configuration and operational constraints and provide information about commissioning, setup and instructions.
- `Hierarchical Structures enabling Bills of Material` can be used to verify machine topology.
- `Technical Data` can be used to verify machine configurations, parameters and technical specifications.
- `Capabilities` can be used to indicate what the machine is capable of performing to derive appropriate operational strategies or actions, supporting flexible and autonomous operation.

## Authentication and Authorization

Apart from mechanism already described within the linked ADRs, no additional Authentication or Authorization mechanism is specified.