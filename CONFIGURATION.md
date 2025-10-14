# Configuration Setup

## Sensitive Data Protection

This project uses environment variables and configuration files to protect sensitive data like API keys.

## Setup Instructions

### Task 1 (Web Application)

1. Copy the example config file:
   ```bash
   cd task1
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your EdgeML credentials:
   ```javascript
   const EDGEML_CONFIG = {
       backendUrl: 'https://app.edge-ml.org',
       deviceApiKey: 'YOUR_WRITE_KEY_HERE',
       username: 'YOUR_USERNAME',
       password: 'YOUR_PASSWORD'
   };
   ```

3. The `config.js` file is git-ignored and won't be committed

### Task 2 (Jupyter Notebook)

1. Copy the example environment file:
   ```bash
   cd task2
   cp .env.example .env
   ```

2. Edit `.env` and add your EdgeML credentials:
   ```
   EDGEML_READ_KEY=your_read_key_here
   EDGEML_WRITE_KEY=your_write_key_here
   EDGEML_SERVER_URL=https://app.edge-ml.org
   ```

3. The `.env` file is git-ignored and won't be committed

## Why This Approach?

- **Security**: API keys are not exposed in the repository
- **Flexibility**: Each developer can use their own credentials
- **Best Practice**: Follows the 12-factor app methodology
- **Easy Setup**: Simple copy and edit process

## Files to Never Commit

- `task1/config.js` (actual credentials)
- `task2/.env` (actual credentials)
- Any file with real API keys or passwords

## Files Safe to Commit

- `task1/config.example.js` (template)
- `task2/.env.example` (template)
- All other code files
