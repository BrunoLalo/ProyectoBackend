import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("--port <port>");
program.parse();

// dotenv.config({ path: cl_options.mode == 'DEVEL' ? './.env.development': './.env.production' });

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGOOSE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  MODE: process.env.MODE,
  GITHUB_AUTH: {
    clientId: process.env.GITHUB_AUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
    callbackUrl: `http://localhost:${
      program.opts().PORT || process.env.PORT || 3000
    }/api/auth/githubcallback`,
  },

};

export default config;