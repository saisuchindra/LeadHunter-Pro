let Queue;
try {
  Queue = require('bull');
} catch {
  // Bull not available
}

const emailSender = require('../services/emailSender.service');
const OutreachLog = require('../models/OutreachLog');

let emailQueue = null;

function initEmailQueue(redisUrl) {
  if (!Queue) return null;
  try {
    emailQueue = new Queue('email-send', redisUrl);

    emailQueue.process(async (job) => {
      const { to, subject, body, variables, logId } = job.data;
      await emailSender.sendEmail({ to, subject, body, variables });
      if (logId) {
        await OutreachLog.updateStatus(logId, 'delivered');
      }
    });

    return emailQueue;
  } catch {
    return null;
  }
}

module.exports = { initEmailQueue, getQueue: () => emailQueue };
