const express = require('express');
const initiativeTaskController = require('../controllers/initiativeTaskController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     InitiativeTask:
 *       type: object
 *       properties:
 *         initiativeTaskId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the initiative task.
 *         initiativeId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the associated initiative.
 *         taskId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the associated task.
 */

/**
 * @swagger
 * /initiativeTasks:
 *   get:
 *     tags:
 *       - InitiativeTasks
 *     summary: Get all InitiativeTasks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of initiativeTasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InitiativeTask'
 *   post:
 *     tags:
 *       - InitiativeTasks
 *     summary: Create a new InitiativeTask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               initiativeId:
 *                 type: string
 *                 description: The initiativeID of the initiative.
 *               taskId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The taskID of the task.
 *             required:
 *               - initiativeId
 *               - taskId
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InitiativeTask'
 */

/**
 * @swagger
 * /initiativeTasks/initiatives/{id}:
 *   get:
 *     summary: Get a initiativeTask by ID
 *     tags: [InitiativeTasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: InitiativeTask ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: InitiativeTask details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InitiativeTask'
 */

router
    .route('/')
    .get(authController.protect, initiativeTaskController.getAllInitiativeTasks)
    .post(
        authController.protect,
        initiativeTaskController.createInitiativeTask
    );

router
    .route('/initiatives/:id')
    .get(
        authController.protect,
        initiativeTaskController.getInitiativeTasksByInitiative
    );

module.exports = router;
