//packages
require("dotenv").config();
const axios = require("axios");
const {google} = require('googleapis');
const sheets = google.sheets('v4')

//setup
let data = ["a", "b", "c"];
let i = 0;
const auth = new google.auth.GoogleAuth({ //google auth!
    keyFile: './key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], //read & write
  });
// set auth as a global default
google.options({
    auth: auth
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
    sheets.spreadsheets.values.get(
        {
          auth: auth,
          spreadsheetId: SP_ID,
          range: 'Sheet1!C6:E6',
        },
        (err, res) => {
          if (err) {
            console.error('The API returned an error.');
            throw err;
          }
          const rows = res.data.values;
          console.log(rows)
        }
      )
  } catch (e) {
    console.log(e.response);
  }
};

//mail sender function
mailSender = async () => {
  if (i < data.length) {
    console.log(data[i]);
    i++;
  } else {
    console.log("Job is done\n");
    clearInterval(starter);
  }
};

const update = async () => {
  try {

    const response = await sheets.spreadsheets.values.update(
        {
          spreadsheetId: SP_ID,
          range: 'Sheet1!C6',
          valueInputOption: 'USER_ENTERED',
         
          requestBody: {
            values: [
              ['Email Sent!']
            ],
          }
        }
      );
        console.log(response.status);

  } catch (e) {
    console.log(e);
  }
  console.log('end')
};



//run

console.log("\nHi, \nApp is going to start...");

get();
// update();


// app();

// const starter = setInterval(mailSender, 3000);
