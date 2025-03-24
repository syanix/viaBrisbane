# Via Brisbane

A comprehensive guide to Brisbane city, featuring events, accommodation options, parking meters, and food trucks.

## Features

- **Events Listing**: Browse upcoming and past events in Brisbane
- **Hotel Guide**: Find the best accommodations in Brisbane with affiliate links
- **Parking Meters**: Find parking meters throughout Brisbane
- **Food Trucks**: Discover food trucks in Brisbane

## Recent Updates

### Hotel Data Structure Improvements

We've enhanced our hotel data structure for better maintainability and display:

- **Flattened Data Structure**: Reorganized from nested objects to a flat array in `hotels.json`
- **Type-Safe Enums**: Added enum mappings for hotel categories and areas
  - `HotelCategory`: Maps codes to display names (e.g., "luxury" → "Luxury")
  - `HotelArea`: Maps location codes to readable names (e.g., "cbd" → "Brisbane CBD")
- **Improved Component Display**: Updated hotel cards to use the new enum mappings for consistent presentation
- **Enhanced Filtering**: Simplified filtering by category and location with the new structure

### Brisbane Hotels Feature

We've added a comprehensive hotel guide for Brisbane:

- **Structured Data**: JSON-based hotel information organized by location and category
- **Carousel Display**: Interactive carousels for exploring hotel options
- **Affiliate Links**: Direct links to booking sites for all listed hotels
- **Location-Based Organization**: Hotels sorted by areas like CBD, South Bank, Fortitude Valley, and more

### URL Structure Improvements

We've simplified the URL structure for event detail pages:

- **Old Format**: `/events/[EVENT_ID]/[SUBJECT]-[LOCATION]`
- **New Format**: `/events/[SUBJECT]-[LOCATION]`

This change improves:
- SEO with more readable URLs
- Database efficiency by using a dedicated slug field
- User experience with cleaner URLs

The system automatically:
- Redirects old URLs to the new format (301 redirects)
- Generates unique slugs for events with the same subject/location
- Maintains backward compatibility for existing links

### Past Events Archive

We've implemented a comprehensive solution for handling past events:

- Use query parameter approach (`?archive=true`) instead of separate URL paths
- Dynamic page titles and descriptions based on archive context
- Past event notice on expired event detail pages
- Toggle between upcoming and past events on the main events page

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Database

The application uses SQLite with Drizzle ORM. To update the database schema:

1. Modify the schema in `src/schema.ts`
2. Generate migrations:
   ```
   npm run db:generate
   ```
3. Apply migrations:
   ```
   npm run db:migrate
   ```

### Utilities

- **Slug Generation**: Use the `createSlug` function from `src/utils/slug.ts` to generate URL-friendly slugs

## Deployment

The site is deployed on Cloudflare Pages with D1 database integration.

To deploy:
1. Build the project:
   ```
   npm run build
   ```
2. Deploy to Cloudflare Pages:
   ```
   npm run deploy
   ```

## License

MIT

## 🚀 Features

- **Events System**: Browse upcoming and past events with search functionality
- **Accommodation Guide**: Find hotels, hostels, and apartments in Brisbane
- **Parking Information**: Find parking locations and availability
- **Food Trucks**: Discover food truck locations and schedules
- **Local Resources**: Access information about Brisbane facilities and services

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📦 Project Structure

```text
/
├── public/
│   ├── images/
│   └── favicon.svg
├── data/
│   ├── hotels.json
│   └── locations.json
├── src/
│   ├── assets/
│   │   └── sass/
│   │       ├── components/
│   │       │   └── _events.scss
│   │       └── main.scss
│   ├── components/
│   │   ├── events.astro
│   │   ├── HotelCard.astro
│   │   ├── HotelCarousel.astro
│   │   └── ...
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── events/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── where-to-stay/
│   │   │   ├── index.astro
│   │   │   └── brisbane-hotels.astro
│   │   └── index.astro
│   ├── types/
│   │   └── types.ts
│   └── utils/
│       ├── eventsCache.ts
│       └── slug.ts
└── package.json
```

## 🔄 Recent Updates

- **Brisbane Hotels Guide**: Added comprehensive hotel listings with interactive carousels
- **Events Archive System**: Implemented a SEO-friendly approach to viewing past events
- **Responsive Design**: Enhanced mobile experience across all pages
- **Performance Optimizations**: Improved loading times and caching strategies

## 📝 Development Notes

See [context.md](./context.md) for detailed information about project decisions, implementation details, and future plans.

## 👀 Want to learn more?

This project is built with [Astro](https://astro.build). Feel free to check [their documentation](https://docs.astro.build) for more information about the framework.

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
