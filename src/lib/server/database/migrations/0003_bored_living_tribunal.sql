CREATE TABLE `email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`email` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON UPDATE no action ON DELETE no action
);
