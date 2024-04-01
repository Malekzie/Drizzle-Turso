import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from '$lib/server/database/zod-schema';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { error, fail, redirect } from '@sveltejs/kit';
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from '$lib/server/database/drizzle';
import { users } from '$lib/server/database/schemas/user-schema';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(registerSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(zod(registerSchema));
        const email = form.data.email;
        const password = form.data.password;

        try {
			if (!form.valid) {
				return fail(400, {
					form,
				});
			}
		} catch (e) {
			return error(500, 'Something went wrong with the forms');
		}

        
        // Checks if user already in the database
        try {
            const userExists = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .get();
            
            if (userExists) {
                return setError(form, 'email', 'Email already exists');
			}
            
        } catch (e) {
            return error(400, 'Something went wrong with the database')
        }
        
        try {
            const hashedPassword = await new Argon2id().hash(password);
            const userId = generateId(15);

            const { insertedId } = await db
            .insert(users)
            .values({
                id: userId,
                email,
                hashed_password: hashedPassword,
            })
            .returning({ insertedId: users.id })
            .get();

            const session = await lucia.createSession(insertedId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});


        } catch (e) {
            return error(500, 'Something went wrong with the database')
        }
		// Redirects to the login page
		redirect(302, '/auth/login');
	}
};
