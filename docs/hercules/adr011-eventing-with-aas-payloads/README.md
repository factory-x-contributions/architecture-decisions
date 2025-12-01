---
title: ADR 011 – Eventing with AAS Payloads
---

### Problem to be solved

The AAS API (as specified
in [IDTA-01002](https://industrialdigitaltwin.io/aas-specifications/IDTA-01002/v3.1.1/index.html)) is synchronous. This
is a problem because in some scenarios, the Data Consumer
requires to be informed proactively about events that happened inside a server holding AAS resources like Submodels.
This is manifested also in REQ 13. This ADR is on the level of the MX Gate. It’s agnostic to access control and
discovery layers above. Integrations with security mechanisms must be decided in later ADRs.

### Solution description

Data Providers emitting events on Asset Administration Shells MUST expose a Server (Broker) accepting and distributing
messages via MQTT version 3.1.1 over WSS mqtt-wss or TLS mqtts emit messages according to the format and semantics of
[AAS async API](https://factory-x-contributions.github.io/async-aas-helm/).

Usage of the `data` property must be agreed within each use-case.

When describing services that emit payloads according to this spec, metadata MAY contain the property
`http://purl.org/dc/terms/type` holding an array containing `https://w3id.org/factoryx/types/mqtt-aas`.

### Expected business consequences

If relevant for a usecase, this (naturally) requires exposure and security of additional services to the web. This may
still result in lower infrastructure cost than continuously polling the relevant AAS resources.

### Alternatives evaluated

Notification via POST/PUT requests. This however does not satisfy the multiplex requirement.

- Eventlogs via HTTP GET - this is an aggregated form of polling, synchronous by nature.
- Various other message protocols were evaluated, MQTT over Websockets (or over TLS) is a pragmatic approach as
  explained
  below.

![mqtt-reasoning.png](resources/mqtt-reasoning.png)
