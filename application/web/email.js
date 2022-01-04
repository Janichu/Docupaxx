// const http = require("http");

// const PORT = 3000;

// const SENDER_EMAIL = `rigog02@live.com`
// const RECIEVER_EMAIL = 'rigorojas158@gmail.com'
// const API_KEY = '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'

// http.createServer((req, res) => {

//     const sgMail = require('@sendgrid/mail');
//     sgMail.setApiKey(API_KEY);


//     const msg = {
//         to: SENDER_EMAIL,
//         from: RECIEVER_EMAIL,
//         subject: 'Contact US Message',
//         text: `First hello`,
//         html: `<strong>hello</strong>`,
//     };

//     sgMail.send(msg, function (err, info) {
//         if (err) {
//             console.log("Email not sent");
//         } else {
//             console.log("Email sent successful");
//         }
//     });

//     res.end();
// })
//     .listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));

