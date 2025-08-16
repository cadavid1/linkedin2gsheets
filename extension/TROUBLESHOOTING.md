# Troubleshooting Guide
## LinkedIn to Google Sheets Extension

This guide helps you resolve common issues you might encounter while using the extension.

## Quick Diagnostics

Before diving into specific issues, try these quick diagnostic steps:

1. **Refresh LinkedIn**: Reload the LinkedIn page and try again
2. **Restart Extension**: Disable and re-enable the extension in `chrome://extensions/`
3. **Check Console**: Open Developer Tools (F12) and check for error messages
4. **Try Incognito**: Test the extension in an incognito window
5. **Update Chrome**: Ensure you're using the latest version of Chrome

## Installation Issues

### Extension Won't Load

**Symptoms**: Extension doesn't appear in Chrome toolbar or extensions list

**Possible Causes**:
- Incomplete ZIP extraction
- Wrong folder selected
- Corrupted download
- Chrome security restrictions

**Solutions**:
1. **Re-extract ZIP file**:
   - Delete the existing folder
   - Extract the ZIP file again
   - Ensure all files are present (manifest.json, popup.html, etc.)

2. **Check folder structure**:
   ```
   linkedin-to-sheets-extension/
   ├── manifest.json
   ├── background.js
   ├── content.js
   ├── popup.html
   ├── popup.js
   ├── injected.js
   ├── icons/
   └── README.md
   ```

3. **Load unpacked correctly**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the folder containing `manifest.json`

4. **Check Chrome version**:
   - Requires Chrome 88 or later
   - Update Chrome if necessary

### Manifest Errors

**Symptoms**: "Invalid manifest" or "Manifest version not supported" errors

**Possible Causes**:
- Corrupted manifest.json file
- Incorrect Client ID format
- Missing required fields

**Solutions**:
1. **Validate manifest.json**:
   - Open manifest.json in a text editor
   - Check for syntax errors (missing commas, brackets)
   - Ensure Client ID is properly formatted

2. **Reset manifest.json**:
   - Replace with original version
   - Re-add your OAuth Client ID
   - Save and reload extension

3. **Check Client ID format**:
   ```json
   "oauth2": {
     "client_id": "123456789-abcdefghijklmnop.apps.googleusercontent.com",
     "scopes": ["https://www.googleapis.com/auth/spreadsheets"]
   }
   ```

## Authentication Issues

### Google Authentication Fails

**Symptoms**: "Authentication failed" or "Invalid credentials" errors

**Possible Causes**:
- Incorrect OAuth Client ID
- Google Sheets API not enabled
- OAuth consent screen not configured
- Browser blocking popups

**Solutions**:
1. **Verify Google Cloud Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Ensure Google Sheets API is enabled
   - Check OAuth 2.0 credentials are created
   - Verify OAuth consent screen is configured

2. **Check Client ID**:
   - Copy Client ID from Google Cloud Console
   - Paste exactly into manifest.json (no extra spaces)
   - Reload extension after changes

3. **Configure OAuth Consent Screen**:
   - Set user type to "External"
   - Add required scopes: `https://www.googleapis.com/auth/spreadsheets`
   - Add your email as a test user
   - Publish the app (or keep in testing mode)

4. **Allow Popups**:
   - Check if Chrome is blocking popups
   - Add exception for the extension
   - Try in incognito mode

### Token Expired Errors

**Symptoms**: "Token expired" or "Invalid token" after successful initial auth

**Possible Causes**:
- OAuth token expired (normal after 1 hour)
- Token revoked in Google Account settings
- Browser cache issues

**Solutions**:
1. **Re-authenticate**:
   - Click "Extract Saved Posts" again
   - Allow re-authentication when prompted
   - Grant permissions again if needed

2. **Clear browser data**:
   - Go to `chrome://settings/content/cookies`
   - Clear cookies for Google domains
   - Restart Chrome and try again

3. **Check Google Account**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Check "Third-party apps with account access"
   - Remove and re-authorize if necessary

## LinkedIn Connection Issues

### "Not Connected to LinkedIn" Status

**Symptoms**: Extension shows disconnected status even when on LinkedIn

**Possible Causes**:
- Not logged in to LinkedIn
- LinkedIn page not fully loaded
- Content script injection failed
- LinkedIn domain restrictions

**Solutions**:
1. **Verify LinkedIn Login**:
   - Make sure you're logged in to LinkedIn
   - Try logging out and back in
   - Check for any LinkedIn error messages

2. **Refresh and Wait**:
   - Refresh the LinkedIn page
   - Wait for page to fully load
   - Try clicking extension icon again

3. **Check URL**:
   - Ensure you're on a linkedin.com domain
   - Some LinkedIn subdomains might not work
   - Try navigating to main LinkedIn feed

4. **Clear LinkedIn Cookies**:
   - Clear cookies for linkedin.com
   - Log back in to LinkedIn
   - Try extension again

### Content Script Injection Fails

**Symptoms**: Extension can't communicate with LinkedIn page

**Possible Causes**:
- LinkedIn security policies
- Browser extension conflicts
- Content Security Policy restrictions
- Ad blockers interfering

**Solutions**:
1. **Disable Other Extensions**:
   - Temporarily disable other extensions
   - Test if extension works
   - Re-enable extensions one by one to find conflicts

2. **Check Ad Blockers**:
   - Disable ad blockers temporarily
   - Add exception for LinkedIn
   - Some ad blockers block content scripts

3. **Try Different LinkedIn Pages**:
   - Try from LinkedIn feed
   - Try from profile page
   - Try from saved posts page directly

## Data Extraction Issues

### No Posts Found

**Symptoms**: "No saved posts found" message when you have saved posts

**Possible Causes**:
- No posts actually saved
- LinkedIn page structure changed
- Posts are private/restricted
- Extraction method failed

**Solutions**:
1. **Verify Saved Posts**:
   - Manually navigate to LinkedIn saved posts
   - Check if posts are visible there
   - Save a test post and try again

2. **Try Different Extraction Method**:
   - The extension tries API first, then DOM scraping
   - If one fails, it should try the other
   - Check browser console for specific errors

3. **Clear LinkedIn Cache**:
   - Hard refresh LinkedIn (Ctrl+Shift+R)
   - Clear LinkedIn cookies and cache
   - Log back in and try again

### Partial Data Extraction

**Symptoms**: Only some posts extracted, or missing data fields

**Possible Causes**:
- LinkedIn rate limiting
- Network timeouts
- Post privacy settings
- Incomplete page loading

**Solutions**:
1. **Wait and Retry**:
   - Wait 5-10 minutes between attempts
   - LinkedIn may be rate limiting requests
   - Try during off-peak hours

2. **Check Network Connection**:
   - Ensure stable internet connection
   - Try on different network if possible
   - Check for proxy/VPN interference

3. **Smaller Batches**:
   - If you have many saved posts, extraction might timeout
   - Try unsaving some posts temporarily
   - Extract in smaller batches

### Extraction Hangs or Freezes

**Symptoms**: Progress bar stops moving, extension becomes unresponsive

**Possible Causes**:
- JavaScript errors
- Memory issues
- LinkedIn anti-bot measures
- Browser resource constraints

**Solutions**:
1. **Close Other Tabs**:
   - Close unnecessary browser tabs
   - Free up system memory
   - Try extraction again

2. **Restart Browser**:
   - Close Chrome completely
   - Restart Chrome
   - Try extraction with fresh session

3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Report specific errors for debugging

## Google Sheets Export Issues

### Spreadsheet Creation Fails

**Symptoms**: "Failed to create spreadsheet" error

**Possible Causes**:
- Google Sheets API quota exceeded
- Insufficient permissions
- Google Drive storage full
- Network connectivity issues

**Solutions**:
1. **Check Google Drive Storage**:
   - Go to [Google Drive](https://drive.google.com/)
   - Check available storage space
   - Delete files or upgrade storage if needed

2. **Verify API Quotas**:
   - Go to Google Cloud Console
   - Check API quotas and usage
   - Wait if quotas are exceeded

3. **Check Permissions**:
   - Ensure extension has spreadsheet creation permissions
   - Re-authorize if necessary
   - Try creating a test spreadsheet manually

### Data Export Incomplete

**Symptoms**: Spreadsheet created but missing data or formatting

**Possible Causes**:
- API request timeouts
- Data formatting issues
- Large dataset problems
- Network interruptions

**Solutions**:
1. **Check Data Size**:
   - Very large datasets might timeout
   - Try exporting smaller batches
   - Check if all data was extracted first

2. **Retry Export**:
   - Try exporting the same data again
   - Check if more data appears
   - Compare with extraction results

3. **Manual Verification**:
   - Check the created spreadsheet
   - Verify row count matches extraction count
   - Look for any obvious missing data

## Performance Issues

### Slow Extraction

**Symptoms**: Extraction takes very long time

**Possible Causes**:
- Large number of saved posts
- Slow network connection
- LinkedIn rate limiting
- Browser performance issues

**Solutions**:
1. **Be Patient**:
   - Large collections (100+ posts) take time
   - Don't interrupt the process
   - Monitor progress bar for updates

2. **Optimize Browser**:
   - Close unnecessary tabs
   - Restart browser if needed
   - Ensure sufficient system memory

3. **Check Network**:
   - Use stable, fast internet connection
   - Avoid VPN if possible
   - Try during off-peak hours

### Memory Issues

**Symptoms**: Browser becomes slow or crashes during extraction

**Possible Causes**:
- Large dataset in memory
- Browser memory leaks
- Insufficient system RAM
- Other applications using memory

**Solutions**:
1. **Free Up Memory**:
   - Close other applications
   - Close unnecessary browser tabs
   - Restart browser before extraction

2. **System Requirements**:
   - Ensure adequate RAM (4GB+ recommended)
   - Close memory-intensive applications
   - Consider upgrading system if needed

## Error Messages Reference

### Common Error Messages and Solutions

**"Please navigate to LinkedIn first"**
- Solution: Open LinkedIn.com and log in

**"Authentication failed"**
- Solution: Check Google Cloud Console setup and Client ID

**"No saved posts found"**
- Solution: Verify you have saved posts on LinkedIn

**"Failed to create spreadsheet"**
- Solution: Check Google Drive storage and permissions

**"Extraction timeout"**
- Solution: Wait and try again, or try smaller batches

**"Invalid token"**
- Solution: Re-authenticate with Google

**"Rate limit exceeded"**
- Solution: Wait 10-15 minutes before trying again

**"Network error"**
- Solution: Check internet connection and try again

## Advanced Troubleshooting

### Browser Console Debugging

1. **Open Developer Tools**:
   - Press F12 or right-click → "Inspect"
   - Go to "Console" tab

2. **Look for Errors**:
   - Red error messages indicate problems
   - Note the exact error text
   - Check timestamps to correlate with issues

3. **Common Console Errors**:
   - `Content Security Policy` errors: LinkedIn blocking scripts
   - `Network` errors: Connection or API issues
   - `Authentication` errors: Google OAuth problems
   - `Permission` errors: Missing browser permissions

### Extension Debugging

1. **Check Extension Console**:
   - Go to `chrome://extensions/`
   - Click "Details" on the extension
   - Click "Inspect views: background page"
   - Check console for background script errors

2. **Reload Extension**:
   - Click refresh icon on extension
   - This reloads all extension code
   - Try operation again

3. **Reinstall Extension**:
   - Remove extension completely
   - Re-extract ZIP file
   - Load unpacked again
   - Reconfigure settings

### Network Debugging

1. **Check Network Tab**:
   - Open Developer Tools → Network tab
   - Try extraction while monitoring requests
   - Look for failed requests (red status codes)

2. **Common Network Issues**:
   - 403 Forbidden: LinkedIn blocking requests
   - 429 Too Many Requests: Rate limiting
   - 500 Server Error: LinkedIn server issues
   - Timeout: Network or server overload

## Getting Additional Help

If these troubleshooting steps don't resolve your issue:

1. **Document the Problem**:
   - Note exact error messages
   - Record steps to reproduce
   - Check browser console for errors
   - Note your Chrome version and OS

2. **Check System Requirements**:
   - Chrome 88+ required
   - Stable internet connection needed
   - Adequate system memory (4GB+ recommended)

3. **Try Alternative Approaches**:
   - Use different browser profile
   - Try on different computer
   - Test with minimal browser extensions

4. **Report Issues**:
   - Include detailed error information
   - Provide steps to reproduce
   - Mention your system configuration
   - Attach relevant screenshots

Remember: Most issues are related to authentication setup or LinkedIn connection problems. Double-check your Google Cloud Console configuration and ensure you're properly logged in to LinkedIn.

