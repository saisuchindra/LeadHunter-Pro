const db = require('../config/db');

const User = {
  async create({ email, passwordHash, name }) {
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, plan, created_at`,
      [email, passwordHash, name]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query(
      `SELECT id, email, name, plan, created_at FROM users WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  async updatePlan(id, plan) {
    const { rows } = await db.query(
      `UPDATE users SET plan = $1 WHERE id = $2 RETURNING id, email, name, plan`,
      [plan, id]
    );
    return rows[0];
  },
};

module.exports = User;
