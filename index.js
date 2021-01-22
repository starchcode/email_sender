//packages
require("dotenv").config();
const axios = require("axios");
//setup
let data = ["a", "b", "c"];
let i = 0;

//variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const GOOGLE_API = process.env.GOOGLE_API;
const SP_ID = process.env.SPREADSHEET_ID;

const URL =
  "https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:D5";

const app = async () => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SP_ID}/values/Sheet1!C6:E6`,
      {
        params: {
          key: GOOGLE_API,
        },
      }
    );

    console.log(response.data.values);
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

    const response = await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${SP_ID}/values/Sheet1!C6:C6?valueInputOption=USER_ENTERED`,
      {
        range: "Sheet1!C6:C6",
        majorDimension: "ROWS",
        values: [["NodeJs"]],

    },{
        params: {
          key: GOOGLE_API,
        }
    }
    );

    console.log(response.data.values);
  } catch (e) {
    console.log(e.response);
  }
};

console.log("\nHi, \nApp is going to send emails");

// update();
app();

// const starter = setInterval(mailSender, 3000);
