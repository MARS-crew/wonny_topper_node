const { executeQuery } = require("../repository");

const uploadService = {
  uploadFile: async (req, res) => { // 등록
    try {
      const { originalname, filename, path, mimetype } = req.file;

      const data = {
        origin_name: originalname,
        change_name: filename,
        ext: mimetype,
        url: path
      };

      const sql = "INSERT INTO tbl_file SET ?";
      const saveAnswer = await executeQuery(sql, data);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 등록에 성공하였습니다.",
        data: { file_id: saveAnswer.insertId },
      });
    }catch (err) {
      let message;

      if(req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다."
      } else {
        message = "에러가 발생하였습니다.";
      }

      console.error(err);
      res
        .status(500)
        .json({ message: message, data: err, code: 500 });
    }
  },
  deleteFile: async (req, res) => { // 등록
    try {
      const { originalname, filename, path, mimetype } = req.file;

      // 업로드된 파일의 경로
      const filePath = req.file.path;

      // 파일 삭제
      fs.unlink(filePath, (err) => {
        let message;

        if(err) {
          message = "파일 삭제 실패"
        } else {
          message = "파일 삭제 성공";
        }

        console.error(err);
        res
          .status(500)
          .json({ message: message, data: err, code: 500 });
      });
    } catch {
      console.error(err);
      res
        .status(500)
        .json({ message: '파일 삭제 실패', data: err, code: 500 });
    }
  },
};


module.exports = uploadService;
