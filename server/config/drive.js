const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const TOKEN_PATH = path.join(__dirname, "token.json");

const CREDENTIALS_PATH = path.join(__dirname, "oauth-client.json");

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, "utf8");

    oauth2Client.setCredentials(JSON.parse(token));

    return oauth2Client;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive"],
  });

  console.log("\nOpen this URL:\n", authUrl);

  const code = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("\nPaste code here: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

  return oauth2Client;
}

module.exports = authorize();
