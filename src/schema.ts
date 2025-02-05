import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const parkingMeters = sqliteTable("parking_meters", {
  ObjectId: integer("ObjectId").primaryKey(),
  METER_NO: integer("METER_NO"),
  CATEGORY: text("CATEGORY", { length: 255 }),
  STREET: text("STREET", { length: 255 }),
  SUBURB: text("SUBURB", { length: 255 }),
  MAX_STAY_HRS: text("MAX_STAY_HRS", { length: 255 }),
  RESTRICTIONS: text("RESTRICTIONS", { length: 255 }),
  OPERATIONAL_DAY: text("OPERATIONAL_DAY", { length: 255 }),
  OPERATIONAL_TIME: text("OPERATIONAL_TIME", { length: 255 }),
  TAR_ZONE: text("TAR_ZONE", { length: 255 }),
  TAR_RATE_WEEKDAY: real("TAR_RATE_WEEKDAY"),
  TAR_RATE_AH_WE: real("TAR_RATE_AH_WE"),
  LOC_DESC: text("LOC_DESC", { length: 255 }),
  VEH_BAYS: integer("VEH_BAYS"),
  MC_BAYS: integer("MC_BAYS"),
  MC_RATE: real("MC_RATE"),
  LONGITUDE: real("LONGITUDE"),
  LATITUDE: real("LATITUDE"),
  MOBILE_ZONE: integer("MOBILE_ZONE"),
  MAX_CAP_CHG: text("MAX_CAP_CHG", { length: 255 }),
  geo_shape: text("geo_shape", { length: 255 }),
  geo_point_2d: text("geo_point_2d", { length: 255 }),
  VEH_BAYS_INT: integer("VEH_BAYS_INT"),
});

export const events = sqliteTable("events", {
  eventId: integer("event_id").primaryKey(), // SQLite auto-increment is implicit for primary key integers
  subject: text("subject", { length: 255 }), // Medium-length string
  webLink: text("web_link", { length: 255 }), // Medium-length string
  location: text("location", { length: 255 }), // Medium-length string
  startDatetime: text("start_datetime", { length: 25 }), // ISO 8601 with timezone
  endDatetime: text("end_datetime", { length: 25 }), // ISO 8601 with timezone
  formattedDatetime: text("formatteddatetime", { length: 50 }), // Short formatted date description
  description: text("description", { length: 4096 }), // Large field for extended descriptions
  eventTemplate: text("event_template", { length: 50 }), // Short identifier
  eventType: text("event_type", { length: 255 }), // Medium-length string
  venue: text("venue", { length: 255 }), // Medium-length string
  venueAddress: text("venueaddress", { length: 255 }), // Medium-length string
  venueType: text("venuetype", { length: 50 }), // Short identifier
  parentEvent: text("parentevent", { length: 255 }), // Medium-length string
  primaryEventType: text("primaryeventtype", { length: 50 }), // Short identifier
  cost: text("cost", { length: 50 }), // Short string
  eventImage: text("eventimage", { length: 255 }), // Medium-length string
  age: text("age", { length: 50 }), // Short string
  bookings: text("bookings", { length: 4096 }), // Large field for booking information
  bookingsRequired: integer("bookingsrequired"), // Represent boolean as integer (0 or 1)
  ageRange: text("agerange", { length: 50 }), // Short string
  libraryEventTypes: text("libraryeventtypes", { length: 255 }), // Medium-length string
  eventTypeField: text("eventtype", { length: 50 }), // Short string
  status: text("status", { length: 50 }), // Short status code
  maximumParticipantCapacity: text("maximumparticipantcapacity", { length: 50 }), // Short string
  activityType: text("activitytype", { length: 255 }), // Medium-length string
  requirements: text("requirements", { length: 255 }), // Medium-length string
  meetingPoint: text("meetingpoint", { length: 255 }), // Medium-length string
  waterwayAccessFacilities: text("waterwayaccessfacilities", { length: 255 }), // Medium-length string
  waterwayAccessInformation: text("waterwayaccessinformation", { length: 255 }), // Medium-length string
  communityHall: text("communityhall", { length: 50 }), // Short identifier
  image: text("image", { length: 255 }), // Medium-length string
  suburb: text("suburb", { length: 50 }), // Medium-length string
  ward: text("ward", { length: 50 }), // Medium-length string
  locationifvenueunavailable: text("locationifvenueunavailable", { length: 255 }), // Medium-length string
  externaleventid: text("externaleventid", { length: 50 }),
});

export const foodTrucks = sqliteTable("food_trucks", {
  truckId: integer("truck_id").primaryKey(), // Unique identifier
  name: text("name", { length: 255 }), // Food truck name
  category: text("category", { length: 255 }), // Food category
  bio: text("bio", { length: 4096 }), // Detailed description
  avatar: text("avatar", { length: 1024 }), // Avatar image URL
  coverPhoto: text("cover_photo", { length: 1024 }), // Cover photo URL
  website: text("website", { length: 1024 }), // Website URL
  facebookUrl: text("facebook_url", { length: 1024 }), // Facebook URL
  instagramHandle: text("instagram_handle", { length: 255 }), // Instagram handle
  twitterHandle: text("twitter_handle", { length: 255 }), // Twitter handle
});