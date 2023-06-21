const db = require("../config/db");
const setResponseJson = require("../dto/responseDto");
const sendMail = require("../utils/mail");
const { executeQuery } = require("../repository");

const counselService = {
  search: (req, res) => {
    // 검색
    const data = {
      reg_date_from: req.body.reg_date_from + " 00:00:00",
      reg_date_to: req.body.reg_date_to + " 23:59:59",
      purpose: req.body.purpose,
      answer_yn: req.body.answer_yn,
      search_word: req.body.search_word,
    };

    // if (req.session.user) {
    const sql = `
            SELECT 
                a.*, 
                IF(
                    b.answer_id IS NOT NULL, 
                    'Y', 'N'
                ) AS answer_yn
            FROM tbl_counsel a

            LEFT JOIN tbl_answer b
            ON b.counsel_id = a.counsel_id

            WHERE a.reg_date BETWEEN ? AND ?
            AND a.purpose = ?
            AND a.detail LIKE '%${data.search_word}%'
            AND ((? = 'N' AND b.answer_id IS NULL) OR (? = 'Y' AND b.answer_id IS NOT NULL))
        `;
    db.query(
      sql,
      [
        data.reg_date_from,
        data.reg_date_to,
        data.purpose,
        data.answer_yn,
        data.answer_yn,
      ],
      function (err, rows) {
        if (!err) {
          res.send(setResponseJson(200, "상담 검색 성공", rows));
        } else {
          console.log("상담 검색 실패 err : " + err);
          res.send(setResponseJson(404, "상담 검색 실패", err));
        }
      }
    );
    // } else {
    //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
    // }
  },
  select: (req, res) => {
    // 상세 조회
    const data = {
      //y     counsel_id: req.body.counsel_id
    };
    const { counsel_id } = req.query;

    // if (req.session.user) {
    let sql = `SELECT * FROM tbl_counsel WHERE del_yn = 'N'`;
    if (counsel_id) {
      sql += ` AND counsel_id = ?`;
    }
    db.query(sql, [counsel_id], function (err, rows) {
      if (!err) {
        // 첨부파일 + 상담 합쳐서 넘겨줘야함
        res.send(setResponseJson(200, "상담 조회 성공", rows));
      } else {
        console.log("상담 조회 실패 err : " + err);
        res.send(setResponseJson(404, "상담 조회 실패", err));
      }
    });
    // } else {
    //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
    // }
  },
  insertCounsel: (req, res) => {
    // 등록
    const data = {
      name: req.body.name,
      phone_num: req.body.phone_num,
      email: req.body.email,
      location: req.body.location,
      budget: req.body.budget,
      purpose: req.body.purpose,
      detail: req.body.detail,
      agree: req.body.agree
    };

    // if (req.session.user) {
    const sql = "INSERT INTO tbl_counsel SET ?";
    db.query(sql, data, function (err, rows) {
      if (!err) {
        if (rows != "") {
          res.send(setResponseJson(200, "상담 등록 성공", ""));
        } else {
          res.send(setResponseJson(405, "상담 등록 실패", ""));
        }
      } else {
        console.log("상담 등록 실패 err : " + err);
        res.send(setResponseJson(404, "상담 등록 실패", err));
      }
    });
    // } else {
    //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
    // }
  },
  insertAnswer: async (req, res) => {
    try {
      const { detail, counsel_id, file, email } = req.body;
      const sql =
        "INSERT INTO tbl_answer (user_id, counsel_id, detail) VALUES(?, ?, ?)";

      const saveAnswer = await executeQuery(sql, [
        req.session.user.id,
        counsel_id,
        detail,
      ]);
      console.log(saveAnswer.insertId);
      console.log(file);

      if(file != undefined && file != ''&& file != null) {
        const sql2 =
        "INSERT INTO tbl_file (target_id, origin_name, change_name, ext, url, del_yn, type) VALUES(?, ?, ?, ?, ?, ?, ?)";
      
        await executeQuery(sql2, [
          saveAnswer.insertId,
          file.origin_name,
          file.change_name,
          file.ext,
          file.url,
          "Y",
          "Main",
        ]);
      }

      await sendMail(email, "[워니토퍼] 안녕하세요! 문의 주셔서 감사합니다.", detail);
      res.status(200).json({
        code: 200,
        message: "답변 생성에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
};

module.exports = counselService;
