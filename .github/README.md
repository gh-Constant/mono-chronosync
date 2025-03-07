# ChronoSync GitHub Workflows

This directory contains GitHub Actions workflows for automating various tasks in the ChronoSync repository.

## Available Workflows

### 1. Discord Notifications (`discord-webhook.yml`)

Sends notifications to a Discord channel when:
- New commits are pushed to any branch
- Pull requests are opened, closed, or updated

### 2. Issue Tracker (`issue-tracker.yml`)

Automates issue management:
- Sends notifications when issues are opened, edited, closed, reopened, assigned, etc.
- Automatically labels new issues with 'triage-needed'
- Adds a welcome comment to new issues
- Sends email notifications for new issues
- Tracks issue comments