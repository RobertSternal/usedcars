# UsedCars - Premium Car Marketplace

UsedCars is a modern, feature-rich car marketplace built with Next.js 15, TypeScript, and Tailwind CSS 4. This platform allows users to browse, search, and filter used cars, as well as list their own vehicles for sale.

## Features

- **Responsive Design**: Fully responsive UI that works on all devices
- **Car Browsing**: Browse through a catalog of used cars with filtering options
- **Car Finder**: Tinder-like swiping interface to discover cars
- **Detailed Car Pages**: Comprehensive information about each vehicle
- **Sell Your Car**: Form to list your vehicle for sale
- **Modern UI**: Beautiful, professional automotive-themed design

## Tech Stack

- **Framework**: Next.js 15.3.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.3
- **CSS Processing**: PostCSS 8.5.3
- **Font**: Geist (from Vercel)

## Project Structure

```
src/
├── app/                  # Next.js app router pages
│   ├── about/            # About us page
│   ├── browse/           # Car browsing page with filters
│   ├── cars/[id]/        # Dynamic car detail pages
│   ├── discover/         # Car finder (Tinder-like) page
│   ├── sell/             # Sell your car page
│   ├── globals.css       # Global CSS with Tailwind directives
│   ├── layout.tsx        # Root layout with Navbar and Footer
│   └── page.tsx          # Homepage
├── components/           # Reusable components
│   ├── CarCard.tsx       # Car card component for listings
│   ├── CarFilter.tsx     # Filter component for browse page
│   ├── CarSwiper.tsx     # Tinder-like swiper component
│   ├── Footer.tsx        # Site footer
│   ├── HeroSection.tsx   # Hero section for homepage
│   └── Navbar.tsx        # Site navigation
└── lib/                  # Utility functions and shared code
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Image Assets

The application references various image assets that should be placed in the `/public` directory. See the `/public/README.md` file for a detailed list of required images.

## Pages

### Home Page
- Hero section with search functionality
- Featured cars section
- Popular brands section
- Why choose us section
- Testimonials
- Call-to-action section

### Browse Page
- Comprehensive filtering options
- Grid view of available cars
- Sorting functionality
- Pagination

### Car Finder (Discover) Page
- Tinder-like swiping interface
- Detailed car information
- Like/dislike functionality
- How it works section

### Car Detail Page
- Multiple car images
- Comprehensive vehicle information
- Technical specifications
- Features list
- Seller information
- Similar cars section

### Sell Your Car Page
- Multi-section form
- Vehicle information inputs
- Photo upload section
- Seller information
- Success stories

### About Us Page
- Company story and mission
- Team information
- Statistics and achievements
- Contact information

## Customization

You can customize the application by:

1. Modifying the car data in each page file
2. Updating the styling by editing Tailwind classes
3. Adding or removing features from components
4. Replacing placeholder images with real car photos

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
