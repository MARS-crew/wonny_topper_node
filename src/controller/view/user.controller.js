const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("test");
});

router.get("/main", (req, res) => {
  res.render("main", { user: req.session.user });
});

//사용자 페이지
router.get("/index", (req, res) => {
  res.render("index");
});

router.get("/balloon", (req, res) => {
  res.render("balloon");
});

router.get("/class", (req, res) => {
  res.render("class");
});

router.get("/facepainting", (req, res) => {
  res.render("facepainting");
});

router.get("/pierrot", (req, res) => {
  res.render("pierrot");
});

router.get("/topper", (req, res) => {
  res.render("topper");
});

router.get("/qna", (req, res) => {
  res.render("qna");
});
module.exports = router;
