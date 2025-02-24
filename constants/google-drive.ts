export const PARENT_FOLDER_ID = "17_EDKoZlFgNeRpXZdqGQRg6mtSt-RI5I";
export const CONFIG_GOOGLE_CREDENTIALS = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS!, "base64").toString("utf-8")
);

// export const CONFIG_KEY_FILE_PATH =
// JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!) || {};
// path.join(process.cwd(), "config/service-account.json") ||

// export const CONFIG_KEY_FILE_PATH = {
//   type: process.env.GOOGLE_SA_TYPE,
//   project_id: process.env.GOOGLE_SA_PROJECT_ID,
//   private_key_id: process.env.GOOGLE_SA_PRIVATE_KEY_ID,
//   private_key: process.env.GOOGLE_SA_PRIVATE_KEY,
//   client_email: process.env.GOOGLE_SA_CLIENT_EMAIL,
//   client_id: process.env.GOOGLE_SA_CLIENT_ID,
//   auth_uri: process.env.GOOGLE_SA_AUTH_URI,
//   token_uri: process.env.GOOGLE_SA_TOKEN_URI,
//   auth_provider_x509_cert_url:
//     process.env.GOOGLE_SA_AUTH_PROVIDER_X509_CERT_URL,
//   client_x509_cert_url: process.env.GOOGLE_SA_CLIENT_X509_CERT_URL,
//   universe_domain: process.env.GOOGLE_SA_UNIVERSE_DOMAIN,
// };
