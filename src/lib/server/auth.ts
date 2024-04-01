import { GitHub } from "arctic";
import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./database/drizzle";
import { session, users } from "./database/schemas/user-schema";

const adapter = new DrizzleSQLiteAdapter(db, session, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// Set to true when deploying to https
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// User attributes
			githubId: attributes.github_id,
			username: attributes.username,
            email: attributes.email,
            email_verified: attributes.email_verified
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
    email: string;
    email_verified: boolean;
}


export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET
);