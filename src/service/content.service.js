const db = require("../config/db");
const setResponseJson = require("../dto/responseDto");
const { executeQuery } = require("../repository");

const contentService = {
  search: (req, res) => {
    const reg_date_from = req.body.reg_date_from + " 00:00:00";
    const reg_date_to = req.body.reg_date_to + " 23:59:59";
    const category = req.body.category;
    const search_word = req.body.search_word;

    const sql = `SELECT * FROM tbl_content WHERE reg_date BETWEEN ? AND ? AND category = ? AND title LIKE '%${search_word}%'`;
    db.query(
      sql,
      [reg_date_from, reg_date_to, category, search_word],
      function (err, rows) {
        if (!err) {
          res.send(setResponseJson(200, "컨텐츠 검색 성공", rows));
        } else {
          console.log("컨텐츠 검색 실패 err : " + err);
          res.send(setResponseJson(404, "컨텐츠 검색 실패", err));
        }
      }
    );
  },

  select: (req, res) => {
    // 상세 조회
    const { content_id } = req.query;

    let sql = `SELECT * FROM tbl_content WHERE del_yn = 'N'`;
    if (content_id) {
      sql += ` AND content_id = ?`;
    }

    db.query(sql, [content_id], function (err, rows) {
      if (!err) {
        // 첨부파일 + 컨텐츠 합쳐서 넘겨줘야함
        res.send(setResponseJson(200, "컨텐츠 조회 성공", rows));
      } else {
        console.log("컨텐츠 조회 실패 err : " + err);
        res.send(setResponseJson(404, "컨텐츠 조회 실패", err));
      }
    });
  },
  insert: async (req, res) => { // 등록
    try {
      const data = {
        user_id: req.session.user.id,
        category: req.body.category,
        title: req.body.title,
        note: req.body.note
      };

      const sql = "INSERT INTO tbl_content SET ?";

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
  update: async (req, res) => { // 수정
    try {
      // 수정
      const data = {
        user_id: req.session.user.id,
        content_id: req.body.content_id,
        category: req.body.category,
        title: req.body.title,
        note: req.body.note,
        reg_date : req.body.reg_date
      };

      let sql = `UPDATE tbl_content SET category = ?, title = ?, note = ?`;
      if(data.reg_date != null) {
        sql += `, reg_date = '${data.reg_date}' `;
      }
      sql += `WHERE id = ? AND user_id = ? AND del_yn = 'N'`;

      const saveAnswer = await executeQuery(sql, [
        data.category,
        data.title,
        data.note,
        data.content_id,
        data.user_id,
      ]);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 수정에 성공하였습니다.",
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
  delete: async (req, res) => { // 삭제
    // try {
    //   const data = {
    //     content_id: req.body.content_id,
    //     member_id: req.body.member_id
    //   };

    //   const sql = `UPDATE tbl_content SET del_yn = 'Y', mod_date = ? WHERE content_id = ? AND member_id = ?`;
    //   db.query(
    //     sql,
    //     [data.mod_date, data.content_id, data.member_id],
    //     function (err, rows) {
    //     }
    //   );
    // } catch {
    //   let message;

    //   if(req.session.user == undefined) {
    //     message = "유저 세션이 존재하지 않습니다."
    //   } else {
    //     message = "에러가 발생하였습니다.";
    //   }

    //   console.error(err);
    //   res
    //     .status(500)
    //     .json({ message: message, data: err, code: 500 });
    // }
  },
  deleteFile: (req, res) => {
    // 이미지 삭제
    const today = setDate();
    const data = {
      file_id: req.body.file_id,
      target_id: req.body.content_id,
      target_code: "CT",
      change_name: req.body.change_name,
      mod_date: today,
    };

    sql = `UPDATE tbl_file SET del_yn = 'Y', mod_date = ? WHERE file_id = ? AND target_id = ? AND target_code = ? AND change_name = ?`;
    db.query(
      sql,
      [
        data.mod_date,
        data.file_id,
        data.target_id,
        data.target_code,
        data.change_name,
      ],
      function (err, rows) {
        if (!err) {
          if (rows.affectedRows > 0) {
            res.send(setResponseJson(200, "이미지 삭제 성공", ""));
          } else {
            res.send(setResponseJson(405, "이미지 삭제 실패", ""));
          }
        } else {
          console.log("이미지 삭제 실패 err : " + err);
          res.send(setResponseJson(404, "이미지 삭제 실패", err));
        }
      }
    );
  },
  findGallery: async (req, res) => {
    try {
      const { page, pageSize, category } = req.query;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산

      const query = `
      SELECT tc.id, tc.title, (SELECT tf.url FROM tbl_file tf WHERE tf.target_id = tc.id AND tf.type = "Main" and del_yn = "N") AS url
      FROM tbl_content tc
      WHERE tc.del_yn = "N" AND tc.category = "${category}"
      ORDER BY tc.reg_date DESC
      LIMIT ${pageSize} OFFSET ${offset};
      `;
      const response = await executeQuery(query);

      res.status(200).json({
        code: 200,
        message: "조회에 성공하였습니다.",
        data: response,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        code: 500,
        message: "조회 실패",
        data: err,
      });
    }
  },
};

module.exports = contentService;
