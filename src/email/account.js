const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD
    }
});

const createAcountmail = async (receiver) => {
    // const ma = 'sending mail'   

    const info = await transporter.sendMail({
        from: '"Dharmesh Dadhaniya 👻" <dharmeshcodeage@gmail.com>', // sender address
        to: receiver,   //"dharmeshcodeage@gmail.com", // list of receivers
        subject: "Acount Created ✔", // Subject line
        text: "Wecome to Task Manager", // plain text body
        html: "<b>Good To see you with us</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    return info.messageId
}

const deleteAcountmail = async (receiver) => {
    // const ma = 'sending mail'   

    const info = await transporter.sendMail({
        from: '"Dharmesh Dadhaniya 👻" <dharmeshcodeage@gmail.com>', // sender address
        to: receiver,   //"dharmeshcodeage@gmail.com", // list of receivers
        subject: "Acount Deleted ✔", // Subject line
        text: "Thanks from Task Manager", // plain text body
        html: "<b>We are Thanksfull to be with us form such a long time.<br/>if something not like about us then just let us know so we can imporve that.</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    return info.messageId
}

module.exports = { createAcountmail, deleteAcountmail }