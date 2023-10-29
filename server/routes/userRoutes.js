const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          format: uuid
 *          description: The unique identifier for the user.
 *        firstName:
 *          type: string
 *          description: The first name of the user.
 *        lastName:
 *          type: string
 *          description: The last name of the user.
 *        email:
 *          type: string
 *          format: email
 *          description: The email address of the user.
 *        contactNumber:
 *          type: string
 *          description: The contact number of the user.
 *        startDate:
 *          type: string
 *          format: date-time
 *          description: The start date for the user.
 *        endDate:
 *          type: string
 *          format: date-time
 *          description: The end date for the user.
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - contactNumber
 *        - password
 *        - passwordConfirm
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Created
 *
 * /users/login:
 *   post:
 *     summary: Log in user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: No Content
 */

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// router.use(authController.protect);

router.route('/').get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser);

module.exports = router;
