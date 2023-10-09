const express = require('express');
const initiativeController = require('../controllers/initiativeController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /initiatives:
 *   get:
 *     tags:
 *       - Initiatives
 *     summary: Get all Initiatives
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
 *                 $ref: '#/components/schemas/Initiative'
 *   post:
 *     tags:
 *       - Initiatives
 *     summary: Create a new Initiative
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Initiative'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Initiative'
 */

/**
 * @swagger
 * /initiatives/roles/{id}:
 *   get:
 *     tags: [Initiatives]
 *     summary: Get initiatives by roleID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the initiative
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Initiative details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Initiative"
 */

/**
 * @swagger
 * /initiatives/users/{id}:
 *   get:
 *     tags: [Initiatives]
 *     summary: Get initiatives by userID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Initiative details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Initiative"
 */

router
    .route('/')
    .get(authController.protect, initiativeController.getAllInitiatives)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        initiativeController.createInitiative
    );

router
    .route('/roles/:id')
    .get(authController.protect, initiativeController.getInitiativesByRole);
router
    .route('/users/:id')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        initiativeController.getInitiativesByUser
    );

module.exports = router;
