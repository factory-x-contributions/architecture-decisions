---
id: fx_adr009
title: ADR 009 – Discovery of AAS Services via DSP
date: 2025-10-24
tags: [architecture_decision_records, API]
---

### Problem to be solved

The interaction via Dataspace Protocol (according to ADR 002) facilitates the discovery of services such as APIs. So
far, only ADR 008 has been chosen as common API for discovery of data - namely asset centric data according to
[IDTA-01002](https://industrialdigitaltwin.io/aas-specifications/IDTA-01002/v3.1.1/index.html).

When standing alone, ADR008 assumes that the Data Consumer has prior knowledge about the location and authentication
method of the AAS-APIs. Moreover, it assumes the Data Consumer already holds credentials that the Data Provider accepts.

### Solution description

The Data Provider MUST (with regards to his Digital Twin Registry):

1. advertise the Digital Twin Registry as `Dataset` in their DSP-Catalog to an appropriate audience.
2. annotate that `Dataset` with
   `"http://purl.org/dc/terms/type": {"@id":"https://w3id.org/catenax/taxonomy#DigitalTwinRegistry"}`
3. upon successful authentication yield access to the URL of the DTR before the segments `/shell-descriptors` and
   `/lookup` respectively.
4. add an endpoint to each `submodel-descriptor` with
    1. `protocolInformation.href` set to the endpoint where the submodel is accessible.
    2. `protocolInformation.subprotocol` set to `DSP`
    3. `protocolInformation.subprotocolBody` set according to the concatenation of the following key-value-pairs
       (assigned by a "=" and separated by a semicolon ";"):
        1. `id` represents the id of that Dataset in the Data Providers catalog that contains the Submodel.
        2. `dspEndpoint` represents the endpoint of the Data Provider's DSP endpoint where the catalog containing the
           relevant Dataset is located.
5. ensure that access control to shell-descriptors is enforced on a granular level

The Data Provider MUST (with regards to his Submodels):

1. advertise endpoints in such a manner via the DSP that a Consumer can access them according to the payload from the
   corresponding `submodel-descriptor`’s `endpoints` entry.

### Expected business consequences

This is additional integration effort. This does not mean that each Submodel has to be registered. If the effort is
still conceived as high, appropriate tooling (either by the EDC polling the repos OR the repos registering at the
catalog automatically) can be developed.

### Alternatives evaluated

In the context of the existing [ADRs 002](../adr002-authorization-discovery/README.md) and [ADR 008](../adr008-aas-profile/README.md) -
the overall setup is pretty much predetermined. The metadata annotations of the Dataset objects could theoretically 
reflect the response from a Digital Twin Repository’s `/description` endpoint.
This can be added later in a compatible fashion in there’s a strong preference for it. The Catena-X annotation is
adopted from [CX-0002](https://catenax-ev.github.io/docs/next/standards/CX-0002-DigitalTwinsInCatenaX) to maintain
compatibility with the Catena-X dataspace.

It could be done like in [FraunhoferIOSB/EDC-Extension-for-AAS: EDC Extension supporting usage of Asset Administration
Shells](https://github.com/FraunhoferIOSB/EDC-Extension-for-AAS) where most of the data from the AAS Registry is
duplicated into the DSP catalog rendering the component Digital
Twin Registry pretty much useless.

### Links to additional explanations, further material, and references

This ADR is a subset of [CX-0002](https://catenax-ev.github.io/docs/next/standards/CX-0002-DigitalTwinsInCatenaX) and
the [Digital Twin Kit](https://eclipse-tractusx.github.io/docs-kits/next/kits/digital-twin-kit/software-development-view/).
The latter has diagrams, explanations and motivations sketched out.