const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SGAPI

sgMail.setApiKey(sendgridAPIKey)

// sgMail.send({
//     to: 'abhinaba006@gmail.com',
//     from: 'abhinaba006@gmail.com',
//     subject: 'test',
//     text: 'hi I am testing'
// })

const sendWelcomeMail = (email, name)=>{
    sgMail.send({
        to:email,
        from:"abhinaba006@gmail.com",
        subject:"Welcome! Thanks for joining",
        text:`Welcome to the app, ${name}. Fuck you`
    })
}

const sendCancelationMail = (email, name)=>{
    sgMail.send({
        to:email,
        from:"abhinaba006@gmail.com",
        subject:"Thanks for using us",
        text:`${name} why did you delete your account? or any feedback`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}