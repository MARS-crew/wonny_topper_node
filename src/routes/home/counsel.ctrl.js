const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/db');

// 현재시간 세팅
setDate = () => {
    const today = new Date();
    today.setHours(today.getHours());
    today.toISOString().replace('T', ' ').substring(0, 19);
    
    return today;
};

setResponseJson = (code, message, data) => {
    let result = {};
    if(data != '') {
        result = {
            'code': code,
            'message': message,
            'data': data
        };
    } else {
        result = {
            'code': code,
            'message': message
        };
    }
    return result;
};

const output = {
    'search' : (req, res) => { // 검색
        const data = {
            reg_date_from: req.body.reg_date_from + ' 00:00:00',
            reg_date_to: req.body.reg_date_to + ' 23:59:59',
            purpose: req.body.purpose,
            answer_yn: req.body.answer_yn,
            search_word: req.body.search_word
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
            db.query(sql, [data.reg_date_from, data.reg_date_to, data.purpose, data.answer_yn, data.answer_yn],function(err,rows) {
                if(!err) {
                    res.send(setResponseJson(200, '상담 검색 성공', rows));
                } else {
                    console.log('상담 검색 실패 err : ' + err);
                    res.send(setResponseJson(404, '상담 검색 실패', err));
                }
            });
        // } else {
        //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
        // }
    },
    'select' : (req, res) => { // 상세 조회
        const data = {
       //y     counsel_id: req.body.counsel_id
        };
        const {counsel_id} = req.query;

        // if (req.session.user) {
            let sql = `SELECT * FROM tbl_counsel WHERE del_yn = 'N'`;
            if (counsel_id ) {
                sql += ` AND counsel_id = ?`;
              }
            db.query(sql, [counsel_id],function(err,rows) {
                if(!err) {
                    // 첨부파일 + 상담 합쳐서 넘겨줘야함
                    res.send(setResponseJson(200, '상담 조회 성공', rows));
                } else {
                    console.log('상담 조회 실패 err : ' + err);
                    res.send(setResponseJson(404, '상담 조회 실패', err));
                }
            });
        // } else {
        //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
        // }
    }
};

const process = {
    'insertCounsel' : (req, res) => { // 등록
        const today = setDate();
        const data = {
            name: req.body.name,
            phone_num: req.body.phone_num,
            email: req.body.email,
            location: req.body.location,
            budget: req.body.budget,
            purpose: req.body.purpose,
            detail: req.body.detail,
            agree: req.body.agree,
            reg_date: today
        };

        // if (req.session.user) {
            const sql = 'INSERT INTO tbl_counsel SET ?';
            db.query(sql, data,function(err,rows) {
                if(!err) {
                    if(rows != '') {
                        res.send(setResponseJson(200, '상담 등록 성공', ''));
                    } else {
                        res.send(setResponseJson(405, '상담 등록 실패', ''));
                    }
                } else {
                    console.log('상담 등록 실패 err : ' + err);
                    res.send(setResponseJson(404, '상담 등록 실패', err));
                }
            });
        // } else {
        //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
        // }
    },
    'insertAnswer' : (req, res) => { // 등록
        const today = setDate();
        const data = {
            member_id: req.body.member_id,
            counsel_id: req.body.counsel_id,
            detail: req.body.detail,
            reg_date: today
        };

        // if (req.session.user) {
            const sql = 'INSERT INTO tbl_answer SET ?';
            db.query(sql, data,function(err,rows) {
                if(!err) {
                    if(rows != '') {
                        res.send(setResponseJson(200, '상담 답변 등록 성공', ''));
                    } else {
                        res.send(setResponseJson(405, '상담 답변 등록 실패', ''));
                    }
                } else {
                    console.log('상담 답변 등록 실패 err : ' + err);
                    res.send(setResponseJson(404, '상담 답변 등록 실패', err));
                }
            });
        // } else {
        //     res.send(setResponseJson(405, '로그인 세션 미존재', ''));
        // }
    }
};

module.exports = {
    output,
    process,
};