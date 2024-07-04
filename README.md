# Mobb Fixer for GitHub Code Security (CodeQL) 

## Overview

This action is used alongside the native CodeQL Code Scanning feature to monitor for the completion of a CodeQL scan within a Pull Request. Once the code scanning is complete, the analysis results (.sarif files) are downloaded and provided to Mobb to generate auto-remediation fixes. 

The fixes are presented in 2 formats: 
1. Selected fixes are available within the Pull Request as comments. The fixes presented here only contain fixes that are relevant to the Pull Request based on what has been changed in the diff
2. Full fix report - A full fix analysis report is available via the "Mobb Fix Report Link" in the status section. The fix report here contains all fixes relevant to the entire repository

### Fixes shown in the PR comments 
![image](https://github.com/mobb-dev/codeql-mobb-fixer-action/assets/5158535/2cdd7fb2-2551-404b-b03c-c8290c9d46db)

### Full fix report in Mobb UI
![image](https://github.com/mobb-dev/codeql-mobb-fixer-action/assets/5158535/05d8f498-87fb-4818-aba1-97719d910356)


## Inputs

## `mobb-api-token`

**Required** The Mobb API token to use with the action. [Find out how to get it here](https://docs.mobb.ai/mobb-user-docs/administration/access-tokens). 

## `github-token`

**Required** The GitHub api token to use with the action. Usually available as `${{ secrets.GITHUB_TOKEN }}`.

## Example usage

Create a file under the path `.github/workflow/mobb.yml`. 

A sample content of the workflow file: 

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
    if: ${{ github.event.workflow_run.conclusion == 'success' && contains(github.event.workflow_run.head_branch,'refs/pull') }} # Check if workflow is a Pull Request Event and not a Push event
    permissions:
      pull-requests: write
      security-events: write
      statuses: write
      contents: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - uses: mobb-dev/codeql-mobb-fixer-action@v1.0
        with:
          mobb-api-token: ${{ secrets.MOBB_API_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
