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

The main chain of thought here is:

- Something goes wrong, the situation is transmitted to a remote operator
- The remote operator might gather further information and fault descriptions from vendors and suppliers
- The remote operator uses this information to deduct possible corrections and documents them
- The corrections are recommended/executed

The provided machine data as well as the basic procedure need to be presented in a standardized format, which is defined in this document.

## Roles

- **Machine Owner** acts as _Fault Data Provider_
- **Machine Builder / Component Supplier** acts as _Fault Resolution Expert_
- **Machine (Remote) Operator** acts as _Solution Provider_

### _Fault Data Provider_

This is the party that actually "has the faulty situation", usually the **Machine Owner** who uses the machine.

> Note: This document also defines the `Remote Operator`. Please be aware that a machine can be used by multiple roles.

> Note: A "faulty situation" is an anomalous condition unfamiliar to the system that nonetheless enables the machine to continue operating.

### _Fault Resolution Expert_

This party has additional information about the machine and its components, which might not be available to the _Fault Data Provider_.
This could be the **Machine Builder** or one of many **Component Suppliers**.

### _Solution Provider_

This party offers a service to solve the faulty situation for a `Fault Data Provider`.
For the case under consideration within this document that would be a **Machine (Remote) Operator**, or **Remote Operator** for short.

## API Structure

### Fault Data Provider

The `Fault Data Provider` MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                       | Version | Link                                                                                                                         |
| ------------------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery    |
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication             |
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile                |
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp               |
| ADR 011 – Eventing with AAS Payloads Version 0.2.0                       | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr011-eventing-with-aas-payloads |
| ADR 012 – MQTT over DSP Version 0.2.0                                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr012-mqtt-over-dsp              |

> Note: This would also contain video data as defined in ADR104 if needed.

### Fault Resolution Expert

The `Fault Resolution Expert` MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                       | Version | Link                                                                                                                      |
| ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery |
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication          |
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile             |
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp            |

> Note: Think of it as an AAS database for further information that only a **Machine Builder** or **Component Supplier** might have.

### Solution Provider

The `Solution Provider` MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                | Version | Link                                                                                                                         |
| ----------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery    |
| ADR 003 – Authentication for Dataspaces Version 0.2.0             | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication             |

> Note: The `Solution Provider` is also expected to write to AAS data of the `Fault Data Provider` to provide solutions.

## Data Models

The following submodels are required:

| Submodel                | Version | Reference                       | Status   | Role                                               | 
| ----------------------- | ------- | ------------------------------- | -------- | -------------------------------------------------- |
| Situation Log           | 1.0     | [AOaaS Submodel Template (TBD)]() | Required | Fault Data Provider                              |
| Fault Descriptions      | 1.0     | [AOaaS Submodel Template (TBD)]() | Required | Fault Resolution Expert, Solution Provider       |
| Similarity Analysis     | 1.0     | [AOaaS Submodel Template (TBD)]() | Required | Solution Provider                                |
| Fault Correction Set    | 1.0     | [AOaaS Submodel Template (TBD)]() | Required | Fault Resolution Expert, Solution Provider       |

The following submodels might be also used (mostly to provide additional information to the remote machine operator):

| Submodel                                           | Version | Reference                                                                                                                                                       | Status   | Role                                         |
| -------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------- |
| Asset Interfaces Description                        | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description)                             | Optional | Fault Data Provider                          |
| Time Series Data                                   | 1.1     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1)                                     | Optional | Fault Data Provider                          |
| Handover Documentation                             | 2.0.1   | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/2/0/1)                               | Optional | Fault Data Provider, Fault Resolution Expert |
| Technical Data                                     | 2.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0)                                           | Optional | Fault Data Provider, Fault Resolution Expert |
| Hierarchical Structures enabling Bills of Material | 1.1     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material) | Optional | Fault Data Provider, Fault Resolution Expert |
| Capability Description                             | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/development/Capability/1/0)                                             | Optional | Fault Data Provider, Fault Resolution Expert |

> Note: Asset Interfaces Description might be used to get access to video data according to ADR 104.

The following AAS events MUST be implemented:

| SubmodelElement  | Event Type                                    | Reference                     |  Status   | Sender              | Receiver            |
| ------------------- | --------------------------------------------- | ----------------------------- | ---------------- | ------------------- | --------- |
| Situation | submodelelement/update/elementcreated.publish | [SubmodelElement-level Event](https://factory-x-contributions.github.io/async-aas-helm/submodel-repository-submodelelement/#operation-send-submodelelement/update/elementcreated.publish)  | required  | Fault Data Provider | Solution Provider  |

> Note: A `Situation` MUST be published by an `submodelelement/update/elementcreated.publish` event according to ADR 011.

### The Fault Solution Pipeline

The submodels are used in a basic process that has the following steps:

1. The `Fault Data Provider` detects a faulty situation within a system or machine and creates a `Situation`.
2. The `Solution Provider` is notified using `mqtt-over-dsp` by receiving a `submodelelement/update/elementcreated.publish` event from the `Fault Data Provider`.
3. The `Solution Provider` investigates the `Situation` and retrieves `Fault Descriptions` for faulty components/machines from the `Fault Resolution Expert`.
4. The `Solution Provider` uses `Situation`, `Fault Descriptions` as well as any optional submodels from the list above to diagnose the faulty situation (also taking into effect previous situations and their solutions). The occurred `Situation` is assigned to one or more `Fault Description` and captured in the `Similarity Analysis`.
5. The `Solution Provider` uses the discovered `Fault Descriptions` to retrieve `Fault Correction Set` from the `Fault Resolution Expert`.
6. The `Solution Provider` provides `Fault Corrections` to solve the faulty situation to the `Fault Data Provider`.

> Note: A `Solution Provider` may already have `Fault Descriptions` available and does not always need to retrieve this data from a `Fault Resolution Expert`.

> Note: A `Solution Provider` may already have `Fault Correction Set` available and does not always need to retrieve this data from a `Fault Resolution Expert`.

#### Situation Log

The `Situation Log` submodel is used to capture the context of a faulty situation by providing a set of all occured symptoms that were present within a certain timeframe around the time of fault detection.
One might think of it as a "symptom dashcam".

#### Fault Descriptions

The `Fault Descriptions` submodel contains detailed description of a fault that lead to a faulty situation. It also contains contextual information as well as references to associated symptoms (without duplicating data). Furthermore it contains references to associated `Fault Corrections`.

#### Similarity Analysis

The `Similarity Analysis` submodel contains information how an occurred `Situation` relates to known `Fault Description`, i.e., how similar a new `Situation` is to an old `Situation`. It assigns `Situations` to the associated `Fault Description`.

#### Fault Correction Set

The `Fault Correction Set` submodel contains recommended corrective actions, including predefined strategies and workflows, to address specific faults, with options for both automated and operator-initiated interventions.

> Note: A `Fault Correction Set` submodel contains one or more corrective actions that can be referenced by one or more `Fault Description`.

#### Optional Submodels

- `Asset Interfaces Description` can be used to get access to streaming data according to ADR 104.
- `Time Series Data` can be used to gather any real-time and historical sensor and process data that might be of use to the remote operator.
- `Handover Documentation` can be used to understand system configuration and operational constraints and provide information about commissioning, setup and instructions.
- `Hierarchical Structures enabling Bills of Material` can be used to verify machine topology.
- `Technical Data` can be used to verify machine configurations, parameters and technical specifications.
- `Capabilities` can be used to indicate what the machine is capable of performing to derive appropriate operational strategies or actions, supporting flexible and autonomous operation.

## Authentication and Authorization

Apart from mechanism already described within the linked ADRs, no additional Authentication or Authorization mechanism is specified.
