import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const users = sqliteTable("user", {
	id: text('id').notNull().primaryKey(),
    github_id: integer('github_id').unique(),
    username: text('username').unique(),
    email: text('email').unique(),
    hashed_password: text('hashed_password'),
});

export const session = sqliteTable("session", {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull()
});