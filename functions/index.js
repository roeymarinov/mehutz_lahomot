const functions = require("firebase-functions");
const AWS = require("aws-sdk");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const path = require("path");
const process = require("process");
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

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
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  // scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const JWT = google.auth.JWT;
const authClient = new JWT({
  keyFile: CREDENTIALS_PATH,
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  subject: "mehutzlaomot@gmail.com", // google admin email address to impersonate
});
const SPREADSHEET_ID = "1MtUH4D3z4gNfcjiQVqFx96UHq74dRCYyBY_Q_VwxhFk";
AWS.config.loadFromPath("./aws_credentials.json");
/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  return await auth.getClient();
}
const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (options) => {
  await authClient.authorize(); // once authorized, can do whatever you want
  const gmail = google.gmail({ version: "v1", auth: authClient });
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};

async function sendSummaryEmail(userEmail, userDetails, gameDetails) {
  const messageTitle = `הסעות מחוץ לחומות - סיכום הרשמה להסעה - ${gameDetails.opponent} ${gameDetails.date}`;

  // eslint-disable-next-line no-useless-concat
  const messageBody =
    `<html dir="rtl" lang="iw">` +
    `<head></head>` +
    `<body>` +
    `<h3>פרטי ההסעה</h3>\n` +
    `<p>תאריך: ${gameDetails.date}</p>\n` +
    `<p>שעת המשחק: ${gameDetails.gameTime}</p>\n` +
    `<p>יציאה מרכבת מרכז: ${gameDetails.busTime}</p>\n` +
    `<h3>פרטי ההזמנה</h3>\n` +
    `<p>שם: ${userDetails.name}</p>\n` +
    `<p>טלפון: ${userDetails.phone}</p>\n` +
    `<p>מייל: ${userDetails.email}</p>\n` +
    `<p>מס' נוסעים: ${userDetails.numPassengers}</p>\n` +
    `<p>תחנת עלייה: ${userDetails.boardingStation}</p>\n` +
    `<p>תחנת ירידה: ${userDetails.alightingStation}</p>\n` +
    `</body>` +
    `</html>`;

  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: [
        userEmail,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: messageBody,
        },
        // Text: {
        //   Charset: "UTF-8",
        //   Data: messageBody,
        // },
      },
      Subject: {
        Charset: "UTF-8",
        Data: messageTitle,
      },
    },
    Source: "mehutzlaomot@gmail.com" /* required */,
    ReplyToAddresses: [
      "mehutzlaomot@gmail.com",
      /* more items */
    ],
  };

  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function (data) {
      console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
  // const options = {
  //   to: userEmail,
  //   replyTo: "mehutzlaomot@gmail.com\n",
  //   subject: "Hello Roey 🚀",
  //   text: "This email is sent from the command line",
  //   html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
  //   textEncoding: "base64",
  //   headers: [
  //     { key: "X-Application-Developer", value: "Amit Agarwal" },
  //     { key: "X-Application-Version", value: "v1.0.0.2" },
  //   ],
  // };
  // return await sendMail(options);
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
        "לטרון",
      ],
    ];

    const secondRow = [
      ["סהכ מרכז"],
      ["סהכ מהיר"],
      ["סהכ לטרון"],
      ["סהכ מנוי"],
      ["סהכ חד פעמי"],
      ["סהכ הלוך"],
      ["סהכ חזור"],
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
    const newUsers =
      registeredUsersBefore.length < registeredUsersAfter.length
        ? registeredUsersAfter.filter((x) => !registeredUsersBefore.includes(x))
        : [];
    const totalPassengersToGame = data.totals.toGame;
    const totalPassengersFromGame = data.totals.fromGame;
    const gameDetails = {
      date:
        data.date.toDate().getDate() +
        "/" +
        (parseInt(data.date.toDate().getMonth()) + 1).toString(),
      opponent: data.opponent,
      gameTime:
        data.game_time.toDate().getHours() +
        ":" +
        data.game_time.toDate().getMinutes().toString().padStart(2, "0"),
      busTime:
        data.bus_time.toDate().getHours() +
        ":" +
        data.bus_time.toDate().getMinutes().toString().padStart(2, "0"),
    };
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
          const latrun = "?"; // TODO: change!!
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
              latrun,
            ],
          ];
          appendRows(SPREADSHEET_ID, "'" + title + "'!A:K", "RAW", row)
            .catch(console.error)
            .then(() => sendSummaryEmail(email, userDetails, gameDetails));
        });
      })
      .then(() =>
        updateValues(SPREADSHEET_ID, "'" + title + "'!N4:N5", "USER_ENTERED", [
          [totalPassengersToGame.toString()],
          [totalPassengersFromGame.toString()],
        ])
      )
      .catch(console.error);

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
  });
