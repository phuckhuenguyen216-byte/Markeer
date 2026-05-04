// Quick test: can we connect to Google Sheets without .env?
import { google } from "googleapis";

const sheetId = "1demweJf6kgGDj-G_KcILVT6L6rf9d8ulzqfQfOXCvGQ";
const email = "markee-sheets-bot@yleapiaccount.iam.gserviceaccount.com";
const key = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkTTNWzjBdYxYf
w8VaNCrPAO6qVUxYnRmMTJEqdHb7jH02S6pBBmenqO1DAfpa6Pn+1Y8h2Hr1fiVK
Cp0RNGBi+q5A02BVFtALg2HAMu9OTXSVtTBA3Qgrio5uyYphx2Okw292ZairCyrX
WTvjH2W1/B0oi5SjL489YEw6wc2PwdWI+Isq025CY2rUq1MeV1HDfxVPc1ubVhWZ
Nwj5p08khOVhxcqKBTnAtuOGJ0Cgtrg/UwFJt5VXZO/Xu13tHWtYRs1KAHeVP3TL
81wsCsORGfkezXO2Uk03Z70OYxJqTZC//pSxFKD/k5WA8JC14Mq1uOzAHtm1yE8t
zFCqsjYhAgMBAAECggEAAPT25YSXByU1htb1XFmRTgI0saLkal/0WxMDVaym2H9U
h5tcVQt+MS2Yf6dYW50PnyyD3FPqH+nFmnM6P9RW8x6gAw5EGWzEBowj5qpZRtLI
SPqsmrUa2AOTIamsc9Y1IiuV96nfCAt9KvLI6LFJLqyWqCK7eXGUh0xLN1yjd4jM
Y6ZtorMMIfenLhfVy/Vwsmgq/Uc1tdViX4F4rgLU/GwPqdbRbysPKy9/xfaCmW6A
UJUBAfNEuEbmnkAHDdxTsqAcPRoe4T3blEx8iJUMozcp5v4VxiLb7ApVQ6soVoDl
woZg/7BaE/i3h2t4+oyBLaR/rD8J4AwbsZ7P6iWdsQKBgQDPzp1L+y8wRspQORJs
8BoqHG67noiMi3mAVKZbZt4G2SFKLcevrOx9SBbkRCb3gb+9MvH3bqsE1f+NMsZD
JPOSTVqAEV7o89+B2Z3TYcDcuXf2oWZoUjy1ewXWYjXKYXZpc4rokbKTjjuwSd0Z
m6p0y0/gwj5/IoOx9X6LgzL1UQKBgQDKZ7BG2wKMBrl+CuHe0Lnitt/LM8fl4Pl+
lFuRX6MYlnn5wXCneDOhxa9+LCOKLTEVO96GrffzspHujY18cc5XVcBrbaCa69Tb
EtG6NWuVQf07BI7mBLaF52NU4HXhhKMqM4AwtY24jJpAwjRbIMNIcdum2CIV2qrc
XVB4rek/0QKBgBDhrA2cHj1BwvW5bTHEX5vEK4q6WkVwnzI5rjoGpUrRIM8x4OL4
nU2gKZvpnXDF7ZmlJdr/9oyyBcymr0yNF+xutEdrIday2RlnYFbnvg8wUfqLKhKX
e68Si2rbF5uVR1VRuZsjGuq5x0eO+JM3/iT2z0pm/US+vQwb8WfMBLvBAoGAUbm4
RYPc7WkxsKD4Pp2M0OwCROwthLZoRyHkLzishBsOOThQIm64elN13r43w20n6mj4
Gu1XtsCdh/MD9AGHzV/EiBwFw0gB9EsO/97eB7BTbWcTw/CXOk4Jn5XaQyrpLvsI
gaJtDN1I02kW9sytzSycAiw25xgZ8UyEV5XxHmECgYEAsqPnIgHLHQ9eLvLBpSq/
CwlAq4yAuhxK76m2SQBSIMFeGpnbnhPVBPJBbG16axNzR2W6C4LMFcCjLbG+rTGl
+Og4rPpBNUd61550gbH8QDJxMhqmZPsNYawkrODzdMNRqJqdsicVgwdFhx3K34gL
ztqEBm8PcQ+7XMVO+4k7Rpg=
-----END PRIVATE KEY-----
`;

console.log("=== Google Sheets Connection Test ===");
console.log(
  "Sheet ID:",
  sheetId ? `${sheetId.substring(0, 20)}...` : "MISSING",
);
console.log("Service Email:", email ? "SET" : "MISSING");
console.log("Private Key:", key ? "SET" : "MISSING");

try {
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  console.log("\nConnected successfully!");
  console.log("Spreadsheet title:", res.data.properties.title);
  console.log(
    "Sheets:",
    res.data.sheets.map((s) => s.properties.title).join(", "),
  );

  const sheetName = res.data.sheets[0].properties.title;
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:Z1`,
  });
  console.log("First row:", data.data.values ? data.data.values[0] : "(empty)");
  console.log("\nSheet tab name:", sheetName);
  if (sheetName !== "Ứng viên") {
    console.log("Tab name is NOT 'Ứng viên'. Code expects 'Ứng viên'.");
    process.exitCode = 1;
  }
} catch (err) {
  console.error("\nConnection failed:", err.message);
  if (err.code === 403)
    console.error("Sheet not shared with service account email");
  if (err.code === 404) console.error("Sheet ID is wrong");
  process.exit(1);
}
