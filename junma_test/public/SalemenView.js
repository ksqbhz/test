"use strict"

function SelectSalemanAll(ele) {

    ele.checked == true ?
        $('.saleTr input').prop('checked', true) :
        $('.saleTr input').prop('checked', false)
}
function SelectSaleman() {
    $('.saleTr').length == $('.saleTr input:checked').length ?
        $('#SelectSalemanAll')[0].checked = true :
        $('#SelectSalemanAll')[0].checked = false;

}
function JudgeStatus_SaleMen(data) {
    if (data.result_code == 401) {
        alert(data.err_msg)
        $('.layout').click()
    }
}

function SaleMessage(which = 1) {
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
    $('#checkSalemanMessage').show()

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

    let saledata = {}
    $.ajax({
        type: "post",
        url: "/saleMes",
        "data": {
            Page: which
        },
        success: (resultArrObj) => {
            console.log(resultArrObj.result_code == 0)
            if (resultArrObj.result_code == 200) {
                saledata.messageArray = resultArrObj.data.resultArr
                let pageCount = Math.ceil(resultArrObj.data.PageCount / 8)
                let saleResult = doT.template($("#checkSaleman").text())
                $(".checkSaleman").html(saleResult(saledata))

                $("#PageCheckSaleman").bootstrapPaginator({
                    currentPage: which,
                    size: "normal",
                    numberOfPages: 8,
                    totalPages: pageCount,
                    onPageChanged: function (event, oldPage, newPage) {
                        SaleMessage(newPage)
                    }
                })
            }
            else {
                JudgeStatus_SaleMen(resultArrObj)
            }

        }
    })
}

function SsearchSaleName(which = 1, Condition = {}) {

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
    $('#checkSalemanMessage').show()

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

    let saledata = {}
    Condition.saleName = $('#saleName').val()

    $.ajax({
        type: "post",
        url: "/saleMes",
        "data": {
            Page: which,
            Condition
        },
        success: (resultArrObj) => {
            if (resultArrObj.result_code == 200) {
                saledata.messageArray = resultArrObj.data.resultArr
                let pageCount = Math.ceil(resultArrObj.data.PageCount / 8)
                let saleResult = doT.template($("#checkSaleman").text())
                $(".checkSaleman").html(saleResult(saledata))
                $('#saleName')[0].value = Condition.saleName
                $("#PageCheckSaleman").bootstrapPaginator({
                    currentPage: which,
                    size: "normal",
                    numberOfPages: 8,
                    totalPages: pageCount,
                    onPageChanged: function (event, oldPage, newPage) {
                        SsearchSaleName(newPage, Condition)
                    }
                })
            }
            else {
                JudgeStatus_SaleMen(resultArrObj)
            }
        }
    })
}
/**************************添加业务员信息***************************/
function AddSale() {
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
    $('#checkSalemanMessage').hide()
    $('#updateSalemanMessage').hide()

    $('#addSalemanMessage').show()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    let aaa = {}
    let saleResult = doT.template($("#addSaleman").text())
    $(".addSaleman").html(saleResult(aaa))
}
function sendSaleData() {
    //隐藏模态框
    $('#saleModal').css("display", "none")

    let saleObj = {
        saleName: $('.addSaleman .inp input')[0].value,
        saleQQ: $('.addSaleman .inp input')[1].value,
        saleTelNum: $('.addSaleman .inp input')[2].value,
    }
    if (saleObj.saleName != '' && saleObj.saleQQ != '' && saleObj.saleTelNum != '') {
        $.ajax({
            type: "post",
            url: "/addSale",
            data: {
                saleObj: saleObj
            },
            success: (resultMsg) => {

                if (resultMsg.result_code == 200) {
                    alert("添加成功")
                    SaleMessage()
                    $('#saleModal').css("display", '')
                }
                else {
                    JudgeStatus_SaleMen(resultMsg)
                }
            }
        })
    } else {
        alert("请将所有内容补全")
    }

}

/**************************修改业务员信息***************************/
let editSale = {}
function EditSale() {
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
    $('#checkSalemanMessage').hide()
    $('#addSalemanMessage').hide()

    $('#updateSalemanMessage').show()

    //APP用户信息
    $('#checkAppUsers').hide()
    $('#addAppUsers').hide()
    $('#editAppUsers').hide()
    //消息推送
    $('#Information').hide()
    //投票者记录
    $('#allResults').hide()

    if ($('.saleTab tbody :checked').length !== 1) {
        alert("只能选择一条信息进行修改")
        SaleMessage()
    } else {
        let ChilData = $('.saleTab tbody :checked')[0].parentNode.parentNode.parentNode.childNodes
        editSale.saleName = ChilData[5].innerHTML
        editSale.saleQQ = ChilData[7].innerHTML
        editSale.saleTelNum = ChilData[9].innerHTML

        let EditResult = doT.template($("#updateSaleman").text())
        $(".updateSaleman").html(EditResult(editSale))

        editSale.saleID = ChilData[13].innerHTML
    }


}
//发送修改的数据
function editSaleData() {
    //将模态框隐藏
    $('#EditModal').css("display", "none")

    let editObj = {
        saleName: $('.updateSaleman .inp input')[0].value,
        saleQQ: $('.updateSaleman .inp input')[1].value,
        saleTelNum: $('.updateSaleman .inp input')[2].value,
    }
    if (editObj.saleName == editSale.saleName &&
        editObj.saleQQ == editSale.saleQQ &&
        editObj.saleTelNum == editSale.saleTelNum) {
        alert("请至少修改一项")
    } else {
        editObj.saleID = editSale.saleID
        $.ajax({
            type: "post",
            url: "/editSale",
            data: {
                editObj: editObj
            },
            success: (resultMsg) => {

                if (resultMsg.result_code == 200) {
                    alert("修改成功")
                    SaleMessage()
                    $('#EditModal').css("display", "")
                }
                else {
                    JudgeStatus_SaleMen(resultMsg)
                }
            }
        })
    }

}

/**************************删除业务员信息***************************/
function DelSale() {
    let ChilData,
        saleIDArr = []
    if ($('.saleTab tbody :checked').length <= 0) {
        alert("请选择要删除的信息")
    } else {
        alert("确定要删除此信息吗？")
        for (let i = 0; i < $('.saleTab tbody :checked').length; i++) {
            ChilData = $('.saleTab tbody :checked')[i].parentNode.parentNode.parentNode.childNodes
            saleIDArr.push(ChilData[13].innerHTML)
        }

        $.ajax({
            type: "post",
            url: "/delSale",
            data: {
                saleIDArr: saleIDArr
            },
            success: (resultMsg) => {

                if (resultMsg.result_code == 200) {
                    alert("删除成功")
                    SaleMessage()
                }
                else {
                    JudgeStatus_SaleMen(resultMsg)
                }
            }
        })
    }
}
