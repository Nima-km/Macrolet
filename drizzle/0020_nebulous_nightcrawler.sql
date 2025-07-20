PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_foodItem` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`food_id` integer NOT NULL,
	`servings` integer DEFAULT 0 NOT NULL,
	`serving_mult` integer DEFAULT 1 NOT NULL,
	`serving_type` text NOT NULL,
	`is_template` integer DEFAULT false,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_foodItem`("id", "timestamp", "food_id", "servings", "serving_mult", "serving_type", "is_template") SELECT "id", "timestamp", "food_id", "servings", "serving_mult", "serving_type", "is_template" FROM `foodItem`;--> statement-breakpoint
DROP TABLE `foodItem`;--> statement-breakpoint
ALTER TABLE `__new_foodItem` RENAME TO `foodItem`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `food` ADD `serving_100g` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `food` ADD `volume_100g` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `recipeItem` ADD `serving_mult` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `recipeItem` ADD `serving_type` text NOT NULL;