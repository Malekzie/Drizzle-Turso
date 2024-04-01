import { loginSchema } from '$lib/server/database/zod-schema';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { users } from '$lib/server/database/schemas/user-schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/database/drizzle';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals: {user}, cookies}) => {
    if (!user) {
        redirect(302, '/auth/login')
    }

	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(zod(loginSchema));
		const email = form.data.email;
		const password = form.data.password;
        try {
            if (!form.valid) {
                return fail(400, {
                    form
                });
            }
            
        } catch (e) {
            return error(500, 'Something went wrong with the forms');
        }

        try {

            const user = await db.select().from(users).where(eq(users.email, email)).get();
            
            if (!user) {
                return error(400, 'Invalid Credentials');
            }
            
            const validPassword = await new Argon2id().verify(user.hashed_password!, password);
            if (!validPassword) {
                return error(400, 'Invalid Credentials');
            }
            
            const session = await lucia.createSession(user.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: '.',
                ...sessionCookie.attributes,
            });
        } catch(e) {
            return error(500, 'Something went wrong with the database');
        }
            redirect(302, '/');
        }
    };
    