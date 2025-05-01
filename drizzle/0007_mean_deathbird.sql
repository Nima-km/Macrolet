CREATE TABLE `nutritionGoal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`protein` integer DEFAULT 0 NOT NULL,
	`fat` integer DEFAULT 0 NOT NULL,
	`calories` integer DEFAULT 0,
	`carbs` integer DEFAULT 0 NOT NULL
);
