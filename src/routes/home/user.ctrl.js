const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../../config/db');

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
    'login' : (req, res) => {
        const member_id = req.body.member_id;
        const pwd = req.body.pwd;

        if (req.session.user) {
            res.send(setResponseJson(200, '로그인 세션 존재', ''));
        } else {
            const sql = 'SELECT * FROM tbl_member WHERE member_id = ? AND pwd = ?';
            db.query(sql, [member_id, pwd],function(err,rows) {
                if(!err) {
                    if(rows != '') {
                        req.session.user = {
                            id: member_id,
                            name: rows[0].name,
                            authorized: true
                        };

                        res.send(setResponseJson(200, '로그인 성공', ''));
                    } else {
                        res.send(setResponseJson(405, '로그인 실패', rows));
                    }
                } else {
                    console.log('로그인 실패 err : ' + err);
                    res.send(setResponseJson(404, '로그인 실패', err));
                }
            });
        }
    },
    'logout' : (req, res) => {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    res.send(setResponseJson(404, '로그아웃 실패', ''));
                  return;
                }
                res.send(setResponseJson(200, '로그아웃 성공', ''));
            });
        } else {
            res.send(setResponseJson(200, '기존 비로그인 상태', ''));
        }
    },
    test : (req,res) => {
        res.send('testt est');
    }
};

const process = {

};

module.exports = {
    output,
    process,
};