---
id: fx_adr0xx
title: ADR 0xx – Energy consumption & Load Management
date: 2026-02-11
tags:
  - architecture_decision_records
  - API
---
## Purpose

This ADR provides normative guidance for the implementation of the **"Energy consumption & Load Management"** use-case. It is designed to allow the exchange of energy production and consumption forecasts based on prior given data between actors of the industry, and to enable load management testing of the infrastructure for given data assets via an AAS management platform.

## Roles

- **Energy Company** acts as _Data Provider_ via the Portal
- **Factory Operator** acts as _Data Consumer_

## API Structure

### Data Provider

**Hostname:** `energy-provider`  
**URL Prefix:** `https://provider.example.com/data-provider`

The Data Provider MUST expose the following accessible endpoints:

| Service             | Path         | Full URL Example                                       | Description                                                                          |
| ------------------- | ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **AAS Services**    |              |                                                        | As specified in ADR-008 and ADR-009                                                  |
| AAS Repository      | `/shells/`   | `https://provider.example.com/data-provider/shells/`   | AAS Repository according to ADR-009<br />`Protected` trough DPS                        |
| Submodel Repository | `/submodel/` | `https://provider.example.com/data-provider/submodel/` | Submodel Repository according to ADR-009<br />`Protected` trough DPS                   |
| **Application**     |              |                                                        |                                                                                      |
| Forecast Service    | `/forecast/` | `https://provider.example.com/data-provider/forecast/` | Forecast service for energy time series (see OpenAPI spec)<br />`Protected` trough DPS |
| **Dataspace**       |              |                                                        |                                                                                      |
| Protocol Endpoint   | `/protocol/` | `https://provider.example.com/data-provider/protocol/` | Dataspace Protocol Endpoint (DSP), based on ADR 002                                  |

### Data Consumer

**Hostname:** `factory-operator`  
**URL Prefix:** `https://consumer.example.com/data-consumer`

The Data Consumer MUST expose the following public endpoints:

| Service           | Path         | Full URL Example                                       | Description                       |
| ----------------- | ------------ | ------------------------------------------------------ | --------------------------------- |
| **Dataspace**     |              |                                                        |                                   |
| Protocol Endpoint | `/protocol/` | `https://consumer.example.com/data-consumer/protocol/` | Dataspace Protocol Endpoint (DSP) |

> **Note:** Internal management endpoints are implementation-specific and not part of this specification.
### Forecast Service API

The Forecast Service MUST be implemented according to the [OpenAPI specification](resources/forecast-service-openapi.yaml).
## Data Models

The `Asset` is the instance of a time series set of e.g. an energy meter.

### Shell Descriptor Requirements

- Data Providers MUST use the time series set ID as `globalAssetId` in the Shell Descriptor.
- Data Providers SHOULD use the type identifier as `specificAssetId` with `name` set to `type` in the Shell Descriptor.

### Required Submodels

Each AAS Descriptor MUST point to the following submodels:

| Submodel                   | Version | Reference                                                                                                              | Status   |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| Digital Nameplate          | 3.0.1   | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/3/0) | Required |
| EnergyFlexibilityDataModel | 1.0.0   | TBD                                                                                                                    | Required |
| Time Series Data           | 1.1     | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1) | Required |

### Time Series Data Submodel – Required Elements

The following elements of the `Time Series Data 1.1` submodel are **required**:

| Element                        | idShort              | Requirement | Description                        |
| ------------------------------ | -------------------- | ----------- | ---------------------------------- |
| Time Series Segment Collection | `TimeSeriesSegments` | REQUIRED    | Container for time series segments |
| Segment Metadata               | `SegmentMetadata`    | REQUIRED    | Metadata describing each segment   |
| Record Count                   | `RecordCount`        | REQUIRED    | Number of records in the segment   |
| Start Time                     | `StartTime`          | REQUIRED    | ISO 8601 timestamp of first record |
| End Time                       | `EndTime`            | REQUIRED    | ISO 8601 timestamp of last record  |
| Sampling Interval              | `SamplingInterval`   | REQUIRED    | ISO 8601 duration between samples  |
| Records                        | `Records`            | REQUIRED    | The actual time series data points |

The following elements are **optional**:

| Element            | idShort            | Requirement | Description                        |
| ------------------ | ------------------ | ----------- | ---------------------------------- |
| External Data File | `ExternalDataFile` | OPTIONAL    | Reference to external data storage |
| Linked Segment     | `LinkedSegment`    | OPTIONAL    | Reference to related segments      |
| Quality Indicator  | `QualityIndicator` | OPTIONAL    | Data quality metadata              |

## Authentication and Authorization

The Data Provider MUST expose the APIs mandated in ADR-002 and ADR-003. AAS resources MUST be exposed according to ADR-008 and ADR-009.

The Dataspace Connector implementation is not prescribed; any connector compliant with the Dataspace Protocol (DSP) specification MAY be used.