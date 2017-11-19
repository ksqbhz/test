/*****************************************商标名称投票模块*****************************************/
//    给商标名称统计列表添加点击事件
function statsNamefuc() {

    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').show()
    $('.vote').hide()
    $('#checks').hide();
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()

    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    $.ajax({
        "type": "post",
        "url": "/GetStatsName",
        "success": function (data) {
            if(data.result_code==200){
                var number = {
                    len: 500,
                    resArr: data.data
                }

                let selectResult = doT.template($("#stat").text())
                $(".stat").html(selectResult(number))
            }
            else if(data.result_code==401){
                alert(data.err_msg)
                $('.layout').click()
            }
        }
    })
}

function DisVoteNameBtn() {
    $("#stats button")[0].disabled=!($("#stats button")[0].disabled)
    $("#stats button")[1].disabled=!($("#stats button")[1].disabled)
}

/*商标名称统计*/
function KeepVoteName(ele) {
    DisVoteNameBtn()	
    let inputtext = new FormData(),
        ifNum = 0,
        realNum = 0,
        KeepArr = [];
    for (let i = 0; i < 500; i++) {
        if (($('.StatType')[i].value) && $('.StatName')[i].value) {
            realNum++

            KeepArr.push([$('.StatType')[i].value + "%=", $('.StatName')[i].value + "%=", $('.StatDesc')[i].value + "%="])
        }
    }
    for (let j = 0; j < 500; j++) {
        if (($('.StatType')[j].value) || ($('.StatName')[j].value)) {
            ifNum++
        }
    }
    if (realNum == ifNum && realNum !== 0 && ifNum !== 0) {
        inputtext.append('keepdata', KeepArr)
        $.ajax({
            type: 'post',
            url: '/KeepVoteName',
            cache: false,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            data: inputtext,
            success: function (data) {

                if (data.result_code == 200) {
                    alert(data.data)
		  DisVoteNameBtn()
                }
                else if (data.result_code == 404) {
                    alert(data.err_msg)
                }
                else if(data.result_code==401){
                    alert(data.err_msg)
                    $('.layout').click()
                }
            },
            eror: function () {
                console.log(eror)
            }
        })
    }
    else {
        alert("请把商标类别，商标名称补全")
        DisVoteNameBtn()	
    }
}
function SumbitVoteName(ele) {
    DisVoteNameBtn()	
    let inputtext = new FormData(),
        ifNum = 0,
        realNum = 0,
        SumbitArr = [];
    for (let i = 0; i < 500; i++) {
        if (($('.StatType')[i].value) && $('.StatName')[i].value) {
            realNum++

            SumbitArr.push([$('.StatType')[i].value + "%=", $('.StatName')[i].value + "%=", $('.StatDesc')[i].value + "%="])
        }
    }
    for (let j = 0; j < 500; j++) {
        if (($('.StatType')[j].value) || ($('.StatName')[j].value)) {
            ifNum++
        }
    }
    if (realNum == ifNum && realNum !== 0 && ifNum !== 0) {
        inputtext.append('Sumbitdata', SumbitArr)
        $.ajax({
            type: 'post',
            url: '/SumbitVoteName',
            cache: false,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            data: inputtext,
            success: function (data) {
                if (data.result_code == 200) {
                    alert(data.data)
                    VoteNamefuc()
                }
                else if (data.result_code == 404) {
		  ele.disabled=false
                    alert(data.err_msg)
                }
                else if(data.result_code==401){
                    alert(data.err_msg)
                    $('.layout').click()
                }

            },
            eror: function () {
                console.log(eror)
            }
        })
    }
    else {
        alert("请把商标类别，商标名称补全")
	DisVoteNameBtn()
    }
}

//给商标名称投票添加点击事件
let OrderType = {}
function VoteNamefuc() {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('#checks').hide()
    $('.vote').show()
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    $.ajax({
        type: "post",
        url: "/CheckVoteName",
        success: function (data) {

            if (data.result_code == 200) {
                let votelist = {}
                votelist.result = data.data

                let voteText = doT.template($("#vote").text());
                $(".vote").html(voteText(votelist));
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].IsSubmit == "Y") {
                        $("#voteTab input").prop("disabled", true)
                        break
                    }
                }

                $("#ChoVoteNum")[0].innerHTML = $('.voteTr input:checked').length

                OrderType = votelist;

                $(".voteTr-tbody").perfectScrollbar()
            }
            else if (data.result_code == 404) {
                alert(data.err_msg)
                $('#statsName').click()
            }
            else if(data.result_code==401){
                alert(data.err_msg)
                $('.layout').click()
            }
        }

    })


}
//
let jiantouByType = 1
function OrderByTpefuc() {
    OrderType.Flag = jiantouByType
    let voteText = doT.template($("#vote").text());
    $(".vote").html(voteText(OrderType));
    $(".voteTr-tbody").perfectScrollbar()
    for (let i = 0; i < OrderType.result.length; i++) {
        if (OrderType.result[i].IsSubmit == "Y") {
            $("#voteTab input").prop("disabled", true)
            break
        }
    }
    $("#ChoVoteNum")[0].innerHTML = $('.voteTr input:checked').length

}
function OrderByType() {
    if (jiantouByType % 2 == 1) {
        OrderType.result.reverse()
        jiantouByType = jiantouByType + 1
        OrderByTpefuc()
        $("#Typejiantou").addClass("glyphicon-chevron-up")
        $("#Typejiantou").removeClass("glyphicon-chevron-down")

    }
    else {
        OrderType.result.reverse()
        jiantouByType = 1
        OrderType.Flag = jiantouByType
        OrderByTpefuc()
        $("#Typejiantou").removeClass("glyphicon-chevron-up")
        $("#Typejiantou").addClass("glyphicon-chevron-down")
    }

}

/*筛选*/
function SelectVoteAll(ele) {
    if (ele.checked == true) {
        $('.voteTr input').prop('checked', true)
        $("#ChoVoteNum").html($("#TotalCho")[0].innerHTML)
    } else {
        $('.voteTr input').prop('checked', false)
        $("#ChoVoteNum").html(0)
    }
}
function SelectVote() {
    if ($('.voteTr').length == $('.voteTr input:checked').length) {
        $('#SelectVoteAll')[0].checked = true
        $("#ChoVoteNum").html($('.voteTr input:checked').length)

    } else {
        $('#SelectVoteAll')[0].checked = false
        $("#ChoVoteNum").html($('.voteTr input:checked').length)
    }
}

function DisabledBtn() {
    $("#KeepVoteBtn")[0].disabled=!($("#KeepVoteBtn")[0].disabled)
    $("#SubmitVoteBtn")[0].disabled=!($("#SubmitVoteBtn")[0].disabled)
}

function KeepVoteResult(ele) {
    DisabledBtn()
    let inputtext = new FormData(),
        voteresult = []
    for (let i = 0; i < $(".voteTr input:checked").length; i++) {
        voteresult.push($(".voteTr input:checked")[i].parentNode.parentNode.lastChild.previousSibling.innerHTML)
    }
    inputtext.append("idd", voteresult)
    if ($(".voteTr input:checked").length > 0 && $(".voteTr input:checked").length <= 500) {
        $.ajax({
            type: "post",
            url: "/KeepVoteResult",
            cache: false,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            data: inputtext,
            success: function (data) {

                if (data.result_code == 200) {
                    alert(data.data)
		  DisabledBtn()
                    VoteNamefuc()
                }
                else if (data.result_code == 404) {
                    alert(data.err_msg)
                }
                else if(data.result_code==401){
                    alert(data.err_msg)
                    $('.layout').click()
                }
            },
            error: function (error) {
                console.log(error)
            }
        })
    } else {
        alert("请勾选至多500条并保存")
        DisabledBtn()
    }
}


function SubmitVoteResult(ele) {
    DisabledBtn();
    let inputtext = new FormData(),
        voteresult = []
    for (let i = 0; i < $(".voteTr input:checked").length; i++) {
        voteresult.push($(".voteTr input:checked")[i].parentNode.parentNode.lastChild.previousSibling.innerHTML)
    }
    inputtext.append("idd", voteresult)
    if ($(".voteTr input:checked").length > 0 && $(".voteTr input:checked").length <= 500) {
        $.ajax({
            type: "post",
            url: "/SubmitVoteResult",
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            data: inputtext,
            success: function (data) {
                if (data.result_code == 200) {
                    $("#voteTab input").prop("disabled", "disabled")
                    alert("提交成功")
                }
                else if (data.result_code == 404) {		  
                    alert(data.err_msg)
                }
                else if(data.result_code==401){
                    alert(data.err_msg)
                    $('.layout').click()
                }

            },
            error: function (error) {
                console.log(error)
            }
        })
    } else {
        alert("请勾选至多500条后再提交或你无法为自己投票")
        DisabledBtn()
    }
}
function VoteNumber(Array) {
    $(".tab-body").perfectScrollbar()
    let arr = []
    Array.resArr.forEach((valueObj, index) => {
        arr.push(valueObj.count)
    })

    arr.sort((a, b) => a - b)  //从大到小排序
    for (let i = 0; i < arr.length;) {
        let testArr = arr.filter(x => x == arr[i])
        if (i < arr.length - 1) {
            $("#voteRes").append(`<span>${arr[i]}票：${testArr.length}个 , </span>`)
        } else {
            $("#voteRes").append(`<span>${arr[i]}票：${testArr.length}个</span>`)
        }
        i += testArr.length
    }
}

let OrderReload = {};
//给投票结果查询添加点击事件
$('#checkResult').click(() => {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').show()
    $('#manages').hide()
    $('#trans').hide()
    $('#edits').hide()

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()


    let resObj = {}
    $.ajax({
        type: 'post',
        url: '/FinalVoteResult',
        success: function (data) {

            if (data.result_code == 200) {
                resObj.resArr = data.data;
                level !== "3" ?
                    resObj.Right = true :
                    resObj.Right = false
                OrderReload = resObj;
                let checkResult = doT.template($("#check").text())
                $(".check").html(checkResult(resObj))
                $(".tab-body").perfectScrollbar()

                VoteNumber(OrderReload)
            }
            else if (data.result_code == 404) {
                alert(data.err_msg)
                $('#statsName').click()
            }
            else if(data.result_code==401){
                alert(data.err_msg)
                $('.layout').click()
            }
        }
    })
})

let jiantouFlag2 = 1;
function Reverse2(ele) {
    if (jiantouFlag2 % 2 == 1) {
        OrderReload.resArr.reverse()
        jiantouFlag2 = jiantouFlag2 + 1
        OrderReload.Flag = jiantouFlag2
        let checkResult = doT.template($("#check").text())
        $(".check").html(checkResult(OrderReload))
        VoteNumber(OrderReload)
    }
    else {
        OrderReload.resArr.reverse()
        jiantouFlag2 = 1
        OrderReload.Flag = jiantouFlag2
        let checkResult = doT.template($("#check").text())
        $(".check").html(checkResult(OrderReload))
        VoteNumber(OrderReload)
    }
}


//导出Excel文件
var idTmr;
function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}
function method5(tableid) {
    if (getExplorer() == 'ie') {
        var curTbl = document.getElementById(tableid);  //获取ID
        var oXL = new ActiveXObject("Excel.Application");  //新建Excel程序
        var oWB = oXL.Workbooks.Add();          //新建工作簿
        var xlsheet = oWB.Worksheets(1);        //新建工作表格
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval("Cleanup();", 1);
        }

    }
    else {
        tableToExcel(tableid, 'aaaa')
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function () {
    let uri = 'data:application/vnd.ms-excel;base64,',
        // template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
            'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
            '</head><body><table>{table}</table></body></html>',
        //window.btoa : 将ascii字符串或二进制数据转换成一个base64编码过的字符串
        //encodeURIComponent、unescape:编码再解码
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g,
                function (m, p) {
                    return c[p];
                })
        }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)  //如果没有table则再重新寻找table
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})()

//清除数据
function clearData() {
    if ($('#checkTab tr').length <= 1) {
        alert("没有数据可清除")
    }
    else {
        $.ajax({
            type: "post",
            url: "/CleanVotes",
            success: (data) => {

                if (data.result_code == 200) {
                    alert(data.data)
                    window.location.reload()
                }
                else if(data.result_code == 404){
                    alert(data.err_msg)
                }
                else if(data.result_code == 401){
                    alert(data.err_msg)
                    $('.layout').click()
                }
            }
        })
    }
}


//导出Excel文件
var idTmr;
function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}
function method5(tableid) {
    if (getExplorer() == 'ie') {
        var curTbl = document.getElementById(tableid);  //获取ID
        var oXL = new ActiveXObject("Excel.Application");  //新建Excel程序
        var oWB = oXL.Workbooks.Add();          //新建工作簿
        var xlsheet = oWB.Worksheets(1);        //新建工作表格
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval("Cleanup();", 1);
        }

    }
    else {
        tableToExcel(tableid, 'aaaa')
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function () {
    let uri = 'data:application/vnd.ms-excel;base64,',
        // template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
            'xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
            '</head><body><table>{table}</table></body></html>',
        //window.btoa : 将ascii字符串或二进制数据转换成一个base64编码过的字符串
        //encodeURIComponent、unescape:编码再解码
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g,
                function (m, p) {
                    return c[p];
                })
        }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)  //如果没有table则再重新寻找table
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})()


let allVoteResultData = {}

//给投票记录查询添加点击事件
$('#allVoteResult').click(() => {
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

    //业务员信息模块
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').show()

    $.ajax({
        type: "post",
        url: "/CheckPersonVote",
        success: function (data) {
            if (data.result_code == 200) {
                allVoteResultData.result = data.data
                allVoteResultData.Flag = 1
                let voteRes = doT.template($("#allResult").text())
                $(".allResult").html(voteRes(allVoteResultData))
                $(".allvoteRes").perfectScrollbar()
            }
            else if(data.result_code == 404){
                alert(data.err_msg)
            }
            else if(data.result_code == 401){
                alert(data.err_msg)
                $('.layout').click()
            }
        }
    })
})


let jiantouFlag4 = 1;
function OrderBySubmitNumFuc() {
    let voteRes = doT.template($("#allResult").text())
    $(".allResult").html(voteRes(allVoteResultData))
    $(".allvoteRes").perfectScrollbar()
}

function OrderBySubmitNum() {
    if (jiantouFlag4 % 2 == 1) {
        allVoteResultData.result.reverse()
        jiantouFlag4 = jiantouFlag4 + 1
        allVoteResultData.Flag = jiantouFlag4
        OrderBySubmitNumFuc()
    }
    else {
        allVoteResultData.result.reverse()
        jiantouFlag4 = 1
        allVoteResultData.Flag = jiantouFlag4
        OrderBySubmitNumFuc()
    }
}


function SearchAllResult(ele) {
    switch (true) {
        case ele.previousSibling.previousSibling.value.length == 1:
            for (let i = 0; i < $(".allvoteResTr").length; i++) {
                if ($(".allvoteResTr-name")[i].innerHTML.trim().indexOf(ele.previousSibling.previousSibling.value) != -1) {
                    $(".allvoteResTr")[i].style.display = "table-row"
                }
                else {
                    $(".allvoteResTr")[i].style.display = "none"
                }
            }
            break
        case ele.previousSibling.previousSibling.value.length > 1:
            for (let i = 0; i < $(".allvoteResTr").length; i++) {
                if ($(".allvoteResTr-name")[i].innerHTML.trim() == ele.previousSibling.previousSibling.value) {
                    $(".allvoteResTr")[i].style.display = "table-row"
                }
                else {
                    $(".allvoteResTr")[i].style.display = "none"
                }
            }
            break
    }

}
