const sendMail = require("../utils/mail");
const { executeQuery } = require("../repository");

const counselService = {
  select: async (req, res) => { // 조회, 검색
    try {
      const { counsel_id } = req.params;
      const { purpose, search_word, sort, page, pageSize, answer_yn } = req.body;
      let { from_date, to_date } = req.body;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산
      let sql, sql2;
      
      let response;
      let result;
      if (counsel_id == null) {
        sql2 = `SELECT COUNT(*) AS count FROM (`;
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
        if(answer_yn != null) {
          sql += `AND if(aw.answer_id IS NOT NULL, 'Y', 'N') IN (`;
          for(i = 0;  i < answer_yn.length; i++) {
            sql += `'` + answer_yn[i] + `'`;
            if(i+1 < answer_yn.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }
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
        sql2 += sql + `) a`;
        sql += `LIMIT ${pageSize} OFFSET ${offset}`;

        response = await executeQuery(sql);
        const count = await executeQuery(sql2);
        result = {'counsel': response, 'count': count[0].count};
      } else {
        sql = `
          SELECT 
            cs.*,
            fl2.origin_name AS counsel_file_origin_name,
            fl2.url AS counsel_file_url,
            if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
            if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date,
            aw.answer_id,
            aw.file_id AS answer_file_id,
            aw.detail AS answer_detail,
            fl1.origin_name AS answer_file_origin_name,
            fl1.url AS answer_file_url
          FROM tbl_counsel cs
          LEFT JOIN tbl_answer aw ON aw.counsel_id = cs.counsel_id
          LEFT JOIN tbl_content ct ON ct.content_id = cs.content_id
          LEFT JOIN tbl_file fl1 ON fl1.file_id = aw.file_id AND fl1.del_yn = 'N'
          LEFT JOIN tbl_file fl2 ON fl2.file_id = ct.file_main_id AND fl2.del_yn = 'N'
          WHERE cs.del_yn = 'N'
          AND cs.counsel_id = ?
        `;
        result = await executeQuery(sql, [counsel_id]);
      }

      res.status(200).json({
        code: 200,
        message: "상담 조회에 성공하였습니다.",
        data: result,
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
        agree: req.body.agree,
        content_id: req.body.content_id
      };

      let sql = "INSERT INTO tbl_counsel SET ?";
      let response = await executeQuery(sql, data);

      let purpose;
      if(data.purpose == 1) {
        purpose = '풍선장식';
      } else if(data.purpose == 2) {
        purpose = '토퍼';
      } else if(data.purpose == 3) {
        purpose = '부스체험(토퍼, 풍선)';
      } else if(data.purpose == 4) {
        purpose = '삐에로';
      } else if(data.purpose == 5) {
        purpose = '페이스페인팅';
      } else if(data.purpose == 6) {
        purpose = '클래스';
      }

      let mailText = `
      이름 : ${data.name}

      휴대폰번호 : ${data.phone_num}

      이메일 : ${data.email}

      장소 : ${data.location}

      예산 : ${data.budget} 만원

      의뢰목적 : ${purpose}
      `;

      // 해당 컨텐츠의 이미지, 제목, 카테고리
      if(data.content_id != null) {
        sql = `
          SELECT 
            ct.title, ct.file_main_id, fl.origin_name, fl.url 
          FROM tbl_content ct 
          LEFT JOIN tbl_file fl
          ON fl.file_id = ct.file_main_id
          AND fl.del_yn = 'N'
          WHERE ct.content_id = ? AND ct.del_yn = 'N'
        `;
        response = await executeQuery(sql, [data.content_id]);
        let mailText2;
        if(response[0]) {
          mailText2 = `
      관련컨텐츠 : ${response[0].title}

      상담내용 : ${data.detail}
          `;
          await sendMail(process.env.MAIL_EMAIL, '[워니토퍼] ' + data.name + '님의 문의가 도착했습니다.', mailText + mailText2, response[0].url, response[0].origin_name);
        } else {
          mailText2 = `
      관련컨텐츠 : 삭제된 컨텐츠

      상담내용 : ${data.detail}
          `;
          await sendMail(process.env.MAIL_EMAIL, '[워니토퍼] ' + data.name + '님의 문의가 도착했습니다.', mailText + mailText2);
        }
      } else {
        mailText2 = `
      관련컨텐츠 : 없음

      상담내용 : ${data.detail}
        `;
        await sendMail(process.env.MAIL_EMAIL, '[워니토퍼] ' + data.name + '님의 문의가 도착했습니다.', mailText + mailText2);
      }

      res.status(200).json({
        code: 200,
        message: "컨텐츠 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
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

      let sql = `INSERT INTO tbl_answer SET ?`;
      let response = await executeQuery(sql, data);

      if(data.file_id != null) {
        sql = `
          SELECT 
            fl.file_id,
            fl.url,
            fl.origin_name
          FROM tbl_file fl 
          JOIN tbl_answer aw
          ON aw.admin_id = ?
          AND aw.answer_id = ?
          WHERE fl.file_id = aw.file_id
        `;
        response = await executeQuery(sql, [data.admin_id, response.insertId]);

        await sendMail(req.body.email, "[워니토퍼] 안녕하세요! 문의 주셔서 감사합니다.", data.detail, response[0].url, response[0].origin_name);
        res.status(200).json({
          code: 200,
          message: "답변 등록에 성공하였습니다.",
          data: true,
        });
      } else {
        await sendMail(req.body.email, "[워니토퍼] 안녕하세요! 문의 주셔서 감사합니다.", data.detail);
        res.status(200).json({
          code: 200,
          message: "답변 등록에 성공하였습니다.",
          data: true,
        });
      }
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
