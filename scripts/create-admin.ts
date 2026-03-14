import { db } from "../lib/db";
import { adminUsers } from "../lib/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("--- Ocha Admin User Setup ---\n");

  const username = await ask("Username: ");
  if (!username.trim()) {
    console.error("Username cannot be empty.");
    process.exit(1);
  }

  const password = await ask("Password: ");
  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  // Check if user already exists
  const existing = db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username.trim()))
    .get();

  if (existing) {
    db.update(adminUsers)
      .set({ passwordHash: hash })
      .where(eq(adminUsers.username, username.trim()))
      .run();
    console.log(`\nUpdated password for existing user "${username.trim()}".`);
  } else {
    db.insert(adminUsers)
      .values({ username: username.trim(), passwordHash: hash })
      .run();
    console.log(`\nCreated new admin user "${username.trim()}".`);
  }

  console.log(`\nPassword hash: ${hash}`);
  console.log("You can also set this as ADMIN_PASSWORD_HASH in .env.local\n");

  rl.close();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
