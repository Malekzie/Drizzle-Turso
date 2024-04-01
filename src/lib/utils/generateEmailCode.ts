import { db } from "$lib/server/database/drizzle";
import { emailVerification } from "$lib/server/database/schemas/user-schema";
import { eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {

	await db
    .delete(emailVerification)
    .where(eq(emailVerification.userId, userId))

	const code = generateRandomString(8, alphabet("0-9", "A-Z", 'a-z',));
    await db
    .insert(emailVerification)
    .values({
        id: userId,
        userId: userId,
        email,
        code,
        expiresAt: createDate(new TimeSpan(15, "m")) // 15 minutes
    })

	return code;
}