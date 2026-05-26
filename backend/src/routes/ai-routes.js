import express from 'express';
import { suggestResidues } from '../controllers/ai-controller.js';

const router = express.Router();

router.post('/ai/suggest-residues', suggestResidues);

export default router;
