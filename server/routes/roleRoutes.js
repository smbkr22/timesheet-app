const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

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
