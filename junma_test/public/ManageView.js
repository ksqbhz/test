"use strict";
/*****************************************商标交易管理模块*****************************************/

function SelectManageAll(ele) {

    ele.checked == true ?
        $('.manageTr input').prop('checked', true) :
        $('.manageTr input').prop('checked', false)
}
function SelectManage() {
    $('.manageTr').length == $('.manageTr input:checked').length ?
        $('#SelectManageAll')[0].checked = true :
        $('#SelectManageAll')[0].checked = false;

}
function JudgeStatus_trade(data) {
    if (data.result_code == 401) {
        alert(data.err_msg)
        $('.layout').click()
    }
}

/**查看商标交易信息**/
function toDeal(which = 1) {
    removeFileArr = []
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').show()
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

    let Managelist = {};
    Managelist.abc = [];
    $.ajax({
        "type": "post",
        "url": "/checkTrade",
        "data": {
            Page: which
        },
        "success": function (DataArr) {
            if(DataArr.result_code==0){
                let pageCount = Math.ceil(DataArr.data.PageCount / 8)
                for (var i = 0; i < DataArr.data.resultArr.length; i++) {
                    Managelist.abc.push(DataArr.data.resultArr[i])
                }
                let manageText = doT.template($("#manage").text());
                $(".manage").html(manageText(Managelist));
                $("#PageManage").bootstrapPaginator({
                    currentPage: which,
                    size: "normal",
                    numberOfPages: 10,
                    totalPages: pageCount,
                    onPageChanged: function (event, oldPage, newPage) {
                        toDeal(newPage)

                    }
                })
            }
            else {
                JudgeStatus_trade(DataArr)
            }

        }
    })
}

/**筛选查询**/
let selectionBuff = 0;
let selectionType = 0;
let name = '';
// let datas = {}
function AccodingNameSearch(which = 1, Conditions = {}) {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').show()
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
    let Managelist = {};
    Managelist.abc = [];
    for (var i = 0; i < 46; i++) {
        if ($("#checkType .options")[i].selected == true) {
            Conditions.type = i
            break;
        }
    }
    for (let i = 0; i < 4; i++) {
        if ($('#checkBuff .options')[i].selected == true) {
            Conditions.buff = i
            break
        }
    }
    Conditions.name = $('#NameSearch').val().trim()


    $.ajax({
        "type": "post",
        "url": '/checkTrade',
        // "url": `/checkTrade/type/${selectionType}/buff/${selectionBuff}/name/${name}`,
        "data": {
            Page: which,
            Conditions
        },
        "success": function (DataArr) {
            if(DataArr.result_code==0){
                let pageCount = Math.ceil(DataArr.data.PageCount / 8)
                for (var i = 0; i < DataArr.data.resultArr.length; i++) {
                    Managelist.abc.push(DataArr.data.resultArr[i])
                }
                let manageText = doT.template($("#manage").text());
                $(".manage").html(manageText(Managelist));
                $("#checkType .options")[Conditions.type].selected = true
                $('#checkBuff .options')[Conditions.buff].selected = true
                $('#NameSearch')[0].value = Conditions.name
                $("#PageManage").bootstrapPaginator({
                    currentPage: which,
                    size: "normal",
                    numberOfPages: 10,
                    totalPages: pageCount,
                    onPageChanged: function (event, oldPage, newPage) {
                        AccodingNameSearch(newPage, Conditions)
                    }

                })
            }
            else {
                JudgeStatus_trade(DataArr)
            }

        }
    })
}


/*****************添加交易信息******************/
function toAdd() {
    $('.showHide').hide()
    $('.result-list').hide()
    $('.goback').hide()
    //隐藏分页
    $('.pageSet').hide()

    $('#stats').hide()
    $('.vote').hide()
    $('#checks').hide()
    $('#manages').hide()
    $('#trans').show()
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

    //发送请求获取APP用户
    $.ajax({
        "type": "post",
        "url": "/AppUsersMes2",
        "success": function (resultArrObj) {
            if(resultArrObj.result_code==0){
                let appUser = {
                    UserArr: resultArrObj.data.resultArr
                }
                let genResult = doT.template($("#deal").text())
                $(".deal").html(genResult(appUser))
                $(".setdate").datetimepicker({
                    bootcssVer: 3,
                    format: 'yyyy-mm-dd',
                    language: 'zh-CN',//中文，需要引用zh-CN.js包
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: 0
                });

                // //APP用户滑动
                $(".App_Tbody").perfectScrollbar()
            }
            else{
                JudgeStatus_trade(resultArrObj)
            }

        }
    })
}
function toUploadLogo() {
    document.getElementById("logobtn_file").click()
}

function toUploadGuran(ele) {
    ele.parentNode.firstChild.nextSibling.click()
}


function AddDeal() {
    var checktype;
    var checkbuff;
    for (var i = 0; i < $(".dealBuff .options").length; i++) {
        if ($(".dealBuff .options")[i].selected == true) {
            checkbuff = $(".dealBuff .options")[i].index
            break;
        }
    }
    for (var j = 0; j < $(".dealType .options").length; j++) {
        if ($(".dealType .options")[j].selected == true) {
            checktype = $(".dealType .options")[j].index
            break;
        }
    }
    var inputtext = new FormData();
    inputtext.append('name', $(".dealName").val())
    inputtext.append('type', checktype)
    inputtext.append('applytime', $(".applyTime").val())
    inputtext.append('mark', $(".dealMark").val())
    inputtext.append('production', $('.production').val())
    inputtext.append('signdate', $('.signDate').val())
    inputtext.append('price', $('.Price').val())
    inputtext.append('saleprice', $('.salePrice').val())
    inputtext.append('saledate', $('.saledate').val())
    inputtext.append('money', $('.money').val())
    inputtext.append('buff', checkbuff)

    /**************添加APP用户******************/
    let appArr = []
    for (i = 1; i < $('#DealAPPUser span').length; i++) {
        appArr.push($('#DealAPPUser span')[i].innerHTML)
    }
    inputtext.append('appuser', appArr)
    /**************添加APP用户******************/

    let imglogo = $("#logobtn_file").val(); //商标图样
    let gurantee = document.getElementsByClassName('gurbtn_file')          //合同与证书

    var extension = imglogo.substring(imglogo.lastIndexOf('.'), imglogo.length).toLowerCase();
    if ($("#logobtn_file").val().length > 0) {
        if (extension == ".jpg" || extension == ".png") {
            inputtext.append('imglogo', $('#logobtn_file')[0].files[0]);
        }
    }
    for (let k = 0; k < gurantee.length; k++) {
        let extension2 = gurantee[k].value.substring(gurantee[k].value.lastIndexOf('.'), gurantee[k].length).toLowerCase();
        if (extension2 == ".jpg" || extension2 == ".png") {
            inputtext.append('gurantee' + k, gurantee[k].files[0])
        }
    }
    if ($(".dealName").val() !== "" &&
        checktype > 0 &&
        checkbuff > 0 &&
        appArr.length > 0) {
        $.ajax({
            type: 'post',
            url: '/addTrade',
            data: inputtext,
            cache: false,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            success: function (resultMsg) {

                if (resultMsg.result_code == 0) {
                    toDeal()
                }
                else{
                    JudgeStatus_trade(resultMsg)
                }
            },
            error: function (error) {
                console.log('error')
            }
        })
    } else {
        alert("请将所有必填(带红色*号)的信息填写完整")
    }

}

/************************添加合同与证书图片*****************************/
function addGurantee() {

    $('.gurantees').append('<div class="removeGuranteeInp"><input type="file" class="gurbtn_file editgurantee" ' +
        'style="display: inline-block; margin-top: 5px;"> <span class="glyphicon glyphicon-remove" ' +
        'style="color: red; cursor: pointer"' +
        'onclick="removeInp(this)"></span></div>')
}

/********************删除inp**********************/
function removeIMGLogoInp1(event) {
    event.parentNode.innerHTML = '<input type="file" ' +
        'id="logobtn_file" style="display: inline-block;">' +
        ' <span class="glyphicon glyphicon-remove"' +
        'style="color: #f00;cursor: pointer"' +
        'onclick="removeIMGLogoInp1(this)"></span>'
}
function removeIMGLogoInp2(event) {
    event.parentNode.innerHTML = '<input type="file" ' +
        'id="editimglogo" style="display: inline-block;">' +
        ' <span class="glyphicon glyphicon-remove"' +
        'style="color: #f00;cursor: pointer"' +
        'onclick="removeIMGLogoInp2(this)"></span>'
}

function removeInp(event) {
    $(`.${event.parentNode.className}`).click(function (e) {
        $(this).remove()
    })
}

/*****************修改交易信息******************/

let editData = {}
function toEdit() {

    if ($('.manage tbody :checked').length !== 1) {
        alert("只能选择一条信息进行修改")
    } else {
        editData = {}
        let ChilData = $('.manage tbody :checked')[0].parentNode.parentNode.parentNode.childNodes
        //获取合同与证书的图片地址
        let guranteeArr = []
        for (let i = 0; i < ChilData[39].childNodes.length; i++) {
            if (ChilData[39].childNodes[i].childNodes.length > 0) {
                if (ChilData[39].childNodes[i].childNodes[1].childNodes.length > 0) {
                    if (ChilData[39].childNodes[i].childNodes[1].childNodes[1].src) {
                        guranteeArr.push(ChilData[39].childNodes[i].childNodes[1].childNodes[1].src)
                    }
                }
            }
        }
        if (ChilData[7].innerHTML == '　/　') {
            editData.imglogo = "#"
        } else {
            editData.imglogo = ChilData[7].childNodes[1].childNodes[1].childNodes[1].src
        }
        editData.name = ChilData[9].innerHTML
        editData.type = ChilData[13].innerHTML.match(patt1)[0] //类别
        editData.applytime = ChilData[17].innerHTML
        editData.mark = ChilData[21].innerHTML
        editData.production = ChilData[25].innerHTML
        editData.signdate = ChilData[29].innerHTML

        ChilData[33].innerHTML == "　/　" ? editData.price = ChilData[33].innerHTML : editData.price = ChilData[33].innerHTML.match(patt1)[0]
        ChilData[35].innerHTML == "　/　" ? editData.saleprice = ChilData[35].innerHTML : editData.saleprice = ChilData[35].innerHTML.match(patt1)[0]

        editData.gurantee = guranteeArr  //将存放着合同与证书图片地址的数组赋值给editData

        editData.saledate = ChilData[43].innerHTML
        ChilData[45].innerHTML == "　/　" ? editData.money = ChilData[45].innerHTML : editData.money = ChilData[45].innerHTML.match(patt1)[0]
        editData.buff = ChilData[47].innerHTML //状态

        editData.appuser = ChilData[51].innerHTML  //APP用户
        editData.tradeID = ChilData[53].innerHTML  //交易ID

        //发送请求获取APP用户
        $.ajax({
            "type": "post",
            "url": "/AppUsersMes2",
            "success": function (resultArrObj) {

                editData.UserArr = resultArrObj.data.resultArr
                let editResult = doT.template($("#edit").text())
                $(".edit").html(editResult(editData))


                switch (true) {
                    case ChilData[47].innerHTML == "请选择状态":
                        editData.buff = 0
                        break
                    case ChilData[47].innerHTML == "注册中":
                        editData.buff = 1
                        break
                    case ChilData[47].innerHTML == "销售中":
                        editData.buff = 2
                        break
                    case ChilData[47].innerHTML == "已销售":
                        editData.buff = 3
                        break
                }

                $("#editType .options")[editData.type].selected = true
                $("#editBuff .options")[editData.buff].selected = true
                $(".setdate").datetimepicker({
                    bootcssVer: 3,
                    format: 'yyyy-mm-dd',
                    language: 'zh-CN',//中文，需要引用zh-CN.js包
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: 1
                });

		// //APP用户滑动
                $(".App_Tbody").perfectScrollbar()
            }
        })


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
        $('#edits').show()

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

    }


}

/******************************clickInp 点击图片弹出input文件选择窗口**********************/
function clickInp(ev) {
    $(`#${ev.parentNode.children[0].id}`).click()
}
/******************************修改时删除单个图片**********************/
var removeFileArr = []
function removeIMGLogoFile(event) {
    let inpID = event.parentNode.children[0].id
    let imgID = event.parentNode.children[1].src
    if (imgID) {
        removeFileArr.push(imgID.split('/')[4])
    }
    event.parentNode.innerHTML = `<input type="file" style="display: inline-block" class="gurbtn_file" id=${inpID}>
                                <span class="glyphicon glyphicon-remove"
                                style="color: red;cursor: pointer"
                                onclick="removeIMGLogoFile(this)"></span>`
}

function removeFile(event) {

    let inpID = event.parentNode.children[0].id
    removeFileArr.push(inpID)
    $(`#${inpID}`).parent().remove()

}

function EditSubmit() {

    var checktype;
    var checkbuff;
    let flag = 0
    for (var i = 0; i < $("#editBuff .options").length; i++) {
        if ($("#editBuff .options")[i].selected == true) {
            checkbuff = i
            break;
        }
    }

    for (var j = 0; j < $("#editType .options").length; j++) {
        if ($("#editType .options")[j].selected == true) {
            checktype = j
            break;
        }
    }

    var inputtext = new FormData();

    if (editData.name !== $(".editName").val()) {
        inputtext.append('name', $(".editName").val())

        flag = 1
    }

    if (editData.type !== checktype) {
        inputtext.append('type', checktype);
        flag = 1
    }

    if (editData.applytime !== $(".editapplyTime").val()) {
        inputtext.append('applytime', $(".editapplyTime").val())
        flag = 1
    }

    if (editData.mark !== $(".editMark").val()) {
        inputtext.append('mark', $(".editMark").val())
        flag = 1
    }

    if (editData.production !== $('.editproduction').val()) {
        inputtext.append('production', $('.editproduction').val())
        flag = 1
    }

    if (editData.signdate !== $('.editsignDate').val()) {
        inputtext.append('signdate', $('.editsignDate').val())
        flag = 1
    }

    if (editData.price !== $('.editPrice').val()) {
        inputtext.append('price', $('.editPrice').val())
        flag = 1
    }
    if (editData.saleprice !== $('.editsalePrice').val()) {
        inputtext.append('saleprice', $('.editsalePrice').val())
        flag = 1
    }
    if (editData.saledate !== $('.editsaledate').val()) {
        inputtext.append('saledate', $('.editsaledate').val())
        flag = 1
    }

    if (editData.money !== $('.editmoney').val()) {
        inputtext.append('money', $('.editmoney').val())
        flag = 1
    }

    if (editData.buff !== checkbuff) {
        inputtext.append('buff', checkbuff)
        flag = 1
    }


    /*************************修改APP用户*****************/
    let appuserArr = []
    for (i = 0; i < $('#updateDealAPPUsers .AppUserName span').length; i++) {
        appuserArr.push($('#updateDealAPPUsers .AppUserName span')[i].innerHTML)
    }

    if (editData.appuser != appuserArr.join()) {
        inputtext.append('appuser', appuserArr)
        flag = 1
    }
    /*************************修改APP用户*****************/

    let imglogo = $("#editimglogo"); //商标图样

    let gurantee = $('.editgurantee')          //合同与证书

    if ($("#editimglogo").val().length > 0) {

        var extension = imglogo.val().substring(imglogo.val().lastIndexOf('.'), imglogo.val().length).toLowerCase();
        if (extension == ".jpg" || extension == ".png") {
            // imgObj.push($('#logobtn_file')[0].files[0])
            inputtext.append('imglogo', $("#editimglogo")[0].files[0]);
            flag = 1
        } else {
            alert('请确保上传图片时JPG或PNG格式')
        }
    }
    if (gurantee.length > 0) {
        for (let k = 0; k < gurantee.length; k++) {
            if (gurantee[k].id) {
                let extension2 = gurantee[k].value.substring(gurantee[k].value.lastIndexOf('.'), gurantee[k].length).toLowerCase();
                if (extension2 == ".jpg" || extension2 == ".png") {
                    inputtext.append(gurantee[k].id.split(".")[0], gurantee[k].files[0])
                    flag = 1
                }
            } else {
                let extension2 = gurantee[k].value.substring(gurantee[k].value.lastIndexOf('.'), gurantee[k].length).toLowerCase();
                if (extension2 == ".jpg" || extension2 == ".png") {
                    inputtext.append('gurantee' + k, gurantee[k].files[0])
                    flag = 1
                }
            }
        }
    }
    if (flag == 1) {
        inputtext.append('tradeID', editData.tradeID)
        inputtext.append('removeFileArr', removeFileArr)
        $.ajax({
            type: 'post',
            url: '/updateTrade',
            data: inputtext,
            cache: false,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            success: function (resultMsg) {

                if (resultMsg.result_code == 0) {
                    removeFileArr = []
                    toDeal()
                }
                else{
                    JudgeStatus_trade(resultMsg)
                }
            },
            error: function (error) {
                removeFileArr = []
                console.log('error')
            }
        })
    }

}
function clickeditimlogo() {
    $('#editimglogo').click();
}
function clickeditgurantee() {
    $('#editgurantee').click();
}


/********************************删除交易对象********************************/
function toDelete() {
    let deleteArr = [];
    for (let i = 0; i < $('.manageTr input:checked').length; i++) {
        deleteArr.push(parseInt($('.manageTr input:checked')[i].parentNode.parentNode.parentNode.lastChild.previousSibling.innerHTML))
    }
    if (deleteArr.length > 0) {
        $.ajax({
            type: "post",
            url: "/delTrade",
            data: {
                inputData: deleteArr
            },
            success: function (resultMsg) {

                if (resultMsg.result_code == 0) {
                    window.location.reload()
                }
                else{
                    JudgeStatus_trade(resultMsg)
                }

            }
        })
    } else {
        alert("请选择要删除的信息")
        toDeal()
    }
}


/***************************选择APP用户列表***********************************/

/**APP用户勾选框联动**/
function SelectAPPAll(ele) {
    ele.checked == true ?
        $('.APPTr input').prop('checked', true) :
        $('.APPTr input').prop('checked', false)
}

function SelectAPP() {
    $('.APPTr').length == $('.APPTr input:checked').length ?
        $('.SelectAPPAll')[0].checked = true :
        $('.SelectAPPAll')[0].checked = false;
}


/********************上传文件，显示图片*******************/
function editInpIMG(p) {
    var file = p.files[0];
    if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        //监听文件读取结束后事件
        reader.onloadend = function (e) {
            if (p.parentNode.childNodes[3].src) {
                p.parentNode.childNodes[3].src = e.target.result    //e.target.result就是最后的路径地址
            }
        };
    }
}


/********************************点击图片弹出大图*************************/
function openWindow(obj) {
    var showIMG = obj.parentNode.nextSibling.nextSibling
    showIMG.style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}
function closeWindow() {
    if ($('.bigimgLogo').length > 0) {
        for (let i = 0; i < $('.bigimgLogo').length; i++) {
            $('.bigimgLogo')[i].style.display = 'none'
        }
    }
    if ($('.bigGuranteeIMG').length > 0) {
        for (let j = 0; j < $('.bigGuranteeIMG').length; j++) {
            $('.bigGuranteeIMG')[j].style.display = 'none'
        }
    }
    document.getElementById('fade').style.display = 'none';
}
