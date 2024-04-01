import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	github_id: integer('github_id').unique(),
	username: text('username').unique(),
	email: text('email').unique(),
	hashed_password: text('hashed_password'),
	email_verified: integer('email_verified', { mode: 'boolean'}).default(false)
});

export const session = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});

export const emailVerification = sqliteTable('email_verification', {
	id: text('id').notNull().primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp'}).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	verificationCode: text('code').notNull(),
	email: text('email')
		.notNull()
		.references(() => users.email)
});
