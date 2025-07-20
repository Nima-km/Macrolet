ALTER TABLE `foodItem` ADD `serving_mult` integer DEFAULT 0.01 NOT NULL;--> statement-breakpoint
ALTER TABLE `foodItem` ADD `serving_type` text DEFAULT 'g' NOT NULL;--> statement-breakpoint
ALTER TABLE `food` DROP COLUMN `serving_mult`;--> statement-breakpoint
ALTER TABLE `food` DROP COLUMN `volume_mult`;