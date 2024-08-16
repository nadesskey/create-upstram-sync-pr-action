# create-upstream-sync-pr-action

## Inputs

| Name           | Description                                                                 | Required | Default                  |
|----------------|-----------------------------------------------------------------------------|----------|--------------------------|
| upstream-owner | The owner of the upstream repository. If a fork source is detected, it defaults to that. Otherwise, an error occurs if not set. | No       | Fork source or error     |
| upstream-repo  | The name of the upstream repository. If a fork source is detected, it defaults to that. Otherwise, an error occurs if not set. | No       | Fork source or error     |
| head           | The branch in the upstream repository to merge from (head).                  | Yes      | N/A                      |
| base           | The branch in the current repository to merge into (base).                   | Yes      | N/A                      |
| github-token   | GitHub token for authentication.                                             | No      | N/A                      |

## Outputs

| Name   | Description                       |
|--------|-----------------------------------|
| pr-url | The URL of the created Pull Request. |