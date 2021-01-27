const emailSender = require('./app');



//function to be passed as template
function emailTemp (name, sentence) {
    return (    
`Dear sir/madam,<br><br>

I am a self-taught web developer with 1 year of experience working with HTML, CSS and JavaScript (ReactJs and NodeJs). Currently seeking a junior position.<br><br>

I am hoping to learn about web development from some of the best in the industry, and in my research, I came across <b>${name}</b>. ${sentence}.<br><br> 

I am more than happy <b>to volunteer working with you</b> <em>if you do not offer any vacancies at the moment but need some extra help with any projects</em>. As I am still a junior in the industry, my main goal is to get hands on experience and improve my skills.<br>
I would be grateful if you could have a look at my CV (please see attached).<br><br>

Here is my recent React and NodeJs project that I have done entirely from scratch including wire-framing and design:<br><br>

Website: https://theGingerBlondie.ie <br>
Front-end code on github: https://github.com/starchcode/gingerblondiebakery <br>
Back-end code on github: https://github.com/starchcode/gingerblondiebackend <br><br>


My LinkedIn profile:<br>
https://ie.linkedin.com/in/davoudraspebrry<br><br>

My Github profile: <br>
https://github.com/starchcode <br><br>


I’d love to hear your feedback.<br>
Sincerely,<br><br>

Davoud Razbari<br>
phone: +353 89 411 2661<br>
website: https://starchCode.com<br>
`
    )
}

//sheet
const SP_ID='1LIZo3hScxCotSqf7KKrufdzROQi0_2bMflC87JQbcAw'
const SHEET= 'Sheet1!'
const TEST_SHEET= 'test!'
//Range    
const UPDATE_RANGE = 'C'
const GET_RANGE = 'B6:H';

const fileName = "Davoud Razbari - CV - 2021-01-26.pdf";
const pathToFile = "./attatchments/Davoud Razbari - CV - 2021-01-26.pdf";

const myEmailSender = new emailSender(SHEET, SP_ID, UPDATE_RANGE, GET_RANGE, emailTemp, fileName, pathToFile);



console.log("\nHi, \nApp is going to start...\n");

myEmailSender.run(); // run the app

