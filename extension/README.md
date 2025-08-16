# LinkedIn to Google Sheets Exporter

A powerful Chrome extension that exports your LinkedIn saved posts to beautifully formatted Google Sheets with one click.

![Extension Demo](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🚀 **One-Click Export**
- Extract all your LinkedIn saved posts instantly
- Export to professionally formatted Google Sheets
- No manual copying or data entry required

### 📊 **Rich Data Export**
Export comprehensive information for each saved post:
- **Content**: Title, full description, and post URL
- **Author**: Name and profile link
- **Timestamps**: Published date and saved date
- **Engagement**: Likes, comments, and shares count
- **Media**: Image/video detection and media type classification
- **Metadata**: Unique IDs and extraction method tracking

### 🎨 **Professional Formatting**
- **Styled Headers**: Blue background with white text
- **Frozen Headers**: Stay visible when scrolling
- **Auto-sized Columns**: Perfect width for all content
- **Alternating Rows**: Light gray stripes for easy reading
- **Proper Data Types**: Dates, numbers, and text correctly formatted

### ⚙️ **Customizable Options**
- **Engagement Data**: Toggle likes/comments/shares export
- **Media Information**: Include/exclude media type detection
- **Spreadsheet Creation**: Always create new vs. append to existing
- **Duplicate Detection**: Automatically skip already exported posts

### 🔒 **Privacy & Security**
- **Direct Transfer**: LinkedIn → Google Sheets (no intermediate servers)
- **Local Processing**: All data processing happens in your browser
- **OAuth Security**: Secure Google authentication
- **No Tracking**: Your data stays private

## 🎯 Quick Start

### 1. Install the Extension
1. Download the extension files
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder

### 2. Set Up Google API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create OAuth 2.0 credentials
5. Add your Client ID to `manifest.json`

### 3. Start Exporting
1. Navigate to LinkedIn and log in
2. Click the extension icon
3. Click "Extract Saved Posts"
4. Click "Export to Google Sheets"
5. Enjoy your organized data!

## 📚 Documentation

### 📖 **Complete Guides**
- **[Installation Guide](INSTALLATION.md)** - Detailed setup instructions
- **[User Guide](USER_GUIDE.md)** - How to use all features
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Solve common issues

### 🔧 **Technical Details**
- **Chrome Extension Manifest V3** - Latest extension platform
- **OAuth 2.0 Authentication** - Secure Google integration
- **Multiple Extraction Methods** - API + DOM scraping fallback
- **Advanced Error Handling** - Robust operation in various conditions

## 🖼️ Screenshots

### Extension Popup
Modern, intuitive interface with real-time status updates:
- LinkedIn connection indicator
- Progress tracking with detailed steps
- Live statistics (posts found/exported)
- Customizable export settings

### Google Sheets Output
Professional spreadsheet with:
- 15 detailed columns of post information
- Color-coded headers and alternating rows
- Proper data formatting and column sizing
- Comprehensive post metadata

## 🛠️ Technical Architecture

### Core Components
- **`manifest.json`** - Extension configuration and permissions
- **`background.js`** - Service worker for API calls and data processing
- **`content.js`** - LinkedIn page interaction and data extraction
- **`injected.js`** - LinkedIn API access and advanced scraping
- **`popup.html/js`** - User interface and interaction handling

### Data Flow
1. **LinkedIn Detection** - Verify connection and page access
2. **Data Extraction** - Multiple methods for maximum coverage
3. **Google Authentication** - Secure OAuth 2.0 flow
4. **Spreadsheet Creation** - Professional formatting and styling
5. **Data Export** - Comprehensive post information transfer

### Extraction Methods
1. **LinkedIn API Method** - Uses internal LinkedIn APIs for rich data
2. **DOM Scraping Method** - Fallback page scraping for reliability
3. **Hybrid Approach** - Combines both methods for best results

## 📋 System Requirements

### Browser Support
- **Google Chrome** 88 or later
- **Chromium-based browsers** (Edge, Brave, etc.)

### Accounts Required
- **LinkedIn Account** with saved posts
- **Google Account** with Google Sheets access

### Permissions Needed
- **LinkedIn Access** - Read saved posts and profile information
- **Google Sheets** - Create and edit spreadsheets
- **Storage** - Save settings and temporary data

## 🚨 Troubleshooting

### Common Issues

**Extension won't load?**
- Check that all files are extracted properly
- Verify Chrome version (88+ required)
- Try reloading the extension

**Authentication fails?**
- Verify Google Cloud Console setup
- Check OAuth Client ID in manifest.json
- Ensure Google Sheets API is enabled

**No posts found?**
- Verify you have saved posts on LinkedIn
- Try refreshing LinkedIn page
- Check browser console for errors

**Export incomplete?**
- Check Google Drive storage space
- Verify stable internet connection
- Try exporting smaller batches

### Getting Help
1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review browser console for error messages
3. Verify all setup steps in [Installation Guide](INSTALLATION.md)
4. Try the extension in incognito mode

## 🔐 Privacy & Security

### Data Handling
- **No External Servers** - Data goes directly LinkedIn → Google Sheets
- **Local Processing** - All extraction happens in your browser
- **Temporary Storage** - Only cached locally during operation
- **User Control** - You own all exported data

### Permissions Explained
- **LinkedIn Access** - Required to read your saved posts
- **Google Sheets** - Required to create and populate spreadsheets
- **Storage** - Required to save your preferences and settings
- **Identity** - Required for Google OAuth authentication

### Security Measures
- **OAuth 2.0** - Industry standard authentication
- **HTTPS Only** - All API calls use secure connections
- **No Tracking** - Extension doesn't track usage or collect analytics
- **Open Source** - Code is transparent and auditable

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Bug Reports
- Use the issue tracker for bug reports
- Include detailed reproduction steps
- Provide browser console errors
- Mention your system configuration

### Feature Requests
- Suggest new features via issues
- Explain the use case and benefits
- Consider implementation complexity
- Check existing requests first

### Code Contributions
- Fork the repository
- Create feature branches
- Follow existing code style
- Test thoroughly before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LinkedIn** - For providing the platform and data
- **Google** - For Sheets API and Chrome extension platform
- **Chrome Extension Community** - For best practices and examples
- **Open Source Contributors** - For inspiration and code patterns

## 📞 Support

### Documentation
- **[Installation Guide](INSTALLATION.md)** - Complete setup instructions
- **[User Guide](USER_GUIDE.md)** - Detailed usage information
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions

### Community
- **Issues** - Report bugs and request features
- **Discussions** - Ask questions and share tips
- **Wiki** - Community-maintained documentation

---

**Made with ❤️ for LinkedIn users who want to organize their saved content**

*This extension is not affiliated with LinkedIn or Google. LinkedIn and Google are trademarks of their respective owners.*

