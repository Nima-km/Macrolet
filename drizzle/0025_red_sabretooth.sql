PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_macroGoal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`protein` integer DEFAULT 0 NOT NULL,
	`fat` integer DEFAULT 0 NOT NULL,
	`carbs` integer DEFAULT 0 NOT NULL,
	`calories` integer DEFAULT 0 NOT NULL,
	`macro_profile` integer NOT NULL,
	FOREIGN KEY (`macro_profile`) REFERENCES `macroProfile`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_macroGoal`("id", "protein", "fat", "carbs", "calories", "macro_profile") SELECT "id", "protein", "fat", "carbs", "calories", "macro_profile" FROM `macroGoal`;--> statement-breakpoint
DROP TABLE `macroGoal`;--> statement-breakpoint
ALTER TABLE `__new_macroGoal` RENAME TO `macroGoal`;--> statement-breakpoint
PRAGMA foreign_keys=ON;