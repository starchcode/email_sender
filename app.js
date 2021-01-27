//packages
require("dotenv").config();
const axios = require("axios");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const nodemailer = require("nodemailer");
const fs = require("fs");

//variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const GOOGLE_API = process.env.GOOGLE_API;
const SP_ID = process.env.SPREADSHEET_ID;

//DATE
let date = new Date();
const YEAR = date.getFullYear()
const MONTH =  date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
const DAY =  date.getDate()
const HOUR = date.getHours() < 10 ? '0' + date.getHours(): date.getHours();
const MINUTE = date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes();
const SECONDS = date.getSeconds() < 10 ? '0' + date.getSeconds(): date.getSeconds();
const DATE = ''+YEAR+MONTH+DAY + ' - ' + HOUR+MINUTE+SECONDS; //append date and convert to string

const logger = (DATE, DATA) => {
  fs.appendFile(`log/log${DATE}.txt`, DATA, function (err) {
    if (err) throw err;
    console.log(DATA);
  });
};

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
  constructor(sheet, updateRange, getRange, emailTemp, fileName, pathToFile) {
    this._i = 0;
    this._data = [];
    this._interval;
    this._sheet = sheet;
    this._updateRange = updateRange;
    this._getRange = getRange;
    this._emailTemp = emailTemp;
    this._fileName = fileName;
    this._pathToFile = pathToFile;
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
          range: this.sheet + this.getRange,
        },
        (err, res) => {
          if (err) {
            logger(DATE, "The API returned an error.");

            throw err;
          }
          this.data = res.data.values.filter((row) => {
            // 1 index: email status
            // 3 index: name
            // 5 index: email address
            return !row[1] && row[3] && row[5] && row[6];
          });
          if (res.status === 200) {
              logger(DATE,`☑️  Data recieved, there are ${this.data.length} emails to be sent
            `)
          }

          if (this.data.length) {
            logger(DATE,`
            Going to send emails.
            `);
            // console.log(this.data[0])
          }
        }
      );
    } catch (e) {
        logger(e.response);
    }
  };

  update = async (i, value) => {
    try {
        logger(DATE,`Updating email status in spreadsheet...
        `)
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SP_ID,
        range: this.sheet + this.updateRange + i,
        valueInputOption: "USER_ENTERED",

        requestBody: {
          values: [[value]],
        },
      });
      if (response.status === 200) console.log("cell", i - 5, "was updated");
    } catch (e) {
        logger(e + `
        `);
    }
  };

  emailMachine = async (name, email, body, i) => {
    // send mail with defined transport object
    const updateIndex = Number(this.data[i][0]) + 5;
    logger(DATE,`Email Machine launched
    `)

    let info = await transporter.sendMail(
      {
        from: "davoudraspberry@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Inquiry - Davoud Razbari", // Subject line
        //   text: "Hi, Here is your code Mr.Dave!: ", // plain text body
        html: body, // html body
        attachments: [
          {
            filename: this._fileName,
            path: this._pathToFile,
            contentType: "application/pdf",
          },
        ],
      },
      (err) => {
        if (err) {
          this.update(updateIndex, "Error!");
        } else {
          this.update(updateIndex, "Email Sent!");
          //   console.log("Email sent to", name, ":", email);
        }
      }
    );
  };

  coreMethod = async () => {
    // console.log(i, data.length)
    const pullData = (j) => this.data[this.i][j];

    if (this.i < this.data.length) {
      const name = pullData(3);
      const email = pullData(5);
      const sentence = pullData(6);
      logger(DATE,`
      Email  ${this.i + 1} out of ${this.data.length}
      `)
      logger(DATE,`Sending an email to: ${name} > ${email}`)

      // console.log(this._emailTemp(name, sentence))
      this.emailMachine(name, email, this._emailTemp(name, sentence), this.i);

    //   this.update(Number(this.data[this.i][0]) + 5, 'Email Sent!');

      this.i++;
    } else {
        logger(DATE,`
        Job is done! 👍🏼
        `)
      clearInterval(this.interval);
    }
  };

 run = async () => {
    await this.getData();
    this.interval = setInterval(this.coreMethod, 2000);
}
}

module.exports = emailSender;
