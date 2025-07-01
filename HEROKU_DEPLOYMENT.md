# Heroku Deployment Guide

## 🚀 Deploy Your Atelier Store to Heroku

Your painting store is ready for Heroku deployment with all production optimizations in place.

## Prerequisites

1. **Heroku CLI installed** - Download from https://devcenter.heroku.com/articles/heroku-cli
2. **Git repository** - Your code should be in a Git repo
3. **Heroku account** - Free tier available at https://heroku.com

## Quick Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App
```bash
heroku create your-atelier-store
# Replace 'your-atelier-store' with your preferred app name
```

### 3. Set Environment Variables
```bash
# Required production variables
heroku config:set NODE_ENV=production

# Database (use your existing Neon database)
heroku config:set DATABASE_URL=your_neon_database_url

# Cloudinary configuration
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret

# Admin security
heroku config:set ADMIN_TOKEN=your_secure_admin_token
```

### 4. Deploy to Heroku
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 5. Open Your App
```bash
heroku open
```

## Environment Variables Setup

Get these values and set them in Heroku:

### Database URL (Neon)
- Log into your Neon dashboard
- Copy the connection string
- Set with: `heroku config:set DATABASE_URL=postgresql://...`

### Cloudinary Credentials
- Log into your Cloudinary dashboard
- Find these in Account Details:
  - Cloud name
  - API Key
  - API Secret

### Admin Token
- Generate a secure random string
- Use a password generator or: `openssl rand -hex 32`

## Heroku-Specific Configuration

The following files are already configured for Heroku:

### ✅ Procfile
```
web: npm start
```

### ✅ Production Scripts (package.json)
```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### ✅ Security Features Active
- Helmet.js security headers
- Rate limiting
- Compression
- Error handling
- Health checks at `/health`

## Post-Deployment Verification

1. **Check health**: Visit `https://your-app.herokuapp.com/health`
2. **Test gallery**: Browse paintings and add to cart
3. **Test corporate**: Check corporate gifting section
4. **Admin access**: Test admin panel functionality

## Monitoring & Logs

```bash
# View application logs
heroku logs --tail

# Check app status
heroku ps

# View config variables
heroku config
```

## Database Migration

Your database schema is automatically managed by Drizzle ORM. The app will initialize required tables on first run.

## Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add www.yourdomain.com

# Configure SSL
heroku certs:auto:enable
```

## Scaling (If Needed)

```bash
# Scale to multiple dynos
heroku ps:scale web=2

# Check current scaling
heroku ps
```

## Cost Estimation

### Free Tier Includes:
- 550-1000 dyno hours per month
- Custom domain support
- SSL certificates

### Paid Features:
- Additional dyno hours: ~$7/month per dyno
- Database: Using external Neon (separate billing)
- Custom domains with SSL: Free on paid plans

## Troubleshooting

### Common Issues:

1. **Build failures**: Check Node.js version compatibility
2. **Database connection**: Verify DATABASE_URL is set correctly
3. **Images not loading**: Confirm Cloudinary credentials
4. **Admin not working**: Check ADMIN_TOKEN is set

### Debug Commands:
```bash
heroku logs --tail --app your-app-name
heroku restart --app your-app-name
heroku config --app your-app-name
```

## Production Monitoring

Your app includes:
- Health check endpoint: `/health`
- Error logging with timestamps
- Rate limiting with headers
- Security headers for protection

Monitor these in Heroku dashboard or logs.

## Backup Strategy

- **Database**: Neon handles automatic backups
- **Images**: Cloudinary provides redundant storage
- **Code**: Git repository serves as code backup

Your Atelier store is production-ready for Heroku deployment!