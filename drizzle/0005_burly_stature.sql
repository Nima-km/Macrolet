PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_foodItem` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL,
	`food_id` integer NOT NULL,
	`servings` integer NOT NULL,
	`meal` integer NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "meal_check" CHECK("__new_foodItem"."meal" < 3),
	CONSTRAINT "meal_check2" CHECK("__new_foodItem"."meal" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_foodItem`("id", "timestamp", "food_id", "servings", "meal") SELECT "id", "timestamp", "food_id", "servings", "meal" FROM `foodItem`;--> statement-breakpoint
DROP TABLE `foodItem`;--> statement-breakpoint
ALTER TABLE `__new_foodItem` RENAME TO `foodItem`;--> statement-breakpoint
PRAGMA foreign_keys=ON;