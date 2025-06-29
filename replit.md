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

## Recent Changes

- June 29, 2025: **NEW** - Promotional Banner System
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