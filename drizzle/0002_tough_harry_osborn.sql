PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_food` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`protein` integer,
	`fat` integer,
	`carbs` integer
);
--> statement-breakpoint
INSERT INTO `__new_food`("id", "name", "description", "protein", "fat", "carbs") SELECT "id", "name", "description", "protein", "fat", "carbs" FROM `food`;--> statement-breakpoint
DROP TABLE `food`;--> statement-breakpoint
ALTER TABLE `__new_food` RENAME TO `food`;--> statement-breakpoint
PRAGMA foreign_keys=ON;