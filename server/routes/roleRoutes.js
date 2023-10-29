const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the role.
 *         roleName:
 *           type: string
 *           enum: [user, admin, manager]
 *           description: The name of the role (enum value).
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all Roles
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Role"
 */

router.route('/').get(roleController.getAllRoles);

module.exports = router;
