PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_food` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`protein` integer DEFAULT 0 NOT NULL,
	`fat` integer DEFAULT 0 NOT NULL,
	`calories` integer,
	`carbs` integer DEFAULT 0 NOT NULL,
	`is_recipe` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_food`("id", "name", "description", "protein", "fat", "calories", "carbs", "is_recipe") SELECT "id", "name", "description", "protein", "fat", "calories", "carbs", "is_recipe" FROM `food`;--> statement-breakpoint
DROP TABLE `food`;--> statement-breakpoint
ALTER TABLE `__new_food` RENAME TO `food`;--> statement-breakpoint
PRAGMA foreign_keys=ON;