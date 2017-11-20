let weduserfuc = require("../DAO/UserDataClass"),
    tokenfuc = require("../DAO/TokenClass"),
    resultMsg = require("./../returnMsg")

// let tokenIsVali=require('./tokenlist').webverifytoken
//引入jwt模块
var jwt = require('jsonwebtoken');
exports.localLogin = (username, password, done) => {
    new Promise((resolve, reject) => {
        weduserfuc.findByNameAndPwd(username, password, UsersArr => {
            if (UsersArr) {
                resolve(UsersArr);
            }
            else {
                reject();
            }
        })
    }).then((UsersArr) => {
        return new Promise((resolve, reject) => {
            let content = {
                name: UsersArr.name,
                username: username,
                password: password,
                level: UsersArr.level
            };
            let secretOrPrivateKey = "keyyyyyyyyy";
            let token = jwt.sign(content, secretOrPrivateKey);
            //存储token
            let tokenObj = {};
            tokenObj.user = username;
            tokenObj.token = token;
            tokenObj.dateTime = new Date().getTime();

            // res.cookie(encodeURIComponent(UsersArr.name), token + ";;" + UsersArr.level, {maxAge: 3 * (24 * 60 * 60 * 1000)});
            tokenfuc.updateByUser(username, tokenObj, result => {
                resolve(tokenObj);
            })
        })
    }).then((tokenObj) => {
        appLogger.info("gotohome:登陆成功")
        return done(null, tokenObj);
        // res.json(new resultMsg(200, {}, req.headers))
    }).catch(() => {
        errLogger.error("gotohome:");
        errLogger.error("gotohome:账户或密码错误");
        errLogger.error(username, password);
        return done(null, false, {
            message: new resultMsg(400, {}, "账户或密码错误")
        });
        // res.json(new resultMsg(1, {}, "账户或密码错误"))
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login');
}
exports.webLogin2 = (req, res) => {
    console.log(req.flash('error').toString())
    console.log(req.session)
    // res.render('index', {
    //     title: 'Express',
    //     message: req.flash('error').toString()
    // });

}



exports.webLogin2 = (req, res) => {
    new Promise((resolve, reject) => {
        weduserfuc.findByNameAndPwd(req.body.username, req.body.password, UsersArr => {
            appLogger.info("获取WebUser用户名密码")
            appLogger.info(UsersArr)
            if (UsersArr.length > 0) {
                resolve(UsersArr)
            }
            else {
                reject(req.body)
            }
        })
    }).then((UsersArr) => {
        return new Promise((resolve, reject) => {
            let content = {
                name: UsersArr[0].name,
                username: req.body.username,
                password: req.body.password
            }
            let secretOrPrivateKey = "keyyyyyyyyy";
            let token = jwt.sign(content, secretOrPrivateKey)
            //存储token
            let tokenObj = {}
            tokenObj.user = req.body.username
            tokenObj.token = token
            tokenObj.dateTime = new Date().getTime()
            res.cookie(encodeURIComponent(UsersArr[0].name), token + ";;" + UsersArr[0].level, {maxAge: 3 * (24 * 60 * 60 * 1000)})
            tokenfuc.updatebyuser(req.body.username, tokenObj, result => {
                resolve()
            })
        })
    }).then(() => {
        appLogger.info("gotohome:登陆成功")
        res.json(new resultMsg(0, {}, req.headers))
    }).catch((err) => {
        errLogger.error("gotohome:")
        errLogger.error("gotohome:账户或密码错误")
        errLogger.error(err)
        res.json(new resultMsg(1, {}, "账户或密码错误"))
    })

}

//app登录接口
// exports.applogin = (req, res) => {
//     //var user = findAppUsers((req.body.username), (req.body.password))
//     new Promise((resolve, reject) => {
//         appuserfuc.findOneByAppNameAndPwd(req.body.username, req.body.password, result => {
//             if (result) {
//                 appLogger.info(result)
//                 resolve()
//             } else {
//                 reject("账号或密码错误")
//             }
//         })
//     }).then(() => {
//         return new Promise((resolve, reject) => {
//             let content = {
//                 username: req.body.username,
//                 password: req.body.password
//             }
//             let secretOrPrivateKey = "this is for app";
//             let token = jwt.sign(content, secretOrPrivateKey, {})
//             let tokenObj = {}
//             tokenObj.user = req.body.username
//             tokenObj.isApp = true
//             tokenObj.token = token
//             tokenObj.dateTime = new Date().getTime()
//             tokenfuc.updateByNameandIsApp(req.body.username, tokenObj, result => {
//                 resolve(token)
//             })
//         })
//     }).then((token) => {
//         appLogger.info("applogin：App登陆成功")
//         res.json(new resultMsg(0, {appToken: token}, ""))
//     }).catch(err => {
//         errLogger.error("applogin:")
//         errLogger.error(err)
//         res.json(new resultMsg(1, {}, "账号或密码错误"))
//     })
// }


function valCookie(req) {
    return new Promise((resolve, reject) => {
        let CookiesArr = Object.keys(req.cookies)
        let ValCookieArr = []
        let ConditionArr = []
        if (CookiesArr.length == 0) {
            resolve(ValCookieArr)
        }
        else {
            for (let i = 0; i < CookiesArr.length; i++) {
                ConditionArr.push(decodeURIComponent(CookiesArr[i]))
            }
            weduserfuc.JudgeSwitch(ConditionArr, result => {
                resolve(result)
            })

        }
    })
}


exports.auth = (req, res, next) => {
    valCookie(req).then((ValCookieArr) => {
        let token = req.cookies[encodeURI(ValCookieArr[0].UserName)].split(";;")[0]
        jwt.verify(token, "keyyyyyyyyy", function (err, decoded) {
            if (err) {
                errLogger.error("auth:")
                errLogger.error(err)
            }
            else {
                if (decoded.username !== "admin") {
                    errLogger.error("auth:权限不足")
                    res.json(new resultMsg(0, {}, "权限不足"))
                }
                next()
            }
        })
    })
}


exports.auth2 = (req, res, next) => {
    valCookie(req).then((ValCookieArr) => {
        let token = req.cookies[encodeURI(ValCookieArr[0].UserName)].split(";;")[0]
        return new Promise((resolve, reject) => {
            jwt.verify(token, "keyyyyyyyyy", function (err, decoded) {
                if (err) {
                    errLogger.error("auth2:" + err)
                    errLogger.error(err)
                    reject(err)
                }
                else {
                    resolve(decoded)
                }
            })
        })
    }).then((decoded) => {
        return new Promise((resolve, reject) => {
            weduserfuc.findOneByUserName(decoded.username, result => {
                if (result.level == 3) {
                    errLogger.error("auth2:权限不足")
                    reject()
                }
                else {
                    resolve()
                }
            })

        })
    })
        .then(() => {
            next()
        })
        .catch((err) => {
            errLogger.error(err)
            errLogger.error("auth2:权限不足")
            res.json(new resultMsg(404, {}, err))
        })
}


exports.layout = (req, res) => {
    for (let i = 0; i < Object.keys(req.cookies).length; i++) {
        res.clearCookie(Object.keys(req.cookies)[i])
    }
    appLogger.info('登出')
    appLogger.info(Object.keys(req.cookies))
    // return  res.render('login')
    res.redirect('/login.html')
    // res.json(new resultMsg(0, {}, ""))
}


exports.login = (req, res, next) => {
    valCookie(req).then((ValCookieArr) => {
        if (ValCookieArr.length == 0) {
            next()
        }
        else {
            res.redirect('/')
        }
    })

}

exports.IndexFirst = function (req, res) {
    valCookie(req).then((ValCookieArr) => {
        if (ValCookieArr.length == 0) {
            return res.redirect("login.html");
        }
        else {
            res.redirect('/index.html')
        }
    })

}

exports.IndexSecond = (req, res, next) => {
    valCookie(req).then((ValCookieArr) => {
        if (ValCookieArr.length == 0) {
            return res.redirect("login.html");
        }
        else {
            next()
        }
    })


}
