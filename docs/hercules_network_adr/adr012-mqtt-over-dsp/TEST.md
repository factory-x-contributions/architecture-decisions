---
id: fx_adr012_test
title: ADR 012 – Test Scenarios for MQTT over DSP
sidebar_label: ADR 012 – Test Scenarios
description: BDD Gherkin test scenarios derived from the normative requirements of ADR 012 (MQTT over DSP).
tags: [architecture_decision_records, network_adr, mqtt, testing, gherkin]
---

## Test Scenarios

The following Gherkin scenarios are derived from the normative requirements of [ADR 012](./README.md).

Coverage:

| Tag | Scope |
|-----|-------|
| `@smoke` | Critical happy-path scenarios |
| `@edge` | Boundary and equivalence class cases |
| `@negative` | Error handling and failure scenarios |

```gherkin
Feature: ADR 012 – MQTT over DSP
  As a dataspace participant
  I want to discover and connect to MQTT brokers through the Dataspace Protocol
  So that I can consume asynchronous event streams with proper authorization and token lifecycle management

  # ─────────────────────────────────────────────
  # SMOKE – Happy Path (Offering & Discovery)
  # ─────────────────────────────────────────────

  @smoke @ADR-012
  Scenario: Provider's DSP Catalog Distribution has format "Mqtt-PULL"
    Given a Provider has registered an MQTT data stream as a DSP asset
    When a Consumer requests the Provider's DSP Catalog
    Then the Catalog contains a Distribution with "format" set to "Mqtt-PULL"

  @smoke @ADR-012
  Scenario: Provider Asset dataAddress contains required MQTT connection fields
    Given a Consumer has negotiated access to an MQTT asset via DSP
    When the Consumer inspects the provided DataAddress
    Then the DataAddress has "type" set to "Mqtt"
    And includes "mqttEndpointType" with a valid value ("mqtt-wss", "mqtt-tcp-basic", or "mqtt-tls")
    And includes "baseUrl" with the broker URL

  @smoke @ADR-012
  Scenario: Consumer connects to MQTT broker via WSS using JWT authentication (mqtt-jwt-oauth2)
    Given a Consumer has received a DataAddress with "mqttEndpointType" set to "mqtt-wss"
    And the DataAddress includes "dsp-mqtt:authorization" (JWT) and "dsp-mqtt:refreshToken"
    When the Consumer connects to the broker using MQTT over WSS
    And passes the JWT in the MQTT CONNECT password field
    Then the broker accepts the connection and the Consumer can subscribe to topics

  @smoke @ADR-012
  Scenario: Consumer connects to MQTT broker using username/password authentication (mqtt-usrpw)
    Given a Consumer has received a DataAddress with credentials via
      "https://w3id.org/dspace/2025/1/mqtt-pull/user" and
      "https://w3id.org/dspace/2025/1/mqtt-pull/password"
    When the Consumer connects to the MQTT broker
    And passes the username and password in the MQTT CONNECT message
    Then the broker accepts the connection

  # ─────────────────────────────────────────────
  # SMOKE – Token Lifecycle
  # ─────────────────────────────────────────────

  @smoke @ADR-012
  Scenario: Consumer refreshes JWT before expiry using refreshEndpoint
    Given a Consumer is connected to an MQTT broker with a JWT that expires in 60 seconds
    And the DataAddress provides "dsp-mqtt:refreshToken" and "dsp-mqtt:refreshEndpoint"
    When the Consumer sends the refreshToken to the "refreshEndpoint" before token expiry
    Then a new JWT is returned
    And the Consumer updates its MQTT CONNECT password with the new JWT on reconnect

  # ─────────────────────────────────────────────
  # EDGE – Boundary / Equivalence Cases
  # ─────────────────────────────────────────────

  @edge @ADR-012
  Scenario Outline: Provider supports multiple MQTT transport bindings
    Given a Provider has configured an MQTT broker for transport "<mqttEndpointType>"
    When a Consumer negotiates access and receives the DataAddress
    Then the DataAddress "mqttEndpointType" is "<mqttEndpointType>"
    And the Consumer can establish a connection using the corresponding transport

    Examples:
      | mqttEndpointType  |
      | mqtt-wss          |
      | mqtt-tls          |
      | mqtt-tcp-basic    |

  @edge @ADR-012
  Scenario: DataAddress includes optional dsp-mqtt:topic for fine-grained topic access
    Given a Consumer has received a DataAddress that includes "dsp-mqtt:topic" set to "sensor/temperature"
    When the Consumer connects to the MQTT broker
    Then the Consumer is authorized only for the "sensor/temperature" topic
    And subscription to any other topic is rejected by the broker

  @edge @ADR-012
  Scenario: DataAddress omits dsp-mqtt:topic (broker-level access control)
    Given a Consumer has received a DataAddress without the "dsp-mqtt:topic" property
    When the Consumer connects to the MQTT broker
    Then access control is managed entirely by the broker
    And the Consumer can subscribe to all topics the broker permits for this identity

  @edge @ADR-012
  Scenario: OAuth2 authentication is auto-enabled when required fields are present
    Given a Provider Asset dataAddress contains "oauth2:tokenUrl", "oauth2:clientId", and "oauth2:clientSecretKeyAlias"
    When the EDC processes the Asset
    Then the "mqtt-jwt-oauth2" authentication mode is automatically activated
    And the EDC retrieves a JWT from the tokenUrl before providing it to the Consumer

  @edge @ADR-012
  Scenario: JWT expires exactly at connection time (boundary on expiresIn)
    Given a Consumer holds a JWT with "dsp-mqtt:expiresIn" of 0 seconds remaining
    When the Consumer attempts to connect to the MQTT broker with the expired JWT
    Then the broker rejects the connection
    And the Consumer must obtain a refreshed JWT via the refreshEndpoint before retrying

  # ─────────────────────────────────────────────
  # NEGATIVE – Failure / Error Cases
  # ─────────────────────────────────────────────

  @negative @ADR-012
  Scenario: Consumer presents an expired JWT to the MQTT broker
    Given a Consumer holds a JWT past its "expiresIn" deadline
    When the Consumer sends a MQTT CONNECT message with the expired JWT as password
    Then the broker returns a CONNACK with return code 5 (Not Authorized)

  @negative @ADR-012
  Scenario: Distribution missing Mqtt-PULL format in Catalog
    Given a Provider's Catalog Distribution does not specify "format": "Mqtt-PULL"
    When a Consumer searches the Catalog for an MQTT asset
    Then the Consumer cannot identify the Distribution as an MQTT resource
    And the asset discovery for MQTT fails

  @negative @ADR-012
  Scenario: Consumer uses mqtt:// (unencrypted TCP) transport
    Given a Consumer attempts to connect via unencrypted "mqtt://" protocol
    When the connection attempt is made to the Provider's MQTT broker
    Then the connection is refused (no unencrypted TCP support per ADR 012)

  @negative @ADR-012
  Scenario: username/password authentication with wrong credentials
    Given a Consumer holds incorrect credentials for "mqtt-usrpw" authentication
    When the Consumer sends a MQTT CONNECT with wrong username or password
    Then the broker returns a CONNACK with return code 5 (Connection Refused: Not Authorized)
```
