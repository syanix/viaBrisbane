// Test event slug
const eventId = 3070;
const eventSlug = `${eventId}/volunteer-bushcare-working-bee-moore-park-bushcare-group-ironside-park`;
console.log('Event URL:', `/events/${eventSlug}`);

// Test with baseUrl
const baseUrl = 'https://www.viabrisbane.com';
console.log('Full event URL:', `${baseUrl}/events/${eventSlug}`); 