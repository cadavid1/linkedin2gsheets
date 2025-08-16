# User Guide
## LinkedIn to Google Sheets Extension

This guide explains how to use the LinkedIn to Google Sheets extension to export your saved LinkedIn posts to Google Sheets.

## Overview

The LinkedIn to Google Sheets extension allows you to:
- Extract all your saved LinkedIn posts automatically
- Export them to a beautifully formatted Google Spreadsheet
- Avoid duplicates when updating existing spreadsheets
- Customize export settings to fit your needs

## Getting Started

### Step 1: Open LinkedIn

1. Navigate to [LinkedIn.com](https://linkedin.com) in Chrome
2. Make sure you're logged in to your account
3. The extension works from any LinkedIn page, but saved posts page is optimal

### Step 2: Launch the Extension

1. Click the LinkedIn to Sheets extension icon in your Chrome toolbar
2. The popup will show your connection status
3. If connected, you'll see "Connected to LinkedIn" with a green indicator

### Step 3: Configure Settings (Optional)

Before extracting, you can customize your export settings:

#### Export Options (to-do)

- **Include engagement data**: 
  - ✅ Enabled: Exports likes, comments, and shares count
  - ❌ Disabled: Skips engagement metrics for faster processing

- **Include media information**: 
  - ✅ Enabled: Exports media type (image, video, text) and media presence flags
  - ❌ Disabled: Exports only text content

- **Create new spreadsheet**: 
  - ✅ Enabled: Always creates a new Google Sheet
  - ❌ Disabled: Prompts to append to existing sheet (coming soon)

## Using the Extension

### Basic Export Process

1. **Extract Posts**: Click "Extract Saved Posts"
   - The extension navigates to your saved posts page
   - Extracts all saved posts using advanced scraping techniques
   - Shows progress with detailed status updates

2. **Export to Sheets**: Click "Export to Google Sheets"
   - Authenticates with your Google account (first time only)
   - Creates a new, professionally formatted spreadsheet
   - Exports all extracted data with rich formatting

3. **Open Results**: Click "Open Google Sheet"
   - Opens your new spreadsheet in a new tab
   - View, edit, and share your exported data

### Understanding the Progress Indicators

The extension provides detailed feedback during operation:

#### Extraction Phase
- **Checking LinkedIn connection**: Verifies you're on LinkedIn
- **Navigating to saved posts**: Automatically goes to your saved posts page
- **Extracting saved posts**: Scrapes posts using multiple methods
- **Processing extracted data**: Cleans and formats the data

#### Export Phase
- **Authenticating with Google**: Gets permission to create spreadsheets
- **Creating Google Sheet**: Sets up a new spreadsheet with proper formatting
- **Formatting spreadsheet**: Applies headers, colors, and column sizing

### What Gets Exported

The extension exports comprehensive information about each saved post:

#### Basic Information
- **Title**: First 100 characters of the post (for easy identification)
- **Description**: Full post content (up to 1000 characters)
- **URL**: Direct link to the original post
- **Post ID**: Unique identifier for duplicate detection

#### Author Information
- **Author**: Name of the person who created the post
- **Author Profile**: Link to the author's LinkedIn profile

#### Timestamps
- **Published Date**: When the post was originally published
- **Saved Date**: When you saved the post (or extraction date if unavailable)

#### Media Information (if enabled)
- **Media Type**: text, image, or video
- **Has Image**: Yes/No flag for image presence
- **Has Video**: Yes/No flag for video presence

#### Engagement Data (if enabled)
- **Likes**: Number of likes on the post
- **Comments**: Number of comments on the post
- **Shares**: Number of shares/reposts

#### Technical Metadata
- **Extraction Method**: How the post was extracted (API or DOM)

## Advanced Features

### Duplicate Detection

The extension automatically prevents duplicate exports:
- Compares URLs and post IDs
- Skips posts that already exist in the spreadsheet
- Shows count of duplicates skipped

### Multiple Extraction Methods

The extension uses multiple techniques to ensure maximum data extraction:

1. **LinkedIn API Method**: Uses LinkedIn's internal APIs for rich data
2. **DOM Scraping Method**: Falls back to page scraping if API fails
3. **Hybrid Approach**: Combines both methods for best results

### Professional Spreadsheet Formatting

Your exported spreadsheet includes:
- **Header Row**: Blue background with white text
- **Frozen Headers**: Headers stay visible when scrolling
- **Auto-sized Columns**: Columns automatically resize to fit content
- **Alternating Row Colors**: Light gray every other row for readability
- **Proper Data Types**: Dates, numbers, and text formatted correctly

## Tips for Best Results

### Before Extracting

1. **Save More Posts**: The extension can only export posts you've saved
2. **Check Your Connection**: Ensure stable internet connection
3. **Close Other LinkedIn Tabs**: Avoid conflicts with multiple LinkedIn tabs
4. **Review Settings**: Configure export options based on your needs

### During Extraction

1. **Don't Navigate Away**: Stay on the LinkedIn tab during extraction
2. **Be Patient**: Large collections (100+ posts) may take several minutes
3. **Watch Progress**: Monitor the progress bar for status updates
4. **Don't Close Popup**: Keep the extension popup open during operation

### After Export

1. **Review Data**: Check the spreadsheet for completeness
2. **Save Locally**: Download a copy if you want offline access
3. **Share Carefully**: Be mindful of privacy when sharing LinkedIn data
4. **Regular Updates**: Re-run the extension periodically to get new saved posts

## Understanding the Data

### Post Content

- **Truncated Titles**: Long posts are truncated in the title column for readability
- **Full Content**: Complete post text is in the description column
- **Rich Text**: Formatting like line breaks is preserved where possible

### Engagement Metrics

- **Real-time Data**: Engagement numbers reflect the time of extraction
- **Public Posts Only**: Private posts may not have engagement data
- **Approximate Numbers**: LinkedIn sometimes shows approximate counts (1K+, etc.)

### Media Detection

- **Image Posts**: Posts with photos, infographics, or image carousels
- **Video Posts**: Posts with native videos or video links
- **Text Posts**: Posts with only text content
- **Mixed Content**: Posts may have multiple media types

## Troubleshooting Common Issues

### No Posts Found

**Possible Causes**:
- You haven't saved any posts on LinkedIn
- LinkedIn changed their page structure
- Network connectivity issues

**Solutions**:
- Verify you have saved posts by manually checking LinkedIn
- Try refreshing LinkedIn and running the extension again
- Check your internet connection

### Extraction Stops Early

**Possible Causes**:
- LinkedIn rate limiting
- Page navigation issues
- Browser memory constraints

**Solutions**:
- Wait a few minutes and try again
- Close other browser tabs to free memory
- Try extracting in smaller batches

### Authentication Failures

**Possible Causes**:
- Google API credentials not configured
- OAuth consent screen issues
- Browser blocking popups

**Solutions**:
- Check your Google Cloud Console setup
- Allow popups for the extension
- Try in an incognito window

### Incomplete Data

**Possible Causes**:
- LinkedIn privacy settings
- Post visibility restrictions
- API limitations

**Solutions**:
- Check your LinkedIn privacy settings
- Some data may not be publicly available
- Try the extraction again for potentially missed posts

## Privacy and Data Handling

### What Data is Accessed

The extension only accesses:
- Your saved LinkedIn posts (content you've already saved)
- Basic post metadata (author, date, engagement)
- No private messages or personal information

### Where Data Goes

- **LinkedIn → Google Sheets**: Direct transfer, no intermediate servers
- **Local Storage**: Temporary storage in your browser only
- **No External Servers**: Your data never leaves your control

### Data Retention

- **Browser Storage**: Cleared when you uninstall the extension
- **Google Sheets**: Remains in your Google Drive until you delete it
- **No Tracking**: The extension doesn't track your usage

## Frequently Asked Questions

### Can I export posts from other people's profiles?

No, the extension only exports posts that you have personally saved to your "Saved Posts" collection.

### How many posts can I export at once?

There's no hard limit, but very large collections (1000+ posts) may take longer and could hit rate limits. The extension handles pagination automatically.

### Can I schedule automatic exports?

Currently, the extension requires manual operation. Automatic scheduling may be added in future versions.

### Does this work with LinkedIn Premium?

Yes, the extension works with both free and premium LinkedIn accounts.

### Can I export to existing spreadsheets?

Currently, the extension creates new spreadsheets. Appending to existing sheets is planned for a future update.

### Is my data secure?

Yes, your data goes directly from LinkedIn to your Google Sheets. The extension doesn't store or transmit your data to any external servers.

## Getting Support

If you need help:

1. Check this user guide thoroughly
2. Review the [Installation Guide](DEV INSTALLATION.md) for setup issues
3. Check the [Troubleshooting Guide](TROUBLESHOOTING.md) for common problems
4. Look at browser console errors for technical issues

## Feature Requests and Feedback

We're always looking to improve the extension. Common requested features include:
- Exporting LinkedIn connections
- Scheduled automatic exports
- Integration with other platforms
- Advanced filtering options

Your feedback helps prioritize development efforts!

