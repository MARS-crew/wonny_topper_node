const db = require("../config/db");
const setResponseJson = require("../dto/responseDto");

const counselService = {
  select: (req, res) => {
    // 조회
    const data = {
      counsel_id: req.body.counsel_id,
    };

    const sql = `SELECT * FROM tbl_counsel WHERE counsel_id = ? AND del_yn = 'N'`;
    db.query(sql, [data.counsel_id], function (err, rows) {
      if (!err) {
        // 첨부파일 + 상담 합쳐서 넘겨줘야함
        res.send(setResponseJson(200, "상담 조회 성공", rows));
      } else {
        console.log("상담 조회 실패 err : " + err);
        res.send(setResponseJson(404, "상담 조회 실패", err));
      }
    });
  },
};

module.exports = counselService;
