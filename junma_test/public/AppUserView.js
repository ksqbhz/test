function SellectAppUserAll(ele) {
    ele.checked == true ?
        $('.appTr input').prop('checked', true) :
        $('.appTr input').prop('checked', false)
}
function SellectAppUser() {
    $('.appTr').length == $('.appTr input:checked').length ?
        $('#SellectAppUserAll')[0].checked = true : $('#SellectAppUserAll')[0].checked = false;

}
function JudgeStatus(data) {
    console.log(data.result_code)
    switch (data.result_code) {
        case 1:
            alert(data.err_msg)
            break
        case 401:
            alert(data.err_msg)
            $('.layout').click()
            break
    }
}

/**************************查看APP用户信息***************************/

function appUsers(which = 1) {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()

    $('#checkAppUsers').show()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    $.ajax({
        type: "post",
        url: "/AppUsersMes",
        "data": {
            Page: which,
        },
        success: (resultArrObj) => {
            if (resultArrObj.result_code == 0) {
                console.log(resultArrObj)
                let userData = {
                    userArray: resultArrObj.data.resultArr
                }
                let pageCount = Math.ceil(resultArrObj.data.PageCount / 8)
                let users = doT.template($("#checkAppUser").text())
                $(".checkAppUser").html(users(userData))
                //设置分页
                // let allTr = $(".appTr").length
                // pagination(allTr, 6, $('.appTr'))
                $("#PageCheckAppUser").bootstrapPaginator({
                    currentPage: which,
                    size: "normal",
                    numberOfPages: 8,
                    totalPages: pageCount,
                    onPageChanged: function (event, oldPage, newPage) {
                        appUsers(newPage)
                    }
                })
            } else {
                JudgeStatus(resultArrObj)
            }
        }
    })
}
function SsearchAppUserName(which = 1, Condition = {}) {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()

    $('#checkAppUsers').show()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()
    Condition.AppUserName = $('#appUser').val()
    $.ajax({
        type: "post",
        url: "/AppUsersMes",
        "data": {
            Page: which,
            Condition
        },
        success: (resultArrObj) => {
            if(resultArrObj.result_code == 0){
                let userData = {
                    userArray: resultArrObj.data.resultArr
                }
                let pageCount = Math.ceil(resultArrObj.data.PageCount / 8)
                let users = doT.template($("#checkAppUser").text())
                $(".checkAppUser").html(users(userData))
                //设置分页
                // let allTr = $(".appTr").length
                // pagination(allTr, 6, $('.appTr'))
                $('#appUser')[0].value = Condition.AppUserName
                $("#PageCheckAppUser").bootstrapPaginator({
                    currentPage: which,
                    size: "normal",
                    numberOfPages: 8,
                    totalPages: pageCount,
                    onPageChanged: function (event, oldPage, newPage) {
                        SsearchAppUserName(newPage, Condition)
                    }
                })
            } else {
                JudgeStatus(resultArrObj)
            }


        }
    })
}

/**************************添加APP用户信息***************************/
function AddappUser() {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息
    $('#checkSalemanMessage').hide()
    $('#updateSalemanMessage').hide()
    $('#addSalemanMessage').hide()

    $('#checkAppUsers').hide()
    $('#addAppUsers').show()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    let aaa = {}
    let addResult = doT.template($("#addAppUser").text())
    $(".addAppUser").html(addResult(aaa))
}

function sendAPPUsersData() {

    let AppUserObj = {
        AppUserName: $('.addAppUser .inp input')[0].value,
        pwd: $('.addAppUser .inp input')[1].value,
        telNumber: $('.addAppUser .inp input')[2].value,
    }
    if (nameFlag == 1) {
        if (AppUserObj.saleName != '' && AppUserObj.saleQQ != '' && AppUserObj.saleTelNum != '') {
            $.ajax({
                type: "post",
                url: "/addAppUsers",
                data: {
                    AppUserObj: AppUserObj
                },
                success: (resultMsg) => {
                    if (resultMsg.result_code == 0) {
                        alert("添加成功")
                        appUsers()
                    }
                    else {
                        JudgeStatus(resultMsg)
                    }
                }
            })
        } else {
            alert("请将所有内容补全")
        }
    } else {
        alert('请重新填写用户名')
    }


}

/**************************修改APP用户信息***************************/
let editAPPData = {}
function EditappUser() {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()
    //业务员信息
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()

    $('#editAppUsers').show()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    if ($('.AppUserTab tbody :checked').length !== 1) {
        alert("只能选择一条信息进行修改")
        appUsers()
    } else {
        let ChilData = $('.AppUserTab tbody :checked')[0].parentNode.parentNode.parentNode.childNodes
        editAPPData.AppUserName = ChilData[5].innerHTML
        editAPPData.pwd = ChilData[7].innerHTML
        editAPPData.telNumber = ChilData[9].innerHTML

        let EditAppResult = doT.template($("#editAppUser").text())
        $(".editAppUser").html(EditAppResult(editAPPData))

        editAPPData.AppUserID = ChilData[11].innerHTML
    }
}
//发送修改的数据
function editAPPUserData() {

    let editAppObj = {
        AppUserName: $('.editAppUser .inp input')[0].value,
        pwd: $('.editAppUser .inp input')[1].value,
        telNumber: $('.editAppUser .inp input')[2].value,
    }
    if (editAppObj.AppUserName == editAPPData.AppUserName &&
        editAppObj.pwd == editAPPData.pwd &&
        editAppObj.telNumber == editAPPData.telNumber) {
        alert("请至少修改一项")
    } else {
        editAppObj.AppUserID = editAPPData.AppUserID
        $.ajax({
            type: "post",
            url: "/editAppUsers",
            data: {
                editAppObj: editAppObj
            },
            success: (resultMsg) => {
                if (resultMsg.result_code == 0) {
                    alert("修改成功")
                    appUsers()
                }
                else {
                    JudgeStatus(resultMsg)
                }
            }
        })
    }

}
/**************************删除APP用户信息***************************/
function DelappUser() {
    let ChilData,
        APPUserIDArr = []
    if ($('.AppUserTab tbody :checked').length <= 0) {
        alert("请选择要删除的用户")
    } else {
        alert("确定要删除此信息吗？")
        for (let i = 0; i < $('.AppUserTab tbody :checked').length; i++) {
            ChilData = $('.AppUserTab tbody :checked')[i].parentNode.parentNode.parentNode.childNodes
            APPUserIDArr.push(ChilData[11].innerHTML)
        }

        $.ajax({
            type: "post",
            url: "/delAppUsers",
            data: {
                APPUserIDArr: APPUserIDArr
            },
            success: (resultMsg) => {
                if (resultMsg.result_code == 0) {
                    alert("删除成功")
                    appUsers()
                }
                else {
                    JudgeStatus(resultMsg)
                }
            }
        })
    }
}


///////////？？？？添加APP用户时，监听APP用户名失焦事件，查看是否有相同的用户名？？？？//////////
let nameFlag = 0
function checkAPPUserName() {
    $.ajax({
        type: "post",
        url: "/apicheckAppUserName",
        data: {
            AppUserName: $("#APPUSERNAME").val()
        },
        success: ((data) => {
            if (data.result_code == 0) {
                if ($('#checkNames span').length > 0) {
                    $('#checkNames span').remove()
                    $('#checkNames').append('<span style="color: green">该用户名可注册</span>')
                } else {
                    $('#checkNames').append('<span style="color: green">该用户名可注册</span>')
                }
                nameFlag = 1
            } else {
                if ($('#checkNames span').length > 0) {
                    $('#checkNames span').remove()
                    $('#checkNames').append('<span style="color: red">该用户名已被注册</span>')
                } else {
                    $('#checkNames').append('<span style="color: red">该用户名已被注册</span>')
                }
                nameFlag = 0
            }
        })
    })
}
