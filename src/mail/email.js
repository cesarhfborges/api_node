'use strict';

import nodemailer from "nodemailer";
import {templateHtml} from "./template.js";

async function email({from, to, subject} = {from: '', to: '', subject: ''}) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dortha.farrell@ethereal.email', // testAccount.user, // generated ethereal user
            pass: '311fj3ytNV4dCRsQxs' //testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: from, // sender address "Fred Foo 👻" <foo@example.com>
        to: to, // list of receivers "bar@example.com, baz@example.com"
        subject: subject, // Subject line "Hello ✔"
        text: 'Teste', // plain text body "Hello world?"
        html: templateHtml, // html body "<b>Hello world?</b>"
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export {email};
