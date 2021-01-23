//packages
require("dotenv").config();
const axios = require("axios");
const { google } = require("googleapis");
const sheets = google.sheets("v4");

//setup
let data = [];
let i = 0;
let interval;

const auth = new google.auth.GoogleAuth({
  //google auth!
  keyFile: "./key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], //read & write
});
// set auth as a global default
google.options({
  auth: auth,
});

//variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const GOOGLE_API = process.env.GOOGLE_API;
const SP_ID = process.env.SPREADSHEET_ID;
const URL =
  "https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:D5";

//functions

const get = async () => {
  try {
    await sheets.spreadsheets.values.get(
      {
        auth: auth,
        spreadsheetId: SP_ID,
        //   range: 'Sheet1!C5:G',
        range: "test!B6:G", // TEST
      },
      (err, res) => {
        if (err) {
          console.error("The API returned an error.");
          throw err;
        }

        data = res.data.values.filter((row) => {
          // 1 index: email status
          // 3 index: name
          // 5 index: email address
        return !row[1] && row[3] && row[5]

        });
        console.log(
          "Data recieved, there are",
          data.length,
          "emails to be sent"
        );

        if (data.length) {
          console.log("\nGoing to send emails.");

          interval = setInterval(mailSender, 2000);
        }
      }
    );
  } catch (e) {
    console.log(e.response);
  }
};

//mail sender function
mailSender = async () => {
    // console.log(i, data.length)
  if (i < data.length) {
    console.log("\nEmail ", i + 1, "out of", data.length);
    console.log("Sending an email to:", data[i][5]);

    update(Number(data[i][0]) + 5);

    i++;
  } else {
    console.log("Job is done\n");
    clearInterval(interval);
  }
};

const update = async (i) => {
  try {
    console.log("Update email status in spreadsheet...");
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SP_ID,
      //   range: 'Sheet1!C6',
      range: "test!C" + i,
      valueInputOption: "USER_ENTERED",

      requestBody: {
        values: [["Email Sent!"]],
      },
    });
    if (response.status === 200) console.log('cell', i-5, 'was updated');
  } catch (e) {
    console.log(e);
  }
};

//run

console.log("\nHi, \nApp is going to start...\n");

get();
// update();

// app();

// const starter = setInterval(mailSender, 3000);
