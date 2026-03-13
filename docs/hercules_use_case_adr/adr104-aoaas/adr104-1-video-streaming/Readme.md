---
id: fx_adr104-1
title: ADR 104-1 – Video Streaming
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
This ADR provides **"Part1: Video Streaming"**.

## Roles

- **Machine Owner** acts as _Data Provider_ via the Portal
- **Machine (Remote) Operator** acts as _Data Consumer_

## API Structure

### Data Provider

**Hostname:** `video-stream-provider`  
**URL Prefix:** `https://provider.example.com/data-provider`

The Data Provider MUST expose the following public endpoints:

| Service             | Path         | Full URL Example                                       | Description                                                |
| ------------------- | ------------ | ------------------------------------------------------ | ---------------------------------------------------------- |
| **AAS Services**    |              |                                                        | As specified in ADR-008 and ADR-009                        |
| AAS Repository      | `/shells/`   | `https://provider.example.com/data-provider/shells/`   | AAS Repository according to ADR-009                        |
| Submodel Repository | `/submodel/` | `https://provider.example.com/data-provider/submodel/` | Submodel Repository according to ADR-009                   |
| **Dataspace**     |              |                                                        |                                                              |
| Protocol Endpoint   | `/protocol/` | `https://provider.example.com/data-provider/protocol/` | Dataspace Protocol Endpoint (DSP), based on ADR 002        |

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

The required `Asset` is the instance of an `Asset Interface Description` Submodel of a streaming device, e.g., a camera.

### Shell Requirements

- Data Providers MUST provide a streaming device's Asset Administration Shell with referable `globalAssetId` and an associated `Asset Interface Description` Submodel 
- If the streaming device is a self-managed entity and part of a subsystem of a machine:
  - Data Providers MUST provide a machine's Asset Administration Shell with an associated `Bill of Material (hierarchical structures enabling bills of material)` Submodel
  - Data Providers MUST reference the streaming device, e.g. a camera, in `Bill of Material` of the machine's Asset Administration Shell as self-managed entity with an accessible `globalAssetId`

### Required Submodels

Each AAS Descriptor MUST point to the following submodels:

| Submodel                   | Version | Reference                                                                                                              | Status   |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| Asset Interface Description          | 1.0     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description) | Required |
| Hierarchical Structures enabling Bills of Material          | 1.1   | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material) | Optional |


#### Asset Interface Description Submodel

`Asset Interface Description` Submodel MUST contain:

- Actions for `LiveStream` and `Videos`:  
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

The Data Provider MUST expose the APIs mandated in ADR-002 and ADR-003. AAS resources MUST be exposed according to ADR-008 and ADR-009.

The Dataspace Connector implementation is not prescribed; any connector compliant with the Dataspace Protocol (DSP) specification MAY be used.


## Alternatives evaluated

Only credentials are shared within Factory-X dataspace to access stream relevant data through a cloud service. 
As alternative streams may be integrated directly into the Factory-X EDC. Access to streams can be provided by sharing the credentials as shown in [ADR012](https://github.com/factory-x-contributions/architecture-decisions/tree/main/docs/hercules/adr012-mqtt-over-dsp).
