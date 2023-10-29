const express = require('express');
const initiativeMemberController = require('../controllers/initiativeMemberController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    InitiativeMember:
 *      type: object
 *      properties:
 *        initiativeMemberId:
 *          type: string
 *          format: uuid
 *          description: The unique identifier for the initiative member.
 *        userId:
 *          type: string
 *          format: uuid
 *          description: The unique identifier of the user.
 *        initiativeId:
 *          type: string
 *          format: uuid
 *          description: The unique identifier of the initiative.
 *        startDate:
 *          type: string
 *          format: date-time
 *          description: The start date and time of the initiative membership (in ISO 8601 format).
 *        endDate:
 *          type: string
 *          format: date-time
 *          description: The end date and time of the initiative membership (in ISO 8601 format).
 *      required:
 *        - userId
 *        - initiativeId
 *        - startDate
 */

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
 *             type: object
 *             properties:
 *               initiativeId:
 *                 type: string
 *                 description: The ID of the initiative.
 *               userId:
 *                 type: string
 *                 description: The userID of the manager initiating the request.
 *             required:
 *               - initiativeId
 *               - userId
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
