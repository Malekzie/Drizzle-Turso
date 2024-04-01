import { db } from '$lib/server/database/drizzle';
import { emailVerification } from '$lib/server/database/schemas/user-schema';
import { eq } from 'drizzle-orm';
import { isWithinExpirationDate } from 'oslo';

export const verifyEmailCode = async (userId: string, code: string) => {
	const [verificationCode] = await db
		.select()
		.from(emailVerification)
		.where(eq(emailVerification.userId, userId));

	// Checks if verification code exists
	if (!verificationCode) {
		return { success: false, message: 'Verification code not found' };
	}

	// If the provided on does not match the one in the database
	if (verificationCode.verificationCode !== code) {
		return { success: false, message: 'Invalid verification code' };
	}

	// If the verification code has expired
	if (!isWithinExpirationDate(verificationCode.expiresAt)) {
		return { success: false, message: 'Verification code has expired, please request a new one' };
	}

    // if the verification code is correct and has not expired, update the user's email_verified status and delete code from the database

    await db
    .delete(emailVerification)
    .where(eq(emailVerification.userId, userId));

    return { success: true, message: 'Email verified'}
};
