ALTER TABLE `nutritionGoal` ADD `serving_mult` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `nutritionGoal` ADD `volume_mult` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `foodItem` DROP COLUMN `serving_mult`;--> statement-breakpoint
ALTER TABLE `foodItem` DROP COLUMN `serving_type`;