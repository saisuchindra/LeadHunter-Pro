function calculateScore(lead) {
  let score = 0;
  const reasons = [];

  if (!lead.has_website) {
    score += 30;
    reasons.push('NO_WEBSITE');
  } else {
    if (lead.websiteAnalysis?.isDown) { score += 25; reasons.push('WEBSITE_DOWN'); }
    else if (!lead.websiteAnalysis?.hasSSL) { score += 10; reasons.push('NO_SSL'); }
    if (!lead.websiteAnalysis?.hasMeta) { score += 5; reasons.push('NO_META'); }
    if (!lead.websiteAnalysis?.isMobileFriendly) { score += 5; reasons.push('NOT_MOBILE_FRIENDLY'); }
    if (!lead.websiteAnalysis?.hasContactPage) { score += 5; reasons.push('NO_CONTACT_PAGE'); }
  }

  if (!lead.has_gmb) { score += 20; reasons.push('NO_GMB'); }
  if ((lead.review_count || 0) < 5) { score += 15; reasons.push('FEW_REVIEWS'); }
  if (!lead.has_social) { score += 10; reasons.push('NO_SOCIAL'); }
  if ((lead.google_rating || 0) < 3.5 && lead.google_rating != null) { score += 10; reasons.push('LOW_RATING'); }

  // Normalize to 0–100
  const maxPossible = 100;
  const normalized = Math.min(100, Math.round((score / maxPossible) * 100));

  return { score: normalized, reasons };
}

function getScoreLabel(score) {
  if (score >= 80) return 'HOT';
  if (score >= 50) return 'WARM';
  return 'WEAK';
}

module.exports = { calculateScore, getScoreLabel };
