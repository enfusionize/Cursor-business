import { Router } from 'express';
import { rankOne, extractCoreIssue } from '../services/constraintSolver.js';

const router = Router();

router.post('/', (req, res) => {
  const { problem, context } = req.body;
  if (!problem || !context) {
    return res.status(422).json({ error: 'problem & context required' });
  }
  const coreIssue = extractCoreIssue(problem);
  const model = rankOne(coreIssue, context);
  res.json({
    question: coreIssue,
    model: model.name,
    summary: `Use ${model.name}: ${model.description}`,
    applied: `For your problem "${problem}", apply ${model.name} by ...`
  });
});

export default router;