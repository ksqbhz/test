"use strict";

$('.panel').css('background', 'none')
$('.infomation').hide()
$('.showHide').hide()
let level = 0;
let fakeCookie = document.cookie.split(";")
if (fakeCookie.length >1) {
    console.log(fakeCookie)
    let RealCookie=fakeCookie.filter(function (ele) {
        if (!ele.match("__guid") && !ele.match("monitor_count")) {
            return ele
        }
    })
    level = RealCookie[0].split('%3B%3B')[1]
    $('.person')[0].innerHTML = decodeURIComponent(RealCookie[0].split('%3B%3B')[0].split("=")[0])
}
else if (fakeCookie.length == 1) {
    level = document.cookie.split('%3B%3B')[1]
    $('.person')[0].innerHTML = decodeURIComponent(document.cookie.split('%3B%3B')[0].split("=")[0])
}
$("#Search-Input,#VoteGuide,#statsName,.voteName,#allVoteResult,#checkResult,#transaction,#saleMan,#app,#sendMessage").on({
    mouseover: function () {
        $(this).css("color", "blue")
    },
    mouseout: function () {
        $(this).css("color", "white")
    },
    click: function () {
        $("#Search-Input,#VoteGuide,#statsName,.voteName,#allVoteResult,#checkResult,#transaction,#saleMan,#app,#sendMessage")
            .on('mouseover', function () {
                $(this).css("color", "blue")
            });
        $("#Search-Input,#VoteGuide,#statsName,.voteName,#allVoteResult,#checkResult,#transaction,#saleMan,#app,#sendMessage")
            .on('mouseout', function () {
                $(this).css("color", "white")
            });
        $("#Search-Input,#VoteGuide,#statsName,.voteName,#allVoteResult,#checkResult,#transaction,#saleMan,#app,#sendMessage")
            .css("color", "white")
        $(this).css("color", "blue")
        $(this).off('mouseout');
        $(this).off('mouseover');
    }
})
switch (level) {
    case "1":
        $('.infomation').show()
        $('.showHide').show()
        $("#Search-Input").click()
        break
    case "2":
        toDeal()
        $(".showHide ").remove()
        $('#query-result').remove()
        $('#SearchGuide').remove()

        $('.infomation').show()
        break
    case "3":
        $("#part2").addClass("in")
        $(".showHide ").remove()
        $('#query-result').remove()
        $('#SearchGuide,#ManageGuide,#SalemanGudie,#AppGuide,#sendMessage,#allVoteResult').remove()
        $('#manages,#trans,#edits').remove()
        $('#checkSalemanMessage,#addSalemanMessage,#updateSalemanMessage').remove()
        $('#checkAppUsers,#addAppUsers,#editAppUsers').remove()
        $('#sendInformation').remove()
        //投票者记录
        $('#allResults').remove()
        $('.infomation').show()
        statsNamefuc()
        break
    default:
        alert("登陆失败，请按退出键重新登录")
        $('.infomation').remove()
}

var patt1 = new RegExp(/\d+/g);

let jiantouFlag = 1;
function Reverse(ele) {
    if (jiantouFlag % 2 == 1) {
        ele.childNodes[1].classList.add("glyphicon-chevron-down")
        // $('#jiantou').addClass("glyphicon-chevron-down")
        jiantouFlag = jiantouFlag + 1
    }
    else {
        ele.childNodes[1].classList.remove("glyphicon-chevron-down")
        // $('#jiantou').removeClass("glyphicon-chevron-down")
        jiantouFlag = 1
    }
}

/******************************主界面 数据搜索按钮   转换按钮 ******************************/
// 处理数据请求及响应
function handle() {
    if ($('.person')[0].innerHTML == "admin" || $('.person')[0].innerHTML == " admin") {
        let inputValArr = $('#get-input').val().trim().split(" ")
        if (inputValArr.length) {
            $.ajax({
                "type": "get",
                "url": "/search",
                //  param() : 将字符串、数组、对象序列化 : xx=xx
                "data": $.param({
                    'searchContent': inputValArr
                }),
                "success": function (resultObj) {
//                    判断是否有数据传送回来
                    if (parseInt(resultObj.data.result) !== 0) {
                        globalData = resultObj.data.result
                        let headArr = globalData[0].value.split('')
                        let tailArr = globalData[1].value.split('')

                        let obj = {
                            headArr: headArr,
                            tailArr: tailArr,
                            inputValArr: inputValArr
                        }
                        //获取显示字体的div ，将obj传给该div
                        let evalTextList = doT.template($("#list-choice").text())
                        $(".list-choice").html(evalTextList(obj))
                        $('.list-choice').show()
                        handleData(obj)
                        $('.content').show()
                        $('.btn-center').show()   //显示按钮
                        $('.selectAll').show()    //显示全选/反选
                        // logo向上移位
                        if ($('div.title').css('margin-top') !== '0') {
                            $('div.title').css('margin-top', '0')
                            // $('div.title').css('transition','margin-top 1s')
                        }
                    } else {
//                        当没有数据时
                        $('.content').html('<h4>Not Found !</h4>')
                        $('.list-choice').html('')
                        $('.btn-center').hide()
                        $('.selectAll').hide()
                        $('div.title').css('margin-top', '10%')
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        } else {
            alert('请输入拼音查询！')
        }
    }
}

function handleData(obj) { // 过滤元素模板
    //显示组合字体
    let evalTextContent = doT.template($("#content").text())
    $(".content").html(evalTextContent(obj))

}

// 处理选择状态
//    监听键盘事件
$('#get-input').keyup((e) => { //enter监听事件
    if (e.keyCode === 13) {
        handle()
    }
})

//    enter按钮被点击时
$('#basic-addon2').click(() => { //点击事件
    handle()
})

/**********************已选择商标名的可用类别列表**********************/
// 获取查询结果
$('#nextStep').click(() => {
    let
        selectedValArr = [],
        inputGroup = document.querySelector('.content').querySelectorAll('input')
    for (let i = 0; i < inputGroup.length; i++) {
        if (inputGroup[i].checked && inputGroup[i].parentNode.classList.contains('divLine')) {
            selectedValArr.push(inputGroup[i].nextSibling.nextSibling.innerHTML)
            selectedValArr.push(inputGroup[i].nextSibling.nextSibling.innerHTML[1] + inputGroup[i].nextSibling.nextSibling.innerHTML[0]);
        }
    }
    if (selectedValArr.length) {
        $.ajax({
            type: 'post',
            url: '/queryData',
            data: {
                keyWords: selectedValArr
            },
            success: function (ableArrObj) {
                if (ableArrObj.data.ableArr) {
                    let searchResultArr = ableArrObj.data.ableArr
                    handleResult(searchResultArr)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    } else {
        alert('请选择查询单元！')
    }
})

function handleResult(searchResultArr) {
    $('.showHide').hide()
    $('.result-list').show()
    $('.goback').show()


    let obj = {
        'array': searchResultArr
    }

    let evalResultList = doT.template($("#result-list").text())
    $(".result-list").html(evalResultList(obj))
    $('.result-list').show()

    //查看商标可注册类的分页
    let allRecord = $('#tab tr').length - 1  //设置总记录
    pagination(allRecord, 6, $('.con'))

}

function goback() {
    $('.showHide').show()
    $('.result-list').hide()
    $('.goback').hide()

    //隐藏分页
    $('.pageSet').hide()

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()

    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

}

/***************************************分页组件***************************************/
//设置表格分页
function pagination(all, onlyRec, docTr, isVote) {

    //let record = 6  //设置每一页所要显示的总商标
    // let allRecord = $('#tab tr').length - 1  //设置总记录
    let currenPage = 1   //设置当前页，并将当前页设为首页
    let pageLen = all % onlyRec == 0 ? all / onlyRec : Math.floor(all / onlyRec) + 1 //设置总页数
    if (pageLen == 0) {
        pageLen = 1
    }
    $('.curPage').html("第" + currenPage + "页")
    $('.allPage').html("/共" + pageLen + "页,")
    $('.allRec').html("共" + all + "条记录")
    if (isVote) {
        $('#pageSetForVote').show()
        //首页添加点击事件
        $('#firstPageForVote').click(() => {
            currenPage = 1
            showRecord(currenPage, onlyRec, docTr)
        })
        //上一页添加点击事件
        $('#prevPageForVote').click(() => {
            if (currenPage > 1) {
                currenPage--
                showRecord(currenPage, onlyRec, docTr)
            }
        })
        //下一页添加点击事件
        $('#nextPageForVote').click(() => {
            if (currenPage < pageLen) {
                currenPage++
                showRecord(currenPage, onlyRec, docTr)
            }
        })
        //尾页添加点击事件
        $('#lastPageForVote').click(() => {
            currenPage = pageLen
            showRecord(currenPage, onlyRec, docTr)
        })
    } else {
        $('.pageSet').show()
        //首页添加点击事件
        $('#firstPage').click(() => {
            currenPage = 1
            showRecord(currenPage, onlyRec, docTr)
        })
        //上一页添加点击事件
        $('#prevPage').click(() => {
            if (currenPage > 1) {
                currenPage--
                showRecord(currenPage, onlyRec, docTr)
            }
        })
        //下一页添加点击事件
        $('#nextPage').click(() => {
            if (currenPage < pageLen) {
                currenPage++
                showRecord(currenPage, onlyRec, docTr)
            }
        })
        //尾页添加点击事件
        $('#lastPage').click(() => {
            currenPage = pageLen
            showRecord(currenPage, onlyRec, docTr)
        })
    }


    //判断显示记录
    showRecord(currenPage, onlyRec, docTr)
}
//设置显示的记录
function showRecord(p, r, t) {

    $('.curPage').html("第" + p + "页")

    //从外部传入t 获取table中的tr
    t.hide()
    t.each(i => {
        //条件判断决定显示哪个页面中的记录
        // 从当前页之前的记录，截取到当前页结束的记录，便是显示当前页
        if (i >= (p - 1) * r && i <= (p - 1) * r + 1 * r - 1) {
            t.eq(i).show()
        }
    })
}


/*联动*/
//prop:添加属性   querySelector:返回匹配的第一个元素 要返回全部则可使用querySelectorAll
//    classList.contains : 是否包含某个属性

var globalData, inpustValArr
var AllCheckbox = 0;//所有搜索出来的所有checkbox
var AllInput = 0;  //所有字组合的checkbox
var doubleSelect = 0; //两个拼音数目

function gobalAll(ele) {
    // AllCheckbox = $(".showHide input").length - 1 //减去搜索栏的INPUT
    AllInput = $(".divLine input").length   //.divLine的所有input//全局选中
    if (ele.checked) {
        $('#gobalAll-input').prop('checked', true)
        $('.content input[type=checkbox]').prop('checked', true)
        // $('.selectAll span').html(`全选/反选 <b>选中${AllInput}个</b>`)
    } else {
        $('#gobalAll-input').prop('checked', false)
        $('.content input[type=checkbox]').prop('checked', false)
        // $('.selectAll span').html(`全选/反选 <b>选中0个</b>`)
    }
}
// 过滤筛选功能
function selectHead(ele) {//第一个拼音全选
    if (ele.checked) {
        $('.headSel').prop('checked', true)
    } else {
        $('.headSel').prop('checked', false)
    }
    $('#gobalAll-input').prop('checked', false)
//        $('.selectAll span').html('全选/反选')
    filterFunc()
}

function selectTail(ele) {//第二个拼音全选
    if (ele.checked) {
        $('.tailSel').prop('checked', true)
    } else {
        $('.tailSel').prop('checked', false)
    }
    $('#gobalAll-input').prop('checked', false)
//        $('.selectAll span').html('全选/反选')
    filterFunc()
}

function headTailAll(ele) { //第一第二拼音 单选联动 全选联动
    $('#gobalAll-input').prop('checked', false)
//        $('.selectAll span').html('全选/反选')
    //取到所有第一拼音UL的下的所有checkbox
    var obj = document.getElementsByClassName(ele.className)
    var selectCount = 0;
    if (obj.length) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].checked === true) {
                selectCount++
            }
        }
        //inputEle为第一拼音下第一个input即标题input
        let inputEle = ele.parentNode.parentNode.parentNode.parentNode.querySelector('input')
        if (inputEle) {
            if (obj.length === selectCount) {
                inputEle.checked = true
            } else {
                inputEle.checked = false
            }
        }
    }
    filterFunc()
}

function filterFunc() {
    let headArr = globalData[0].value.split('')
    let tailArr = globalData[1].value.split('')
    let headSel = document.querySelectorAll('.headSel')
    let tailSel = document.querySelectorAll('.tailSel')
    let tempArr = []
    let flag = 0
    for (let i = 0; i < headSel.length; i++) {
        if (headSel[i].checked) {
            tempArr.push(headSel[i].nextSibling.innerHTML)
            flag = 1
        }
    }
    if (flag === 1) {
        headArr = tempArr
    }

    tempArr = []
    flag = 0
    for (let i = 0; i < tailSel.length; i++) {
        if (tailSel[i].checked) {
            tempArr.push(tailSel[i].nextSibling.innerHTML)
            flag = 1
        }
    }
    if (flag === 1) {
        tailArr = tempArr
    }

    let objInfo = {
        "headArr": headArr,
        "tailArr": tailArr,
        // "inputValArr": inputValArr
    }
    handleData(objInfo)
}

function setGobalAll(ele) {
    //全局选择联动
    //此处obj为标题head的DIV
    var obj = document.getElementsByClassName(ele.parentNode.className)
    var selectCount = 0
    var lll = 0
    if (obj.length) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].firstChild.nextSibling.checked === true) {
                selectCount++
            }
        }
        if (obj.length === selectCount) {
            document.querySelector('#gobalAll-input').checked = true
        } else {
            document.querySelector('#gobalAll-input').checked = false
        }
        // $('.selectAll span').html(`全选/反选 <b>选中${AllInput}个</b>`)
    }
}


function selectAll(ele) { //单个全选
    if (ele.checked) {
        ele.checked = true
        ele.parentNode.parentNode.classList.add('selectLi')
        $('.selectLi input').prop('checked', true)
        ele.parentNode.parentNode.classList.remove('selectLi')

    } else {
        ele.checked = false
        ele.parentNode.parentNode.classList.add('selectLi')
        $('.selectLi input').prop('checked', false)
        ele.parentNode.parentNode.classList.remove('selectLi')
    }
    setGobalAll(ele)
}

function setSelectAll(ele) { //单个全选联动
    //此处obj为tail内容的input
    var obj = document.getElementsByClassName(ele.className)
    var selectCount = 0
    if (obj.length) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].checked === true) {
                selectCount++
            }
        }
        let inputEle = ele.parentNode.parentNode.firstElementChild.firstElementChild
        if (inputEle) {
            if (obj.length === selectCount) {
                inputEle.checked = true
            } else {
                inputEle.checked = false
            }
        }
        setGobalAll(inputEle)
    }
}


/********************************************************************/
/*****************************************商标可注册类别查询****************************************/

$("#Search-Input").click(() => {
    $('.showHide').show()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide();
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()
    //APP用户
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()
})


function SelectsAppUser(ele) {
    let getID = ele.parentNode.previousSibling.previousSibling.firstChild.nextSibling.id
    let appUsersArr = []
    for (let i = 0; i < $("#" + getID + ' tbody :checked').length; i++) {
        let child = $("#" + getID + ' tbody :checked')[i].parentNode.parentNode.parentNode.childNodes
        appUsersArr.push([child[5].innerHTML, child[11].innerHTML])
    }
    $('.AppUserName').empty()
    appUsersArr.forEach(name => {
        $('.AppUserName').append(`<span>${name[0]}</span> `)
    })
}

/******************************监听输入框的值是否符合规定*******************/
function NumWatch(e) {
    //限制只数字
    // e.value=e.value.replace(/\D/g,'').substring(0,7);//长度限制，7是长度
    if (e.value != e.value.replace(/\D/g, '')) {
        e.value = ""
        e.placeholder = "请输入数字"
    }
}

/*************************登出&********************/
$('.layout').click(() => {

    location.href="/layout"
    // $.ajax({
    //     "type": "get",
    //     "url": "/layout",
    //     "success": function (resultMsg) {
    //         if (resultMsg.result_code == 0) {
    //             location.href = "login.html"
    //         }
    //     },
    //     "error": function (data) {
    //         console.log(data.err_msg)
    //     }
    //
    // })
})





