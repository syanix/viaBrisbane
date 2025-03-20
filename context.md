# Via Brisbane Project Context

## NYC Tourism-Inspired Redesign

### Overview
We've implemented a comprehensive redesign of the Via Brisbane website, inspired by the NYC Tourism site. The redesign focuses on a clean, modern aesthetic with improved user experience, navigation, and visual appeal.

### Key Components

1. **New Layout System**
   - Created `Layout.astro` with improved structure and styling
   - Implemented a responsive header with "Plan Your Visit" CTA
   - Designed a four-column footer with newsletter subscription
   - Added accessibility features including skip-to-content link
   - Fixed TypeScript linter errors for proper event handling

2. **Alternative Homepage**
   - Developed `index2.astro` as a new homepage option
   - Implemented a hero carousel with rotating event banners
   - Created a category navigation grid for exploring Brisbane
   - Added sections for popular attractions with ratings
   - Included a Brisbane highlight section with call-to-action
   - Integrated latest news section with card layout
   - Added newsletter subscription section
   - Used Unsplash images to avoid 404 errors

3. **Styling Improvements**
   - Fully migrated to Tailwind CSS for consistent styling
   - Implemented a black and white color scheme with Brisbane blue accents
   - Enhanced typography using Inter and Montserrat fonts
   - Created consistent component styling for buttons, cards, and navigation
   - Added subtle animations and hover effects for interactive elements
   - Ensured responsive design across all device sizes

4. **Technical Enhancements**
   - Fixed TypeScript linter errors in JavaScript components
   - Implemented vanilla JavaScript for carousel functionality
   - Ensured proper type safety in event handlers
   - Added accessibility features throughout the site
   - Optimized images for web performance

### Next Steps
1. Apply the new design system to inner pages (events, attractions, etc.)
2. Enhance interactive elements with additional JavaScript functionality
3. Implement further accessibility improvements
4. Optimize performance for faster loading times
5. Create additional page templates following the new design system

## Events System Enhancements

### URL Structure Improvements

1. **Simplified URL Structure**
   - Changed event detail URLs from `/events/[EVENT_ID]/[SUBJECT]-[LOCATION]` to `/events/[SUBJECT]-[LOCATION]`
   - Using dedicated `slug` field in the events table for direct lookups
   - Implemented 301 redirects from old URL format to new format for SEO preservation
   - Simplified database queries by using the slug field directly
   - Preserved all existing features (booking info, social sharing, Google Maps)
   - Updated sitemap generation to use the new URL format without event IDs
   - Fixed compatibility issues with parking meters and food trucks slug generation
   - Eliminated duplicate URLs in the events sitemap
   - Updated test utilities to match new function signatures

2. **Slug Generation**
   - Updated slug creation functions to support both old and new URL formats
   - Created `createSlug` function that generates slugs without event ID
   - Maintained `createSlugWithId` for backward compatibility
   - Restored `createParkingMeterSlugByMeter` and fixed `createTruckSlugByTruck` functions
   - Slug field population is handled by a separate worker job outside this project

### Past Events Archive Implementation

We've implemented a comprehensive solution for handling past events while maintaining SEO integrity:

1. **URL Structure Preservation**
   - Maintained original URL structure for all events (/events/[slug])
   - Implemented query parameter approach (?archive=true) instead of separate URL paths
   - Ensures all existing links continue to work without redirects

2. **Event Filtering**
   - Modified `getEventsByPage()` function to conditionally include expired events
   - Added `showArchive` parameter to control event filtering
   - Events are sorted by date with ongoing events prioritized

3. **UI Enhancements**
   - Added a prominent "Past Event Notice" on expired event detail pages
   - Implemented toggle between upcoming and past events on the main events page
   - Created dedicated styling for past event notices with warning colors
   - Improved date display logic to prioritize future dates and only show past event notice when no future dates exist

4. **Intelligent Date Display**
   - Added date parsing and filtering to identify future vs. past dates
   - When future dates exist for an event series, only display upcoming dates and hide the past event notice
   - When no future dates exist, display all dates and show the past event notice
   - Special handling for ongoing events to ensure they're properly categorized

5. **Pagination Improvements**
   - Updated pagination to maintain the archive parameter across page navigation
   - Ensured search functionality preserves the archive context
   - Implemented SEO-friendly pagination with proper redirects for out-of-range pages
   - Added conditional rendering of pagination controls based on content availability
   - Enhanced page titles and descriptions with pagination information
   - Removed pagination links when no content is available to prevent empty pages
   - Standardized pagination implementation across events, food trucks, and parking meters
   - Used 302 (temporary) redirects instead of 301 (permanent) redirects to avoid caching issues with dynamic content

6. **SEO Optimizations**
   - Dynamic page titles and descriptions based on archive context
   - Added appropriate meta tags for both upcoming and past event pages
   - Implemented 302 redirects for invalid page numbers to prevent duplicate content while allowing for content changes
   - Added page numbers to titles and descriptions for paginated pages
   - Ensured consistent URL structure for better search engine indexing

### CSS Structure Improvements

1. **Dedicated Events Stylesheet**
   - Created `_events.scss` for all event-related styles
   - Properly imported in the component structure
   - Implemented responsive design for event listings

2. **Component Organization**
   - Separated event-specific styles from general components
   - Improved maintainability through modular CSS approach

### Navigation Improvements

1. **Enhanced Breadcrumbs**
   - Created dedicated `_breadcrumbs.scss` stylesheet
   - Implemented modern, visually appealing breadcrumb design
   - Added home icon for better visual hierarchy
   - Made breadcrumbs responsive for all device sizes
   - Improved accessibility with proper ARIA attributes
   - Moved breadcrumbs to their own dedicated section between banner and content
   - Aligned breadcrumbs to the left for better readability and consistency
   - Standardized breadcrumb implementation across all detail pages
   - Added subtle background color and border to the breadcrumb section for visual separation
   - Fixed flex layout to ensure proper left alignment

### Next Steps

1. **Performance Optimization**
   - Consider implementing lazy loading for event images
   - Optimize database queries for faster event retrieval

2. **Feature Enhancements**
   - Add event categories/filtering options
   - Implement event sharing functionality
   - Consider calendar view for events

3. **Data Migration**
   - Ensure all existing events have the `slug` field populated
   - Create a migration script to generate slugs for any events missing them
   - Add validation to ensure new events always have a slug generated

4. **Testing**
   - Verify SEO impact with analytics tools
   - Test performance across different devices and browsers
   - Ensure all redirects from old URLs work correctly

# UI Updates - Event Cards and Carousel

## Design Changes (2024-03-XX)
- Implemented NYC Tourism-inspired design for events section
- Updated card and carousel components to match reference design
- Removed link underlines globally
- Added Helvetica Neue as primary font family

### Component Updates
1. EventCard:
   - Standardized card heights
   - Removed shadows
   - Updated button styling
   - Added yellow date badge
   - Implemented category tags with blue/black styling

2. EventsCarousel:
   - Added slide navigation with opacity transitions
   - Implemented proper button visibility logic
   - Added hover states for navigation

# VIA BRISBANE - UI Context and Design Decisions

This document tracks key decisions made during the development of the VIA BRISBANE website, focusing on UI components, architecture, and design patterns.

## Component Architecture

### Navigation Menu
- **Desktop/Mobile Strategy**: 
  - Desktop: Traditional dropdown navigation with hover states
  - Mobile: Full-screen NYC Tourism-inspired overlay menu with right arrow indicators
- **State Management**: Using ARIA attributes to track expanded/collapsed states
- **Accessibility**: Added appropriate ARIA roles, keyboard navigation, and proper focus management
- **Mobile Behavior**:
  - Full-screen overlay menu with clean, minimal look
  - Large, bold typography with right arrows that animate on hover
  - Section dividers with consistent padding
  - Dedicated close button (X) at top right
  - Direct links to main sections instead of nested dropdowns
  - Body scroll locking to prevent background scrolling

### Card Components (EventCard, NewsSection)
- **Consistent Layout**: Standardized card design across different content types
- **Badge System**: Implemented two-badge system (category/date)
- **Hover Effects**: Border-bottom effect on "LEARN MORE" links with transition
- **Image Handling**: Proper fallbacks for missing images
- **Typography**: 
  - Titles: Bold, 2xl size with line clamping
  - Content: Clean gray-700 with line clamping to maintain consistent card heights

### Responsive Behavior
- **Breakpoint Strategy**: Primary breakpoint at md (768px)
- **Image Strategies**: Object-cover with percentage-based aspect ratios
- **Grid Layout**: Single column mobile, 3-column desktop for card sections

## Styling Decisions

### Color Palette
- **Primary Brand**: Black background with white text for navigation
- **Accent Colors**: 
  - Blue (#2073E0) for primary category badges
  - Yellow (#ffc800) for date badges
  - Black for secondary badges

### Typography
- **Font Weight Strategy**: 
  - Navigation: Bold (font-bold) for headers, larger size (text-xl/text-2xl) for mobile menu
  - Cards: Bold for headings, regular for body text
  - CTAs: Black weight (font-black) for highest emphasis

### Shadow System
- **Card Shadows**: Consistent shadow-[0px_2px_8px_rgba(0,0,0,0.1)] for subtle elevation
- **Dropdown Shadows**: shadow-lg for more pronounced elements

## Interaction Patterns

### Navigation
- **Desktop**: Traditional hover-triggered dropdowns
- **Mobile**: 
  - NYC Tourism-inspired full screen overlay
  - Horizontal right arrow indicators with hover animation
  - Direct root section links vs accordion-style submenus
  - Simplified navigation approach prioritizing main sections

### Call-to-Actions
- **Primary Style**: Blue background buttons with white text
- **Secondary Style**: Text links with arrow and border-bottom hover effect
- **Arrows**: Oversized (h-7 w-7) with slight vertical offset for alignment

## NYC Tourism Inspiration

The mobile navigation has been redesigned following key principles from the NYC Tourism site:

1. **Full-screen approach**: Replacing the partial overlay with a complete takeover for stronger visual impact
2. **Simplified hierarchy**: Presenting primary navigation options without nested dropdowns
3. **Visual cues**: Using right arrows that animate on hover to indicate navigation actions
4. **Increased typography size**: Using larger text sizes for better readability and impact
5. **Clear section dividers**: Using divide-y to clearly separate navigation sections
6. **Dedicated close button**: Adding a visible X button for more intuitive closing
7. **Additional sections**: Adding "Business in Brisbane" and language selector options to match the NYC approach

## Performance Considerations

### Image Optimization
- Using aspect ratio containers with absolute positioning for no layout shift
- Implementing lazy loading for images below the fold

### JavaScript Efficiency
- Event delegation where possible
- Passive event listeners for scroll handlers
- Throttled resize handlers
- Simpler mobile menu with fewer DOM operations

## Future Enhancement Areas

- Consider adding subtle fade-in animation for mobile menu appearance
- Add keyboard navigation support for menu items
- Consider adding "Back to top" functionality for long pages
- Evaluate adding breadcrumb navigation for inner pages 