import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

export const uploadFileToDrive = async (file, accessToken) => {
    oauth2Client.setCredentials({ access_token: accessToken });
  
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: file.stream(),
      },
    });
  
    return response.data;
  };