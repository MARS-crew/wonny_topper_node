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
  select: async (req, res) => { // 조회
    try {
      const { counsel_id } = req.params;
      const { purpose, search_word, sort, page, pageSize } = req.body;
      let { from_date, to_date } = req.body;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산
      let sql;
      
      if (counsel_id == null) {
        sql = `
          SELECT 
            cs.*,
            if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
            if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date
          FROM tbl_counsel cs
          LEFT JOIN tbl_answer aw
          ON aw.counsel_id = cs.counsel_id
          WHERE cs.del_yn = 'N'
        `;
        
        if(from_date != null && to_date != null) {
          from_date += ' 00:00:00';
          to_date += ' 23:59:59';
          sql += `AND cs.reg_date BETWEEN '${from_date}' AND '${to_date}' `;
        }
        if(purpose != null) {
          sql += `AND cs.purpose IN (`;
          for(i = 0;  i < purpose.length; i++) {
            sql += purpose[i];
            if(i+1 < purpose.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }
        if(search_word != null) {
          sql += `AND cs.detail LIKE '%${search_word}%' `;
        }
        
        sql += `ORDER BY cs.reg_date ${sort} `;
        sql += `LIMIT ${pageSize} OFFSET ${offset}`;

      } else {
        sql = `
          SELECT 
            cs.*,
            if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
            if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date,
            aw.answer_id,
            aw.file_id AS answer_file_id,
            aw.detail AS answer_detail,
            fl.origin_name AS answer_file_origin_name,
            fl.url AS answer_file_url
          FROM tbl_counsel cs
          LEFT JOIN tbl_answer aw ON aw.counsel_id = cs.counsel_id
          LEFT JOIN tbl_file fl ON fl.file_id = aw.file_id
          WHERE cs.del_yn = 'N'
          AND cs.counsel_id = ?
        `;
      }
      const response = await executeQuery(sql, [counsel_id]);

      res.status(200).json({
        code: 200,
        message: "상담 조회에 성공하였습니다.",
        data: response,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  insertCounsel: async (req, res) => { // 등록
    try {
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

      const sql = "INSERT INTO tbl_counsel SET ?";
      const saveAnswer = await executeQuery(sql, data);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
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
  insertAnswer: async (req, res) => {
    try {
      const data = {
        admin_id: req.session.user.id,
        counsel_id: req.body.counsel_id,
        file_id: req.body.file_id,
        detail: req.body.detail
      };

      const sql = `INSERT INTO tbl_answer SET ?`;
      const saveAnswer = await executeQuery(sql, data);

      await sendMail(req.body.email, "[워니토퍼] 안녕하세요! 문의 주셔서 감사합니다.", data.detail);
      res.status(200).json({
        code: 200,
        message: "답변 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
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
};

module.exports = counselService;
