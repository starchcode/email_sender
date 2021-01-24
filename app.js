//packages
require("dotenv").config();
const axios = require("axios");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const nodemailer = require('nodemailer');


//variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const GOOGLE_API = process.env.GOOGLE_API;
const SP_ID = process.env.SPREADSHEET_ID;

//setup
const auth = new google.auth.GoogleAuth({
    //google auth!
    keyFile: "./key.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], //read & write
  });
  // set auth as a global default
  google.options({
    auth: auth,
  });

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // generated ethereal user
        pass: process.env.GMAIL_PASS, // generated ethereal password
      },
    });




class emailSender {
  constructor(sheet) {
    this._i = 0;
    this._data = [];
    this._interval;
    this._sheet = sheet;
    this._updateRange = 'C'
    this._getRange = 'B6:G';
  }

  get i() {
    return this._i;
  }
  get data() {
    return this._data;
  }
  get interval() {
    return this._interval;
  }
  get sheet() {
      return this._sheet;
  }
  get updateRange() {
      return this._updateRange;
  }
  get getRange() {
      return this._getRange;
  }

  set i(i) {
    this._i = i;
  }
  set data(data) {
    this._data = data;
  }
  set interval(interval) {
    this._interval = interval;
  }

  getData = async () => {
    try {
      await sheets.spreadsheets.values.get(
        {
          auth: auth,
          spreadsheetId: SP_ID,
            range: this.sheet + this.getRange
        },
        (err, res) => {
          if (err) {
            console.error("The API returned an error.");
            throw err;
          }
          this.data = res.data.values.filter((row) => {
            // 1 index: email status
            // 3 index: name
            // 5 index: email address
            return !row[1] && row[3] && row[5];
          });
          if(res.status === 200){
          console.log(
            "☑️  Data recieved, there are",
            this.data.length,
            "emails to be sent"
          );
          }

          if (this.data.length) {
            console.log("\nGoing to send emails.");
          }
        }
      );
    } catch (e) {
      console.log(e.response);
    }
  };

  update = async (i) => {
    try {
      console.log("Updating email status in spreadsheet...");
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SP_ID,
        range: this.sheet + this.updateRange + i,
        valueInputOption: "USER_ENTERED",

        requestBody: {
          values: [["Email Sent!"]],
        },
      });
      if (response.status === 200) console.log("cell", i - 5, "was updated");
    } catch (e) {
      console.log(e);
    }
  };


  emailMachine = async () => {
    // send mail with defined transport object
    let info = await transporter.sendMail(
        {
          from: "<davoudraspberry@gmail.com>", // sender address
          to: "starchcode@gmail.com", // list of receivers
          subject: "Hello ✔", // Subject line
        //   text: "Hi, Here is your code Mr.Dave!: ", // plain text body
          html: "<b>Hello world?</b>", // html body
        },
        function (err, data) {
          if (err) {
            console.log("error: email did not send", err);
            res.send("this could not be processed!");
          } else {
            res.send("Thank you! It's all done!");
          }
        }
      );
  }


  coreMethod = async () => {
    // console.log(i, data.length)
    if (this.i < this.data.length) {

      console.log("\nEmail ", this.i + 1, "out of", this.data.length);
      console.log("Sending an email to:", this.data[this.i][3],' > ', this.data[this.i][5]);

      this.update(Number(this.data[this.i][0]) + 5);

      this.i++;

    } else {
      console.log("\nJob is done! 👍🏼\n");
      clearInterval(this.interval);
    }
  };

  
}

module.exports = emailSender;
