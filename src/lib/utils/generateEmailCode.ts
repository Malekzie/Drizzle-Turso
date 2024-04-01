import { db } from '$lib/server/database/drizzle';
import { emailVerification } from '$lib/server/database/schemas/user-schema';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';

export async function generateEmailVerificationCode(
	userId: string,
	email: string
): Promise<string> {
	const code = generateRandomString(8, alphabet('0-9', 'A-Z', 'a-z'));


    // Transactions ensure that the database is in a consistent state and if there are any errors that occur, the database will rollback to its previous state
	await db.transaction(async (trx) => {

        // Delete any existing email verification codes
		await trx
        .delete(emailVerification)
        .where(eq(emailVerification.userId, userId));

        // Insert the new email verification code
		await trx
        .insert(emailVerification)
        .values({
			id: userId,
			userId: userId,
			email,
			verificationCode: code,
			expiresAt: createDate(new TimeSpan(15, 'm')) // 15 minutes
		});
	});
	return code;
}
