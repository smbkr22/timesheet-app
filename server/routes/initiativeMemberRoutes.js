const express = require('express');
const initiativeMemberController = require('../controllers/initiativeMemberController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /initiativeMembers:
 *   get:
 *     tags:
 *       - InitiativeMembers
 *     summary: Get all InitiativeMembers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of initiativeMembers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Initiative'
 *   post:
 *     tags:
 *       - InitiativeMembers
 *     summary: Create a new InitiativeMember
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitiativeMember'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InitiativeMember'
 */

/**
 * @swagger
 * /initiativeMembers/users/{id}:
 *   get:
 *     tags: [InitiativeMembers]
 *     summary: Get initiativeMember by userID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: InitiativeMember details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InitiativeMember"
 */

/**
 * @swagger
 * /initiativeMembers/initiatives/{id}:
 *   get:
 *     tags: [InitiativeMembers]
 *     summary: Get initiativeMember by initiativeID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the initiative
 *     responses:
 *       200:
 *         description: InitiativeMember details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InitiativeMember"
 */

router
    .route('/')
    .get(
        authController.protect,
        initiativeMemberController.getAllInitiativeMembers
    )
    .post(
        authController.protect,
        initiativeMemberController.createInitiativeMember
    );

router
    .route('/users/:id')
    .get(initiativeMemberController.getInitiativeMemberByUser);
router
    .route('/initiatives/:id')
    .get(initiativeMemberController.getInitiativeMemberByInitiative);

module.exports = router;
