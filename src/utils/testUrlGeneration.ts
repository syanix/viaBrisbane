import { createSlug, createParkingMeterSlug, createTruckSlug } from './slug.js';

// Test event slug generation
const eventSlug = createSlug('Test Event', 'Test Venue', 3070);
console.log('Event slug:', eventSlug);
console.log('Event URL:', `/events/${eventSlug}`);

// Test parking meter slug generation
const parkingMeterSlug = createParkingMeterSlug(123, 'Main Street', 'Brisbane City');
console.log('Parking meter slug:', parkingMeterSlug);
console.log('Parking meter URL:', `/parking-meters/${parkingMeterSlug}`);

// Test food truck slug generation
const foodTruckSlug = createTruckSlug(456, 'Tasty Food Truck');
console.log('Food truck slug:', foodTruckSlug);
console.log('Food truck URL:', `/food-trucks/${foodTruckSlug}`); 