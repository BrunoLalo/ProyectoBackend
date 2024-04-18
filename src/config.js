import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--port <port>");
program.parse();

// dotenv.config({ path: cl_options.mode == 'DEVEL' ? './.env.development': './.env.production' });

dotenv.config();

export const MONGO_URL = process.env.MONGOOSE_URL

export const port = process.env.PORT || 8080

export const SECRET_KEY = process.env.SECRET_KEY

export const MODE = process.env.MODE

export const GITHUB_AUTH = {
  clientId: process.env.GITHUB_AUTH_CLIENT_ID,
  clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
  callbackUrl: `http://localhost:${process.env.PORT}/api/sessions/githubcallback`,
}

