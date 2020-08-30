let jwt = require('jwt-simple');
//秘钥
let secret = "123456";
let time = 10;
let tokenExpiresTime = 1000 * 60 * 30; //token过期时间,毫秒为单位
module.exports = {
    /*
     *检验token合法性
     */
    validate: function (token, res, next) {
        if (token) {
            let decodeToken = null;
            try {
                //防止假冒token解析報錯 
                decodeToken = jwt.decode(token, secret); //解密
            } catch (err) {
                res.send({
                    code: '401',
                    "errorMsg": "非法访问"
                });
                return;
            }
            let exp = decodeToken.exp;
            if (!exp) {
                res.send({
                    code: '401',
                    "errorMsg": "非法访问"
                });
                return;
            }
            // time*60*1000   = > 10分钟
            if (exp < (Date.now() + time * 60 * 1000)) {
                res.send({
                    code: '401',
                    "errorMsg": "授权超时"
                });
                return;
            }
            next();
        } else {
            res.send({
                code: '401',
                "errorMsg": "非法访问"
            });
            return;
        }
    },
    /* 生成token*/
    generateToken(username) {
        let Token = null;
        //需要加密的对象
        let payload = {
            user: username,
            time: new Date().getTime(),
            exp: Date.now() + tokenExpiresTime
        };
        Token = jwt.encode(payload, secret); //加密
        return Token;
    }
}