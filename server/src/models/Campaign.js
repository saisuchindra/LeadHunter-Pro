const db = require('../config/db');

const Campaign = {
  async create({ user_id, name, type, lead_filter, sequence }) {
    const { rows } = await db.query(
      `INSERT INTO campaigns (user_id, name, type, lead_filter, sequence)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [user_id, name, type || 'email', JSON.stringify(lead_filter || {}), JSON.stringify(sequence || [])]
    );
    return rows[0];
  },

  async list(userId) {
    const { rows } = await db.query(
      `SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const { rows } = await db.query(
      `SELECT * FROM campaigns WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0];
  },

  async update(id, userId, fields) {
    const allowed = ['name', 'type', 'status', 'lead_filter', 'sequence', 'stats'];
    const sets = [];
    const params = [];
    let idx = 1;
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = $${idx++}`);
        params.push(['lead_filter', 'sequence', 'stats'].includes(key) ? JSON.stringify(fields[key]) : fields[key]);
      }
    }
    if (sets.length === 0) return null;
    params.push(id, userId);
    const { rows } = await db.query(
      `UPDATE campaigns SET ${sets.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`,
      params
    );
    return rows[0];
  },

  async delete(id, userId) {
    const { rowCount } = await db.query(
      `DELETE FROM campaigns WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rowCount > 0;
  },
};

module.exports = Campaign;
