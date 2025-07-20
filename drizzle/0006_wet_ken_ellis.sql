PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_food` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`protein` integer NOT NULL,
	`fat` integer NOT NULL,
	`calories` integer,
	`carbs` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_food`("id", "name", "description", "protein", "fat", "calories", "carbs") SELECT "id", "name", "description", "protein", "fat", "calories", "carbs" FROM `food`;--> statement-breakpoint
DROP TABLE `food`;--> statement-breakpoint
ALTER TABLE `__new_food` RENAME TO `food`;--> statement-breakpoint
PRAGMA foreign_keys=ON;