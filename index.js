const emailSender = require('./app');

//function to be passed as template

function emailTemp () {
    return (
        ``
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