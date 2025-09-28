# Simple Website - HTML/CSS/JS Version

This is a simplified version of your React-based website, built using only HTML, CSS, and JavaScript with a JSON-based database system.

## Features

### Main Website (`index.html`)
- **Hero Section**: Beautiful gradient background with animated features
- **Companies Section**: Display all companies with filtering capabilities
- **Products Section**: Grid layout showing products with company filtering
- **Product Details**: Modal popup with full product information
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-in, and scale animations
- **Social Media Links**: Contact section with social media icons

### Admin Panel (`admin.html`)
- **Dashboard**: Statistics overview (total companies, products, stock status)
- **Company Management**: Add, edit, delete companies
- **Product Management**: Add, edit, delete products with specifications
- **Data Import/Export**: Backup and restore functionality
- **Real-time Updates**: Changes reflect immediately on the main website

### Database System (`database.js`)
- **JSON-based Storage**: Uses localStorage for persistence
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Data Validation**: Ensures data integrity
- **Search & Filter**: Advanced filtering capabilities
- **Statistics**: Real-time analytics

## File Structure

```
simple-website/
├── index.html          # Main website
├── admin.html          # Admin panel
├── styles.css          # Main website styles
├── admin-styles.css    # Admin panel styles
├── script.js           # Main website functionality
├── admin.js            # Admin panel functionality
├── database.js         # Database system
└── README.md           # This file
```

## How to Use

### 1. Open the Website
Simply open `index.html` in any modern web browser. The website will load with sample data including:
- 4 Companies: Nokia, Samsung, Apple, Premium
- 12 Products: Various electronics with different specifications

### 2. Navigate the Website
- **Home**: Hero section with company overview
- **Companies**: Click on any company to filter products
- **Products**: Browse all products or filter by company
- **Product Details**: Click on any product to see full details
- **Admin**: Access the admin panel (top-right navigation)

### 3. Use the Admin Panel
Access via `admin.html` or click "Admin" in the main navigation:

#### Dashboard
- View statistics: total companies, products, stock levels
- Monitor inventory value

#### Manage Companies
- **Add Company**: Click "Add Company" button
  - Enter unique ID (lowercase, no spaces)
  - Company name and description
  - Optional logo URL
- **Edit Company**: Click "Edit" on any company card
- **Delete Company**: Click "Delete" (will also remove all products from that company)

#### Manage Products
- **Add Product**: Click "Add Product" button
  - Enter unique product ID
  - Product name, description, company
  - Price and stock quantity
  - Photo URLs (one per line)
  - Tags (comma-separated)
  - Specifications (key-value pairs)
- **Edit Product**: Click "Edit" on any product card
- **Delete Product**: Click "Delete" to remove

#### Data Management
- **Export Data**: Download JSON backup of all data
- **Import Data**: Upload JSON file or paste JSON data
- **Reset Data**: Restore to default sample data

## Technical Details

### Database System
- **Storage**: Uses browser's localStorage
- **Format**: JSON objects for companies and products
- **Persistence**: Data survives browser restarts
- **Backup**: Export/import functionality for data portability

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: 768px (tablet), 480px (mobile)
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch-Friendly**: Large buttons and touch targets

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **JavaScript**: ES6+ features used
- **CSS**: Modern CSS features (Grid, Flexbox, Custom Properties)

## Customization

### Adding New Companies
1. Go to Admin Panel → Companies
2. Click "Add Company"
3. Enter company details
4. Save and the company will appear in filters

### Adding New Products
1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill in all product details
4. Add specifications as needed
5. Save and the product will appear on the website

### Styling Changes
- **Main Website**: Edit `styles.css`
- **Admin Panel**: Edit `admin-styles.css`
- **Colors**: Search for color values (e.g., `#d4a574`) and replace
- **Fonts**: Change font imports in HTML head sections

### Functionality Changes
- **Main Website**: Edit `script.js`
- **Admin Panel**: Edit `admin.js`
- **Database**: Edit `database.js` for data structure changes

## Data Format

### Company Object
```json
{
  "id": "company-id",
  "name": "Company Name",
  "description": "Company description",
  "logo": "https://example.com/logo.jpg"
}
```

### Product Object
```json
{
  "id": "product-id",
  "name": "Product Name",
  "description": "Product description",
  "company": "company-id",
  "price": 299.99,
  "stock": 50,
  "photos": ["https://example.com/photo1.jpg"],
  "tags": ["tag1", "tag2"],
  "specs": {
    "screen": "6.5 inch",
    "storage": "128GB"
  }
}
```

## Deployment

### Local Development
1. Simply open `index.html` in a web browser
2. No server required for basic functionality

### Web Server Deployment
1. Upload all files to your web server
2. Ensure proper MIME types for CSS and JS files
3. Access via your domain/index.html

### GitHub Pages
1. Create a new repository
2. Upload all files
3. Enable GitHub Pages in repository settings
4. Access via your GitHub Pages URL

## Troubleshooting

### Data Not Saving
- Check if localStorage is enabled in your browser
- Clear browser cache and reload
- Check browser console for JavaScript errors

### Images Not Loading
- Verify image URLs are accessible
- Check for CORS issues with external images
- Use placeholder images if originals fail

### Styling Issues
- Clear browser cache
- Check for CSS syntax errors in browser console
- Verify all CSS files are loading properly

## Support

This is a standalone HTML/CSS/JavaScript application that doesn't require any external dependencies or server-side components. All functionality works entirely in the browser using modern web standards.
