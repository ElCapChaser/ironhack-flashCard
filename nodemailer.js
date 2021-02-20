const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

const welcomeEmail = (userEmail) => {
  const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  transport
    .sendMail({
      from: process.env.GMAIL_ADDRESS, // Sender
      to: userEmail, // Receiver
      subject: "Welcome! Happy you're joining us!",
      html: `
          <html>
          <head>
              <style>
              a {
                  background-color: yellow;
              }
              </style>
          </head>
          <body>
              <h1>Welcome!</h1>
              <p>We are happy to have you on board! <a href="https://ironflashcard.herokuapp.com/private">Go and practice now!</a></p>
              <footer>This email was sent as part of an IronHack class project. We are students learning how to code.</footer>
          </body>
          </html>`
    })
    .then((result) => {
      console.log('Welcome email was sent.');
      console.log(result);
    })
    .catch((error) => {
      console.log('There was an error sending welcome email');
      console.log(error);
    });
};

const errorEmail = (creatorEmail) => {
  const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  transport
    .sendMail({
      from: process.env.GMAIL_ADDRESS, // Sender
      to: creatorEmail, // Receiver
      subject: 'Wooppss, someone flagged an error on your card.',
      html: `
          <html>
          <head>
              <style>
              a {
                  background-color: yellow;
              }
              </style>
          </head>
          <body>
              <h1>Welcome!</h1>
              <p>More than 3 users flagged a possible error on one of your cards. <a href="https://ironflashcard.herokuapp.com/private">Check it out!</a></p>
              <footer>This email was sent as part of an IronHack class project. We are students learning how to code.</footer>
          </body>
          </html>`
    })
    .then((result) => {
      console.log('Errorflag email was sent.');
      console.log(result);
    })
    .catch((error) => {
      console.log('There was an error sending the errorflag email');
      console.log(error);
    });
};

module.exports = {
  welcomeEmail: welcomeEmail,
  errorEmail: errorEmail
};
