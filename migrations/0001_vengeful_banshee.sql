CREATE TABLE IF NOT EXISTS `events` (
	`event_id` integer PRIMARY KEY NOT NULL,
	`subject` text(255),
	`web_link` text(255),
	`location` text(255),
	`start_datetime` text(25),
	`end_datetime` text(25),
	`formatteddatetime` text(50),
	`description` text(4096),
	`event_template` text(50),
	`event_type` text(255),
	`venue` text(255),
	`venueaddress` text(255),
	`venuetype` text(50),
	`parentevent` text(255),
	`primaryeventtype` text(50),
	`cost` text(50),
	`eventimage` text(255),
	`age` text(50),
	`bookings` text(4096),
	`bookingsrequired` integer,
	`agerange` text(50),
	`libraryeventtypes` text(255),
	`eventtype` text(50),
	`status` text(50),
	`maximumparticipantcapacity` text(50),
	`activitytype` text(255),
	`requirements` text(255),
	`meetingpoint` text(255),
	`waterwayaccessfacilities` text(255),
	`waterwayaccessinformation` text(255),
	`communityhall` text(50),
	`image` text(255)
);
