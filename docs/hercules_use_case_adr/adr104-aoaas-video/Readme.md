---
id: fx_adr104
title: ADR 104 – Video Streaming
date: 2026-03-12
tags:
  - architecture_decision_records
  - API
---

## Purpose

This Architecture Decision Record (ADR) provides normative guidance for the use case **"Autonomous Operation as a Service (AOaaS)"**. As **"Autonomous Operation as a Service"** provides different scenarios, the ADRs are separated.

This ADR provides guidance about **Video Streaming**.

Autonomous Operation as a Service aims at keeping machine downtime minimal by accelerating the process to solve a faulty situation using knowledge of prior events as well as human ingenuity.
One of the main "fault-to-solution" paths within AOaaS involves a Machine Operator diagnosing faulty situations remotely while only using machine data and video information.

To access the available video content (either as dashcam-style video segments or as live streams) some guidelines were established, which are documented here.
Please note, that this document assumes to only handle the credential and endpoint information; accessing the actual video data itself is not part of this document.

## Roles

- **Machine Owner** acts as _Data Provider_
- **Machine (Remote) Operator** acts as _Data Consumer_

## API Structure

### Data Provider

The Data Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                       | Version | Link                                                                                                                      |
| ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery |
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication          |
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile             |
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp            |

### Data Consumer

The Data Consumer MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                                | Version | Link                                                                                                                      |
| ----------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0 | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery |
| ADR 003 – Authentication for Dataspaces Version 0.2.0             | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication          |

> Note: The Consumer is not required to provide any assets

## Data Models

The following submodels are used (the _Short Name_ will be used in further chapters):

| Short Name                   | Full Name                                          | Version | Reference                                                                                                                                                           | Status   |
| ---------------------------- | -------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Asset Interfaces Description | Asset Interfaces Description                       | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description/1/0)                             | Required |
| Bills of Material            | Hierarchical Structures enabling Bills of Material | 1.1     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material/1/1) | Optional |

### How to Provide Data

To provide information and credentials about available video data the `Asset Interfaces Description` Submodel MUST be used.
This Submodel MUST be part of an Asset Administration Shell (AAS) of a streaming device (like a camera). This AAS itself MUST be referable by using the `globalAssetId` of the streaming device.

A Data Provider MUST provide the `Asset Interfaces Description` Submodel in at least one of two ways:

- Providing its AAS directly using the `globalAssetId`
- Providing its AAS using a _self-managed Entity_ as part of a `Bills of Material` Submodel of another AAS, also referable using the `globalAssetId`

> Note: This step is optional if the `dspEndpoint` and all relevant metadata are already known - in which case a negotiation can begin right away.

#### Asset Interfaces Description Submodel

The `Asset Interfaces Description` Submodel MUST contain an `Interface` with:

- `Actions` for _LiveStream_ and _Videos_ within `InteractionMetadata` according to the `PropertyDefinition`:
  - _LiveStream (Action)_:
    - The REST API endpoint that returns a URL (e.g., WebRTC) for the camera's live video stream.
  - _Videos (Action)_:
    - The REST API endpoint that returns URLs for recorded videos of a specific event ID.

- Application specific _dsp_sc_ in `securityDefinitions` within `InteractionMetadata`:
  - _scheme_: Defines the security mechanism that used during access; Set to: `dsp`.
  - _id_: ID of the Dataset in the Data Providers catalog that contains the Submodel.
  - _dspEndpoint_: Points to a DSP Catalog endpoint containing the relevant Dataset.

  > Note: _dsp_sc_ is defined in `resources/dsp_no_sec.json` within this repository

- Reference to _dsp_sc_ within the `security` of `EndpointMetadata`.

## Authentication and Authorization

Apart from mechanism already described within the linked ADRs, no additional Authentication or Authorization mechanism is specified.

## Alternatives evaluated

Only credentials are shared within Factory-X dataspace to access stream relevant data through a cloud service.
As an alternative, streams may be integrated directly into the Factory-X EDC. Access to streams can be provided by sharing the credentials similar to how it is done in [ADR012](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr012-mqtt-over-dsp).
