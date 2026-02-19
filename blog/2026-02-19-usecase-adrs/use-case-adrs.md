---
slug: Use-Case ADRs
title: Building Use-Case ADRs
authors: [ arnoweiss ]
tags: [ architecture_decision_records, factory-x ]
---

Introduction to use-case ADRs that build on network-ADRs to solve specific business problems and enable data exchange
for value-creating processes.

{/* truncate */}

### The last mile: From network-ADRs to solving business problems

The Factory-X project has so far focused on publishing [**network-ADRs
**](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_network_adr) that specify
the technological foundation for data exchange in the context of the MX-Port Hercules. These ADRs lay out the protocols,
APIs, and architectural decisions that enable interoperability and secure communication between components in the
Factory-X ecosystem.

Now, this solid foundation is put to use as the foundation for [**use-case ADRs
**](https://factory-x-contributions.github.io/architecture-decisions/docs/hercules_use_case_adr).
These ADRs build on the network-ADRs to solve specific business problems and enable data exchange for value-creating
processes. Use-case ADRs specify how the underlying technologies are applied in real-world scenarios, detailing the data
flows, interactions, and decisions made to address particular use cases. Building on a broad foundation, use-case ADRs
are lean and only extend the network-ADRs where necessary to solve the problem at hand.

### Nomenclature

The Hercules Use-Case ADRs will be numerated consecutively starting with `ADR-101`.
