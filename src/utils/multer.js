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
module.exports = upload;
