CREATE TABLE `weight` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`weight` integer DEFAULT 0 NOT NULL
);
