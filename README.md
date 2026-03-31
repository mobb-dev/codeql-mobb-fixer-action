# Mobb Fixer for GitHub Code Scanning (CodeQL)

## Overview

This action is used alongside the native CodeQL Code Scanning feature to monitor for the completion of a CodeQL scan within a Pull Request or on commits. Once the code scanning is complete, the analysis results (.sarif files) are downloaded and provided to Mobb to generate auto-remediation fixes.

## Supported Triggers

This action supports two types of CodeQL scans:

1. **Pull Request Scans**: Triggered when CodeQL runs on pull requests
2. **Commit Scans**: Triggered when CodeQL runs on push events to branches

## Example usage

Create a file under the path `.github/workflow/mobb.yml`. 

### For Pull Requests and Commits (Recommended)

```yaml
name: Mobb fix from CodeQL reports
on:
  workflow_run:
    workflows: ["CodeQL"] # This workflow is triggered when the name specified here is triggered. In CodeQL Default Code Scanning Setup, this name is "CodeQL", if you are using CodeQL Advanced Setup, you may need to change this if you have a different workflow name.
    types:
      - completed
jobs:
  handle_codeql_scan:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    permissions:
      pull-requests: write
      security-events: write
      statuses: write
      contents: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - uses: mobb-dev/codeql-mobb-fixer-action@v1.1
        with:
          mobb-api-token: ${{ secrets.MOBB_API_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # Optional: specify organization and project
          # organization-id: "your-org-id"
          # mobb-project-name: "Your Project Name"
```

### For Pull Requests Only (Legacy)

```yaml
name: Mobb fix from CodeQL reports
on:
  workflow_run:
    workflows: ["CodeQL"] 
    types:
      - completed
jobs:
  handle_codeql_scan:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' && (contains(github.event.workflow_run.head_branch, 'refs/pull') || github.event.workflow_run.event == 'pull_request') }}
    permissions:
      pull-requests: write
      security-events: write
      statuses: write
      contents: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - uses: mobb-dev/codeql-mobb-fixer-action@v1.1
        with:
          mobb-api-token: ${{ secrets.MOBB_API_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

## `mobb-api-token`

**Required** The Mobb API token to use with the action. [Find out how to get it here](https://docs.mobb.ai/mobb-user-docs/administration/access-tokens). 

## `mobb-project-name`

**Optional** The Mobb Project Name. If unspecified, it will go to "My First Project". 

## `organization-id`

**Optional** The Mobb Organization ID. If specified, the analysis will be associated with the specified organization.

## `github-token`

**Required** The GitHub api token to use with the action. Usually available as `${{ secrets.GITHUB_TOKEN }}`.

## Results

The fixes are presented differently depending on the trigger type:

### For Pull Requests
The fixes are presented in 2 formats:
1. **Selected fixes in the pull request comments** - The fixes presented here only contain a subset of all available fixes that are only relevant to the context of the current pull request based on what has been changed in the diff.
2. **Full fix report** - A full fix analysis report is available via the "Mobb Fix Report Link" in the status section. The fix report here contains all fixes relevant to the entire repository.

### For Commits
For commit-triggered scans, the full fix report URL is available in the action output. Since there's no pull request context, the fixes include all vulnerabilities found in the scanned commit.

## Behavior Differences

| Feature | Pull Request Scans | Commit Scans |
|---------|-------------------|--------------|
| PR Comments | ✅ Yes | ❌ No |
| Status Checks | ✅ Yes | ❌ No |
| Fix Report URL | ✅ Yes (in status + output) | ✅ Yes (in output only) |
| Scope | PR diff context | Full repository |

### Fixes shown in the PR comments 
![image](https://github.com/mobb-dev/codeql-mobb-fixer-action/assets/5158535/46161a99-4010-4ef1-90be-a06860f755a9)

### Full fix report in Mobb UI
![image](https://github.com/mobb-dev/codeql-mobb-fixer-action/assets/5158535/7955c545-e30a-4b61-975c-0b1f1f2e18d8)

