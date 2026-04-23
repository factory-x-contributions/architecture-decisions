---
id: fx_adr106
title: ADR 106 – Traceability 0.1.0
sidebar_label: ADR 106 – Traceability 0.1.0
tags: [architecture_decision_records, API, Catena-X, Traceability]
---
## Purpose

This ADR provides normative guidance for the implementation of the **"Traceability"** use-case. It is designed to allow the exchange of data relevant for parts, material and data traceability between different partners in the supply chain.

## Roles

- **Supplier** acts as _Data Provider_ that provides the traceability data of goods that were produced by him.
- **Factory Operator** acts as _Data Consumer_, who requests the data from the Supplier for the goods he received from him.

## API structure
### Data Provider

The Data Provider MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                         | Version | Link                                                   | 
| ---------------------------------------------------------- | ------- | ------------------------------------------------------ | 
| ADR 002 – Cross-Company Authorization and Discovery        | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery | 
| ADR 003 – Authentication for Dataspaces                    | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication | 
| ADR 008 – Asset Administration Shell Profile for Factory-X | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr008-aas-profile | 
| ADR 009 – Discovery of AAS Services via DSP                | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr009-aas-rest-dsp | 


### Data Consumer

The Data Consumer MUST expose the endpoints according to the following Architecture Decision Records (ADRs):

| Architecture Decision Record (ADR)                  | Version | Link                                                   | 
| --------------------------------------------------- | ------- | ------------------------------------------------------ | 
| ADR 002 – Cross-Company Authorization and Discovery | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr002-authorization-discovery | 
| ADR 003 – Authentication for Dataspaces             | 0.2.0   | https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr/adr003-authentication | 


## Data Models
### Submodels

Dependent on the scenario that should be supported, different data models MUST or MAY be used to support the Traceabily use case.  
Multiple scenarios can be supported, but at least scenario 1 MUST be supported.

#### Scenario 1 - Catena-X Quality Notifications

The Traceability Use Case is based on the results of the project Catena-X. This includes the support for quality notifications between partners in the supply chain.

The following standards MUST be implemented for Scenario 1:

| Submodel/Catena-X standard                  | Version | Link                                                   |
| ------------------------------------------- | ------- | ------------------------------------------------------ |
| CX-0125 Traceability Use Case               | 2.2.1   | https://catenax-ev.github.io/docs/standards/CX-0125-TraceabilityUseCase |
| CX-0127 Industry Core: Part Instance        | 2.0.2   | https://catenax-ev.github.io/docs/standards/CX-0127-IndustryCorePartInstance |


#### Scenario 2 - Exchange of quality data

A common scenario is the exchange of quality related product data across the supply chain. The following sub models are recommended to be used:

| Submodel/Catena-X standard                  | Version | Link                                                   |
| ------------------------------------------- | ------- | ------------------------------------------------------ |
| IDTA-02049 Quality Control for Machining    | 1.0     | https://github.com/admin-shell-io/submodel-templates/tree/main/published/Quality%20Control%20for%20Machining/1/0 |
| IDTA-02050 Purchase Order                   | 1.0     | https://github.com/admin-shell-io/submodel-templates/tree/main/published/Purchase%20Order/1/0 |


#### Scenario 3 - Exchange of process data

Another scenario is the exchange of process related data. The following sub models are recommended:

| Submodel/Catena-X standard                       | Version | Link                                                   |
| ------------------------------------------------ | ------- | ------------------------------------------------------ |
| IDTA-02008 Time Series Data                      | 1.1     | https://github.com/admin-shell-io/submodel-templates/tree/main/published/Time%20Series%20Data/1/1 |
| IDTA-02031-2 Process Parameters Part 2: Instance | 1.0     | https://github.com/admin-shell-io/submodel-templates/tree/main/published/Process%20Parameters%20Instance/1/0 |


## Authentication and Authorization

The Data Provider MUST expose the APIs mandated in ADR-002 and ADR-003. AAS-resources MUST be exposed according to ADR-009.

If the data exchange is executed within the Catena-X data space, additionally the definitions in [Catena-X standard CX-0152 Policy Constraints V1.0.0](https://catenax-ev.github.io/docs/standards/CX-0152-PolicyConstrainsForDataExchange) for Data Exchange MUST be followed.
