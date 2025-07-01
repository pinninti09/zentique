#!/bin/bash

# Heroku Deployment Script for Atelier Store
# Run with: chmod +x deploy-heroku.sh && ./deploy-heroku.sh

echo "🎨 Deploying Atelier Store to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it from https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in
if ! heroku auth:whoami &> /dev/null; then
    echo "🔑 Please login to Heroku first:"
    heroku login
fi

# Get app name from user
read -p "Enter your Heroku app name (or press Enter for auto-generated): " APP_NAME

# Create Heroku app
if [ -z "$APP_NAME" ]; then
    echo "🚀 Creating Heroku app with auto-generated name..."
    heroku create
else
    echo "🚀 Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
fi

# Set NODE_ENV
echo "⚙️ Setting NODE_ENV=production..."
heroku config:set NODE_ENV=production

# Environment variables setup
echo ""
echo "📋 Please provide the following environment variables:"

read -p "Database URL (from Neon): " DATABASE_URL
heroku config:set DATABASE_URL="$DATABASE_URL"

read -p "Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
heroku config:set CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME"

read -p "Cloudinary API Key: " CLOUDINARY_API_KEY
heroku config:set CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY"

read -s -p "Cloudinary API Secret: " CLOUDINARY_API_SECRET
echo ""
heroku config:set CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET"

read -s -p "Admin Token (secure password): " ADMIN_TOKEN
echo ""
heroku config:set ADMIN_TOKEN="$ADMIN_TOKEN"

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Heroku deployment"
fi

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy Atelier store to Heroku" || echo "No changes to commit"

# Add heroku remote if it doesn't exist
if ! git remote | grep -q heroku; then
    heroku git:remote
fi

git push heroku main

# Open the app
echo "✅ Deployment complete!"
echo "🌍 Opening your app..."
heroku open

echo ""
echo "🎉 Your Atelier store is now live on Heroku!"
echo "📊 Monitor with: heroku logs --tail"
echo "🏥 Health check: https://$(heroku info -s | grep web_url | cut -d= -f2)/health"