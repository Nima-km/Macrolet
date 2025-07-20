PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_nutritionGoal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL,
	`protein` integer DEFAULT 0 NOT NULL,
	`fat` integer DEFAULT 0 NOT NULL,
	`calories` integer DEFAULT 0 NOT NULL,
	`carbs` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_nutritionGoal`("id", "timestamp", "protein", "fat", "calories", "carbs") SELECT "id", "timestamp", "protein", "fat", "calories", "carbs" FROM `nutritionGoal`;--> statement-breakpoint
DROP TABLE `nutritionGoal`;--> statement-breakpoint
ALTER TABLE `__new_nutritionGoal` RENAME TO `nutritionGoal`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `foodItem` ADD `serving_mult` integer DEFAULT 0.01 NOT NULL;--> statement-breakpoint
ALTER TABLE `foodItem` ADD `serving_type` text DEFAULT 'g' NOT NULL;