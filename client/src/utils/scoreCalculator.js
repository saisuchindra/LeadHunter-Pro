export function calculateScore(business) {
  let score = 100
  if (business.has_website || business.hasWebsite) score -= 40
  if (business.has_gmb || business.googleMyBusiness) score -= 20
  if ((business.review_count || business.reviewCount || 0) > 10) score -= 15
  if (business.has_social || (business.socialMedia && business.socialMedia.length > 0)) score -= 15
  if ((business.last_updated || 999) < 180) score -= 10
  return Math.max(0, score)
}

export function getScoreLabel(score) {
  if (score >= 80) return 'HOT'
  if (score >= 50) return 'WARM'
  return 'WEAK'
}

export function getScoreColor(score) {
  if (score >= 70) return '#00FFB2'
  if (score >= 40) return '#FFB347'
  return '#FF4D6D'
}
