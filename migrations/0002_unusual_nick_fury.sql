CREATE TABLE `food_trucks` (
	`truck_id` integer PRIMARY KEY NOT NULL,
	`name` text(255),
	`category` text(255),
	`bio` text(4096),
	`avatar` text(1024),
	`cover_photo` text(1024),
	`website` text(1024),
	`facebook_url` text(1024),
	`instagram_handle` text(255),
	`twitter_handle` text(255)
);
