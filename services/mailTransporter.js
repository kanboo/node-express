const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.MAILER_ACCOUNT,
    pass: process.env.MAILER_PASSWORD,
  },
})

 // 註冊成功通知信
const registerSuccessMail = (email) => {
  transporter.sendMail({
    from: process.env.MAILER_ACCOUNT,
    to: email,
    subject: 'Meta-Wall Register Success',
    html: `
      Congratulations on your successful registration.
      <br>
      <br>
      Website: <a href="https://meta-wall.kanboo.cc/">Meta-Wall</a>
    `,
  })
    .then((info) => {
      console.log('發信通知', { info })
    })
    .catch(console.error)
}

module.exports = {
  registerSuccessMail,
}
