---
slug: FX-ADR in Docusaurus
title: Architecture Decision Records in Docusaurus
authors: [ janiskretschmann ]
tags: [ architecture_decision_records, factory-x, docusaurus ]
---

Factory‑X's Architecture Decision Records are now published on a static website, providing a clear, searchable format
organized by MX port configuration.

{/* truncate */}

I’m pleased to announce that Factory‑X’s Architecture Decision Records (ADRs) are now published on a static website
built with the Docusaurus framework. The ADRs are pulled directly from the repository’s .md documents and presented in a
clear, searchable format. To make navigation easier, entries are organized according to the different configurations of
the MX port, so you can quickly find decisions relevant to a particular setup.

Serving the ADRs as a static site delivers fast page loads, reliable hosting, and straightforward version control,
because the source remains the markdown files in the repo. This also makes it simpler for contributors to propose
updates via pull requests and helps keep the documentation aligned with code changes. Whether you’re reviewing past
decisions or onboarding to the codebase, the new site should make it easier to discover the rationale behind our
architecture choices.

Enjoy browsing the ADRs, and please share any feedback or suggested improvements—pull requests and issues are welcome
for clarifications, corrections, or new entries.