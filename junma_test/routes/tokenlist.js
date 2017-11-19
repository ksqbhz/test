/*
let tokenfuc = require("../modelfunc/tokenfuc"),
    Userfuc = require("../modelfunc/userdatafuc"),
    resultMsg = require("./../returnMsg"),
    logconf = require("../conf"),
    log4js = logconf.logg,
    httpLogger = logconf.httpLogger,
    appLogger = logconf.appLogger,
    errLogger = logconf.errLogger
//引入jwt模块
var jwt = require('jsonwebtoken');

exports.webverifytoken = (req, res, next) => {
    let ValCookiesNum = [];
    let PromiseArr = []
    let CookiesArr = Object.keys(req.cookies)
    if (req.headers.cookie != 'undefined') {
        let token
        for (let i = 0; i < CookiesArr.length; i++) {
            PromiseArr.push(new Promise((resolve, reject) => {
                let CookieName = decodeURIComponent(CookiesArr[i])
                Userfuc.findOneByUserName(CookieName, result => {
                    if (result) {
                        ValCookiesNum.push(CookiesArr[i])
                        resolve()
                    }
                    else {
                        reject()
                    }
                })

            }))
        }
        Promise.all(PromiseArr).then(() => {
            return new Promise((resolve, reject) => {
                if (ValCookiesNum.length == 1) {
                    resolve(ValCookiesNum[0])
                }
                else if (ValCookiesNum == 0) {
                    next()
                }
                else {
                    reject()
                }
            })
        })
            .then((UserName) => {
                token = req.cookies[UserName].split(";;")[0]
                return new Promise((resolve, reject) => {
                    tokenfuc.findbytoken(token, tokenRes => {
                        if (tokenRes.length > 0) {
                            resolve(tokenRes)
                        } else {
                            errLogger.error("webverifytoken:此token无效")
                            reject()
                        }
                    })
                })
            })
            .then((tokenRes) => {
                let expriedTime = (1000 * 60 * 60 * 24) * 3  //3天的毫秒数
                if (new Date().getTime() - tokenRes[0].dateTime < expriedTime) {
                    tokenRes[0].dateTime = new Date().getTime()  //重新更新有效期限
                    tokenfuc.updatebytoken(token, tokenRes[0].dateTime, result => {
                        next()
                    })
                } else {
                    errLogger.error("webverifytoken:token已过期token已过期")
                    if(req.method=="GET"){
                        // for (let i = 0; i < Object.keys(req.cookies).length; i++) {
                        //     console.log(Object.keys(req.cookies))
                        //     res.clearCookie(Object.keys(req.cookies)[i])
                        // }
                        return res.redirect('/layout')
                        // return  res.render('login')
                    }
                    else{
                        res.json(new resultMsg(401, {}, "账户有效期已过，请重新登录"))
                    }
                    // return res.render('err', {
                    //     code: 401,
                    //     message: "账户有效期已过，请重新登录"
                    // })
                    // res.json(new resultMsg(401, {}, "账户有效期已过，请重新登录"))
                }
            })
            .catch(err => {

                errLogger.error(err)
                errLogger.error("webverifytoken:你的账号在其他设备登录，请重新登录")
                if(req.method=="GET"){
                    // for (let i = 0; i < Object.keys(req.cookies).length; i++) {
                    //     console.log(Object.keys(req.cookies))
                    //     res.clearCookie(Object.keys(req.cookies)[i])
                    // }
                    return res.redirect('/layout')
                    // return  res.render('login')
                }
                else{
                    res.json(new resultMsg(401, {}, "你的账号在其他设备登录，请重新登录"))
                }
                // return res.render('err', {
                //     code: 401,
                //     message: "你的账号在别处登录或未登陆，请重新登录"
                // })
                // res.json(new resultMsg(401, {}, "你的账号在别处登录，请重新登录"))
            })
    } else if (req.body.appToken && req.body.appToken != 'undefined') {
        let token = req.body.appToken
        new Promise((resolve, reject) => {
            tokenfuc.findbytoken(token, tokenRes => {
                if (tokenRes.length > 0) {
                    resolve(tokenRes)
                } else {
                    errLogger.error("webverifytoken:此token无效")
                    reject()
                }
            })
        }).then((tokenRes) => {

            let expriedTime = (1000 * 60 * 60 * 24) * 3  //3天的毫秒数
            if (new Date().getTime() - tokenRes[0].dateTime < expriedTime) {
                tokenRes[0].dateTime = new Date().getTime()  //重新更新有效期限
                tokenfuc.updatebytoken(token, tokenRes[0].dateTime, result => {
                    next()
                })
            } else {
                errLogger.error("webverifytoken:token已过期")
                res.json(new resultMsg(8500, {}, "token已过期"))
            }
        }).catch(err => {
            errLogger.error("webverifytoken:APPtoken请求查询接口失败")
            errLogger.error(err)
            res.json(new resultMsg(8501, {}, "此token无效"))
        })
    } else {
        errLogger.error("webverifytoken:验证请求接口失败")
        res.json(new resultMsg(1, {}, "验证请求接口失败"))
    }
}

exports.appverifytoken = (req, res, next) => {
    if (req.body.appToken && req.body.appToken != 'undefined') {
        //验证token
        let token = req.body.appToken
        new Promise((resolve, reject) => {
            tokenfuc.findbytoken(token, tokenRes => {
                if (tokenRes.length > 0) {
                    resolve(tokenRes)
                } else {
                    errLogger.error("appverifytoken:APP验证接口，此token无效")
                    reject()
                }
            })
        }).then((tokenRes) => {
            let expriedTime = (1000 * 60 * 60 * 24) * 3
            if (new Date().getTime() - tokenRes[0].dateTime < expriedTime) {
                tokenRes[0].dateTime = new Date().getTime()  //重新更新有效期限
                tokenfuc.updatebytoken(token, tokenRes[0].dateTime, result => {
                    res.json(new resultMsg(0, {}, ""))
                })
            } else {
                //删除token 返回前端 重新登录
                //res.send('已过期')
                errLogger.error("appverifytoken:token已过期")
                res.json(new resultMsg(8500, {}, "token已过期"))
            }
        }).catch(err => {
            errLogger.error(err)
            res.json(new resultMsg(8501, {}, "APP验证接口，此token无效"))
        })
    } else {
        errLogger.error("appverifytokenAPP验证接口，此token无效")
        res.json(new resultMsg(8501, {}, "APP验证接口，此token无效"))
    }
}


*/
