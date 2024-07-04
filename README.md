# Mobb Fixer for GitHub Code Security (CodeQL) 

This action is used alongside the native CodeQL Analysis enabled for your GitHub repository to monitor for analysis results (.sarif files) and generate auto-remediation fixes based on the report. 

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
      - uses: mobb-dev/codeql-mobb-fixer-action@main
        with:
          mobb-api-token: ${{ secrets.MOBB_API_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
