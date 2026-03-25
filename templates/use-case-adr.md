---
id: fx_adr101
title: ADR 101 – The Train Health API 0.1.0
sidebar_label: ADR XXX – <Short Title>
description: ADR XXX describes...
tags: [architecture_decision_records, API]
---

> This is an example of a fictional Use-Case ADR in Factory-X. The structure should be reused.

## Purpose

This ADR provides normative guidance for the implementation of the **"Train Health API"**. It is designed to enable the 
exchange of data between train operators and repair shops to flexibly schedule when a train should be sent to
maintenance. 

> Here, the usage view could be added and the API located within it.

## Roles

The train operator acts as _Data Provider_ and the repair shop acts as _Data Consumer_.

## API structure

The Train Health API follows ADR 008. Additionally, Data Providers MUST implement the POST `/query/shells` endpoint as
described in [Asset Administration Shell Repository Service Specification V3.1.1 SSP-003](https://app.swaggerhub.com/apis/Plattform_i40/AssetAdministrationShellRepositoryServiceSpecification/V3.1.1_SSP-003).

## Data Models

The `Asset` (see IDTA-01001-3-1) is the instance of a train.

- Data Providers MUST use the train's [UIC Number](https://en.wikipedia.org/wiki/UIC_identification_marking_for_tractive_stock) as `globalAssetId` in the Shell Descriptor.
- Data Providers SHOULD use the train's type identifier as `specificAssetId` with `name` set to `type` in the Shell Descriptor.

Each AAS Descriptor points to submodels.

- Data Providers MUST expose the Submodel [`Digital Nameplate 3.0.1`](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Digital%20nameplate/3/0)
- Data Providers MUST expose the Submodel `Train Health 0.1` as defined in the SMT/JSON schema attached.

## Authentication and Authorization

The Data Provider MUST expose the APIs mandated in ADR-002 and ADR-003. AAS-resources MUST be exposed according to 
ADR-009.
