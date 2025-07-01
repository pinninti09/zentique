# Atelier - Painting Store

## Overview

Atelier is a full-stack painting gallery application built with React, Express.js, and TypeScript. The application serves as an e-commerce platform for showcasing and selling paintings, featuring a clean and elegant user interface with admin management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system and Radix UI components
- **Component Library**: Custom UI components built on top of Radix UI primitives
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **API Design**: RESTful API with JSON responses
- **File Uploads**: Multer for handling image uploads
- **Development**: Hot module replacement via Vite integration

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database
- **Schema**: Defined in shared TypeScript files for full-stack type safety
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations

## Key Components

### Frontend Pages
- **Gallery**: Main page displaying paintings with search, sort, and filtering capabilities
- **Cart**: Shopping cart with quantity management and checkout interface
- **Admin**: Administrative panel for managing paintings and uploads
- **404**: Custom not-found page

### Backend Routes
- **Public Routes**:
  - `GET /api/paintings` - Fetch all paintings
  - `GET /api/paintings/:id` - Fetch specific painting
- **Cart Routes**:
  - `GET /api/cart/:sessionId` - Fetch cart items for session
  - `POST /api/cart` - Add item to cart
  - `PUT /api/cart/:sessionId/:paintingId` - Update cart item quantity
  - `DELETE /api/cart/:sessionId/:paintingId` - Remove item from cart
- **Admin Routes**:
  - `POST /api/admin/paintings` - Upload new painting (with authentication)

### Database Schema
- **Paintings Table**: Stores painting metadata (title, description, price, images, etc.)
- **Cart Items Table**: Manages shopping cart state per session
- **Users Table**: Basic user management structure

## Data Flow

1. **Frontend Request**: User interactions trigger API calls via TanStack Query
2. **Route Handling**: Express.js routes process requests and validate data
3. **Data Layer**: Storage interface abstracts database operations
4. **Response**: JSON responses sent back to frontend
5. **State Update**: TanStack Query updates local cache and triggers re-renders

## External Dependencies

### UI Framework
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Backend Services
- **Neon Database**: Serverless PostgreSQL database
- **Multer**: File upload handling middleware

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and enhanced developer experience
- **Drizzle Kit**: Database migration and schema management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express.js backend
- **Hot Reload**: Full-stack hot module replacement
- **Type Safety**: Shared TypeScript types between frontend and backend

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Deployment**: Suitable for platforms like Replit, Vercel, or traditional hosting

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Environment Variables**: Database connection via `DATABASE_URL`
- **Session Management**: Session-based cart storage without user authentication

## User Preferences

Preferred communication style: Simple, everyday language.

## Checkpoint: gallery-complete (June 30, 2025)
**Stable release point with full functionality working**

## Checkpoint: corporate-sales-completed (June 30, 2025)
**Stable release point with dual-purpose platform complete - art gallery and corporate gifting with comprehensive admin management**

## Checkpoint: going-for-footer (June 30, 2025)
**Stable release point before implementing comprehensive footer pages for both gallery and corporate sections**

## Checkpoint: footer-pages-complete (June 30, 2025)
**Stable release point with comprehensive footer navigation system implemented - 12 professional pages with full routing and content**

## Recent Changes

- July 1, 2025: **NEW** - Admin Panel Restructured to Linear Layout
  - Replaced tabbed interface with linear scrolling layout grouped by business function
  - Gallery Management section (blue theme): Analytics, Upload Painting, Banner Management
  - Corporate Gifting Management section (purple theme): Analytics, Upload Gift, Banner Management, Recent Orders
  - All sections maintain collapsible functionality with smooth height transitions
  - Improved admin workflow with visual section dividers and color-coded organization
  - Single continuous scrolling interface for managing both gallery and corporate operations

- July 1, 2025: **PRODUCTION READY** - Complete Production Security and Performance Implementation
  - Added comprehensive security middleware: Helmet.js, rate limiting, CSP headers
  - Implemented tiered rate limiting: 1000 general, 500 API, 100 admin requests per 15min
  - Added production error handling with secure responses and detailed logging
  - Created health check endpoint (/health) for load balancer monitoring
  - Added compression middleware for optimized response delivery
  - Configured trust proxy settings for proper forwarded header handling
  - Enhanced production build scripts and deployment documentation
  - All security headers active: HSTS, XSS protection, frame options, content type options
  - Application ready for immediate production deployment on any platform

- July 1, 2025: **FIXED** - Restored Full E-commerce Functionality with Database Persistence
  - Implemented missing cart methods in DatabaseStorage class for complete shopping cart functionality
  - Fixed cart operations: add to cart, update quantities, remove items, clear cart - all with database persistence
  - Restored wishlist functionality with proper UUID generation and error handling
  - Implemented availability notifications system with database storage
  - All cart and wishlist operations work seamlessly with proper quantity management and duplicate handling
  - Cart and wishlist data persists across server restarts and integrates with existing session management
  - Fixed corporate gifts display to fetch from database instead of hardcoded fallback data
  - Full e-commerce workflow now operational: browse → add to cart → wishlist → persistent storage

- June 30, 2025: **NEW** - Database Persistence for Paintings
  - Implemented DatabaseStorage class to replace MemStorage for painting data
  - Paintings now persist permanently in PostgreSQL database across server restarts
  - Fixed data loss issue where uploaded paintings were lost on server reload
  - Maintained backward compatibility with existing API endpoints
  - Sample paintings load from database with fallback to static data if needed
  - Cloudinary integration preserved for image storage while data is stored in Neon database

- June 30, 2025: **NEW** - Extended Cloudinary Integration to Corporate Gifts
  - Added file upload capability to corporate gift form in admin panel
  - Created API endpoint `/api/admin/corporate-gifts` with Cloudinary integration
  - Updated corporate gift form with dual input options (URL or file upload)
  - Configured automatic image optimization for corporate gift uploads to dedicated folder
  - Added proper form validation and error handling for corporate gift uploads
  - Both Gallery paintings and Corporate gifts now support production-ready file uploads

- June 30, 2025: **NEW** - Hybrid Architecture with Cloudinary Integration
  - Implemented production-ready hybrid architecture with Neon PostgreSQL for data and Cloudinary for images
  - Added Cloudinary configuration with automatic image optimization and CDN delivery
  - Created separate storage folders for paintings and artist photos with optimized transformations
  - Updated admin panel with file upload capabilities alongside URL inputs
  - Added painting image upload (10MB limit, 1200x900 optimization) and artist photo upload (5MB limit, 400x400 with face detection)
  - Enhanced production scalability with 25GB free image storage and global CDN performance
  - Maintains existing database structure while enabling unlimited high-resolution artwork storage

- June 30, 2025: **NEW** - Artists Page Implementation
  - Created comprehensive Artists page accessible via `/artists` route
  - Displays all artists with professional photos, biographical information, birth years, and awards
  - Groups paintings by artist showing featured works for each artist
  - Includes hover effects and navigation to individual artworks
  - Professional layout with artist statistics and "View All Works" functionality
  - Integrated into footer navigation system for complete artist discovery experience

- June 30, 2025: **NEW** - Comprehensive Footer Pages Implementation
  - Created 12 complete footer pages with professional content and beautiful designs
  - Gallery footer pages: About, Customer Care, Shipping Info, Returns, Care Instructions, Contact
  - Corporate footer pages: Corporate Solutions, Bulk Orders, Custom Branding, Enterprise, Volume Pricing, Corporate Returns, Customization, Account Manager
  - Added full routing system with proper navigation using wouter Link components
  - Each page features detailed information, pricing tiers, process workflows, and call-to-action sections
  - All pages maintain consistent branding with Montserrat font and warm beige background
  - Updated footer links to navigate to actual functional pages instead of placeholder anchors

- June 30, 2025: **NEW** - Footer Text Contrast Enhancement
  - Fixed footer text visibility issues by changing background from `bg-charcoal` to `bg-gray-900`
  - Enhanced text contrast with `text-white` headings and `text-gray-200` body text for better readability
  - Updated copyright text to `text-gray-300` for improved visibility
  - Applied consistent contrast improvements to both Gallery and Corporate Gifting footers
  - Ensured all footer sections (Quick Links, Business Support, Connect) are clearly visible

- June 30, 2025: **NEW** - Visual Design Enhancement
  - Changed website background from white to warm light beige for elegant appearance
  - Added stunning "Sunset Over the Ocean" background image to both introduction sections
  - Made hero sections full-width with screen overflow for dramatic visual impact
  - Enhanced text with white styling and drop shadows for readability over images
  - Expanded introduction text width for better visual balance
  - Added Montserrat font family for distinctive brand elements
  - Updated "ATELIER" and "CORPORATE GIFTING" to use uppercase styling with Montserrat font
  - Applied brand font to all navigation items and main page headings
  - Enhanced visual consistency across both gallery and corporate sections

- June 30, 2025: **NEW** - Corporate Sales Overview Tab in Admin Panel
  - Added tabbed interface to admin panel with Gallery Management and Corporate Sales sections
  - Implemented comprehensive corporate metrics dashboard showing revenue, orders, and client tracking
  - Created recent corporate orders section with collapsible functionality and order status tracking
  - Added performance insights highlighting peak seasons, bulk order success, and growth opportunities
  - Included top corporate products analytics showing best-selling items and revenue breakdown
  - Enhanced admin workflow with dual-purpose management for both art gallery and corporate gifting operations

- June 30, 2025: **NEW** - Enhanced Admin Panel with Artist Information
  - Added comprehensive artist fields to painting upload: biography, photo URL, born year, awards/recognitions
  - Extended admin panel with corporate gift management and dual banner system
  - Created dynamic footer system that switches between gallery and corporate contexts
  - Separated banner management for gallery vs corporate promotional content
  - Implemented collapsible sections in admin panel for better organization
  - Updated Corporate Gifting page with heartfelt messaging about workplace culture and employee appreciation

- June 30, 2025: **NEW** - Corporate Gifting Page Added
  - Created dedicated Corporate Gifting page with bulk ordering functionality
  - Added navigation tab with Building2 icon before Gallery
  - Corporate product imagery (mugs, t-shirts, notebooks, water bottles, etc.)
  - Bulk quantity slider (1-500 items) replacing +/- buttons
  - No size/frame dropdowns for corporate products
  - Unique corporate banner text about business relationships
  - Same filtering/sorting as Gallery but corporate-focused
  - Integrates with existing cart and checkout system

- June 30, 2025: **COMPLETED** - Size and Frame Dropdown Functionality
  - Added comprehensive size options (Canvas Print, Framed Print, Metal Print)
  - Implemented frame options (Gallery Wrap, Black Frame, White Frame, etc.)
  - Admin panel checkboxes to control available options per painting
  - Updated database schema with availableSizes and availableFrames arrays
  - Cart system stores selected size and frame preferences
  - Updated gallery hero text with elegant new description
  - Refined navigation branding (Gallery in nav, Atelier on main page)

- June 29, 2025: **NEW** - UI Improvements, Reviews, and Admin Fixes
  - Fixed painting upload functionality with proper FormData handling and admin token authorization
  - Enhanced star ratings with bright yellow fill colors for better visibility
  - Added "Rate this artwork" button for easy access to review form
  - Fixed review display and submission system - reviews now show properly
  - Removed statistics and feature list from gallery hero section for cleaner design
  - Updated promotional banner with navy blue color scheme for better aesthetics
  - Added dynamic promotional banner at top of website
  - July 4th banner with customizable text, colors, and activation
  - Admin panel integration for easy banner management
  - User-dismissible banners with localStorage persistence
  - API endpoints for banner CRUD operations

- June 29, 2025: **COMPLETED** - Full-featured painting store with all functionality working
  - Beautiful emerald green "Add to Cart" buttons on all painting cards
  - Real-time cart updates with proper cache invalidation
  - Fixed API endpoint routing for cart functionality
  - Cart count updates immediately in navigation bar
  - Success toast notifications for user feedback

- June 29, 2025: Added comprehensive ratings and reviews system
  - Customer reviews with 5-star ratings and comments
  - Real-time rating aggregation and display on paintings
  - Reviews component with interactive star selection
  - Sample reviews data for demonstration

- June 29, 2025: Implemented wishlist functionality
  - Heart button on painting cards for adding/removing from wishlist
  - Dedicated wishlist page with painting management
  - Session-based wishlist storage
  - Navigation integration with wishlist link

- June 29, 2025: Enhanced painting cards with new features
  - Star ratings display showing average rating and review count
  - Wishlist toggle functionality with visual feedback
  - Improved Ballard Designs-inspired aesthetic

- June 29, 2025: Added availability notification system (backend ready)
  - Email notifications for sold painting availability
  - Database schema for tracking notification requests
  - API endpoints for managing notifications

## Changelog

Changelog:
- June 29, 2025. Initial setup with ratings, reviews, and wishlist features