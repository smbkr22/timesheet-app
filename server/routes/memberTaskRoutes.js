const express = require('express');
const memberTaskController = require('../controllers/memberTaskController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MemberTask:
 *       type: object
 *       properties:
 *         memberTaskId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the member task.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the user.
 *         initiativeTaskId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the associated initiative task.
 *         taskStatus:
 *           type: string
 *           enum: [Todo, Completed, WorkInProgress]
 *           description: The status of the task (enum value).
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the member task (in ISO 8601 format).
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the member task (in ISO 8601 format).
 *         workHours:
 *           type: string
 *           description: The number of work hours associated with the task.
 */

/**
 * @swagger
 * /memberTasks:
 *   get:
 *     tags:
 *       - MemberTasks
 *     summary: Get all MemberTasks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of memberTasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Initiative'
 *   post:
 *     tags:
 *       - MemberTasks
 *     summary: Assign a new MemberTask by Manager
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               initiativeId:
 *                 type: string
 *                 description: The initiativeId of the initiative.
 *               userId:
 *                 type: string
 *                 description: The userID of the manager initiating the request.
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date and time of the initiative.
 *             required:
 *               - initiativeId
 *               - userId
 *               - startDate
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberTask'
 */

/**
 * @swagger
 * /memberTasks/{id}:
 *   delete:
 *     summary: Delete a memberTask by ID
 *     tags: [MemberTasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MemberTask ID
 *     responses:
 *       204:
 *         description: No Content
 */

/**
 * @swagger
 * /memberTasks/users:
 *   get:
 *     tags: [MemberTasks]
 *     summary: Get All MemberTasks by loggedIn user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of memberTasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MemberTasks"
 *   post:
 *     tags:
 *       - MemberTasks
 *     summary: Create a new MemberTask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberTask'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberTask'
 */

/**
 * @swagger
 * /memberTasks/users/initiatives:
 *   get:
 *     tags: [MemberTasks]
 *     summary: Get Initiatives by Member Tasks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of initiatives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MemberTasks"
 */

/**
 * @swagger
 * /memberTasks/users/tasks:
 *   get:
 *     tags: [MemberTasks]
 *     summary: Get Tasks by Member Tasks
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
 *                 $ref: "#/components/schemas/MemberTasks"
 */

router
    .route('/')
    .get(authController.protect, memberTaskController.getAllMemberTasks)
    .post(authController.protect, memberTaskController.createMemberTask)
    .patch(authController.protect, memberTaskController.updateMemberTask);

router
    .route('/:id')
    .delete(authController.protect, memberTaskController.deleteMemberTask);

/* LOGGED IN USER */

router
    .route('/users')
    .get(authController.protect, memberTaskController.getMemberTasksByUser)
    .post(authController.protect, memberTaskController.createMemberTaskByUser);

router
    .route('/users/initiatives')
    .get(
        authController.protect,
        memberTaskController.getInitiativesByMemberTasks
    );
router
    .route('/users/tasks')
    .get(authController.protect, memberTaskController.getTasksByMemberTasks);

router
    .route('/users/infos')
    .get(authController.protect, memberTaskController.getAllMemberTasksInfo);

module.exports = router;
