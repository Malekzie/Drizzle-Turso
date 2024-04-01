
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals: { user }, cookies}) => {
    if (!user) {
        redirect(302, '/auth/login'),
        cookies
    }

    return {
        loggedInUser: user.username
    };
}