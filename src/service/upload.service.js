const conn = require("../config/db");
const setResponseJson = require("../dto/responseDto");

const uploadService = {
  uploadFile: (req, res) => {
    const { originalname, filename, path, mimetype } = req.file;

    const data = {
      member_id: "admin",
      target_id: 0,
      target_code: "CT",
      origin_name: originalname,
      change_name: filename,
      ext: mimetype,
      url: path,
      reg_date: setDate(),
      mod_date: setDate(),
    };

    const sql = "INSERT INTO tbl_file SET ?";

    conn.query(sql, data, (err, row) => {
      if (err) {
        console.log(err);
        res.send(setResponseJson(500, "에러 발생", false));
        return;
      }
      console.log(row);
      res.send(setResponseJson(200, "파일 저장 성공", row));
    });
  },
};

module.exports = uploadService;
