/**
 * Mock data for Nags Head Inn, Garthmyl
 *
 * This data will be replaced by Venue Manager API responses in V2.
 * Structure mirrors expected API response shapes.
 */

import {
  VenueInfo,
  OpeningHours,
  Menu,
  Accommodation,
  Attraction,
  GalleryImage,
  PageContent,
} from '@/types'

// =============================================================================
// VENUE INFO
// =============================================================================

export const mockVenueInfo: VenueInfo = {
  name: 'The Nags Head Inn',
  tagline: 'A Grade 2 listed former coaching inn',
  description:
    'Nestled in the heart of Garthmyl, Montgomery, The Nags Head Inn is a beautiful Grade 2 listed former coaching inn offering award-winning dining and luxury accommodation.',
  address: {
    line1: 'Garthmyl',
    town: 'Montgomery',
    county: 'Powys',
    postcode: 'SY15 6RS',
    country: 'Wales',
  },
  contact: {
    phone: '01686 640 600',
    email: 'info@nagsheadgarthmyl.co.uk',
    bookingEmail: 'reservations@nagsheadgarthmyl.co.uk',
  },
  social: {
    facebook: 'https://www.facebook.com/nagsheadgarthmyl',
    instagram: 'https://www.instagram.com/nagsheadgarthmyl',
  },
  awards: [
    {
      name: 'Rosette',
      body: 'AA',
      rating: 'Rosette for Culinary Excellence',
    },
    {
      name: '5 Star Accommodation',
      body: 'AA',
      rating: '5 stars',
    },
    {
      name: '5 Star Accommodation',
      body: 'Visit Wales',
      rating: '5 stars',
    },
  ],
}

// =============================================================================
// OPENING HOURS
// =============================================================================

export const mockOpeningHours: OpeningHours = {
  regular: [
    {
      day: 'monday',
      isClosed: true,
    },
    {
      day: 'tuesday',
      isClosed: true,
    },
    {
      day: 'wednesday',
      isClosed: false,
      periods: [
        { open: '12:00', close: '14:30', label: 'Lunch' },
        { open: '18:00', close: '21:00', label: 'Dinner' },
      ],
    },
    {
      day: 'thursday',
      isClosed: false,
      periods: [
        { open: '12:00', close: '14:30', label: 'Lunch' },
        { open: '18:00', close: '21:00', label: 'Dinner' },
      ],
    },
    {
      day: 'friday',
      isClosed: false,
      periods: [
        { open: '12:00', close: '14:30', label: 'Lunch' },
        { open: '18:00', close: '21:00', label: 'Dinner' },
      ],
    },
    {
      day: 'saturday',
      isClosed: false,
      periods: [
        { open: '12:00', close: '14:30', label: 'Lunch' },
        { open: '18:00', close: '21:00', label: 'Dinner' },
      ],
    },
    {
      day: 'sunday',
      isClosed: false,
      periods: [{ open: '12:00', close: '16:00', label: 'Sunday Lunch' }],
    },
  ],
  specialClosures: [
    {
      date: '2025-12-25',
      reason: 'Christmas Day',
      isClosed: true,
    },
    {
      date: '2025-12-26',
      reason: 'Boxing Day',
      isClosed: true,
    },
  ],
}

// =============================================================================
// MENUS
// =============================================================================

export const mockMenus: Menu[] = [
  {
    id: 'menu-lunch',
    name: 'Lunch Menu',
    slug: 'lunch',
    description: 'Served Wednesday to Saturday, 12pm - 2:30pm',
    isActive: true,
    isEvent: false,
    sortOrder: 1,
    sections: [
      {
        id: 'lunch-starters',
        name: 'Starters',
        sortOrder: 1,
        items: [
          {
            id: 'item-1',
            name: 'Soup of the Day',
            description: 'Served with crusty bread and Welsh butter',
            price: 6.95,
            dietaryTags: ['vegetarian'],
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-2',
            name: 'Welsh Rarebit',
            description: 'Traditional recipe with local ale and mature cheddar',
            price: 7.5,
            dietaryTags: ['vegetarian'],
            isAvailable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        id: 'lunch-mains',
        name: 'Mains',
        sortOrder: 2,
        items: [
          {
            id: 'item-3',
            name: 'Beer Battered Fish & Chips',
            description: 'Fresh haddock, hand-cut chips, mushy peas, tartare sauce',
            price: 15.95,
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-4',
            name: 'Nags Head Burger',
            description: 'Welsh beef patty, smoked bacon, cheese, brioche bun, skinny fries',
            price: 14.95,
            isAvailable: true,
            sortOrder: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'menu-evening',
    name: 'Evening Menu',
    slug: 'evening',
    description: 'Served Wednesday to Saturday, 6pm - 9pm',
    isActive: true,
    isEvent: false,
    sortOrder: 2,
    sections: [
      {
        id: 'eve-starters',
        name: 'Starters',
        sortOrder: 1,
        items: [
          {
            id: 'item-5',
            name: 'Pan-Seared Scallops',
            description: 'With black pudding, pea purée and crispy pancetta',
            price: 12.95,
            dietaryTags: ['gluten-free'],
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-6',
            name: 'Game Terrine',
            description: 'With red onion marmalade and toasted brioche',
            price: 9.95,
            isAvailable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        id: 'eve-mains',
        name: 'Mains',
        sortOrder: 2,
        items: [
          {
            id: 'item-7',
            name: 'Welsh Lamb Rump',
            description: 'Dauphinoise potatoes, seasonal vegetables, rosemary jus',
            price: 24.95,
            dietaryTags: ['gluten-free'],
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-8',
            name: 'Pan-Roasted Sea Bass',
            description: 'Crushed new potatoes, samphire, lemon butter sauce',
            price: 22.95,
            dietaryTags: ['gluten-free'],
            isAvailable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        id: 'eve-desserts',
        name: 'Desserts',
        sortOrder: 3,
        items: [
          {
            id: 'item-9',
            name: 'Sticky Toffee Pudding',
            description: 'With toffee sauce and vanilla ice cream',
            price: 7.95,
            dietaryTags: ['vegetarian'],
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-10',
            name: 'Welsh Cheese Board',
            description: 'Selection of local cheeses, crackers, chutney',
            price: 9.95,
            dietaryTags: ['vegetarian', 'gluten-free'],
            isAvailable: true,
            sortOrder: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'menu-sunday',
    name: 'Sunday Lunch',
    slug: 'sunday',
    description: 'Served Sundays, 12pm - 4pm. Booking recommended.',
    isActive: true,
    isEvent: false,
    sortOrder: 3,
    sections: [
      {
        id: 'sunday-roasts',
        name: 'Roasts',
        description: 'All roasts served with Yorkshire pudding, roast potatoes, seasonal vegetables and gravy',
        sortOrder: 1,
        items: [
          {
            id: 'item-11',
            name: 'Roast Beef',
            description: 'Welsh sirloin, slow-roasted',
            price: 18.95,
            dietaryTags: ['gluten-free'],
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-12',
            name: 'Roast Lamb',
            description: 'Local leg of lamb with mint sauce',
            price: 18.95,
            dietaryTags: ['gluten-free'],
            isAvailable: true,
            sortOrder: 2,
          },
          {
            id: 'item-13',
            name: 'Nut Roast',
            description: 'With vegetarian gravy',
            price: 15.95,
            dietaryTags: ['vegetarian', 'vegan'],
            isAvailable: true,
            sortOrder: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'menu-mothers-day-2025',
    name: "Mother's Day Menu 2025",
    slug: 'mothers-day-2025',
    description: 'Treat Mum to a special lunch at The Nags Head. Booking essential.',
    isActive: false, // Would be set to true closer to the date
    isEvent: true,
    eventDateRange: {
      start: '2025-03-30',
      end: '2025-03-30',
    },
    sortOrder: 10,
    sections: [
      {
        id: 'md-menu',
        name: 'Set Menu',
        description: '3 courses - £39.95 per person',
        sortOrder: 1,
        items: [
          {
            id: 'item-md-1',
            name: 'Starter',
            description: 'Choice of soup, prawn cocktail, or chicken liver pâté',
            isAvailable: true,
            sortOrder: 1,
          },
          {
            id: 'item-md-2',
            name: 'Main',
            description: 'Roast beef, roast chicken, or pan-fried salmon',
            isAvailable: true,
            sortOrder: 2,
          },
          {
            id: 'item-md-3',
            name: 'Dessert',
            description: 'Chocolate torte, lemon posset, or cheese board',
            isAvailable: true,
            sortOrder: 3,
          },
        ],
      },
    ],
  },
]

// =============================================================================
// ACCOMMODATION
// =============================================================================

export const mockAccommodation: Accommodation = {
  description:
    'The Nags Head offers 8 beautifully appointed en-suite bedrooms, each individually designed with Laura Ashley furnishings. Awarded 5 stars by both AA and Visit Wales, our rooms provide the perfect base for exploring the stunning Welsh countryside.',
  bookingUrl: 'https://via.eviivo.com/NagsHeadInnSY15',
  bookingEmail: 'reservations@nagsheadgarthmyl.co.uk',
  features: [
    'Free WiFi',
    'Pet-friendly rooms available',
    'En-suite bathrooms',
    'Tea & coffee making facilities',
    'Full Welsh breakfast included',
    'Free on-site parking',
  ],
  awards: [
    { name: '5 Star', body: 'AA', rating: '5 stars' },
    { name: '5 Star', body: 'Visit Wales', rating: '5 stars' },
  ],
  rooms: [
    {
      id: 'room-1',
      name: 'The Montgomery',
      description: 'Spacious double room with views over the garden. Features a king-size bed and large en-suite bathroom with roll-top bath.',
      type: 'double',
      sleeps: 2,
      features: ['King-size bed', 'Garden view', 'Roll-top bath', 'Seating area'],
      images: [],
      isAvailable: true,
      sortOrder: 1,
    },
    {
      id: 'room-2',
      name: 'The Powis',
      description: 'Elegant double room decorated in classic Laura Ashley style. Perfect for couples seeking a romantic getaway.',
      type: 'double',
      sleeps: 2,
      features: ['King-size bed', 'En-suite shower', 'Countryside view'],
      images: [],
      isAvailable: true,
      sortOrder: 2,
    },
    {
      id: 'room-3',
      name: 'The Vyrnwy',
      description: 'A comfortable twin room ideal for friends or family. Can be configured as a super-king double on request.',
      type: 'twin',
      sleeps: 2,
      features: ['Twin beds / Super-king option', 'En-suite shower', 'Pet-friendly'],
      images: [],
      isAvailable: true,
      sortOrder: 3,
    },
  ],
}

// =============================================================================
// ATTRACTIONS
// =============================================================================

export const mockAttractions: Attraction[] = [
  {
    id: 'attr-1',
    name: 'Montgomeryshire Canal',
    description:
      'Just 20 yards from our front door, the Montgomeryshire Canal offers beautiful towpath walks and is a haven for wildlife.',
    distance: '20 yards',
    category: 'nature',
    sortOrder: 1,
  },
  {
    id: 'attr-2',
    name: 'Powis Castle',
    description:
      'A medieval castle with stunning gardens, world-famous collections and breathtaking views. Managed by the National Trust.',
    distance: '8 miles',
    websiteUrl: 'https://www.nationaltrust.org.uk/powis-castle-and-garden',
    category: 'heritage',
    sortOrder: 2,
  },
  {
    id: 'attr-3',
    name: 'Lake Vyrnwy',
    description:
      'A stunning reservoir surrounded by hills and forest. Perfect for walking, cycling, bird watching and water sports.',
    distance: '25 miles',
    websiteUrl: 'https://www.lakevyrnwy.com',
    category: 'nature',
    sortOrder: 3,
  },
  {
    id: 'attr-4',
    name: 'Montgomery Town',
    description:
      'A charming Georgian market town with independent shops, castle ruins and excellent walking routes.',
    distance: '3 miles',
    category: 'heritage',
    sortOrder: 4,
  },
  {
    id: 'attr-5',
    name: "Offa's Dyke Path",
    description:
      'The famous 177-mile National Trail runs nearby, offering fantastic walking through the Welsh Marches.',
    category: 'activities',
    sortOrder: 5,
  },
]

// =============================================================================
// GALLERY
// =============================================================================

export const mockGallery: GalleryImage[] = [
  {
    id: 'img-1',
    src: '/images/exterior-front.jpg',
    alt: 'The Nags Head Inn exterior',
    caption: 'Our Grade 2 listed coaching inn',
    category: 'exterior',
    sortOrder: 1,
  },
  {
    id: 'img-2',
    src: '/images/restaurant-interior.jpg',
    alt: 'The restaurant dining room',
    caption: 'Our light and airy dining room',
    category: 'restaurant',
    sortOrder: 2,
  },
  {
    id: 'img-3',
    src: '/images/bedroom-montgomery.jpg',
    alt: 'The Montgomery room',
    caption: 'The Montgomery - our premium double room',
    category: 'rooms',
    sortOrder: 3,
  },
]

// =============================================================================
// PAGE CONTENT
// =============================================================================

export const mockPageContent: Record<string, PageContent> = {
  restaurant: {
    title: 'Restaurant',
    subtitle: 'Award-winning dining in the heart of Wales',
    sections: [
      {
        id: 'rest-intro',
        title: 'A Beautiful Setting',
        content:
          'Our restaurant is a beautiful, light and airy room featuring oak furnishings with doors leading out to the garden patio. The perfect setting for a relaxed lunch or memorable evening meal.',
        layout: 'image-right',
        sortOrder: 1,
      },
      {
        id: 'rest-food',
        title: 'Local, Quality, Homemade',
        content:
          'We take pride in sourcing the finest local ingredients from trusted Welsh suppliers. Our AA Rosette-awarded kitchen creates dishes that celebrate the best of the region, from Welsh lamb and beef to fresh seasonal vegetables from nearby farms.',
        layout: 'image-left',
        sortOrder: 2,
      },
    ],
  },
  explore: {
    title: 'Explore the Area',
    subtitle: 'Discover the beauty of the Welsh Marches',
    sections: [
      {
        id: 'explore-intro',
        content:
          'The Nags Head is perfectly situated for exploring the stunning Welsh countryside and historic border towns. Whether you enjoy walking, cycling, heritage sites or simply beautiful scenery, there is something for everyone.',
        layout: 'text-only',
        sortOrder: 1,
      },
    ],
  },
}
