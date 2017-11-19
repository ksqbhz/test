/*************************消息推送模块********************/
function pushInformation() {

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
    //APP用户
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //投票者记录
    $('#allResults').hide()

    $('#Information').show()

    //发送请求获取APP用户
    $.ajax({
        "type": "post",
        "url": "/AppUsersMes2",
        "success": function (resultArrObj) {
            console.log(resultArrObj.result_code == 401)
            if (resultArrObj.result_code == 0) {
                let appUser = {
                    UserArr: resultArrObj.data.resultArr
                }
                let genResult = doT.template($("#sendInformation").text())
                $(".sendInformation").html(genResult(appUser))

		// //APP用户滑动
                $(".App_Tbody").perfectScrollbar()
            }
            else if (resultArrObj.result_code == 401) {
                alert(resultArrObj.err_msg)
                $('.layout').click()
            }
        }
    })
}

//发送消息内容并推送
function sendAppMes() {

    if (!$("#sendAPPmessage").val()) {

        alert("请输入要推送的内容")

    }else if($(".AppUserName").children().length<=0){
        alert("请选择APP用户")

    } else {
        let appUsers = $('.sendInformation .AppUserName span')
        let appUsersArr = []
        for (let a = 0; a < appUsers.length; a++) {
            let name = appUsers[a].innerHTML

            appUsersArr.push(name)
        }
        $.ajax({
            "type": "post",
            "url": "/sendAPPMessage",
            data: {
                content: $("#sendAPPmessage").val(),
                APPUsersName: appUsersArr
            },
            "success": function (resultMsg) {

                if (resultMsg.result_code == 0) {
                    alert("推送成功")
                }
                else if (resultMsg.result_code == 401) {
                    alert(resultMsg.err_msg)
                    $('.layout').click()
                }
            }
        })
    }
}
