# Installation Guide
## LinkedIn to Google Sheets Extension

This guide will walk you through installing and setting up the LinkedIn to Google Sheets extension.

## Prerequisites

Before installing the extension, make sure you have:

- **Google Chrome** (version 88 or later)
- **LinkedIn account** with saved posts
- **Google account** with access to Google Sheets
- **Google Cloud Console access** (for API setup)

## Step 1: Set Up Google API Credentials

### 1.1 Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `LinkedIn to Sheets Extension`
4. Click "Create"

### 1.2 Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API" and click "Enable"

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: `LinkedIn to Sheets Extension`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `https://www.googleapis.com/auth/spreadsheets`
   - Add test users (your email address)

4. Create OAuth client ID:
   - Application type: "Chrome extension"
   - Name: `LinkedIn to Sheets Extension`
   - Click "Create"

5. **Important**: Copy the Client ID - you'll need it in Step 2.3

## Step 2: Install the Extension

### 2.1 Download the Extension

1. Download the `linkedin-to-sheets-extension.zip` file
2. Extract it to a folder on your computer (e.g., `~/Downloads/linkedin-to-sheets-extension/`)

### 2.2 Load Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the extracted extension folder
6. The extension should now appear in your extensions list

### 2.3 Configure API Credentials

1. Open the extension folder
2. Edit `manifest.json` file
3. Find the line with `"YOUR_CLIENT_ID"`
4. Replace `YOUR_CLIENT_ID` with your actual OAuth Client ID from Step 1.3
5. Save the file
6. Go back to `chrome://extensions/`
7. Click the refresh icon on the LinkedIn to Sheets extension

## Step 3: Test the Installation

### 3.1 Verify Extension is Loaded

1. Look for the LinkedIn to Sheets icon in your Chrome toolbar
2. If you don't see it, click the puzzle piece icon and pin the extension

### 3.2 Test Basic Functionality

1. Navigate to [LinkedIn.com](https://linkedin.com)
2. Log in to your LinkedIn account
3. Click the extension icon
4. You should see "Connected to LinkedIn" status

### 3.3 Test Authentication

1. Click "Extract Saved Posts" button
2. You should be prompted to authenticate with Google
3. Grant the necessary permissions
4. The extension should show "Authentication successful"

## Step 4: First Export

### 4.1 Navigate to Saved Posts

1. Go to LinkedIn and make sure you have some saved posts
2. You can save posts by clicking the bookmark icon on any LinkedIn post

### 4.2 Run the Extension

1. Click the extension icon
2. Click "Extract Saved Posts"
3. Wait for the extraction to complete
4. Click "Export to Google Sheets"
5. A new Google Sheet should be created with your saved posts

## Troubleshooting Installation Issues

### Extension Not Loading

**Problem**: Extension doesn't appear in Chrome
**Solution**: 
- Make sure you extracted the ZIP file completely
- Check that you selected the correct folder (should contain `manifest.json`)
- Try refreshing the extension in `chrome://extensions/`

### Authentication Errors

**Problem**: "Authentication failed" error
**Solution**:
- Verify your OAuth Client ID is correctly entered in `manifest.json`
- Make sure Google Sheets API is enabled in Google Cloud Console
- Check that your OAuth consent screen is properly configured
- Try removing and re-adding the extension

### LinkedIn Connection Issues

**Problem**: "Not connected to LinkedIn" status
**Solution**:
- Make sure you're logged in to LinkedIn
- Refresh the LinkedIn page
- Try navigating to a different LinkedIn page and back
- Check that the extension has permission to access LinkedIn

### Permission Errors

**Problem**: Extension can't access LinkedIn or Google Sheets
**Solution**:
- Check extension permissions in `chrome://extensions/`
- Make sure all required permissions are granted
- Try reinstalling the extension

## Advanced Configuration

### Custom Settings

The extension supports several customizable settings:

- **Include engagement data**: Export likes, comments, and shares
- **Include media information**: Export information about images and videos
- **Create new spreadsheet**: Always create a new sheet vs. appending to existing

### API Quotas

Google Sheets API has usage quotas:
- 300 requests per minute per project
- 100 requests per 100 seconds per user

For normal usage, these limits should be sufficient. If you hit rate limits, wait a few minutes before trying again.

### Security Considerations

- Your OAuth credentials are stored locally in Chrome
- The extension only accesses LinkedIn when you explicitly run it
- No data is sent to external servers (only LinkedIn → Google Sheets)
- You can revoke access anytime in your Google Account settings

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review the browser console for error messages
3. Ensure you're using the latest version of Chrome
4. Try the extension in an incognito window to rule out conflicts

## Next Steps

Once installed successfully:
1. Read the [User Guide](USER_GUIDE.md) for detailed usage instructions
2. Check out [Advanced Features](ADVANCED.md) for power user tips
3. Review [Privacy & Security](PRIVACY.md) information

