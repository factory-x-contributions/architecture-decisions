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

The following submodels are used (the *Short Name* will be used in further chapters):

| Short Name                                         | Full Name | Version                                                                                                                                                         | Reference | Status |
| -------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------ |
| Asset Interface Description | Asset Interface Description                        | 1.0       | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description)                             | Required  |
| Bills of Material |  Hierarchical Structures enabling Bills of Material | 1.1       | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material) | Optional  |

### How to provide data

To provide information and credentials about available video data the `Asset Interface Description` Submodel MUST be used.
This Submodel MUST be part of an Asset Administration Shell (AAS) of a streaming device (like a camera). This AAS itself MUST be referable by using the `globalAssetId` of the streaming device.

A Data Provider MUST provide the `Asset Interface Description` Submodel in at least one of two ways:

- Providing its AAS directly using the `globalAssetId`
- Providing its AAS using a _self-managed Entity_ as part of a `Bills of Material` Submodel of another AAS, also referable using the `globalAssetId`

> Note: if the `dspEndpoint` of the asset of the stream as well as the required urls are known, a user can direct negotiate the access to it.

#### Asset Interface Description Submodel

The `Asset Interface Description` Submodel MUST contain:

- Actions for `LiveStream` and `Videos` according to the `json`-schema of the SubmodelElementCollection `PropertyDefinition` of the `Asset Interface Description`:
  - `LiveStream (Action)`:
    - The REST API endpoint that returns a URL (e.g., WebRTC) for the camera's live video stream.
  - `Videos (Action)`:
    - The REST API endpoint that returns URLs for recorded videos of a specific event ID.

- Implement application specific `dsp_sc` security definition, the basic structure is located [here](./resources/dsp_no_sec.json):
  - `scheme (xs:string)`: Defines the security mechanism that used during access: `dsp`.
  - `id (xs:string)`: Defines id of that Dataset in the Data Providers catalog that contains the Submodel.
  - `dspEndpoint (xs:string)`: Defines the endpoint of the Data Provider's DSP endpoint where the catalog containing the relevant Dataset is located.

- Reference the `dsp_sc` inside the `security` SubmodelElementList of `Asset Interface Description`.

## Authentication and Authorization

Apart from mechanism already described within the linked ADRs, no additional Authentication or Authorization mechanism is specified.

## Alternatives evaluated

Only credentials are shared within Factory-X dataspace to access stream relevant data through a cloud service.
As alternative streams may be integrated directly into the Factory-X EDC. Access to streams can be provided by sharing the credentials as shown in [ADR012](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr012-mqtt-over-dsp).
