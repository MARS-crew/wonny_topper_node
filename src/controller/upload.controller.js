const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const uploadService = require("../service/upload.service");

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload API
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     summary: Upload File
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             example:
 *               file: file
 */
router.post("/", upload.single("file"), uploadService.uploadFile);

module.exports = router;
