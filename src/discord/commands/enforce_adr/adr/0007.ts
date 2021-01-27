export const adr0007 = `
We no longer allow integrations to add or change a platform YAML configuration.

This integration needs to be refactored first to have the configuration the schema in the base integration module and the configuration YAML section under the top-level integration domain key.

For example:

\`\`\`yaml
# Platform level configuration example
sensor:
  - platform: awesome_integration
    username: user

# Integration level configuration example
awesome_integration:
  username: user
\`\`\`

More information on this can be found in Architecture Decision Record:

- ADR-0007: <https://github.com/home-assistant/architecture/blob/master/adr/0007-integration-config-yaml-structure.md#decision>

Please note that if this integration connects to a device or service, another Architecture Decision Record may apply, which disallows the use of YAML configuration in favor of a configuration flow via the UI:

- ADR-0010: <https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md#decision>

If ADR-0010 applies, see our developer documentation on how to get started creating a configuration flow for this integration:

<https://developers.home-assistant.io/docs/config_entries_config_flow_handler>

As these changes often involve a bit of work and some significant shift in the current code, we will close this PR for now.

We (and our community!) would really appreciate it if you could start on the refactoring of this integration. If you do so, submit it in a new PR.

Thanks already! :+1:
`;
