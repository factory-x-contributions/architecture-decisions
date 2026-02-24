---
id: fx_adr102
title: ADR 102 – Manufacturing as a Service Version 0.1.0
date: 2026-02-24
tags:
  - architecture_decision_records
  - API
---
## Purpose

This Architecture Decision Record (ADR) provides normative guidance for the use case **"Manufacturing as a Service (MaaS)"**. These guidelines enable standardized, secure, and interoperable data exchange via the MX-Port Hercules and ensure data sovereignty for the MaaS use case. The vision of MaaS is a manufacturing ecosystem where manufacturers standardize their information once, forming a digital twin of production. This allows them to be visible across all digital manufacturing service platforms and marketplaces without the need to serve the specific data channels of individual providers. Our goal is to enable an easy entry into digital marketplaces, increasing order income while minimizing manual advertising, acquisition and order processing efforts.

## Roles

- **Supplier** acts as _Data Provider_. A supplier is an organization, e.g., an SME, that provides manufacturing services to buyers. Suppliers can offer their services via platform applications.
- **Platform application** acts as _Data Consumer_. A platform application is a MaaS cloud platform that acts as a middleware between buyers and suppliers by aggregating the manufacturing as a service offering of multiple suppliers and offering them to interested buyers. Suppliers can register at platform applications and publish their manufacturing capabilities there. Buyers can search for suppliers that match their manufacturing request at platform applications.
- **Buyer** also acts as _Data Consumer_. A buyer is an entity, e.g., a company, buying manufacturing services from Suppliers.

## API Structure

### Data Provider

The Data Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)            | Version         | Link                      | 
| ------------------- | ------------ | ------------------------------------------------------ | 
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery | 
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication | 
| ADR 008 – Asset Administration Shell Profile for Factory-X Version 0.2.0 | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile | 
| ADR 009 – Discovery of AAS Services via DSP Version 0.2.0                | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp | 
| 

### Data Consumer

The Data Consumer MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)            | Version         | Link                      | 
| ------------------- | ------------ | ------------------------------------------------------ | 
| ADR 002 – Cross-Company Authorization and Discovery Version 0.2.0        | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery | 
| ADR 003 – Authentication for Dataspaces Version 0.2.0                    | 0.2.0 | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication | 
| 

## Data Models

The `Asset` can be the instance of a company, factory, machine, product or a software application.

### Submodels

The following submodels may be used for the Manufacturing as a Service use case. In the MaaS use-case, there are three scenarios which each require a different set of submodels. Data providers may expose arbitrary additional submodels according to the need of their business processes.

- **Scenario 1**: Capability Notification and Matchmaking: Suppliers provide their machine capabilities in a standardized and automated manner so that platforms can use them for capability-based matching.
- **Scenario 2**: Request, Offer, Order: Geometry and feature recognition are used to automatically generate an AAS (including a purchase order submodel), enabling suppliers to quickly calculate prices and delivery times and submit quotes for order placement.
- **Scenario 3**: Order Execution and Quality Control: Orders are executed automatically using AI-supported feature recognition and CAM automation, while the AAS submodel “Quality Control for Machining” translates quality requirements into inspection and machine programs and monitors production resulting in a quality report.


| Standard                   | Version | Reference                                                                                                                   | Affiliation   | Required in scenario   |
| -------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| Digital Nameplate for industrial equipment        | 3.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/3/0)  | Company, Factory, Machine, Product | Scenario 1, 2, 3 |
| Capability Description        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/development/Capability/1/0)  | Factory, Machine, Product | Scenario 1 |
| Purchase Order       | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Purchase%20Order/1/0)  | Product | Scenario 2 |
| Quality Control for Machining       | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Quality%20Control%20for%20Machining/1/0)  | Product | Scenario 3 |
| Handover Documentation        | 2.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Handover%20Documentation/2/0)  | Factory, Machine, Product | Scenario 2, 3 |
| Generic Frame for Technical Data for Industrial Equipment in Manufacturing        | 2.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0)  | Company, Factory, Machine, Product | Scenario 2, 3 |
| Contact Information        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Contact%20Information/1/0)  | Company, Factory, Machine | optional |
| Data Model for Asset Location        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Data%20Model%20for%20Asset%20Location/1/0)  | Factory, Machine | optional |
| Asset Interface Description        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Description/1/0)  | Asset | optional |
| Asset Interfaces Mapping Configuration        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Asset%20Interfaces%20Mapping%20Configuration/1/0)  | Asset | optional |
| Time Series Data        | 1.1  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1)  | Machine | optional |
| Hierarchical Structures enabling Bills of Material        | 1.1  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Hierarchical%20Structures%20enabling%20Bills%20of%20Material/1/1)  | Company, Factory, Machine, Product | optional |
| Production Calendar        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Production%20Calendar/1/0)  | Machine | optional |
| Carbon Footprint        | 1.0  | [IDTA Submodel Template](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Carbon%20Footprint/1/0)  | Product | optional |


## Authentication and Authorization

Participants must comply to authentication and authorization defined ADR-002 and ADR-003.