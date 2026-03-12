const db = require('../config/db');

const EmailTemplate = {
  async create({ user_id, name, subject, body, type, variables }) {
    const { rows } = await db.query(
      `INSERT INTO email_templates (user_id, name, subject, body, type, variables)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, name, subject, body, type, variables || []]
    );
    return rows[0];
  },

  async list(userId) {
    const { rows } = await db.query(
      `SELECT * FROM email_templates WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const { rows } = await db.query(
      `SELECT * FROM email_templates WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0];
  },

  async update(id, userId, { name, subject, body, type, variables }) {
    const { rows } = await db.query(
      `UPDATE email_templates SET name=COALESCE($1,name), subject=COALESCE($2,subject),
       body=COALESCE($3,body), type=COALESCE($4,type), variables=COALESCE($5,variables)
       WHERE id=$6 AND user_id=$7 RETURNING *`,
      [name, subject, body, type, variables, id, userId]
    );
    return rows[0];
  },

  async delete(id, userId) {
    const { rowCount } = await db.query(
      `DELETE FROM email_templates WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rowCount > 0;
  },

  async incrementUsage(id) {
    await db.query(`UPDATE email_templates SET usage_count = usage_count + 1 WHERE id = $1`, [id]);
  },
};

module.exports = EmailTemplate;
