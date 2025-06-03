ALTER TABLE `food` ADD `is_template` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `foodItem` DROP COLUMN `is_template`;