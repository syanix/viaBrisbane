/**
 * Timezone utility functions for Brisbane events
 */

/**
 * Converts UTC datetime string to Brisbane timezone (AEST - UTC+10)
 * Brisbane, Queensland does not observe daylight saving time, so it's always UTC+10
 * 
 * @param utcDateString - UTC datetime string in ISO format (e.g., "2025-07-07T04:00:00+00:00")
 * @returns Brisbane datetime string in ISO format (e.g., "2025-07-07T14:00:00+10:00")
 */
export function convertUTCtoBrisbane(utcDateString: string): string {
  if (!utcDateString) return "";
  
  try {
    const utcDate = new Date(utcDateString);
    
    // Check if the date is valid
    if (isNaN(utcDate.getTime())) {
      console.warn(`Invalid date string: ${utcDateString}`);
      return utcDateString; // Return original if invalid
    }
    
    // Brisbane is always UTC+10 (AEST) - Queensland doesn't observe daylight saving
    const brisbaneDate = new Date(utcDate.getTime() + (10 * 60 * 60 * 1000));
    
    // Format to ISO string and replace Z with +10:00
    const isoString = brisbaneDate.toISOString();
    const brisbaneISOString = isoString.replace('Z', '+10:00');
    
    return brisbaneISOString;
  } catch (error) {
    console.error(`Error converting UTC to Brisbane time: ${error}`);
    return utcDateString; // Return original if error
  }
}

/**
 * Formats a Brisbane datetime for display purposes
 * 
 * @param brisbaneISOString - Brisbane datetime string in ISO format
 * @returns Formatted string like "Monday, 7 July 2025, 2:00 PM AEST"
 */
export function formatBrisbaneDateTime(brisbaneISOString: string): string {
  if (!brisbaneISOString) return "";
  
  try {
    // Remove the timezone part and create a date object
    const dateWithoutTZ = brisbaneISOString.replace('+10:00', '');
    const date = new Date(dateWithoutTZ);
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Australia/Brisbane'
    };
    
    return `${date.toLocaleDateString('en-AU', options)} AEST`;
  } catch (error) {
    console.error(`Error formatting Brisbane datetime: ${error}`);
    return brisbaneISOString;
  }
}

/**
 * Checks if an event is in the past based on Brisbane timezone
 * 
 * @param eventEndDateTime - Event end datetime in Brisbane timezone
 * @returns true if the event has ended
 */
export function isEventPastBrisbane(eventEndDateTime: string): boolean {
  if (!eventEndDateTime) return false;
  
  try {
    const now = new Date();
    const brisbaneNow = convertUTCtoBrisbane(now.toISOString());
    const eventEnd = new Date(eventEndDateTime.replace('+10:00', ''));
    const brisbaneNowDate = new Date(brisbaneNow.replace('+10:00', ''));
    
    return eventEnd < brisbaneNowDate;
  } catch (error) {
    console.error(`Error checking if event is past: ${error}`);
    return false;
  }
} 