import { MODEL_DB } from './mentalModels.js';

export function suggestModels(constraints = []) {
  return MODEL_DB.filter(m => constraints.some(c => m.domains.includes(c))).slice(0, 5);
}

export function rankOne(issue, context) {
  const { domains, urgency, recent } = context;
  const scored = MODEL_DB.map(m => {
    const domainScore = m.domains.some(d => domains.includes(d)) ? 1 : 0;
    const simScore = issue.length ? 0.5 : 0;
    const urgencyScore = (urgency || 0) / 10;
    const penalty = (recent || []).includes(m.id) ? 0.2 : 0;
    return { m, score: domainScore + simScore + urgencyScore - penalty };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].m;
}

export function extractCoreIssue(text = '') {
  return text.split('.')[0];
}