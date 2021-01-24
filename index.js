const emailSender = require('./app');



//function to be passed as template

function emailTemp () {
    return (
        
`<b>Hello admin,</b> <br> <br>
here is a new message. reply by clicking on the email or copy and paste it in your form!<br><br>
Full name: ${req.body.fullName}<br>
Email: <a href="mailto:${req.body.email}">${req.body.email}</a><br>
Phone: ${req.body.phone}<br>
Enquiry: <br>" <em>${req.body.enquiry}</em>"
`
    )
}



//run

console.log("\nHi, \nApp is going to start...\n");

const myEmailSender = new emailSender();

const run = async () => {
    await myEmailSender.getData();
    myEmailSender.interval = setInterval(myEmailSender.coreMethod, 2000);
}

run();