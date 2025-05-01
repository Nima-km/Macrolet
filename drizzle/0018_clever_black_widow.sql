ALTER TABLE `food` ADD `serving_mult` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `food` ADD `volume_mult` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `nutritionGoal` DROP COLUMN `serving_mult`;--> statement-breakpoint
ALTER TABLE `nutritionGoal` DROP COLUMN `volume_mult`;