---
id: fx_adr012
title: ADR 012 – MQTT over DSP Version 0.2.0
sidebar_label: ADR 012 – MQTT over DSP
description: ADR 012 describes support for MQTT as an asynchronous, event-driven data exchange protocol in the Factory-X dataspace.
tags: [architecture_decision_records, network_adr, eventing]
---

### Problem to be solved

The Factory-X dataspace requires support for asynchronous, event-driven data exchange. MQTT is a lightweight, widely
adopted protocol for publish-subscribe messaging, especially in IoT and industrial contexts. To enable secure and
interoperable asynchronous data transfer, support for MQTT with appropriate transport and authentication mechanisms must
be defined.

### Solution description

Similar to [ADR 011](../adr011-eventing-with-aas-payloads/README.md), This ADR proposes support for MQTT over WSS
(mqtt-wss) as well as MQTT over TLS (mqtts) as possible transport bindings.

#### Offering Requirements

In order to find and connect to an MQTT broker through DSP, the relevant metadata must be included in the catalog
entry of the MX-Port. A `Distribution` object MUST have the `format` property set to `Mqtt-PULL`.

##### Provider-Side Configuration Example  (non-normative)

- An Asset that describes the data stream being shared.
- Authentication details, either directly or via OAuth2 configuration.

This ensures that consumers can negotiate contracts and initiate transfers with all necessary information.

When creating an Asset, it must now include a dataAddress of type Mqtt. An Example is given below. The DataAddress field
also specifies the information required to access the broker

```json
{
  "@type": "Asset",
  "@id": "mqtt-asset",
  "dataAddress": {
    "@type": "DataAddress",
    "type": "Mqtt",
    "mqttEndpointType": "mqtt-wss",  // Also possible: "mqtt-tcp-basic", "mqtt-tls"
    "baseUrl": "wss://providercorp.com/internal/broker",
    "oauth2:tokenUrl": "https://keycloak.providercorp/internal/realms/mqtt/protocol/openid-connect/token",
    "oauth2:clientId": "dataspace-user",
    "oauth2:clientSecretKeyAlias": "Oauth2-client-secret",  // Reference to Secret in Vault
    "dsp-mqtt:topic": "topic-name"  // Optional: specifies the MQTT topic being accessed"
  }
}
```

Upon successful negotiation, the DataAddress and access information are given from the provider to the consumer. This
information set must specify the transport, authentication type, and optionally the topic. Example:

```json
{
  "@type": "DataAddress",
  "flowType": "PULL",
  "dsp-mqtt:baseUrl": "wss://providercorp.com/internal/broker",
  "mqttEndpointType": "mqtt-wss",  // Also possible: "mqtt-tcp-basic", "mqtt-tls"
  "dsp-mqtt:authorization": "<JWT>",
  "dsp-mqtt:refreshToken": "<RefreshToken>",
  "dsp-mqtt:refreshEndpoint": "https://keycloak.providercorp/internal/realms/mqtt/protocol/openid-connect/token",
  "dsp-mqtt:expiresIn": "300",
  "dsp-mqtt:refreshAudience": "<Audience>",
  "dsp-mqtt:topic": "sensor/temperature"  // Optional: specifies the MQTT topic being accessed
}

```

Note: The `dsp-mqtt:topic` property is optional and can be used to indicate the specific MQTT topic the consumer is
authorized to access or where the data is published. This supports fine-grained access control for a specific topic if
needed.

Otherwise, the provider can control the level of access given through the broker, if, for example, access to mulitple
topics is to be given to the consumer.

#### Authentication

Clients can authenticate with the MQTT broker using a JWT passed in the password field of the MQTT CONN message.

Two authentication modes for MQTT are defined:

1. `mqtt-jwt-oauth2`
   The JWT is issued by a trusted IdP and provided via the authorization endpoint property within the authorization
   field:
    - `https://w3id.org/dspace/2025/1/mqtt-pull/authorization`
    - `refreshToken` - contains the short-term token
    - `refreshEndpoint` - to request new refresh tokens
    - `expiresIn` - Time until access token expires and a new refreshed access token must be requested.

Automatically enabled when the Asset.dataAddress includes:

- `oauth2:tokenUrl`
- `oauth2:clientId`
- `oauth2:clientSecretKey`

2. `mqtt-usrpw`

Clients authenticate using username/password provisioned in the broker. Credentials are passed via:

- https://w3id.org/dspace/2025/1/mqtt-pull/user
- https://w3id.org/dspace/2025/1/mqtt-pull/password

### Expected business consequences

- Security: JWT-based authentication ensures secure, time-bound access. Refresh mechanisms reduce the risk of long-lived
  credentials.
- Interoperability: DSP-compliant endpoint properties ensure semantic compatibility across participants.
- Flexibility: Supporting both JWT and username/password modes allows integration with diverse broker setups.
- Efficiency: MQTT reduces infrastructure load compared to polling-based approaches.

### Alternatives evaluated

- MQTT over TCP (mqtt://): Rejected due to lack of encryption and browser compatibility. 
- HTTP-based polling: Rejected due to synchronous nature and higher infrastructure cost.
- Eventlogs via HTTP GET: Aggregated polling, not suitable for near real-time scenarios.
- Notification via POST/PUT: Does not support multiplexing or scalable event distribution.

### Links to additional explanations, further material, and references

Related ADRs:
- [ADR 003](../adr003-authentication/README.md) – Authentication for Dataspace Participants
- [ADR 011](../adr011-eventing-with-aas-payloads/README.md) – Eventing with AAS payloads

Related Requirements:
- [REQ #13 (p. 34)](https://factory-x.org/wp-content/uploads/Requirements-UseCases-1-19.pdf)

Reference Implementation:
- [Factory-X EDC v0.1.3 factory-x-contributions/factoryx-edc](https://github.com/factory-x-contributions/factoryx-edc/releases/tag/0.1.3)