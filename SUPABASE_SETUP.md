# Supabase Setup Instructions

## 🚀 Quick Setup

### 1. Database Setup
1. Go to your Supabase project: https://hesycproljmuaimqcptn.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the entire content from `database-schema.sql`
4. Click **Run** to execute the SQL commands

### 2. Security Configuration
The database is configured with Row Level Security (RLS) for maximum protection:

- **Public Access**: Anyone can view products and companies
- **Admin Access**: Only authenticated users can add/edit/delete data
- **Data Validation**: All inputs are sanitized and validated
- **SQL Injection Protection**: Parameterized queries prevent SQL injection
- **XSS Protection**: HTML content is sanitized

### 3. Admin Panel Access
- **URL**: `https://hakimigg.github.io/au/admin.html`
- **Username**: `admin`
- **Password**: `admin123`

### 4. Features
✅ **Real-time sync** with Supabase database  
✅ **Offline support** with automatic sync when back online  
✅ **Input validation** and sanitization  
✅ **Error handling** with user-friendly messages  
✅ **Secure CRUD operations**  
✅ **Data persistence** across sessions  

### 5. Database Tables Created
- **companies**: Stores company information
- **products**: Stores product details with foreign key to companies
- **Indexes**: Optimized for fast queries
- **Triggers**: Automatic timestamp updates

### 6. Security Features
- Row Level Security (RLS) enabled
- Input sanitization prevents XSS attacks
- Parameterized queries prevent SQL injection
- Validation for all data types
- Secure ID generation
- Error handling without exposing sensitive information

### 7. Offline Support
- Data cached in localStorage
- Automatic sync when connection restored
- Queue system for offline operations
- Graceful fallback to local data

## 🔧 Troubleshooting

### If data doesn't load:
1. Check browser console for errors
2. Verify Supabase URL and key in `supabase-config.js`
3. Ensure database schema was created successfully
4. Check network connection

### If admin operations fail:
1. Verify RLS policies are created
2. Check that tables exist in Supabase
3. Ensure proper authentication

## 📊 Database Schema

```sql
companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    logo TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT REFERENCES companies(id),
    price DECIMAL(10,2) CHECK (price >= 0),
    stock INTEGER CHECK (stock >= 0),
    description TEXT,
    photos JSONB,
    tags JSONB,
    specs JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

Your website is now fully integrated with Supabase! 🎉
