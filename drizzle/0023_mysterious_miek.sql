CREATE TABLE `macroGoal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`protein` integer DEFAULT 0 NOT NULL,
	`fat` integer DEFAULT 0 NOT NULL,
	`carbs` integer DEFAULT 0 NOT NULL,
	`calories` integer DEFAULT 0 NOT NULL,
	`macro_profile` integer NOT NULL,
	FOREIGN KEY (`macro_profile`) REFERENCES `food`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `macroProfile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `weight` DROP COLUMN `is_metric`;