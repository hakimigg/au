# Local Development Setup

## Quick Start

1. **Start Local Server**: Double-click `start-local-server.bat` or run in terminal:
   ```bash
   python -m http.server 8000
   ```

2. **Open Website**: Navigate to `http://localhost:8000` in your browser

3. **Make Changes**: Edit any files (HTML, CSS, JS) and refresh the browser to see changes

4. **Push to GitHub**: When satisfied with changes, commit and push to update the live site

## Development Workflow

### Testing Changes Locally
- Start the local server using the batch file
- Make your changes to any files
- Refresh browser to see updates instantly
- Test all functionality including Supabase connections

### Deploying to GitHub Pages
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Files Structure
- `index.html` - Main website page
- `styles.css` - Main stylesheet
- `script.js` - Main JavaScript functionality
- `supabase-config.js` - Supabase configuration and database functions
- `admin.html` - Admin panel for managing products
- Other HTML files - Various utility and setup pages

## Important Notes
- The local server runs on port 8000 by default
- Supabase connections work the same locally as on GitHub Pages
- CORS is already configured for both localhost and GitHub Pages
- All changes are immediately visible after browser refresh

## Troubleshooting
- If port 8000 is busy, the server will automatically try the next available port
- Make sure Python is installed on your system
- For HTTPS testing, you may need to use a different local server setup
