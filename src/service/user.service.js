const bcrypt = require("bcrypt");
const setResponseJson = require("../dto/responseDto");
const { executeQuery } = require("../repository");

const userService = {
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie("topper");
    res.redirect("/admin/index");
  },
  register: async (req, res) => {
    try {
      const { member_id, pwd, name } = req.body;

      const findUser = await executeQuery(
        "SELECT * FROM tbl_member where member_id = ?",
        member_id
      );
      if (findUser.length > 0) {
        res.send(setResponseJson(400, "이미 존재하는 ID 입니다.", false));

        return;
      }

      const hash = await bcrypt.hash(pwd, 10);

      await executeQuery(
        "INSERT INTO tbl_member(member_id, pwd, name) VALUES(?,?,?)",
        [member_id, hash, name]
      );

      res.send(setResponseJson(200, "회원가입 성공", true));
    } catch (err) {
      console.error(err);
      res.send(setResponseJson(500, "회원가입 실패", false));
    }
  },
  login: async (req, res) => {
    try {
      const { member_id, pwd, isAuto } = req.body;

      const findUser = await executeQuery(
        "SELECT * FROM tbl_member where member_id = ?",
        member_id
      );

      if (findUser.length < 1) {
        res.status(400).json({
          code: 400,
          message: "유저를 찾을 수 없습니다.",
          data: false,
        });

        return;
      }

      const result = await bcrypt.compare(pwd, findUser[0].pwd);
      if (!result) {
        res.status(400).json({
          code: 400,
          message: "패스워드가 틀립니다.",
          data: false,
        });
        return;
      }

      req.session.user = {
        id: findUser[0].id,
      };

      if (isAuto) {
        res.cookie("topper", findUser[0].id, { maxAge: 60 * 60 * 24 * 14 });
      }

      res.status(200).json({
        code: 200,
        message: "로그인 성공",
        data: {
          id: findUser[0].id,
          member_id: findUser[0].member_id,
          name: findUser[0].name,
        },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
};

module.exports = userService;
