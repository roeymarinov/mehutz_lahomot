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
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
//const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
//const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "mehutz-lahomot-7b68b8f7834c.json"
);
const { GoogleAuth } = require("google-auth-library");

const auth = new GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const SPREADSHEET_ID = "1MtUH4D3z4gNfcjiQVqFx96UHq74dRCYyBY_Q_VwxhFk";

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  return await auth.getClient();
}

async function updateValues(spreadsheetId, range, valueInputOption, values) {
  const client = await authorize();
  const sheets = google.sheets({ version: "v4", auth: client });

  const resource = {
    values,
  };
  try {
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log("%d cells updated.", result.data.updatedCells);
    return result;
  } catch (err) {
    console.log(err.message);
  }
}

async function createBusSheet(spreadsheetId, title) {
  const client = await authorize();
  const sheets = google.sheets({ version: "v4", auth: client });
  const requests = [];
  // Change the spreadsheet's title.
  requests.push({
    addSheet: {
      properties: {
        title: title,
        index: 0,
        rightToLeft: true,
      },
    },
  });

  try {
    return await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        includeSpreadsheetInResponse: false,
        requests: requests,
        responseIncludeGridData: false,
        responseRanges: [],
      },
    });
  } catch (err) {
    console.log("batchUpdate error");
    console.log(err.message);
  }
}

async function appendRows(spreadsheetId, range, valueInputOption, values) {
  const client = await authorize();
  const service = google.sheets({ version: "v4", auth: client });
  console.log("invoke appendRows");
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log(`${result.data.updates.updatedCells} cells appended.`);
    return result;
  } catch (err) {
    console.log(err.message);
  }
}

exports.createNewBusSheet = functions.firestore
  .document("/Buses/{busId}")
  .onCreate((snap, context) => {
    console.log("invoked createNewBusSheet");
    const data = snap.data();
    const title =
      data.opponent +
      " " +
      data.date.toDate().getDate() +
      "/" +
      (parseInt(data.date.toDate().getMonth()) + 1).toString();
    const firstRow = [
      [
        "שם",
        "מייל",
        "טלפון",
        "הלוך",
        "חזור",
        "חד פעמי",
        "מנוי",
        "מרכז",
        "מהיר",
        "שילת",
        "שולם",
      ],
    ];

    const secondRow = [
      ["סהכ מרכז"],
      ["סהכ מהיר"],
      ["סהכ שילת"],
      ["סהכ נוסעים"],
    ];
    return authorize()
      .then(() => createBusSheet(SPREADSHEET_ID, title))
      .then(() => {
        appendRows(
          SPREADSHEET_ID,
          "'" + title + "'",
          "USER_ENTERED",
          firstRow
        ).then(() =>
          appendRows(
            SPREADSHEET_ID,
            "'" + title + "'!M:M",
            "USER_ENTERED",
            secondRow
          )
        );
      })
      .catch(console.error);

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
  });

exports.registerUser = functions.firestore
  .document("/Buses/{documentId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const registeredUsersBefore = change.before.data().registered_users;
    const registeredUsersAfter = change.after.data().registered_users;
    const title =
      data.opponent +
      " " +
      data.date.toDate().getDate() +
      "/" +
      (parseInt(data.date.toDate().getMonth()) + 1).toString();
    const newUsers = registeredUsersAfter.filter(
      (x) => !registeredUsersBefore.includes(x)
    );
    const totalPassengers = data.total_passengers;
    return authorize()
      .then(() => {
        newUsers.forEach((userDetails) => {
          const name = userDetails.name;
          const phone = userDetails.phone;
          const email = userDetails.email;
          const haloch =
            userDetails.boardingStation !== "אני נוסע/ת רק חזור"
              ? userDetails.numPassengers
              : "0";
          const hazor =
            userDetails.alightingStation !== "אני נוסע/ת רק הלוך"
              ? userDetails.numPassengers
              : "0";
          const oneTime = userDetails.numPassengers; // TODO: change!!
          const member = "0"; // TODO: change!!
          const merkaz = "?"; // TODO: change!!
          const mahir = "?"; // TODO: change!!
          const shilat = "?"; // TODO: change!!
          const paid = "-"; // TODO: change!!
          const row = [
            [
              name,
              email,
              phone,
              haloch,
              hazor,
              oneTime,
              member,
              merkaz,
              mahir,
              shilat,
              paid,
            ],
          ];
          appendRows(SPREADSHEET_ID, "'" + title + "'!A:K", "RAW", row).catch(
            console.error
          );
        });
      })
      .then(() =>
        updateValues(SPREADSHEET_ID, "'" + title + "'!N4:N4", "USER_ENTERED", [
          [totalPassengers.toString()],
        ])
      )
      .catch(console.error);

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
  });
