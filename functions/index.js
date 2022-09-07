const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const { GoogleAuth } = require("google-auth-library");

const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/spreadsheet",
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1MtUH4D3z4gNfcjiQVqFx96UHq74dRCYyBY_Q_VwxhFk";

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// async function updateSheet(auth, sheetName) {
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
//     range: "Class Data!A2:E",
//   });
//   const rows = res.data.values;
//   if (!rows || rows.length === 0) {
//     console.log("No data found.");
//     return;
//   }
//   console.log("Name, Major:");
//   rows.forEach((row) => {
//     // Print columns A and E, which correspond to indices 0 and 4.
//     console.log(`${row[0]}, ${row[4]}`);
//   });
// }

async function createBusSheet(spreadsheetId, title) {
  const requests = [];
  // Change the spreadsheet's title.
  requests.push({
    addSheetRequest: {
      properties: {
        title: title,
        index: 0,
        rightToLeft: true,
      },
    },
  });

  const batchUpdateRequest = { requests };
  try {
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: batchUpdateRequest,
    });
    const findReplaceResponse = response.data.replies[1].findReplace;
    console.log(`${findReplaceResponse.occurrencesChanged} replacements made.`);
    return response;
  } catch (err) {
    // TODO (developer) - Handle exception
    console.log(err.message);
  }
}

// exports.updateBusSheet = functions.firestore
//   .document("/Buses/{documentId}")
//   .onUpdate((change, context) => {
//     authorize().then(updateSheet).catch(console.error);
//
//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return null;
//   });

exports.createNewBusSheet = functions.firestore
  .document("/Buses/{busId}")
  .onCreate((snap, context) => {
    const data = snap.data();
    const title =
      data.opponent +
      " " +
      data.date.toDate().getDate() +
      "/" +
      (parseInt(data.date.toDate().getMonth()) + 1).toString();

    authorize()
      .then(() => createBusSheet(SPREADSHEET_ID, title))
      .catch(console.error);

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return null;
  });
