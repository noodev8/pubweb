/*
  API Client for Venue Manager
  All API calls go through this module.
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3017';

interface ApiResponse<T = unknown> {
  return_code: string;
  message?: string;
  [key: string]: T | string | undefined;
}

async function apiCall<T>(endpoint: string, data?: object): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data || {}),
    });

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    return {
      return_code: 'NETWORK_ERROR',
      message: 'Network error - please check your connection',
    };
  }
}

// Auth
export async function login(email: string, password: string) {
  return apiCall<{ token: string; user: User }>('/api/auth/login', { email, password });
}

// Venue
export async function getVenue(venueId: number) {
  return apiCall<{ venue: Venue }>('/api/venue/get_venue', { venue_id: venueId });
}

export async function updateVenue(venueId: number, data: Partial<Venue>) {
  return apiCall('/api/venue/update_venue', { venue_id: venueId, ...data });
}

// Hours
export async function getHours(venueId: number) {
  return apiCall<{ hours: OpeningHours }>('/api/hours/get_hours', { venue_id: venueId });
}

export async function updateHours(venueId: number, data: Partial<OpeningHours>) {
  return apiCall('/api/hours/update_hours', { venue_id: venueId, ...data });
}

// Menus
export async function getMenus(venueId: number) {
  return apiCall<{ menus: Menu[] }>('/api/menus/get_menus', { venue_id: venueId });
}

export async function getMenu(menuId: number) {
  return apiCall<{ menu: Menu }>('/api/menus/get_menu', { menu_id: menuId });
}

export async function createMenu(venueId: number, data: Partial<Menu>) {
  return apiCall<{ menu_id: number }>('/api/menus/create_menu', { venue_id: venueId, ...data });
}

export async function updateMenu(menuId: number, data: Partial<Menu>) {
  return apiCall('/api/menus/update_menu', { menu_id: menuId, ...data });
}

export async function deleteMenu(menuId: number) {
  return apiCall('/api/menus/delete_menu', { menu_id: menuId });
}

// Sections
export async function createSection(menuId: number, data: Partial<MenuSection>) {
  return apiCall<{ section_id: number }>('/api/sections/create_section', { menu_id: menuId, ...data });
}

export async function updateSection(sectionId: number, data: Partial<MenuSection>) {
  return apiCall('/api/sections/update_section', { section_id: sectionId, ...data });
}

export async function deleteSection(sectionId: number) {
  return apiCall('/api/sections/delete_section', { section_id: sectionId });
}

// Items
export async function createItem(sectionId: number, data: Partial<MenuItem>) {
  return apiCall<{ item_id: number }>('/api/items/create_item', { section_id: sectionId, ...data });
}

export async function updateItem(itemId: number, data: Partial<MenuItem>) {
  return apiCall('/api/items/update_item', { item_id: itemId, ...data });
}

export async function deleteItem(itemId: number) {
  return apiCall('/api/items/delete_item', { item_id: itemId });
}

export async function toggleItemAvailability(itemId: number) {
  return apiCall<{ isAvailable: boolean }>('/api/items/toggle_availability', { item_id: itemId });
}

// Accommodation
export async function getAccommodation(venueId: number) {
  return apiCall<{ accommodation: Accommodation }>('/api/accommodation/get_accommodation', { venue_id: venueId });
}

export async function updateAccommodation(venueId: number, data: Partial<Accommodation>) {
  return apiCall('/api/accommodation/update_accommodation', { venue_id: venueId, ...data });
}

// Rooms
export async function createRoom(venueId: number, data: Partial<Room>) {
  return apiCall<{ room_id: number }>('/api/rooms/create_room', { venue_id: venueId, ...data });
}

export async function updateRoom(roomId: number, data: Partial<Room>) {
  return apiCall('/api/rooms/update_room', { room_id: roomId, ...data });
}

export async function deleteRoom(roomId: number) {
  return apiCall('/api/rooms/delete_room', { room_id: roomId });
}

// Attractions
export async function getAttractions(venueId: number) {
  return apiCall<{ attractions: Attraction[] }>('/api/attractions/get_attractions', { venue_id: venueId });
}

export async function createAttraction(venueId: number, data: Partial<Attraction>) {
  return apiCall<{ attraction_id: number }>('/api/attractions/create_attraction', { venue_id: venueId, ...data });
}

export async function updateAttraction(attractionId: number, data: Partial<Attraction>) {
  return apiCall('/api/attractions/update_attraction', { attraction_id: attractionId, ...data });
}

export async function deleteAttraction(attractionId: number) {
  return apiCall('/api/attractions/delete_attraction', { attraction_id: attractionId });
}

// Pages
export async function getPage(venueId: number, page: string) {
  return apiCall<{ pageContent: PageContent }>('/api/pages/get_page', { venue_id: venueId, page });
}

export async function updatePage(venueId: number, page: string, data: Partial<PageContent>) {
  return apiCall('/api/pages/update_page', { venue_id: venueId, page, ...data });
}

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  venue_id: number;
  venue_name: string;
}

export interface Venue {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  address: {
    line1: string;
    line2?: string;
    town: string;
    county?: string;
    postcode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    bookingEmail?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tripadvisor?: string;
  };
  awards?: Award[];
}

export interface Award {
  name: string;
  body: string;
  rating?: string;
  year?: number;
}

export interface OpeningHours {
  regular: DayHours[];
  specialClosures?: SpecialClosure[];
  specialNotice?: string;
}

export interface DayHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isClosed: boolean;
  periods?: { open: string; close: string }[];
}

export interface SpecialClosure {
  date: string;
  reason?: string;
  isClosed: boolean;
  periods?: { open: string; close: string }[];
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'regular' | 'event' | 'drinks';
  isActive: boolean;
  sortOrder: number;
  sections: MenuSection[];
  pdfUrl?: string;
  imageUrl?: string;
  eventDateRange?: {
    start: string;
    end: string;
  };
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  priceNote?: string;
  dietaryTags?: DietaryTag[];
  isAvailable: boolean;
  sortOrder: number;
  variants?: MenuItemVariant[];
}

export interface MenuItemVariant {
  id?: string;
  label: string;
  price: number;
  isDefault?: boolean;
  isAvailable?: boolean;
  sortOrder?: number;
}

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'contains-nuts'
  | 'spicy';

export interface Accommodation {
  id: string;
  description: string;
  features: string[];
  bookingUrl?: string;
  bookingEmail?: string;
  awards?: Award[];
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'single' | 'double' | 'twin' | 'suite' | 'family';
  sleeps: number;
  features: string[];
  images?: string[];
  price?: {
    from: number;
    currency: string;
  };
  isAvailable: boolean;
  sortOrder: number;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: 'heritage' | 'nature' | 'activities' | 'dining' | 'shopping' | 'transport';
  distance?: string;
  websiteUrl?: string;
  image?: string;
}

export interface PageContent {
  id: string;
  page: string;
  title?: string;
  subtitle?: string;
  sections: PageSection[];
}

export interface PageSection {
  id: string;
  title?: string;
  content: string;
  image?: string;
  layout?: 'text-only' | 'image-left' | 'image-right';
  sortOrder: number;
}
