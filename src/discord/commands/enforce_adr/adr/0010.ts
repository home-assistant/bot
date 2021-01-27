export const adr0010 = `
For integrations that connect to devices or service, we no longer accept new YAML configuration or changes.

This integration needs to be refactored fist to use a configuration flow and config entries first.

More information about this can be found in Architecture Decision Record:

- ADR-0010: <https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md#decision>

See our developer documentation on how to get started creating a configuration flow for this integration:

<https://developers.home-assistant.io/docs/config_entries_config_flow_handler>

As these changes often involve a bit of work and some significant shift in the current code, we will close this PR for now.

We (and our community!) would really appreciate it if you would like to contribute the refactoring. If you do so, submit it in a new PR.

Thanks already! :+1:
`;
