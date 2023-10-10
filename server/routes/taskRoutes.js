const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /tasks/initiatives/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get tasks by initiativeID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Task"
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     parameters:
 *       - in: body
 *         name: task
 *         description: The task to create
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/Task"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */

router
    .route('/initiatives/:id')
    .get(authController.protect, taskController.getTaskByInitiative);

router
    .route('/')
    .get(authController.protect, taskController.getAllTasks)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        taskController.createTask
    );

router.route('/:id').get(authController.protect, taskController.getTask);

module.exports = router;
