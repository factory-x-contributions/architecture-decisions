---
id: fx_adr103
title: ADR 103 - Re-use Catena-X PCF Exchange
date: 2026-02-12
tags: [architecture_decision_records, PCF, Catena-X, Tractus-X, reuse, API]
---


## Purpose

- This ADR provides normative guidance for implementing Product Carbon Footprint (PCF) data exchange in Factory-X by adopting Catena-X / Tractus-X PCF exchange specification ("standardization triangle": mandatory components, data models, APIs, registration/procedures).
- The objective is interoperability with Catena-X-aligned partners and a verifiable conformance basis


## Roles

- The upstream partner (e.g., supplier) acts as Data Provider of PCF values.

- The downstream partner (e.g., customer) acts as Data Consumer of PCF values.

## API structure

- The partners MUST implement PCF exchange according to Catena-X CX-0136 "Use Case PCF" (v2.2.1) and its defined synchronous and/or asynchronous exchange patterns, including the "standardization triangle" requirements.

- If asynchronous data exchange is used, the PCF Exchange API MUST be implemented as specified (HTTP GET for request, HTTP PUT for response) and MUST be called via a Catena‑X conform connector according to CX‑0018 “Dataspace Connectivity” (not directly).

- If synchronous data exchange is used, the Data Provider MUST register the required submodel endpoint in the Digital Twin (e.g., idShort: "SynchronousPCFExchangeEndpoint") and the synchronous GET MUST be executed via a Catena‑X conform connector according to CX‑0018 “Dataspace Connectivity” (DSP negotiation + Data Plane) and MUST NOT bypass this connector.

- The partners MUST follow the additional Catena-X standards referenced as supporting standards in CX-0136 (e.g., Digital Twins, Dataspace Connectivity, SAMM), insofar as they are used by the PCF use case.

## Data Models

- PCF payloads MUST conform to the PCF aspect model identifier required by CX-0136 (urn:samm:io.catenax.pcf:9.0.0, as specified) and the corresponding machine-readable artifacts provided in the Tractus-X semantic models repository.

- The semantic model identifier MUST be used by the Data Provider to define the semantics of the transferred data.

- For value-only JSON payloads (e.g., synchronous pull), the response body MUST be value-only JSON conforming to the PCF model and Content-Type MUST be application/json.

## Authentication and Authorization

- Data sharing MUST follow the CX‑0136 conformance and proof‑of‑conformity requirements for Catena‑X participants, including that standardized OpenAPI specs and CX‑0018 “Dataspace Connectivity” asset/contract structures MUST correspond to the described structure.
- Where policies are used in the PCF exchange context, CX-0136 specifies required minimum policy elements (e.g., Membership, FrameworkAgreement, UsagePurpose) and references the Catena-X policy constraints standard that MUST be followed for providing/consuming data in Catena-X.
