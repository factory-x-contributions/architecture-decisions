---
id: fx_adr101
title: ADR 101 – Energy consumption & Load Management Version 0.1.0
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

The Data Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

|Architecture Decision Record (ADR)|Version|Link|
|---|---|---|
|ADR 002 – Cross-Company Authorization and Discovery|0.2.0|[https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery)|
|ADR 003 – Authentication for Dataspaces|0.2.0|[https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication)|
|ADR 008 – Asset Administration Shell Profile for Factory-X|0.2.0|[https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile)|
|ADR 009 – Discovery of AAS Services via DSP|0.2.0|[https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp)|
### Data Consumer

The Data Consumer MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

|Architecture Decision Record (ADR)|Version|Link|
|---|---|---|
|ADR 002 – Cross-Company Authorization and Discovery|0.2.0|[https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery)|
|ADR 003 – Authentication for Dataspaces|0.2.0|[https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication)|

### Forecast Service API

The Forecast Service MUST be implemented according to the [OpenAPI specification](./resources/forecast-service-openapi.yaml).

**Hostname:** `energy-provider`  
**URL Prefix:** `https://provider.example.com/data-provider`

| Service          | Path         | Full URL Example                                       | Description                                                                         |
| ---------------- | ------------ | ------------------------------------------------------ |-------------------------------------------------------------------------------------|
| Forecast Service | `/forecast/` | `https://provider.example.com/data-provider/forecast/` | Forecast service for energy time series (see OpenAPI spec); `Protected` through DPS |
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

| Element                        | idShort              | Description                        |
| ------------------------------ | -------------------- | ---------------------------------- |
| Time Series Segment Collection | `TimeSeriesSegments` | Container for time series segments |
| Segment Metadata               | `SegmentMetadata`    | Metadata describing each segment   |
| Record Count                   | `RecordCount`        | Number of records in the segment   |
| Start Time                     | `StartTime`          | ISO 8601 timestamp of first record |
| End Time                       | `EndTime`            | ISO 8601 timestamp of last record  |
| Sampling Interval              | `SamplingInterval`   | ISO 8601 duration between samples  |
| Records                        | `Records`            | The actual time series data points |

The following elements are **optional**:

| Element            | idShort            | Description                        |
| ------------------ | ------------------ | ---------------------------------- |
| External Data File | `ExternalDataFile` | Reference to external data storage |
| Linked Segment     | `LinkedSegment`    | Reference to related segments      |
| Quality Indicator  | `QualityIndicator` | Data quality metadata              |

## Authentication and Authorization

Participants must comply to authentication and authorization defined in ADR-002 and ADR-003.