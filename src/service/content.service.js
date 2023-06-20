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
  insert: (req, res) => {
    // 등록
    const today = setDate();
    const data = {
      member_id: req.body.member_id,
      category: req.body.category,
      title: req.body.title,
      note: req.body.note,
      reg_date: today,
      mod_date: today,
    };

    const sql = "INSERT INTO tbl_content SET ?";
    db.query(sql, data, function (err, rows) {
      if (!err) {
        if (rows != "") {
          // 등록 성공
          const image = req.files; // 업로드된 이미지 정보

          if (image.length > 0) {
            // 이미지 업로드 된 경우
            fnUploadImage(req, rows.insertId, image, today, "등록", res); // 이미지 등록 함수 호출
          } else {
            res.send(setResponseJson(200, "컨텐츠 등록 성공", ""));
          }
        } else {
          res.send(setResponseJson(405, "컨텐츠 등록 실패", ""));
        }
      } else {
        console.log("컨텐츠 등록 실패 err : " + err);
        res.send(setResponseJson(404, "컨텐츠 등록 실패", err));
      }
    });
  },
  update: (req, res) => {
    // 수정
    const today = setDate();
    const data = {
      content_id: req.body.content_id,
      member_id: req.body.member_id,
      category: req.body.category,
      title: req.body.title,
      note: req.body.note,
      mod_date: today,
    };

    const sql = `UPDATE tbl_content SET category = ?, title = ?, note = ?, mod_date = ? WHERE content_id = ? AND member_id = ? AND del_yn = 'N'`;
    db.query(
      sql,
      [
        data.category,
        data.title,
        data.note,
        data.mod_date,
        data.content_id,
        data.member_id,
      ],
      function (err, rows) {
        if (!err) {
          if (rows.affectedRows > 0) {
            const image = req.file; // 업로드된 이미지 정보

            if (image != undefined) {
              // 이미지 업로드 된 경우
              fnUploadImage(req, content_id, image, today, "수정", res); // 이미지 등록 함수 호출
            } else {
              res.send(setResponseJson(200, "컨텐츠 수정 성공", ""));
            }
          } else {
            res.send(setResponseJson(405, "컨텐츠 수정 실패", ""));
          }
        } else {
          console.log("컨텐츠 수정 실패 err : " + err);
          res.send(setResponseJson(404, "컨텐츠 수정 실패", err));
        }
      }
    );
  },
  delete: (req, res) => {
    // 삭제
    // const today = setDate();
    // const arrayData = req.body.data;
    // const sql = `UPDATE tbl_content SET del_yn = 'Y', mod_date = ? WHERE content_id = ? AND member_id = ?`;
    // let completedQueries = 0;

    // for (let i = 0; i < arrayData.length; i++) {
    //     const data = {
    //         content_id: arrayData[i].content_id,
    //         member_id: arrayData[i].content_id,
    //         mod_date: today
    //     };

    //     db.query(sql, [data.mod_date, data.content_id, data.member_id], (err, rows) => {
    //         if (!err) {
    //             if (rows.affectedRows > 0) {
    //                 fnDeleteImage(data.content_id, today, '삭제');

    //                 completedQueries++;
    //                 if (completedQueries === arrayData.length) {
    //                     res.send(setResponseJson(200, '모든 컨텐츠 삭제 성공', ''));
    //                 }
    //             } else {
    //                 res.send(setResponseJson(405, '컨텐츠 삭제 실패', ''));
    //             }
    //         } else {
    //             console.log('컨텐츠 삭제 실패 err : ' + err);
    //             res.send(setResponseJson(404, '컨텐츠 삭제 실패', err));
    //         }
    //     });
    // }

    // for(i = 0; i < arrayData.length; i++) {
    //     const data = {
    //         content_id: arrayData[i].content_id,
    //         member_id: arrayData[i].content_id,
    //         mod_date: today
    //     };
    //     db.query(sql, [data.mod_date, data.content_id, data.member_id],function(err,rows) {
    //         if(!err) {
    //             if(rows.affectedRows > 0) {
    //                 fnDeleteImage(data.content_id, today, '삭제', res);
    //                 // res.send(setResponseJson(200, '컨텐츠 삭제 성공', ''));
    //             } else {
    //                 res.send(setResponseJson(405, '컨텐츠 삭제 실패', ''));
    //             }
    //         } else {
    //             console.log('컨텐츠 삭제 실패 err : ' + err);
    //             res.send(setResponseJson(404, '컨텐츠 삭제 실패', err));
    //         }
    //     });
    // }

    const today = setDate();
    const data = {
      content_id: req.body.content_id,
      member_id: req.body.member_id,
      mod_date: today,
    };

    const sql = `UPDATE tbl_content SET del_yn = 'Y', mod_date = ? WHERE content_id = ? AND member_id = ?`;
    db.query(
      sql,
      [data.mod_date, data.content_id, data.member_id],
      function (err, rows) {
        if (!err) {
          if (rows.affectedRows > 0) {
            fnDeleteImage(data.content_id, today, "삭제", res);
            // res.send(setResponseJson(200, '컨텐츠 삭제 성공', ''));
          } else {
            res.send(setResponseJson(405, "컨텐츠 삭제 실패", ""));
          }
        } else {
          console.log("컨텐츠 삭제 실패 err : " + err);
          res.send(setResponseJson(404, "컨텐츠 삭제 실패", err));
        }
      }
    );
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
