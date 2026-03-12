const db = require('../config/db');

const OutreachLog = {
  async create({ lead_id, user_id, type, direction, subject, body, status }) {
    const { rows } = await db.query(
      `INSERT INTO outreach_logs (lead_id, user_id, type, direction, subject, body, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [lead_id, user_id, type, direction || 'outbound', subject, body, status || 'sent']
    );
    return rows[0];
  },

  async findByLead(leadId) {
    const { rows } = await db.query(
      `SELECT * FROM outreach_logs WHERE lead_id = $1 ORDER BY created_at DESC`,
      [leadId]
    );
    return rows;
  },

  async updateStatus(id, status, extra = {}) {
    const sets = ['status = $1'];
    const params = [status];
    let idx = 2;
    if (status === 'opened') { sets.push(`opened_at = NOW()`); }
    if (status === 'replied') { sets.push(`replied_at = NOW()`); }
    if (extra.call_duration) { sets.push(`call_duration = $${idx++}`); params.push(extra.call_duration); }
    params.push(id);
    const { rows } = await db.query(
      `UPDATE outreach_logs SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0];
  },

  async getRecent(userId, limit = 20) {
    const { rows } = await db.query(
      `SELECT ol.*, l.business_name, l.category, l.city
       FROM outreach_logs ol JOIN leads l ON ol.lead_id = l.id
       WHERE ol.user_id = $1 ORDER BY ol.created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },
};

module.exports = OutreachLog;
