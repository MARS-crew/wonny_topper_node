const express = require("express");
const router = express.Router();
const path = require("path");
const ctrl = require("./home.ctrl");
const userCtrl = require("./user.ctrl");
const contentCtrl = require("./content.ctrl");
const counselCtrl = require("./counsel.ctrl");
const uploadCtrl = require("./upload.ctrl");

// Multer 이미지 업로드
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/uploads");
  },
  filename: (req, file, callback) => {
    const originalExtension = file.originalname.split(".").pop(); // 원본 파일의 확장자 추출
    callback(null, file.fieldname + "-" + Date.now() + "." + originalExtension);
  },
});

const upload = multer({ storage: storage }); // 업로드된 파일이 어떻게 저장될지를 지정

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


//관리자 페이지
router.get("/admin/index", (req, res) => {
  res.render("admin/index", { user: req.session.user });
});
router.get("/admin/content_main", (req, res) => {
  res.render("admin/content_main", { user: req.session.user });
});
router.get("/admin/content_register", (req, res) => {
  res.render("admin/content_register", { user: req.session.user });
});
router.get("/admin/content_edit", (req, res) => {
  res.render("admin/content_edit", { user: req.session.user });
});
router.get("/admin/content_detail", (req, res) => {
  res.render("admin/content_detail", { user: req.session.user });
});
router.get("/admin/consultation_main", (req, res) => {
  res.render("admin/consultation_main", { user: req.session.user });
});
router.get("/admin/common/sidebar", (req, res) => {
  res.render("admin/common/sidebar", { user: req.session.user });
});
router.get("/admin/common/topbar", (req, res) => {
  res.render("admin/common/topbar", { user: req.session.user });
});


// 회원
router.post("/user/login", userCtrl.output["login"]);
router.get("/user/logout", userCtrl.output["logout"]);

//
router.get('/content/search', contentCtrl.output['search']);
router.get('/content/select', contentCtrl.output['select']);
router.post('/content/insert', upload.array('image', 5), contentCtrl.process['insert']);
router.post('/content/update', contentCtrl.process['update']);
router.post('/content/delete', contentCtrl.process['delete']);

// 전 컨텐츠
// router.post(
//   "/content/insert",
//   upload.array("file"),
//   contentCtrl.process["insert"]
// );
router.post("/content/deleteFile", contentCtrl.process["deleteFile"]);

// 상담
router.get("/counsel/search", counselCtrl.output["search"]);
router.get("/counsel/select", counselCtrl.output["select"]);
router.post(
  "/counsel/insertCounsel",
  upload.array("image", 5),
  counselCtrl.process["insertCounsel"]
);
router.post("/counsel/insertAnswer", counselCtrl.process["insertAnswer"]);

router.post("/upload", upload.single("file"), uploadCtrl.process.uploadFile);

module.exports = router;
