const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        taskId:
 *          type: string
 *          format: uuid
 *          description: The unique identifier for the task.
 *        taskName:
 *          type: string
 *          description: The name of the task.
 *        taskDescription:
 *          type: string
 *          description: The description of the task.
 *        createdBy:
 *          type: string
 *          description: The user who created the task.
 *      required:
 *        - taskName
 *        - taskDescription
 *        - createdBy
 */

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
 *     tags:
 *       - Tasks
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
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *                 description: The name of the task.
 *               taskDescription:
 *                 type: string
 *                 description: The description of the task.
 *                 default: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?'
 *             required:
 *               - taskName
 *               - taskDescription
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
    .get(authController.protect, taskController.getTasksByInitiative);

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
