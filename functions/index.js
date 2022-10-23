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
const dayjs = require("dayjs");

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
  const messageBody = `<div align="center" class="bl-template bl-content-removable bl-template-version-2" id="template-body" style="width:100%;"><table border="0" cellpadding="0" cellspacing="0" class="bl-template-main-wrapper" style="width: 100%; background-color: #e5e5e5; border-collapse: collapse;" align="center" id="bl_0" valign="top" is-new-template="0"><tbody><tr><td class="bl-template-margin" width="100%" align="center" style="margin: 0px; padding: 10px;" id="bl_1" valign="top"> <!--[if gte mso 9 | (IE)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;"><tr><td valign="top" width="600" style="width:600px;"> <![endif]--><table class="template-main-table bl-template-background template-direction-right" border="0" cellpadding="0" cellspacing="0" style="width: 100%; text-align: right; background-color: #ffffff;" valign="top" width="100%" id="bl_2" template-direction="rtl"><tbody><tr><td class="bl-template-border" style="width: 100%; padding: 0px;" valign="top" width="100%" id="bl_3"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" valign="top" width="100%"><tbody><tr><td class="bl-zone bl-zone-dropable" name="FrameworkZone" style="width: 100%;" width="100%" valign="top" id="bl_4" height=""><div class="bl-block bl-block-image" id="bl_5" blocktype="image" name="image" width="100%" cellpadding="0" cellspacing="0" border="0" style=""><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="background-color: #e5e5e5; width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides no-side-padding" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides no-side-padding" width="100%" style="padding-top: 0px; padding-bottom: 0px; width: 100%;"><div class="bl-block-content-item bl-block-content-item-image bl-in-edit-mode-single" style="text-align: center;"><img id="bl_23" border="0" src="https://cdn-media.web-view.net/i/z3wxdzdacspd/top_tound_0.png?cache=1531377642062" style="display: inline; max-width: 600px; width: 100%;" width="600" alt="top_tound" max-width-back="600"></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-image" id="bl_7" blocktype="image" name="image" width="100%" cellpadding="0" cellspacing="0" border="0" style=""><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 0px; padding-bottom: 0px; width: 100%;"><div class="bl-block-content-item bl-block-content-item-image bl-in-edit-mode-single" style="text-align: center;"><img id="bl_27" border="0" src="https://cdn-media.web-view.net/i/xtzztwshddhc/Edited_Photos/mehutz_lahomot_logo.png?dummy=3887" style="display: inline; max-width: 100px; width: 100%;" width="100" alt="Asset_5"></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_11" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 243, 165, 0);"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 20px; padding-bottom: 0px; width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner" dir="rtl"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" style="text-align: right;" data-gramm="false"><div style="text-align: center;"><span style="color:#B22222;"><span style="font-size:26px;"><strong>סיכום הרשמה להסעה - ${gameDetails.opponent} ${gameDetails.date}</strong></span></span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_13" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 243, 165, 0);"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 9px; padding-bottom: 9px;width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner" dir="rtl"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" style="text-align: right;" data-gramm="false"><div style="text-align: center;"><span style="font-size:16px;">תודה שנרשמת להסעה למשחק של הפועל ירושלים נגד ${gameDetails.opponent} בתאריך ${gameDetails.date}. במייל זה נמצאים פרטי ההסעה וההזמנה שלך. ביטול ועריכת ההרשמה מתבצעים דרך <u><a data-link-type="url" href="http://hapoelbus.com" style="text-decoration: none; color: #606060;"><span style="color:#0000FF;"><u>אתר ההסעות</u></span></a></u></span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_42" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style=""><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="vertical-align: top;padding-top: 9px; padding-bottom: 9px;width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" data-gramm="false"><div style="text-align: center;"><span style="font-size:16px;"><strong><span style="color:#B22222;">שימו לב!</span></strong> מייל זה אינו מהווה אישור סופי לשמירת מקום בהסעה. אם אינכם מנויי הסעה, יש לשלם <span style="color:#0000FF;"><u><a data-link-type="url" href="https://web.payboxapp.com/?v=j&g=61547de7df517a0008bdb060#/" style="text-decoration: none; color: #0000ff;">בפייבוקס</a></u></span> על מנת שמקומכם יישמר.</span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-button" id="bl_43" blocktype="button" name="button" width="100%" cellpadding="0" cellspacing="0" border="0" style="display: block;"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table align="right" border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="282" style="width: 282px;vertical-align: top; display: inline-block;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="264" style="vertical-align: top;padding-top: 9px; padding-bottom: 9px;width: 264px;" align="center"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%" class="bl-block-content-item-container"> <tbody><tr> <td align="center" class="bl-block-content-item-container-inner" style="display: table-cell;"> <table border="0" cellpadding="0" cellspacing="0" style="border-radius: 10px; background-color: #bf0000;"> <tbody> <tr> <td align="center" valign="middle" style="font-size: 16px; padding: 10px; width: 282px;" class=""> <div class="bl-block-content-item bl-block-content-item-button cke_editable_inline cke_contents_rtl" style="min-width: 1px; min-height: 16px; display: block; line-height: 100%; text-align: center; text-decoration: none;" data-gramm="false" spellcheck="true" role="textbox" aria-label="עורך טקסט עשיר, editor47" aria-describedby="cke_3015"><strong><font color="#ffffff"><a data-link-type="url" href="https://web.payboxapp.com/?v=j&g=61547de7df517a0008bdb060#/" style="text-decoration: none; color: #ffffff;">תשלום בפייבוקס</a></font></strong></div> </td> </tr> </tbody> </table> </td> </tr></tbody></table></td></tr></tbody></table><table align="right" border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="282" style="width: 282px;vertical-align: top; display: inline-block;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="264" style="vertical-align: top;padding-top: 9px; padding-bottom: 9px;width: 264px;" align="center"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%" class="bl-block-content-item-container"> <tbody><tr> <td align="center" class="bl-block-content-item-container-inner" style="display: table-cell;"> <table border="0" cellpadding="0" cellspacing="0" style="border-radius: 10px; background-color: #bf0000;"> <tbody> <tr> <td align="center" valign="middle" style="font-size: 16px; padding: 10px; width: 282px;" class=""> <strongdiv class="bl-block-content-item bl-block-content-item-button cke_editable_inline cke_contents_rtl" style="min-width: 1px; min-height: 16px; display: block; line-height: 100%; text-align: center; text-decoration: none;" data-gramm="false" spellcheck="true" role="textbox" aria-label="עורך טקסט עשיר, editor47" aria-describedby="cke_3015"><strong><font color="#ffffff"><a data-link-type="url" href="https://www.google.com/calendar/render?action=TEMPLATE&text=הסעה+למשחק+נגד+${gameDetails.opponent}&dates=${gameDetails.busTimeGoogle}/${gameDetails.gameTimeGoogle}&details=https://www.hapoelbus.com&sf=true&output=xml" style="text-decoration: none; color: #ffffff;">הוספה ליומן גוגל</a></font></strong><div> </td> </tr> </tbody> </table> </td> </tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-divider" id="bl_16" blocktype="divider" name="divider" width="100%" cellpadding="0" cellspacing="0" border="0" style=""><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 9px; padding-bottom: 9px;width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner"><div class="bl-block-content-item bl-block-content-item-divider bl-in-edit-mode-single" style="text-align: center;"><table class="divider-line" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; display: block; border-bottom: 1px solid #bf0000;"><tbody><tr><td width="600" style="width:600px; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><span width="600" style="width:600px"></span></td></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_17" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style="display: block;"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 0px; padding-bottom: 0px; width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner" dir="rtl"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" style="text-align: right;" data-gramm="false"><div style="text-align: center;"><span style="color:#B22222;"><span style="caret-color: #2497ab; font-size: 30px;"><b>פרטי ההסעה</b></span></span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_18" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 243, 165, 0); display: block;"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 9px; padding-bottom: 9px;width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner" dir="rtl"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" style="text-align: right;" data-gramm="false"><div></div>

<div style="text-align: center;"><span style="font-size:15px;"><strong>תאריך:<span style="color:#2497AB;"><strong> </strong></span><span style="color:#B22222;">${gameDetails.date}</span></strong></span></div>

<div style="text-align: center;"><br>
<span style="font-size:15px;"><strong>שעת המשחק:<span style="color:#2497AB;"><strong> </strong></span><span style="color:#B22222;">${gameDetails.gameTime}</span></strong><br>
<br>
<strong>יציאה מרכבת מרכז:<span style="color:#2497AB;"><strong> </strong></span><span style="color:#B22222;">${gameDetails.busTime}</span><br>
<br>
חניון שפירים - הנתיב המהיר:<span style="color:#B22222;"> ${gameDetails.mahirTime} (משוער)</span><br>
<br>
מחלף לטרון:<span style="color:#B22222;"> ${gameDetails.latrunTime} (משוער)</span><br>
<br>
איסוף מחניית השחקנים:<span style="color:#B22222;"> 10 דק' מתום המשחק</span></strong></span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-divider" id="bl_38" blocktype="divider" name="divider" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 243, 165, 0); display: block;"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 9px; padding-bottom: 9px;width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner"><div class="bl-block-content-item bl-block-content-item-divider bl-in-edit-mode-single" style="text-align: center;"><table class="divider-line" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; display: block; border-bottom: 1px solid #bf0000;"><tbody><tr><td width="600" style="width:600px; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"><span width="600" style="width:600px"></span></td></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_30" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style="display: block; background-color: rgba(255, 243, 165, 0);"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 0px; padding-bottom: 0px; width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner" dir="rtl"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" style="text-align: right;" data-gramm="false"><div style="text-align: center;"><span style="color:#B22222;"><span style="caret-color: #2497ab; font-size: 30px;"><b>פרטי ההזמנה</b></span></span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-text" id="bl_31" blocktype="text" name="text" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 243, 165, 0); display: block;"><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides" width="100%" style="padding-top: 9px; padding-bottom: 9px;width: 100%;"><table cellpadding="0" cellspacing="0" border="0" class="bl-block-content-item-container" width="100%"><tbody><tr><td class="bl-block-content-item-container-inner" dir="rtl"><div class="bl-block-content-item bl-block-content-item-text bl-in-edit-mode-single" style="text-align: right;" data-gramm="false"><div></div>

<div style="text-align: center;"><span style="font-size:15px;"><strong>שם: <span style="color:#B22222;">${userDetails.name}</span><br>
<br>
טלפון: <span style="color:#B22222;">${userDetails.phone}</span><br>
<br>
<span style="color:#B22222;">מייל: ${userDetails.email}</span><br>
<br>
מס' נוסעים: <span style="color:#B22222;">${userDetails.numPassengers}</span><br>
<br>
תחנת עלייה: <span style="color:#B22222;">${userDetails.boardingStation}</span><br>
<br>
תחנת ירידה: <span style="color:#B22222;">${userDetails.alightingStation}</span></strong></span></div>
</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div><div class="bl-block bl-block-image" id="bl_19" blocktype="image" name="image" width="100%" cellpadding="0" cellspacing="0" border="0" style=""><div class="bl-block-content" ><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; min-width: 100%;"><tbody><tr><td class="bl-block-content-table bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="background-color: #e5e5e5; width: 100%; min-width: 100%;"><tbody><tr class="bl-block-content-row-outer"><td valign="top" class="bl-block-content-row-inner bl-padding-2-sides no-side-padding" style="text-align: center;vertical-align: top;"><table border="0" cellpadding="0" cellspacing="0" valign="top" class="bl-block-content-column bl-block-content-new-column" width="100%" style="margin: 0px auto;vertical-align: top;width: 100%;"><tbody><tr><td valign="top" class="bl-content-wrapper bl-padding-2-sides no-side-padding" width="100%" style="padding-top: 0px; padding-bottom: 9px; width: 100%;"><div class="bl-block-content-item bl-block-content-item-image bl-in-edit-mode-single" style="text-align: center;"><img id="bl_26" border="0" src="https://cdn-media.web-view.net/i/z3wxdzdacspd/Bottom_ROund.png?cache=1531377706008" style="display: inline; max-width: 600px; width: 100%;" width="600" alt="Bottom_ROund" max-width-back="600"></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div></div></td></tr></tbody></table></td></tr></tbody></table><table class="bl-new-footer-container" style="width: 100%; direction: rtl; text-align: right;" valign="top" width="100%" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="bl-new-footer-wrapper" style="width: 100%; padding: 0px;" valign="top" width="100%"><table border="0" cellpadding="0" cellspacing="0" style="width: 100%;" valign="top" width="100%"><tbody class="bl-new-footer-content"><tr><td class="bl-zone" name="FooterZone" style="width:100%;" width="100%" valign="top" id="bl_21" height=""><div class="bl-block bl-block-footer" name="Footer Block" blocktype="footer" id="bl_22" style=""><div class="bl-block-content" ><div class="bl-block-content-table bl-block-content-layout-0 bl-block-dir-rtl"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="bl-block-content-row bl-block-content-first-row bl-block-content-last-row" style="background-color: transparent; width: 100%; min-width: 100%;"><tbody><tr><td valign="top" class="bl-block-content-row-inner"><table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="bl-block-content-column bl-1-column"><tbody><tr><td valign="top" class="bl-padding-1-column"><div class="bl-block-content-item bl-block-content-item-text bl-block-content-item-canspam canspam-info-uninit item-uneditable bl-content-item-unremovable" data-gramm="false"><span class="canspam-companyname">מחוץ לחומות</span> | <span class="canspam-phone">mehutzlaomot@gmail.com</span></div><div class="bl-block-content-item bl-block-content-item-text bl-block-content-item-unsubscribe bl-content-item-unremovable" data-gramm="false"></td></tr></tbody></table></td></tr></tbody></table></div></div></div></td></tr></tbody></table></td></tr></tbody></table> </td></tr></tbody></table><div><style type="text/css">.bl-template-margin {
    padding: 10px;
}

.template-main-table {
    min-width: 0px;
    max-width: 600px;
}

.bl-new-footer-container {
    min-width: 0px;
    max-width: 600px;
}

.bl-template-main-wrapper {
    line-height: 0px !important;
}

.bl-template .bl-block-menu {
    line-height: 1.2 !important;
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-imageContent {
    padding-top: 0px;
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-buttonContent {
    padding-top: 0px;
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-textContent {
    padding-top: 0px;
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-priceContent {
    padding-top: 0px;
}

/* Outlook.con puts line-height 142% on all elements.  2. Set h1-h4 to line height 1.2 */
.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-container-inner {
    line-height: 1.2 !important
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-buttonContent {
    line-height: 1.2 !important
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-textContent {
    line-height: 1.2 !important
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-titleContent * {
    line-height: 1.2 !important
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-buttonContent * {
    line-height: 1.2 !important
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-textContent * {
    line-height: 1.2 !important
}

.bl-template {
    font-style: normal;
    font-weight: normal;
    font-family: arial,sans-serif;
    font-size: 15px;
    color: #606060;
}

    .bl-template .bl-block-content-item {
        font-style: normal;
        font-family: arial, sans-serif;
        font-size: 15px;
        color: #606060; /*border: 0px; border-color: inherit;*/
    }

    .bl-template .bl-block-content-item-text {
        text-align: right;
        line-height: 1.2;
        min-height: 8px;
    }
    /* LTR STYLE, word-break: break-all; */
    .bl-template .bl-block-text {
        font-style: normal;
        font-family: arial,sans-serif;
        font-size: 15px;
        color: #606060;
    }

    .bl-template a {
        word-wrap: break-word !important;
        color: #00008c;
        border: 0;
        outline: none;
        text-decoration: none;
    }
    /*.bl-template img { height: auto !important; display:inline-block; vertical-align:top; border:0px; outline:none; text-decoration:none;}
      .bl-template a img { border:0; outline:none; text-decoration:none; }*/


    .bl-template .bl-block-productcartitems .bl-block-content-layout-1 .bl-block-content-item-image a {
        text-align: center !important;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-1 .bl-block-content-item-image a {
        text-align: center !important;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-1 .bl-block-content-item-image a img {
        max-width: 130px !important;
        width: 130px !important;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-1 .bl-block-content-item-image a img {
        max-width: 130px !important;
        width: 130px !important;
    }

    .bl-template .bl-block-productsrecommend .bl-block-content-item-td-imageContent {
        padding-top: 9px;
    }

        .bl-template .bl-block-productsrecommend .bl-block-content-item-td-imageContent a img {
            max-width: 164px;
            width: 164px;
        }

    .bl-template .bl-block-productsrecommend .bl-content-item-product-item-image {
        text-align: center;
    }

    .bl-template .bl-block-productsrecommend .bl-block-content-item-product-item-name {
        text-align: center;
    }

    .bl-template .bl-block-productsrecommend .bl-block-content-item-product-item-price {
        text-align: center;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-item-product-item-name {
        text-align: right;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-item-product-item-price {
        text-align: right;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-item-product-item-name {
        text-align: right;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-item-product-item-price {
        text-align: right;
    }

    .bl-template .bl-block-productorderitems .bl-content-item-product-item-image {
        text-align: center;
    }

    .bl-template .bl-block-productcartitems .bl-content-item-product-item-image {
        text-align: center;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-1 .bl-block-content-column.bl-column-middle {
        vertical-align: middle;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-1 .bl-block-content-column.bl-column-last {
        vertical-align: middle;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-1 .bl-block-content-column.bl-column-middle {
        vertical-align: middle;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-1 .bl-block-content-column.bl-column-last {
        vertical-align: middle;
    }


    .bl-template table {
        border-collapse: collapse !important;
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
    }

    .bl-template td {
        border-collapse: collapse !important;
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
    }

    .bl-template .bl-template-border {
        border-collapse: collapse !important;
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
    }

    .bl-template p {
        margin: 1em 0;
    }

    .bl-template h1 {
        display: block;
        margin: 0;
        padding: 0;
        font-weight: bold;
        background-color: transparent;
        border: 0px;
        color: #606060 !important;
        font-size: 40px;
        letter-spacing: normal !important;
        line-height: 1.2;
    }

    .bl-template h2 {
        display: block;
        margin: 0;
        padding: 0;
        font-weight: bold;
        background-color: transparent;
        border: 0px;
        color: #606060 !important;
        font-size: 26px;
        letter-spacing: normal !important;
        line-height: 1.2;
    }

    .bl-template h3 {
        display: block;
        margin: 0;
        padding: 0;
        font-weight: bold;
        background-color: transparent;
        border: 0px;
        line-height: 1.2;
        font-size: 18px;
        letter-spacing: normal;
    }

    .bl-template h4 {
        display: block;
        margin: 0;
        padding: 0;
        font-weight: bold;
        background-color: transparent;
        border: 0px;
        line-height: 1.2;
        font-size: 16px;
        letter-spacing: normal;
    }

    .bl-template h1 a {
        color: #6DC6DD;
        font-weight: bold;
    }

    .bl-template h2 a {
        color: #6DC6DD;
        font-weight: bold;
    }

    .bl-template h3 a {
        color: #6DC6DD;
        font-weight: bold;
    }

    .bl-template h4 a {
        color: #6DC6DD;
        font-weight: bold;
    }

    .bl-template .bl-padding-1-column {
        padding: 0px 18px 0px 18px;
    }

    .bl-template .bl-padding-2-columns-left {
        padding: 0px 0px 0px 18px;
    }

    .bl-template .bl-padding-2-columns-right {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .bl-padding-3-columns {
        padding: 0px 18px 0px 18px;
    }



    .bl-template .bl-block-product .bl-column-first .bl-padding-3-columns {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .bl-block-product .bl-column-middle .bl-padding-3-columns {
        padding: 0px 9px 0px 9px;
    }

    .bl-template .bl-block-product .bl-column-last .bl-padding-3-columns {
        padding: 0px 0px 0px 18px;
    }

    .bl-template .template-direction-right .bl-block-product .bl-block-dir-ltr .bl-column-first .bl-padding-3-columns {
        padding: 0px 0px 0px 18px;
    }

    .bl-template .template-direction-right .bl-block-product .bl-block-dir-ltr .bl-column-middle .bl-padding-3-columns {
        padding: 0px 9px 0px 9px;
    }

    .bl-template .template-direction-right .bl-block-product .bl-block-dir-ltr .bl-column-last .bl-padding-3-columns {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .template-direction-right .bl-block-product .bl-block-dir-rtl .bl-column-first .bl-padding-3-columns {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .template-direction-right .bl-block-product .bl-block-dir-rtl .bl-column-middle .bl-padding-3-columns {
        padding: 0px 9px 0px 9px;
    }

    .bl-template .template-direction-right .bl-block-product .bl-block-dir-rtl .bl-column-last .bl-padding-3-columns {
        padding: 0px 0px 0px 18px;
    }

    /* Recommend products */
    .bl-template .bl-block-productsrecommend .bl-column-first .bl-padding-3-columns {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .bl-block-productsrecommend .bl-column-middle .bl-padding-3-columns {
        padding: 0px 9px 0px 9px;
    }

    .bl-template .bl-block-productsrecommend .bl-column-last .bl-padding-3-columns {
        padding: 0px 0px 0px 18px;
    }

    .bl-template .template-direction-right .bl-block-productsrecommend .bl-block-dir-ltr .bl-column-first .bl-padding-3-columns {
        padding: 0px 0px 0px 18px;
    }

    .bl-template .template-direction-right .bl-block-productsrecommend .bl-block-dir-ltr .bl-column-middle .bl-padding-3-columns {
        padding: 0px 9px 0px 9px;
    }

    .bl-template .template-direction-right .bl-block-productsrecommend .bl-block-dir-ltr .bl-column-last .bl-padding-3-columns {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .template-direction-right .bl-block-productsrecommend .bl-block-dir-rtl .bl-column-first .bl-padding-3-columns {
        padding: 0px 18px 0px 0px;
    }

    .bl-template .template-direction-right .bl-block-productsrecommend .bl-block-dir-rtl .bl-column-middle .bl-padding-3-columns {
        padding: 0px 9px 0px 9px;
    }

    .bl-template .template-direction-right .bl-block-productsrecommend .bl-block-dir-rtl .bl-column-last .bl-padding-3-columns {
        padding: 0px 0px 0px 18px;
    }

    /*.bl-template .bl-block-content-first-row .bl-block-content-row-inner { padding-top: 9px }
      .bl-template .bl-block-content-last-row .bl-block-content-row-inner { padding-bottom: 9px }*/

    /*
      .bl-template .social-items-container { text-align: center; }
      .bl-template .social-items-container .social-padding { display: inline-block !important;   max-width: 560px!important;}
      .bl-template .social-items-container .social-table { margin: 0 auto; }
      */

    .bl-template .bl-block-content-item-logo {
        text-align: right;
    }

    .bl-template .bl-block-content-item-viewweb {
        text-align: center;
    }

    /* Article / Header / Footer
      .bl-template .bl-block-content-column .bl-block-content-item + .bl-block-content-item { padding-top:18px; }
      .bl-template .bl-block-content-column .bl-block-content-item + .bl-block-content-item-container .bl-block-content-item-container-inner { padding-top:18px; }
      .bl-template .bl-block-content-column .bl-block-content-item-container + .bl-block-content-item-container .bl-block-content-item-container-inner { padding-top:18px; }
      .bl-template .bl-block-content-column .bl-block-content-item-container + .bl-block-content-item { padding-top:18px; }
      */

    .bl-template .bl-block-content-column .bl-block-content-item-container + .bl-block-content-item-container .bl-block-content-item-container-inner {
        padding-top: 18px;
    }

    .bl-template .bl-block-articleleft .bl-block-content-column .bl-block-content-item-container + .bl-block-content-item-container .bl-block-content-item-container-inner {
        padding-top: 9px;
    }

    .bl-template .bl-block-articleright .bl-block-content-column .bl-block-content-item-container + .bl-block-content-item-container .bl-block-content-item-container-inner {
        padding-top: 9px;
    }

    .bl-template .bl-block-textunderimage .bl-block-content-column .bl-block-content-item + .bl-block-content-item-container .bl-block-content-item-container-inner {
        padding-top: 18px;
    }

    /*for padding text under image*/
    .bl-template .bl-block-textunderimage .bl-block-content-new-column .bl-content-wrapper td {
        padding-bottom: 18px;
    }


    /*.bl-template .bl-block-textunderimage .bl-block-content-new-column .bl-block-content-item-container .bl-block-content-item-container-inner { padding-top:18px; }*/

    .bl-template .bl-block-product .bl-block-content-item-title h2 {
        line-height: 75% !important;
        font-size: 24px;
    }

    .bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-title h2 {
        line-height: 1.2 !important;
        font-size: 24px;
    }

    /* Header styles */
    .bl-template .bl-block-header .bl-block-content-first-row .bl-block-content-row-inner {
        padding-top: 18px;
        padding-bottom: 18px;
    }

    .bl-template .bl-block-header .bl-block-content-last-row .bl-block-content-row-inner {
        padding-top: 18px;
        padding-bottom: 18px;
    }

    /* Product cart + order styles */
    .bl-template .bl-block-productcartitems .bl-block-content-first-row .bl-block-content-row-inner {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-last-row .bl-block-content-row-inner {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-first-row .bl-block-content-row-inner {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-last-row .bl-block-content-row-inner {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-0 .bl-block-content-item-product-item-title a {
        color: #5F5F5F;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-0 .bl-block-content-item-product-item-title a {
        color: #5F5F5F;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-0 .bl-block-content-item-product-item-price {
        color: #5F5F5F;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-0 .bl-block-content-item-product-item-price {
        color: #5F5F5F;
    }


    .bl-template .bl-block-header .bl-block-content-layout-0 .bl-block-content-first-row {
        background-color: #f9f9f9;
    }

        .bl-template .bl-block-header .bl-block-content-layout-0 .bl-block-content-first-row .social-items-container {
            text-align: left;
        }

        .bl-template .bl-block-header .bl-block-content-layout-0 .bl-block-content-first-row .bl-block-content-item-viewweb {
            font-size: 14px;
        }

            .bl-template .bl-block-header .bl-block-content-layout-0 .bl-block-content-first-row .bl-block-content-item-viewweb > div {
                text-align: right;
            }

    .bl-template .bl-block-header .bl-block-content-layout-1 .bl-block-content-first-row .bl-block-content-item-logo {
        text-align: right;
    }

    .bl-template .bl-block-header .bl-block-content-layout-1 .bl-block-content-first-row .bl-block-content-item-viewweb {
        text-align: left;
        font-size: 14px;
    }

    .bl-template .bl-block-header .bl-block-content-layout-1 .bl-block-content-first-row {
        background-color: #f9f9f9;
    }

    .bl-template .bl-block-header .bl-block-content-layout-2 .bl-block-content-first-row .bl-block-content-item-viewweb {
        text-align: center;
        font-size: 14px;
    }

    .bl-template .bl-block-header .bl-block-content-layout-2 .bl-block-content-first-row {
        background-color: #f9f9f9;
    }

    .bl-template .bl-block-header .bl-block-content-layout-2 .bl-block-content-last-row {
        background-color: transparent;
    }

        .bl-template .bl-block-header .bl-block-content-layout-2 .bl-block-content-last-row .bl-block-content-item-logo {
            text-align: right;
        }

        .bl-template .bl-block-header .bl-block-content-layout-2 .bl-block-content-last-row .bl-block-content-item-headerlinks {
            font-size: 14px;
        }

            .bl-template .bl-block-header .bl-block-content-layout-2 .bl-block-content-last-row .bl-block-content-item-headerlinks > div {
                text-align: left;
            }

    .bl-template .bl-block-header .bl-block-content-layout-3 .bl-block-content-first-row .bl-block-content-item-viewweb {
        text-align: center;
        font-size: 14px;
    }

    .bl-template .bl-block-header .bl-block-content-layout-3 .bl-block-content-first-row {
        background-color: #f9f9f9;
    }

    .bl-template .bl-block-header .bl-block-content-layout-3 .bl-block-content-last-row {
        background-color: transparent;
    }

        .bl-template .bl-block-header .bl-block-content-layout-3 .bl-block-content-last-row .bl-block-content-item-logo {
            text-align: right;
        }

        .bl-template .bl-block-header .bl-block-content-layout-3 .bl-block-content-last-row .social-items-container {
            text-align: left;
        }

    /* Footer styles */
    .bl-template .bl-block-footer .bl-block-content-item-text {
        font-size: 14px;
    }

    .bl-template .bl-block-footer .bl-block-content-item-companyinfo > div {
        text-align: center;
    }
    /*.bl-template .bl-block-footer .bl-block-content-first-row .bl-block-content-row-inner { padding-top: 18px; padding-bottom:18px; }
      .bl-template .bl-block-footer .bl-block-content-last-row .bl-block-content-row-inner { padding-top: 18px; padding-bottom: 9px; }*/

    .bl-template .bl-block-footer .bl-block-content-column .bl-block-content-item-canspam {
        text-align: center;
        padding-top: 2px !important;
    }

    .bl-template .bl-block-footer .bl-block-content-column .bl-block-content-item-unsubscribe {
        text-align: center;
    }

    .bl-template .bl-block-footer .bl-block-content-column .bl-block-content-item-container + .bl-block-content-item-container {
        margin-top: 9px;
    }

    /*New Footer*/
    .bl-template .bl-new-footer-wrapper .bl-block-footer .bl-block-content-column .bl-block-content-item-canspam {
        padding-top: 0px !important;
        font-size: 12px !important;
    }

    .bl-template .bl-new-footer-wrapper .bl-block-footer .bl-block-content-column .bl-block-content-item-unsubscribe {
        padding-top: 7px !important;
    }

        .bl-template .bl-new-footer-wrapper .bl-block-footer .bl-block-content-column .bl-block-content-item-unsubscribe a {
            color: #08c;
        }

    /*TO REMOVE*/
    .bl-template .bl-block-footer .bl-block-content-column .bl-block-content-item-copyrights {
        text-align: center;
        padding-top: 2px !important;
    }

    .bl-template .bl-new-footer-wrapper .bl-block-footer .bl-block-content-column .bl-block-content-item-copyrights {
        font-size: 12px !important;
        padding-top: 7px !important;
    }


    .bl-template .bl-block-footer .bl-block-content-row {
        background-color: #f9f9f9;
    }
    /* bl-block-content-layout-0, bl-block-content-first-row, bl-block-content-last-row */
    .bl-template .bl-block-footer .bl-block-content-layout-1 .social-items-container {
        text-align: left;
    }

    .bl-template .bl-block-footer .bl-block-content-layout-3 .bl-block-content-item-headerlinks > div {
        text-align: left;
    }






    /* Images styles */
    .bl-template .at-line-hight-removal {
        font-size: 0px;
        line-height: 0px;
    }

    .bl-template .bl-block-content-item-image.non-editable-content {
        font-size: 15px;
    }


    /*Open issue for outlook 2010 etc...*/
    .bl-template .social-items-container img {
        padding: 0px;
    }

    /*Divider*/
    .bl-template .bl-block-divider .bl-block-content-item-container-inner {
        padding-top: 3px;
        padding-bottom: 3px;
    }

/*Direction*/
.template-direction-left {
    direction: ltr;
}

.bl-template .bl-block-dir-rtl .bl-block-columns-container {
    direction: rtl;
}

.bl-template .bl-block-dir-rtl .bl-block-content-item-container-inner {
    direction: rtl;
}

.bl-template .bl-block-content-item-text {
    direction: rtl;
}

.bl-template .bl-block-content-item-button {
    direction: rtl;
}

.bl-template .bl-block-text td.bl-block-content-row-inner,
.bl-template .bl-block-button td.bl-block-content-row-inner,
.bl-template .bl-block-image td.bl-block-content-row-inner,
.bl-template .bl-block-countdown td.bl-block-content-row-inner,
.bl-template .bl-block-textunderimage td.bl-block-content-row-inner,
.bl-template .bl-block-product-v2 td.bl-block-content-row-inner {
    direction: ltr;
}

.bl-template .bl-block-product.bl-block-product-v2 .bl-block-content-item-td-priceContent .bl-block-content-item-container-inner {
    direction: ltr;
}
/* IE Fix */
.bl-template .bl-zone-dropable.ui-sortable {
    min-height: 0px !important;
}

.bl-footer-adv-sep {
    margin: 0 0 20px 0;
    border: 1px inset;
}

/*.bl-template ul {padding-top: 0px!important; padding-bottom:0px!important; padding-left: 0px!important; padding-right:0px!important; margin-top:10px!important; margin-bottom:10px!important; margin-right:25px!important; margin-left:25px!important; list-style-type:disc;}*/
/*.bl-template ol {padding-top: 0px; padding-bottom:0px; margin-top:0px; margin-bottom:0px; margin-left:25px !important;}*/
.bl-template ol {
    padding: 0px;
    margin-right: 25px !important;
    margin-left: 0px !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

.bl-template ul {
    padding: 0px;
    margin-right: 25px !important;
    margin-left: 0px !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    list-style-type: disc;
}

.bl-template ol[dir="ltr"] {
    margin-right: 0px !important;
    margin-left: 25px !important;
}

.bl-template ul[dir="ltr"] {
    margin-right: 0px !important;
    margin-left: 25px !important;
}

/*Multiple Wrappers in Column (4 columns)*/
.bl-template .bl-block-dir-ltr .bl-block-4-cloumns-wrapper.left {
    padding-right: 6px;
}

.bl-template .bl-block-dir-ltr .bl-block-4-cloumns-wrapper.right {
    padding-left: 6px;
}

.bl-template .bl-block-dir-rtl .bl-block-4-cloumns-wrapper.left {
    padding-left: 6px;
}

.bl-template .bl-block-dir-rtl .bl-block-4-cloumns-wrapper.right {
    padding-right: 6px;
}

.bl-template .menu-item {
    display: inline-block;
}

div[class*="bl-template"] .bl-block-content-item-td {
    padding-bottom: 9px !important;
}

.bl-padding-2-sides {
    padding-left: 9px;
    padding-right: 9px;
}

.bl-template .no-side-padding {
    padding-right: 0px !important;
    padding-left: 0px !important;
}

.bl-block-activecommercecartitems .tb-content-item-product-item-image {
    padding-top: 12px;
    margin-left: 12px;
    padding-right: 6px;
    vertical-align: top;
    display: inline-block;
    width: 264px;
}

.bl-block-activecommercerelateditems .tb-content-item-product-item-image {
    padding-top: 12px;
    margin-left: 12px;
    padding-right: 6px;
    vertical-align: top;
    display: inline-block;
    width: 264px;
}

.bl-block-activecommercecartitems .tb-content-item-product-item-text {
    vertical-align: top;
    display: inline-block;
    padding-top: 12px;
    padding-right: 6px;
    width: 264px;
}

.bl-block-activecommercerelateditems .tb-content-item-product-item-text {
    vertical-align: top;
    display: inline-block;
    padding-top: 12px;
    padding-right: 6px;
    width: 264px;
}

.bl-block-activecommercecartitems .tb-content-item-product-item-price {
    vertical-align: top;
    display: inline-block;
    padding-left: 4px;
    width: 130px;
}

.bl-block-activecommercerelateditems .tb-content-item-product-item-price {
    vertical-align: top;
    display: inline-block;
    padding-left: 4px;
    width: 130px;
}

.bl-block-activecommercecartitems .tb-content-item-product-item-quantity {
    vertical-align: top;
    display: inline-block;
    width: 130px;
}

.bl-block-activecommercerelateditems .tb-content-item-product-item-quantity {
    vertical-align: top;
    display: inline-block;
    width: 130px;
}

.bl-block-activecommercecartitems .tb-content-item-product-item-image a img {
    max-width: 264px !important;
    width: 264px !important;
}

.bl-block-activecommercerelateditems .tb-content-item-product-item-image a img {
    max-width: 264px !important;
    width: 264px !important;
}

.msoBorderWidthAlt {
    mso-border-width-alt: 3px !important;
}

</style><style title="resp" type="text/css">@media screen and (max-width: 480px) {

    div[class*="bl-template"] td[class*="bl-template-border"] {
        min-width: 0px !important;
    }

    div[class*="bl-template-version-2"] div[class*="bl-block-textunderimage"] table[class*="bl-2-columns"]
    div[class*="bl-template-version-2"] div[class*="bl-block-textimage"] table[class*="bl-2-columns"]
    div[class*="bl-template-version-2"] div[class*="bl-block-imagetext"] table[class*="bl-2-columns"]
    div[class*="bl-template-version-2"] div[class*="bl-block-articleright"] table[class*="bl-2-columns"]
    div[class*="bl-template-version-2"] div[class*="bl-block-articleleft"] table[class*="bl-2-columns"]
    div[class*="bl-template-version-2"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"]
    /*, div[class*="bl-template-version-2"] td[class*="bl-block-content-row-inner"]*/ {
        display: block !important;
        max-width: 100% !important;
        width: 100% !important;
    }

    /*div[class*="bl-template-version-2"] table[class*="bl-2-columns"],
      div[class*="bl-template-version-2"] td[class*="bl-block-content-row-inner"]
      {display: table !important; max-width: 100% !important; width: 100% !important;}*/



    div[class*="bl-template-version-2"] table[class*="bl-2-columns"] > table {
        padding-bottom: 36px;
    }

    div[class*="bl-template-version-2"] table[class*="bl-4-columns"], div[class*="bl-template-version-2"] td[class*="bl-block-content-row-inner"] { /*display: table !important;*/
        max-width: 100% !important;
        width: 100% !important;
    }


        div[class*="bl-template-version-2"] table[class*="bl-4-columns"] > table {
            padding-bottom: 36px;
        }

    body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100% !important;
    }

    /*new social share*/
    /*div[class*="bl-template-version-2"] div[class*="bl-block-share"] td[class*="bl-block-content-row-inner"] { width: 360px !important; }*/

    div[class*="bl-template-version-2"] div[class*="bl-block-text"] td[class*="bl-block-content-item-container-inner"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleright"] td[class*="bl-block-content-item-container-inner"],
    div[class*="bl-template-version-2"] div[class*="bl-block-imagetext"] td[class*="bl-block-content-item-container-inner"],
    div[class*="bl-template-version-2"] div[class*="bl-block-textimage"] td[class*="bl-block-content-item-container-inner"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleleft"] td[class*="bl-block-content-item-container-inner"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleright"] td[class*="bl-block-content-item-container-inner"],
    div[class*="bl-template-version-2"] div[class*="bl-block-textunderimage"] td[class*="bl-block-content-item-container-inner"] {
        width: 100% !important;
    }




    div[class*="bl-template-version-2"] div[class*="bl-block-product-v2"] td[class*="bl-padding-2-columns-left"],
    div[class*="bl-template-version-2"] div[class*="bl-block-product-v2"] td[class*="bl-padding-2-columns-right"],
    div[class*="bl-template-version-2"] div[class*="bl-block-divider"] td[class*="bl-padding-2-columns-left"],
    div[class*="bl-template-version-2"] div[class*="bl-block-divider"] td[class*="bl-padding-2-columns-right"],
    div[class*="bl-template-version-2"] div[class*="bl-block-text"] td[class*="bl-padding-2-columns-left"],
    div[class*="bl-template-version-2"] div[class*="bl-block-text"] td[class*="bl-padding-2-columns-right"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleleft"] td[class*="bl-padding-2-columns-left"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleleft"] td[class*="bl-padding-2-columns-right"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleright"] td[class*="bl-padding-2-columns-left"],
    div[class*="bl-template-version-2"] div[class*="bl-block-articleright"] td[class*="bl-padding-2-columns-right"],
    div[class*="bl-template-version-2"] div[class*="bl-block-imagetext"] td[class*="bl-padding-2-columns-left"],
    div[class*="bl-template-version-2"] div[class*="bl-block-imagetext"] td[class*="bl-padding-2-columns-right"] {
        width: 100% !important;
    }
    /*div[class*="bl-template-version-2"] div[class*="bl-block-button"] td[class*="bl-block-content-row-inner"] {display: inline-block !important; }*/



    div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-block-content-item-td-buttonContent"] {
        padding-top: 0px;
    }

    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-titleContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-titleContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-titleContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-textContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-textContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-textContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-imageContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-imageContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-imageContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-priceContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-priceContent"],
    div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-priceContent"] {
        height: auto !important;
    }

        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-titleContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-titleContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-titleContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-textContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-textContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-textContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-imageContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-imageContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-imageContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-1-column"] td[class*="bl-block-content-item-td-priceContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] table[class*="bl-2-columns"] td[class*="bl-block-content-item-td-priceContent"] td[class*="bl-block-content-item-td-wrapper"],
        div[class*="bl-template"] div[class*="bl-block-product-v2"] td[class*="bl-3-columns"] td[class*="bl-block-content-item-td-priceContent"] td[class*="bl-block-content-item-td-wrapper"] {
            height: auto !important;
            padding: 9px;
        }

    div[class*="bl-template"] td[class*="bl-template-margin"] {
        padding: 0 0 !important;
    }

    div[class*="bl-template"] table[class*="template-main-table"] {
        max-width: 600px !important;
        width: 100% !important;
        margin-right: 0px !important;
        margin-left: 0px !important;
    }

    div[class*="bl-template"] table[class*="template-main-table"],
    div[class*="bl-template"] td[class*="bl-template-border"],
    div[class*="bl-template"] td[class*="bl-template-border"] > table,
    div[class*="bl-template"] table[class*="bl-new-footer-container"],
    div[class*="bl-template"] td[class*="bl-new-footer-wrapper"],
    div[class*="bl-template"] td[class*="bl-new-footer-wrapper"] > table,
    div[class*="bl-template"] td[class*="bl-zone"],
    div[class*="bl-template"] td[class*="bl-zone"] > table,
    div[class*="bl-template"] td[class*="bl-block-content-row-inner"] table[class*="bl-block-content-column"] {
        width: 100% !important;
        display: table !important;
    }


    div[class*="bl-template"] td[class*="bl-template-border"],
    table[class*="bl-new-footer-container"] td[class*="bl-zone"] {
        border-width: 0px !important;
    }


    div[class*="bl-template"] .bl-content-wrapper {
        width: 100% !important;
    }

    div[class*="bl-template"] div[class*="bl-block-content-item-image"] img {
        width: 100% !important;
    }

    div[class*="bl-template"] div[class*="bl-block-content-item-countdown"] img {
        width: 100% !important;
    }

    div[class*="bl-template"] div[class*="bl-block-Share"] td[class*="bl-content-wrapper"] {
        padding: 0px !important;
    }

    div[class*="bl-template"] td[class*="bl-block-content-column"] {
        display: block !important;
        max-width: 600px !important;
        width: 100% !important;
    }

        div[class*="bl-template"] table[class*="bl-block-columns-container"],
        div[class*="bl-template"] td[class*="bl-block-content-column"] > table {
            max-width: 600px !important;
            width: 100% !important;
        }




    /*Keep these styles here so they will be included in all campaigns (inliner will not remove them)*/
    body {
        width: 100% !important;
        -webkit-text-size-adjust: none;
        -ms-text-size-adjust: none;
        margin: 0;
        padding: 0
    }

    #outlook a {
        padding: 0;
    }

    .ReadMsgBody {
        width: 100%;
    }

    .ExternalClass {
        width: 100% !important;
        line-height: 100% !important;
    }

    .yshortcuts {
        color: #5187bd;
    }

        .yshortcuts a span {
            color: #5187bd;
            border-bottom: none !important;
            background: none !important;
        }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-1 .bl-block-content-item-product-item-name {
        text-align: center !important;
    }

    .bl-template .bl-block-productcartitems .bl-block-content-layout-1 .bl-block-content-item-product-item-price {
        text-align: center !important;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-1 .bl-block-content-item-product-item-name {
        text-align: center !important;
    }

    .bl-template .bl-block-productorderitems .bl-block-content-layout-1 .bl-block-content-item-product-item-price {
        text-align: center !important;
    }
}
</style></div></div>`;
  // : `<html dir="rtl" lang="iw">` +
  //   `<head><title></title></head>` +
  //   `<body>` +
  //   `<h3>פרטי ההסעה</h3>\n` +
  //   `<p>תאריך: ${gameDetails.date}</p>\n` +
  //   `<p>שעת המשחק: ${gameDetails.gameTime}</p>\n` +
  //   `<p>יציאה מרכבת מרכז: ${gameDetails.busTime}</p>\n` +
  //   `<h3>פרטי ההזמנה</h3>\n` +
  //   `<p>שם: ${userDetails.name}</p>\n` +
  //   `<p>טלפון: ${userDetails.phone}</p>\n` +
  //   `<p>מייל: ${userDetails.email}</p>\n` +
  //   `<p>מס' נוסעים: ${userDetails.numPassengers}</p>\n` +
  //   `<p>תחנת עלייה: ${userDetails.boardingStation}</p>\n` +
  //   `<p>תחנת ירידה: ${userDetails.alightingStation}</p>\n` +
  //   `</body>` +
  //   `</html>`;

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
      console.log("email sent to" + userEmail);
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

  if (index === -1) {
    await appendRows(
      SPREADSHEET_ID,
      "'" + title + "'!A:K",
      "RAW",
      newDetailsRow
    );
  } else {
    const rowNum = (index + 1).toString();
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
  const index = valuesResponse.data.values[0].indexOf(email);
  if (index !== -1) {
    const rowNum = index + 1;

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
      } else if (
        !util.isDeepStrictEqual(
          registeredUsersBefore[key],
          registeredUsersAfter[key]
        )
      ) {
        newUsers[key] = registeredUsersAfter[key];
      }
    }
    const afterKeys = Object.keys(registeredUsersAfter);
    const deletedUsers = {};
    for (const key in registeredUsersBefore) {
      if (!afterKeys.includes(key)) {
        deletedUsers[key] = registeredUsersBefore[key];
      }
    }
    // const newUsers =
    //   registeredUsersBefore.length < registeredUsersAfter.length
    //     ? registeredUsersAfter.filter((x) => !registeredUsersBefore.includes(x))
    //     : [];
    const busTimeDayjs = dayjs(data.bus_time.toDate());
    const mahirTime = busTimeDayjs.add(15, "m");
    const latrunTime = busTimeDayjs.add(35, "m");
    let gameTimeGoogle = data.game_time.toDate();
    gameTimeGoogle.setMonth(data.date.toDate().getMonth());
    gameTimeGoogle.setDate(data.date.toDate().getDate());
    gameTimeGoogle = gameTimeGoogle.toISOString().replace(/-|:|\.\d\d\d/g, "");
    let busTimeGoogle = data.bus_time.toDate();
    busTimeGoogle.setMonth(data.date.toDate().getMonth());
    busTimeGoogle.setDate(data.date.toDate().getDate());
    busTimeGoogle = busTimeGoogle.toISOString().replace(/-|:|\.\d\d\d/g, "");
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
      gameTimeGoogle: gameTimeGoogle,
      busTime:
        data.bus_time.toDate().toLocaleString("en-US", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        }) +
        ":" +
        data.bus_time.toDate().getMinutes().toString().padStart(2, "0"),
      busTimeGoogle: busTimeGoogle,
      mahirTime:
        mahirTime.toDate().toLocaleString("en-US", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        }) +
        ":" +
        mahirTime.toDate().getMinutes().toString().padStart(2, "0"),
      latrunTime:
        latrunTime.toDate().toLocaleString("en-US", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        }) +
        ":" +
        latrunTime.toDate().getMinutes().toString().padStart(2, "0"),
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
