---
id: fx_adrXXX
title: ADR XXX – Manufacturing as a Service
date: 2026-02-xx
tags:
  - architecture_decision_records
  - API
---
## Purpose

This Architecture Decision Record (ADR) provides normative guidance for the use case **"Manufacturing as a Service (MaaS)"**. These guidelines enable standardized, secure, and interoperable data exchange via the MX-Port Hercules and ensure data sovereignty for the MaaS use case. The vision of MaaS is a manufacturing ecosystem where manufacturers standardize their information once, forming a digital twin of production. This allows them to be visible across all digital manufacturing service platforms and marketplaces without the need to serve the specific data channels of individual providers. Our goal is to enable an easy entry into digital marketplaces, increasing order income while minimizing manual advertising, acquisition and order processing efforts.

## Roles

- **Supplier** acts as _Data Provider_
- **Platform application** acts as _Data Consumer_

## API Structure

Repository of the Asset Administration Shell Specification IDTA-01002 API: https://github.com/admin-shell-io/aas-specs-api

### Data Provider

The Data Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)            | Version         | Link                      | 
| ------------------- | ------------ | ------------------------------------------------------ | 
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr002-authorization-discovery | 
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr003-authentication | 
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr008-aas-profile | 
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr009-aas-rest-dsp | 
| 

### Data Consumer

The Data Consumer MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)            | Version         | Link                      | 
| ------------------- | ------------ | ------------------------------------------------------ | 
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr002-authorization-discovery | 
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr003-authentication | 
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules/adr009-aas-rest-dsp | 
| 

## Data Models

The `Asset` can be the instance of a company, factory, machine or a product.

### Submodels

The following submodels may be used for the Manufacturing as a Service use case.

| Standard                   | Version | Reference                                                                                                                   | Affiliation   |
| -------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| Digital Nameplate for industrial equipment        | 3.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/3/0)  | Company, Factory, Machine, Product |
| Contact Information        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Contact%20Information/1/0)  | Company, Factory, Machine |
| Generic Frame for Technical Data for Industrial Equipment in Manufacturing        | 2.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0)  | Company, Factory, Machine, Product |
| Data Model for Asset Location        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Data%20Model%20for%20Asset%20Location/1/0)  | Factory, Machine |
| Asset Interface Description        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description/1/0)  | Asset |
| Asset Interfaces Mapping Configuration        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Mapping%20Configuration/1/0)  | Asset |
| Time Series Data        | 1.1  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1)  | Machine |
| Hierarchical Structures enabling Bills of Material        | 1.1  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material/1/1)  | Company, Factory, Machine, Product |
| Capability Description        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/development/Capability/1/0)  | Factory, Machine, Product |
| Production Calendar        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Production%20Calendar/1/0)  | Machine |
| Handover Documentation        | 2.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/2/0)  | Factory, Machine, Product |
| Carbon Footprint        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Carbon%20Footprint/1/0)  | Product |
| Quality Control for Machining       | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Quality%20Control%20for%20Machining/1/0)  | Product |
| Submodel Purchase Order       | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Purchase%20Order/1/0)  | Product |


## Authentication and Authorization

The Data Provider MUST expose the APIs mandated in ADR-002 and ADR-003. AAS resources MUST be exposed according to ADR-008 and ADR-009.

The Dataspace Connector implementation is not prescribed; any connector compliant with the Dataspace Protocol (DSP) and Decentralized Claims Protocol (DCP) specification MAY be used.