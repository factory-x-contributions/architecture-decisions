<!--
SPDX-FileCopyrightText: 2024-2026 Contributors to the Factory-X project
SPDX-License-Identifier: CC-BY-4.0
-->

<div align="center">

<img src="https://factory-x.org/wp-content/uploads//factory-x-logo.svg" alt="Factory-X Logo" width="140" />

# Factory-X Architecture Decisions

Architecture Decision Records for the Factory-X consortium

[![Live Website](https://img.shields.io/badge/🌐%20LIVE%20WEBSITE-factory--x--contributions.github.io-1e3a5f?style=for-the-badge)](https://factory-x-contributions.github.io/architecture-decisions/)

[![Build](https://github.com/factory-x-contributions/architecture-decisions/actions/workflows/build-and-deploy-gh-pages.yaml/badge.svg)](https://github.com/factory-x-contributions/architecture-decisions/actions/workflows/build-and-deploy-gh-pages.yaml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENCE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENCE_non-code)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.10.0-green?logo=docusaurus)](https://docusaurus.io/)

[Getting Started](#getting-started) • [ADR Types](#adr-types) • [ADR Graph](#adr-graph) • [OpenAPI](#openapi-integration) • [Contributing](#contributing) • [License](#licensing-and-copyright)

</div>

---

## Getting Started

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Local Development

```bash
# Install dependencies (only needed once)
npm install

# Start development server
npm start
```

The website will be available at [http://localhost:3000/](http://localhost:3000/).

## Contributing

For detailed instructions on how to add new Architecture Decision Records, see **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

### ADR Types

The repository is organized by consortium. Each consortium has its own section in the documentation.

| Consortium | Type         | Location                       | Template                                                         |
|------------|--------------|--------------------------------|------------------------------------------------------------------|
| Hercules   | Network ADR  | `docs/hercules_network_adr/`   | [Network ADR Template](./CONTRIBUTING.md#network-adr-template)   |
| Hercules   | Use Case ADR | `docs/hercules_use_case_adr/`  | [Use Case ADR Template](./CONTRIBUTING.md#use-case-adr-template) |
| Leo        | _(upcoming)_ | `docs/leo/`                    | —                                                                |
| Orion      | _(upcoming)_ | `docs/orion/`                  | —                                                                |

### ADR Graph

The site includes an interactive **ADR Graph** (`/adr-graph`) that visualizes relationships between ADRs and highlights impact when hovering over a node.

### OpenAPI Integration

Use Case ADRs can include OpenAPI specifications for interactive API documentation.

```bash
# 1. Place OpenAPI YAML in:
docs/hercules_use_case_adr/<adr-folder>/resources/

# 2. Register in openapi-configs.js

# 3. API docs are generated automatically on npm start and npm run build
npm start
```

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-openapi-documentation) for details.

## Licensing and Copyright

Copyright 2024-2026 Contributors to the Factory-X project

This project uses a dual-licensing approach:

- **Code** (JavaScript, CSS, configuration files): [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) (Apache-2.0)
- **Documentation and non-code content** (Markdown, images, PDFs): [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) (CC-BY-4.0)

This project follows the [REUSE specification](https://reuse.software/) for clear and unambiguous license and copyright information. Each file contains SPDX license identifiers either inline or via the `REUSE.toml` file.

For details, see the [NOTICE](./NOTICE) file.
