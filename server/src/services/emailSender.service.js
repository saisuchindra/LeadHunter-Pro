const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

function replaceVariables(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

async function sendEmail({ to, subject, body, variables = {} }) {
  const renderedSubject = replaceVariables(subject, variables);
  const renderedBody = replaceVariables(body, variables);

  const info = await transporter.sendMail({
    from: `"LeadHunter Pro" <${env.smtp.user}>`,
    to,
    subject: renderedSubject,
    html: renderedBody,
  });

  return { messageId: info.messageId, accepted: info.accepted };
}

module.exports = { sendEmail, replaceVariables };
