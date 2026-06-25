import bcrypt from "bcryptjs";

// Secure password hashing — bcrypt with a cost of 10. Never MD5/SHA, never plaintext.
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
