const express = require('express');
const memberTaskController = require('../controllers/memberTaskController');
const authController = require('../controllers/authController');

const router = express.Router();

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
 *     summary: Get Task by user
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
    .post(authController.protect, memberTaskController.createMemberTask);

router
    .route('/:id')
    .delete(authController.protect, memberTaskController.deleteMemberTask);

router
    .route('/users')
    .get(authController.protect, memberTaskController.getMemberTasksByUser);

/* LOGGED IN USER */
router
    .route('/users/initiatives')
    .get(
        authController.protect,
        memberTaskController.getInitiativesByMemberTasks
    );
router
    .route('/users/tasks')
    .get(authController.protect, memberTaskController.getTasksByMemberTasks);

module.exports = router;
