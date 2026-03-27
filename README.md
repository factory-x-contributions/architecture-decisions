<!--
SPDX-FileCopyrightText: 2024-2026 Contributors to the Factory-X project
SPDX-License-Identifier: CC-BY-4.0
-->

# Factory-X Architecture Decisions

[![Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus%203-green?logo=docusaurus)](https://docusaurus.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENCE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENCE_non-code)

This repository contains the released **Architecture Decision Records (ADRs)** made in the Factory-X consortium.

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

| Type         | Location                       | Template                                                         |
|--------------|--------------------------------|------------------------------------------------------------------|
| Network ADR  | `docs/hercules_network_adr/`   | [Network ADR Template](./CONTRIBUTING.md#network-adr-template)   |
| Use Case ADR | `docs/hercules_use_case_adr/`  | [Use Case ADR Template](./CONTRIBUTING.md#use-case-adr-template) |

### OpenAPI Integration

Use Case ADRs can include OpenAPI specifications for interactive API documentation.

```bash
# 1. Place OpenAPI YAML in:
docs/hercules_use_case_adr/<adr-folder>/resources/

# 2. Register in openapi-configs.js

# 3. Generate API docs
npm run build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-openapi-documentation) for details.

## Licensing and Copyright

Copyright 2024-2026 Contributors to the Factory-X project

This project uses a dual-licensing approach:

- **Code** (JavaScript, CSS, configuration files): [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) (Apache-2.0)
- **Documentation and non-code content** (Markdown, images, PDFs): [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) (CC-BY-4.0)

This project follows the [REUSE specification](https://reuse.software/) for clear and unambiguous license and copyright information. Each file contains SPDX license identifiers either inline or via the `REUSE.toml` file.

For details, see the [NOTICE](./NOTICE) file.
