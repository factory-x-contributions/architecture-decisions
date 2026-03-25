# Contributing ADRs to Factory-X

This guide explains how to add new Architecture Decision Records (ADRs) to the Factory-X documentation.

## ADR Types

Factory-X distinguishes between two types of ADRs:

| Type             | Purpose                                              | Numbering   |
|------------------|------------------------------------------------------|-------------|
| **Network ADR**  | Infrastructure, authentication, protocols            | ADR 0xx     |
| **Use Case ADR** | Business-specific implementations with APIs          | ADR 1xx+    |

## Directory Structure

```
docs/
├── hercules_network_adr/
│   └── adrXXX-<name>/
│       └── README.md
└── hercules_use_case_adr/
    └── adrXXX-<name>/
        ├── README.md
        ├── api/              # Auto-generated (do not edit)
        └── resources/
            └── <service>-openapi.yaml
```

---

## ADR Templates

### Use Case ADR

Use the template at [templates/use-case-adr.md](./templates/use-case-adr.md) as a starting point for new Use Case ADRs. Copy it to `docs/hercules_use_case_adr/adrXXX-<name>/README.md` and adjust the content accordingly.

**Example:** See [ADR 101 - Load Management](./docs/hercules_use_case_adr/adr101-load-management/README.md) for a complete implementation.

### Network ADR

For Network ADRs, refer to existing examples like [ADR 002 - Authorization and Discovery](./docs/hercules_network_adr/adr002-authorization-discovery/README.md) as a reference.

---

## Adding OpenAPI Documentation

Use Case ADRs can include interactive API documentation generated from OpenAPI specifications.

### Step 1: Create OpenAPI YAML

Create your OpenAPI specification in the `resources/` folder:

```
docs/hercules_use_case_adr/adrXXX-<name>/resources/<service>-openapi.yaml
```

**Example OpenAPI structure:**

```yaml
openapi: 3.0.3
info:
  title: <Service Name> API
  version: 1.0.0
  description: API for <description>

paths:
  /<endpoint>/{id}:
    get:
      summary: <Operation summary>
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/<SchemaName>'

components:
  schemas:
    <SchemaName>:
      type: object
      properties:
        <property>:
          type: string
```

### Step 2: Register in openapi-configs.js

Add your API configuration to `openapi-configs.js`:

```javascript
const apiConfigs = {
  // Existing configs...

  // ADR XXX - <Use Case Name>
  "adrXXX-service-name": createApiConfig(
    "adrXXX-<folder-name>",      // ADR folder name
    "<service>-openapi.yaml"     // YAML file name
  ),
};
```

**Full example for ADR 101:**

```javascript
const apiConfigs = {
  // ADR 101 - Energy consumption & Load Management
  "adr101-forecast-service": createApiConfig(
    "adr101-load-management",
    "forecast-service-openapi.yaml"
  ),
};
```

### Step 3: Build and Verify

```bash
# Generate API documentation
npm run build

# Preview locally
npm run serve
```

The API documentation will be available at:
`/docs/hercules_use_case_adr/adrXXX-<name>/api/`

### Step 4: Link in README

Reference the API in your ADR's README.md:

```markdown
## API Specification

The service MUST be implemented according to the [OpenAPI specification](./resources/<service>-openapi.yaml).
```

---

## Checklist for New ADRs

### Network ADR

- [ ] Create folder: `docs/hercules_network_adr/adrXXX-<name>/`
- [ ] Create `README.md` with frontmatter (id, title, sidebar_label, description, tags)
- [ ] Include all required sections (Problem, Solution, Context, Consequences, Alternatives)
- [ ] Add references to related ADRs
- [ ] Test locally with `npm start`

### Use Case ADR

- [ ] Create folder: `docs/hercules_use_case_adr/adrXXX-<name>/`
- [ ] Create `README.md` with frontmatter (id, title, date, tags)
- [ ] Define roles (Data Provider, Data Consumer)
- [ ] Document API structure and endpoints
- [ ] If API exists:
  - [ ] Create `resources/<service>-openapi.yaml`
  - [ ] Register in `openapi-configs.js`
  - [ ] Verify API docs generate correctly

### Final Steps

- [ ] Run `npm run build` without errors
- [ ] Verify all links work
- [ ] Create Pull Request

---


## Questions?

For questions or issues, please open an issue on [GitHub](https://github.com/factory-x-contributions/architecture-decisions/issues).
