const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

/**
 * @swagger
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: Get all Clients
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Client"
 *   post:
 *     tags: [Clients]
 *     summary: Create a new Client
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/Client"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Client"
 */

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 */

router
    .route('/')
    .get(clientController.getAllClients)
    .post(clientController.createClient);

router.route('/:id').get(clientController.getClient);

module.exports = router;
