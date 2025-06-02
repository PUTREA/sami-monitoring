const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problem/ProblemController');

router.get('/problems', problemController.getAllProblems);
router.get('/problems/:id', problemController.getProblemById);
router.post('/problems', problemController.createProblem);
router.put('/problems/:id', problemController.updateProblem);
router.delete('/problems/:id', problemController.deleteProblem);
router.get('/problems/export', problemController.exportProblemsToPDF);

module.exports = router;