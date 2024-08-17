# create-upstream-sync-pr-action
GitHub Action to fetch upstream on fork. This creates PR when changes detected.

## Inputs

| Name           | Description                                                                 | Required | Default                  |
|----------------|-----------------------------------------------------------------------------|----------|--------------------------|
| upstream-owner | The owner of the upstream repository. If a fork source is detected, it defaults to that. Otherwise, an error occurs if not set. | No       | Fork source or error     |
| upstream-repo  | The name of the upstream repository. If a fork source is detected, it defaults to that. Otherwise, an error occurs if not set. | No       | Fork source or error     |
| head           | The branch in the upstream repository to merge from (head).                  | Yes      | N/A                      |
| base           | The branch in the current repository to merge into (base).                   | Yes      | N/A                      |
| github-token   | GitHub token for authentication.                                             | No      | ${github.token}                      |

## Outputs

| Name   | Description                       |
|--------|-----------------------------------|
| pr-url | The URL of the created Pull Request. |

## example
[example.yml](https://github.com/nadesskey/create-upstream-sync-pr-action/blob/master/example.yml)

## alternatives
- Bot strategy: https://github.com/wei/pull
- fork-sync: https://github.com/tgymnich/fork-sync?tab=readme-ov-file
  - That action source is more functionally
  - I did not know it already existed, until I completed the first release
  - DIFFERENCES:
    - TEST before pr created and don't make PR if changes are conflict
      - I think that you should be create new branch and mannualy merge when coflict.
      - I have plan to autoclose action's auto-created PR when conflict detected.(Not implement yet.)

- Fork-Sync-With-Upstream-action: https://github.com/aormsby/Fork-Sync-With-Upstream-action
  - That is not reusable action, just example
