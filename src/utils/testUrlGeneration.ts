import { createSlug, createSlugWithId, createParkingMeterSlug, createTruckSlug } from './slug.js';

// Test event slug generation (new format without ID)
const eventSlug = createSlug('Test Event', 'Test Venue');
console.log('Event slug (new format):', eventSlug);
console.log('Event URL (new format):', `/events/${eventSlug}`);

// Test event slug generation (old format with ID)
const eventSlugWithId = createSlugWithId('Test Event', 'Test Venue', 3070);
console.log('Event slug (old format):', eventSlugWithId);
console.log('Event URL (old format):', `/events/${eventSlugWithId}`);

// Test parking meter slug generation
const parkingMeterSlug = createParkingMeterSlug({
    METER_NO: 123,
    STREET: 'Main Street',
    SUBURB: 'Brisbane City'
});
console.log('Parking meter slug:', parkingMeterSlug);
console.log('Parking meter URL:', `/parking-meters/${parkingMeterSlug}`);

// Test food truck slug generation
const foodTruckSlug = createTruckSlug(456, 'Tasty Food Truck');
console.log('Food truck slug:', foodTruckSlug);
console.log('Food truck URL:', `/food-trucks/${foodTruckSlug}`); 