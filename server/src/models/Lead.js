const db = require('../config/db');

const Lead = {
  async create(lead) {
    const { rows } = await db.query(
      `INSERT INTO leads (
        user_id, business_name, category, phone, email, address, city, country,
        latitude, longitude, has_website, website_url, website_speed_score,
        has_gmb, gmb_url, google_rating, review_count, last_gmb_update,
        instagram_url, facebook_url, has_social,
        opportunity_score, score_reasons, status, source
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      ) RETURNING *`,
      [
        lead.user_id, lead.business_name, lead.category, lead.phone, lead.email,
        lead.address, lead.city, lead.country || 'India',
        lead.latitude, lead.longitude,
        lead.has_website || false, lead.website_url, lead.website_speed_score,
        lead.has_gmb || false, lead.gmb_url, lead.google_rating, lead.review_count || 0,
        lead.last_gmb_update,
        lead.instagram_url, lead.facebook_url, lead.has_social || false,
        lead.opportunity_score, lead.score_reasons ? JSON.stringify(lead.score_reasons) : null,
        lead.status || 'new', lead.source || 'google_places',
      ]
    );
    return rows[0];
  },

  async findById(id, userId) {
    const { rows } = await db.query(
      `SELECT * FROM leads WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0];
  },

  async list(userId, { category, city, status, minScore, maxScore, search, limit = 50, offset = 0 } = {}) {
    const conditions = ['user_id = $1'];
    const params = [userId];
    let idx = 2;

    if (category) { conditions.push(`category = $${idx++}`); params.push(category); }
    if (city) { conditions.push(`city ILIKE $${idx++}`); params.push(`%${city}%`); }
    if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
    if (minScore != null) { conditions.push(`opportunity_score >= $${idx++}`); params.push(minScore); }
    if (maxScore != null) { conditions.push(`opportunity_score <= $${idx++}`); params.push(maxScore); }
    if (search) {
      conditions.push(`(business_name ILIKE $${idx} OR address ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.join(' AND ');
    params.push(limit, offset);

    const countResult = await db.query(`SELECT COUNT(*) FROM leads WHERE ${where}`, params.slice(0, -2));
    const { rows } = await db.query(
      `SELECT * FROM leads WHERE ${where} ORDER BY opportunity_score DESC NULLS LAST, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      params
    );
    return { leads: rows, total: parseInt(countResult.rows[0].count, 10) };
  },

  async update(id, userId, fields) {
    const allowed = [
      'business_name', 'category', 'phone', 'email', 'address', 'city',
      'status', 'notes', 'tags', 'assigned_to', 'opportunity_score', 'score_reasons',
    ];
    const sets = [];
    const params = [];
    let idx = 1;
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = $${idx++}`);
        params.push(key === 'score_reasons' ? JSON.stringify(fields[key]) : fields[key]);
      }
    }
    if (sets.length === 0) return null;
    sets.push(`updated_at = NOW()`);
    params.push(id, userId);

    const { rows } = await db.query(
      `UPDATE leads SET ${sets.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`,
      params
    );
    return rows[0];
  },

  async delete(id, userId) {
    const { rowCount } = await db.query(
      `DELETE FROM leads WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rowCount > 0;
  },

  async bulkUpdateStatus(ids, userId, status) {
    const { rowCount } = await db.query(
      `UPDATE leads SET status = $1, updated_at = NOW() WHERE id = ANY($2::uuid[]) AND user_id = $3`,
      [status, ids, userId]
    );
    return rowCount;
  },

  async getStats(userId) {
    const { rows } = await db.query(
      `SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'contacted') AS contacted,
        COUNT(*) FILTER (WHERE status = 'replied') AS replied,
        COUNT(*) FILTER (WHERE status = 'client') AS converted,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 day') AS today
      FROM leads WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  },

  async getCategoryBreakdown(userId) {
    const { rows } = await db.query(
      `SELECT category, COUNT(*) AS count FROM leads WHERE user_id = $1 GROUP BY category ORDER BY count DESC`,
      [userId]
    );
    return rows;
  },

  async getDailyLeads(userId, days = 14) {
    const { rows } = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM leads WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 day' * $2
       GROUP BY DATE(created_at) ORDER BY date`,
      [userId, days]
    );
    return rows;
  },

  async getFunnel(userId) {
    const { rows } = await db.query(
      `SELECT status, COUNT(*) AS count FROM leads WHERE user_id = $1 GROUP BY status`,
      [userId]
    );
    return rows;
  },
};

module.exports = Lead;
