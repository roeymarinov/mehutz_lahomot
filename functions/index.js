const functions = require("firebase-functions");
const AWS = require("aws-sdk");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const path = require("path");
const process = require("process");
const { google } = require("googleapis");
//const MailComposer = require("nodemailer/lib/mail-composer");

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
const util = require("util");

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
// const encodeMessage = (message) => {
//   return Buffer.from(message)
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// };

// const createMail = async (options) => {
//   const mailComposer = new MailComposer(options);
//   const message = await mailComposer.compile().build();
//   return encodeMessage(message);
// };

// const sendMail = async (options) => {
//   await authClient.authorize(); // once authorized, can do whatever you want
//   const gmail = google.gmail({ version: "v1", auth: authClient });
//   const rawMessage = await createMail(options);
//   const { data: { id } = {} } = await gmail.users.messages.send({
//     userId: "me",
//     resource: {
//       raw: rawMessage,
//     },
//   });
//   return id;
// };

async function sendSummaryEmail(userEmail, userDetails, gameDetails) {
  console.log("sending email to", userEmail);
  const messageTitle = `הסעות מחוץ לחומות - סיכום הרשמה להסעה - ${gameDetails.opponent} ${gameDetails.date}`;

  // eslint-disable-next-line no-useless-concat
  const messageBody =
    `<html dir="rtl" lang="iw">` +
    `<head><title></title></head>` +
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
    return await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
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
    console.log(err.message);
  }
}

async function appendRows(spreadsheetId, range, valueInputOption, values) {
  const client = await authorize();
  const service = google.sheets({ version: "v4", auth: client });
  const resource = {
    values,
  };
  try {
    return await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function getValues(spreadsheetId, range, majorDimension) {
  const service = google.sheets({ version: "v4", auth });
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
      majorDimension,
    });
    const numRows = result.data.values ? result.data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    return result;
  } catch (err) {
    throw err;
  }
}
async function getSheetId(spreadsheetId, range) {
  const service = google.sheets({ version: "v4", auth });
  const authClient = await authorize();
  const request = {
    // The spreadsheet to request.
    spreadsheetId,

    // The ranges to retrieve from the spreadsheet.
    ranges: [range],

    // True if grid data should be returned.
    // This parameter is ignored if a field mask was set in the request.
    includeGridData: false,
    auth: authClient,
  };

  try {
    const response = (await service.spreadsheets.get(request)).data;
    console.log("sheetID here?");
    console.log(response.sheets[0]);
    return response.sheets[0].properties.sheetId;
  } catch (err) {
    console.error(err);
  }
}
async function cutPaste(spreadsheetId, source, destination, pasteType) {
  const client = await authorize();
  const sheets = google.sheets({ version: "v4", auth: client });
  const requests = [];
  requests.push({
    cutPaste: {
      source,
      destination,
      pasteType,
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
    console.log(err.message);
  }
}
async function updateUserDetails(email, newDetailsRow, title) {
  const response = await getValues(
    SPREADSHEET_ID,
    "'" + title + "'!B:B",
    "COLUMNS"
  );

  const index = response.data.values[0].indexOf(email);
  console.log(index);
  console.log(email);
  console.log(response.data.values);
  if (index === -1) {
    await appendRows(
      SPREADSHEET_ID,
      "'" + title + "'!A:K",
      "RAW",
      newDetailsRow
    );
  } else {
    const rowNum = (index + 1).toString();
    console.log("'" + title + "'!A" + rowNum + ":K" + rowNum);
    await updateValues(
      SPREADSHEET_ID,
      "'" + title + "'!A" + rowNum + ":K" + rowNum,
      "RAW",
      newDetailsRow
    );
  }
}
async function deleteUserDetails(email, title) {
  const valuesResponse = await getValues(
    SPREADSHEET_ID,
    "'" + title + "'!B:B",
    "COLUMNS"
  );
  const sheetId = await getSheetId(SPREADSHEET_ID, "'" + title + "'!B:B");
  // console.log(valuesResponse);
  const index = valuesResponse.data.values[0].indexOf(email);
  if (index !== -1) {
    const rowNum = index + 1;
    console.log("cutPaste", sheetId);
    console.log(valuesResponse.data.values[0].length + 3);
    console.log(rowNum);
    await cutPaste(
      SPREADSHEET_ID,
      {
        sheetId,
        startRowIndex: rowNum,
        endRowIndex: valuesResponse.data.values[0].length + 3,
        startColumnIndex: 0,
        endColumnIndex: 11,
      },
      {
        sheetId,
        rowIndex: rowNum - 1,
        columnIndex: 0,
      },
      "PASTE_NORMAL"
    );
  }
}

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
    const newUsers = {};
    const beforeKeys = Object.keys(registeredUsersBefore);
    for (const key in registeredUsersAfter) {
      if (!beforeKeys.includes(key)) {
        newUsers[key] = registeredUsersAfter[key];
        console.log("new registration");
      } else if (
        !util.isDeepStrictEqual(
          registeredUsersBefore[key],
          registeredUsersAfter[key]
        )
      ) {
        console.log("update registration");
        console.log(registeredUsersAfter[key], registeredUsersBefore[key]);
        newUsers[key] = registeredUsersAfter[key];
      }
    }
    const afterKeys = Object.keys(registeredUsersAfter);
    const deletedUsers = {};
    for (const key in registeredUsersBefore) {
      if (!afterKeys.includes(key)) {
        deletedUsers[key] = registeredUsersBefore[key];
        console.log("delete registration");
      }
    }
    console.log("deleted users:");
    console.log(deletedUsers);
    // const newUsers =
    //   registeredUsersBefore.length < registeredUsersAfter.length
    //     ? registeredUsersAfter.filter((x) => !registeredUsersBefore.includes(x))
    //     : [];
    const gameDetails = {
      date:
        data.date.toDate().getDate() +
        "/" +
        (parseInt(data.date.toDate().getMonth()) + 1).toString(),
      opponent: data.opponent,
      gameTime:
        data.game_time.toDate().toLocaleString("en-US", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        }) +
        ":" +
        data.game_time.toDate().getMinutes().toString().padStart(2, "0"),
      busTime:
        data.bus_time.toDate().toLocaleString("en-US", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        }) +
        ":" +
        data.bus_time.toDate().getMinutes().toString().padStart(2, "0"),
    };

    return authorize()
      .then(() => {
        Object.entries(newUsers).forEach(([emailat, userDetails]) => {
          const name = userDetails.name;
          const email = userDetails.email;
          const phone = userDetails.phone;
          const haloch =
            userDetails.boardingStation !== "אני נוסע/ת רק חזור"
              ? userDetails.numPassengers
              : "0";
          const hazor =
            userDetails.alightingStation !== "אני נוסע/ת רק הלוך"
              ? userDetails.numPassengers
              : "0";
          const oneTime = userDetails.numPassengers - userDetails.numMembers;
          const member = userDetails.numMembers;
          const merkaz =
            userDetails.boardingStation === "רכבת מרכז" ||
            userDetails.alightingStation === "רכבת מרכז"
              ? userDetails.numPassengers
              : "0";
          const mahir =
            userDetails.boardingStation === "חניון שפירים" ||
            userDetails.alightingStation === "חניון שפירים"
              ? userDetails.numPassengers
              : "0";
          const latrun =
            userDetails.boardingStation === "מחלף לטרון" ||
            userDetails.alightingStation === "מחלף לטרון"
              ? userDetails.numPassengers
              : "0";
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
          updateUserDetails(email, row, title)
            .catch(console.error)
            .then(() => {
              if (userDetails.sendMail && !userDetails.sentMail) {
                sendSummaryEmail(email, userDetails, gameDetails)
                  .catch((err) => console.log(err))
                  .then(() => {
                    const sentMailDocRef = admin
                      .firestore()
                      .collection("Buses")
                      .doc(change.after.id);

                    return sentMailDocRef.update({
                      [`registered_users.${emailat}.sentMail`]: true,
                    });
                  });
              }
            });
        });
      })
      .then(() => {
        Object.entries(deletedUsers).forEach(([, userDetails]) => {
          const email = userDetails.email;
          deleteUserDetails(email, title).catch(console.error);
        });
      })
      .then(() =>
        updateValues(SPREADSHEET_ID, "'" + title + "'!N1:N7", "USER_ENTERED", [
          [data.totals.merkaz.toString()],
          [data.totals.mahir.toString()],
          [data.totals.latrun.toString()],
          [data.totals.members.toString()],
          [data.totals.oneTime.toString()],
          [data.totals.toGame.toString()],
          [data.totals.fromGame.toString()],
        ])
      )
      .catch(console.error);

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
  });
