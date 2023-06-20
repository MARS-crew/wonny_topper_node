const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const counselService = require("../service/counsel.service");

/**
 * @swagger
 * tags:
 *   name: Counsel
 *   description: Counsel API
 */

router.get("/search", counselService.search);
router.get("/select", counselService.select);
router.post(
  "/insertCounsel",
  upload.array("image", 5),
  counselService.insertCounsel
);
router.post("/insertAnswer", counselService.insertAnswer);

module.exports = router;
