$(function () {
    loadPage();
    to_page(1,5);
})

var totalRecord,currentPage,currentPageSize,currentPageSort,isSored,isHasExample;

currentPageSize=5;

currentPageSort=true;

isSored=false;

isHasExample=false;

//加载页面
function loadPage() {
    $('#updateStartActiveDate').datetimepicker({
        format : 'YYYY-MM-DD'
    });

    $('#updateEndActiveDate').datetimepicker({
        format : 'YYYY-MM-DD'
    });

    $('#addStartActiveDate').datetimepicker({
        format : 'YYYY-MM-DD'
    });

    $('#addEndActiveDate').datetimepicker({
        format : 'YYYY-MM-DD'
    });

    //点击新增按钮弹出模态框。
    $("#item_add_modal_btn").click(function(){
        //清除表单数据（表单完整重置（表单的数据，表单的样式））
        reset_form("#itemAddModal form");
        //s$("")[0].reset();
        //弹出模态框
        $("#itemAddModal").modal({
            backdrop:"static"
        });
    });

    //给选择每页有多少条数据的选择框绑定事件
    $('#pageSizeNumSelect').change(function(){
        var pageSizeStr=$(this).children('option:selected').val();
        currentPageSize=pageSizeStr.replace("条/页","");
        to_page(1,currentPageSize);
    });


}

//清空表单样式及内容
function reset_form(ele){
    $(ele)[0].reset();
    //清空表单样式
    $(ele).find("*").removeClass("has-error has-success");
    $(ele).find(".help-block").text("");
}

//第几页
function to_page(pn,pageCountNum){
    $.ajax({
        url:"/items",
        data:{"pn":pn,"pageCountNum":pageCountNum},
        type:"GET",
        success:function(result){
            //构建页面列表
            build_items_table(result);
            //解析显示分页信息
            build_page_info(result)
            //构建分页条
            build_page_nav(result)
        }
    });
}

//构建页面列表
function build_items_table(result){
    //清空table表格
    $("#items_table tbody").empty();
    var items = result.extend.pageInfo.list;
    $.each(items,function(index,itemData){
        var checkBoxTd = $("<td><input type='checkbox' class='check_item'/></td>");
        var itemCodeTd = $("<td></td>").append(itemData.itemCode);
        var itemDescriptionTd = $("<td></td>").append(itemData.itemDescription);
        var itemUomTd = $("<td></td>").append(itemData.itemUom);
        var startActiveDateTd = $("<td></td>").append(new Date(itemData.startActiveDate).getFullYear()+'年'+(new Date(itemData.startActiveDate).getMonth()+1)+'月'+new Date(itemData.startActiveDate).getDate()+'日');
        var endActiveDateTd = $("<td></td>").append(new Date(itemData.endActiveDate).getFullYear()+'年'+(new Date(itemData.endActiveDate).getMonth()+1)+'月'+new Date(itemData.endActiveDate).getDate()+'日');
        var enabledFlagTd = $("<td></td>").append(itemData.enabledFlag==1?"是":"否");
        /**
         <button class="">
         <span class="" aria-hidden="true"></span>
         编辑
         </button>
         */
        var editBtn = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn")
            .append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append("编辑");
        //为编辑按钮添加一个自定义的属性，来表示当前员工id
        editBtn.attr("edit-id",itemData.itemId);
        var delBtn =  $("<button></button>").addClass("btn btn-danger btn-sm delete_btn")
            .append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("删除");
        //为删除按钮添加一个自定义的属性来表示当前删除的员工id
        delBtn.attr("del-id",itemData.itemId);
        var btnTd = $("<td></td>").append(editBtn).append(" ").append(delBtn);
        //var delBtn =
        //append方法执行完成以后还是返回原来的元素
        $("<tr></tr>").append(checkBoxTd)
            .append(itemCodeTd)
            .append(itemDescriptionTd)
            .append(itemUomTd)
            .append(startActiveDateTd)
            .append(endActiveDateTd)
            .append(enabledFlagTd)
            .append(btnTd)
            .appendTo("#items_table tbody");
    });

    $(document).ready(function(){
        var idsItemUrl = "/getExcel?";
        $("td button:contains('编辑')").each(function () {
            idsItemUrl += ("itemIds="+$(this).attr("edit-id")+"&");
        })
        idsItemUrl=idsItemUrl.substr(0,idsItemUrl.length-1);
        $("#getExcelBtn").attr("href",idsItemUrl)
    });
}

//解析显示分页信息
function build_page_info(result){
    $("#page_info_area").empty();
    $("#page_info_area").append("当前"+result.extend.pageInfo.pageNum+"页,总"+
        result.extend.pageInfo.pages+"页,总"+
        result.extend.pageInfo.total+"条记录");
    totalRecord = result.extend.pageInfo.total;
    currentPage = result.extend.pageInfo.pageNum;
}

//解析显示分页条，点击分页要能去下一页....
function build_page_nav(result){
    //page_nav_area
    $("#page_nav_area").empty();
    var ul = $("<ul></ul>").addClass("pagination");

    //构建元素
    var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href","#"));
    var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;"));
    if(result.extend.pageInfo.hasPreviousPage == false){
        firstPageLi.addClass("disabled");
        prePageLi.addClass("disabled");
    }else{
        //为元素添加点击翻页的事件
        firstPageLi.click(function(){
                to_page(1,currentPageSize);
        });
        prePageLi.click(function(){
                to_page(result.extend.pageInfo.pageNum -1,currentPageSize);
        });
    }



    var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;"));
    var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href","#"));
    if(result.extend.pageInfo.hasNextPage == false){
        nextPageLi.addClass("disabled");
        lastPageLi.addClass("disabled");
    }else{
        nextPageLi.click(function(){
            to_page(result.extend.pageInfo.pageNum +1,currentPageSize);
        });
        lastPageLi.click(function(){
            to_page(result.extend.pageInfo.pages,currentPageSize);
        });
    }



    //添加首页和前一页 的提示
    ul.append(firstPageLi).append(prePageLi);
    //1,2，3遍历给ul中添加页码提示
    $.each(result.extend.pageInfo.navigatepageNums,function(index,item){

        var numLi = $("<li></li>").append($("<a></a>").append(item));
        if(result.extend.pageInfo.pageNum == item){
            numLi.addClass("active");
        }
        numLi.click(function(){
            to_page(item,currentPageSize);
        });
        ul.append(numLi);
    });
    //添加下一页和末页 的提示
    ul.append(nextPageLi).append(lastPageLi);

    //把ul加入到nav
    var navEle = $("<nav></nav>").append(ul);
    navEle.appendTo("#page_nav_area");
}

//显示校验结果的提示信息
function show_validate_msg(ele,status,msg){
    //清除当前元素的校验状态
    $(ele).parent().removeClass("has-success has-error");
    $(ele).next("span").text("");
    if("success"==status){
        $(ele).parent().addClass("has-success");
        $(ele).next("span").text(msg);
    }else if("error" == status){
        $(ele).parent().addClass("has-error");
        $(ele).next("span").text(msg);
    }
}

//字符串转日期格式，strDate要转为日期格式的字符串
function getDate(strDate){
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
        return date;
    }

//点击保存，保存员工。
$("#item_save_btn").click(function(){
    //1、模态框中填写的表单数据提交给服务器进行保存
    //1、先对要提交给服务器的数据进行校验
    //2、发送ajax请求保存员工
    var startDateAddValue=$("#addStartActiveDate").find("input").val();
    var endDateAddValue=$("#addEndActiveDate").find("input").val();
    if(startDateAddValue!=""&&endDateAddValue!=""){

            $.ajax({
                url:"/item",
                type:"POST",
                data:{"itemDescription":$("#itemDescription_add_input").val(),
                    "itemUom":$("#itemAddUomSelect").val(),
                    "enabledFlag":$("#itemAddEnabledFlagSelect").val()=="是"?1:0,
                      "startActiveDate":getDate(startDateAddValue),
                        "endActiveDate":getDate(endDateAddValue)},
                success:function(result){
                    //alert(result.msg);
                    if(result.code == 100){
                        //员工保存成功；
                        //1、关闭模态框
                        $("#itemAddModal").modal('hide');

                        //2、来到最后一页，显示刚才保存的数据
                        //发送ajax请求显示最后一页数据即可
                        //alert(Math.ceil(totalRecord/5));
                        to_page(Math.ceil((totalRecord+1)/currentPageSize),currentPageSize);
                    }else{
                        //显示失败信息

                        //有哪个字段的错误信息就显示哪个字段的；
                        if(undefined != result.extend.errorFields.itemDescription){
                            //显示邮箱错误信息
                            show_validate_msg("#itemDescription_add_input", "error", result.extend.errorFields.itemDescription);
                        }
                        if(undefined != result.extend.errorFields.startActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addStartActiveDate", "error", result.extend.errorFields.startActiveDate);
                        }
                        if(undefined != result.extend.errorFields.endActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addEndActiveDate", "error", result.extend.errorFields.endActiveDate);
                        }
                    }
                }
            });

    }else{
        if(startDateAddValue!=""&&endDateAddValue==""){
            $.ajax({
                url:"/item",
                type:"POST",
                data:{"itemDescription":$("#itemDescription_add_input").val(),
                    "itemUom":$("#itemAddUomSelect").val(),
                    "enabledFlag":$("#itemAddEnabledFlagSelect").val()=="是"?1:0,
                    "startActiveDate":getDate(startDateAddValue)},
                success:function(result){
                    //alert(result.msg);
                    if(result.code == 100){
                        //员工保存成功；
                        //1、关闭模态框
                        $("#itemAddModal").modal('hide');

                        //2、来到最后一页，显示刚才保存的数据
                        //发送ajax请求显示最后一页数据即可
                        //alert(Math.ceil(totalRecord/5));
                        to_page(Math.ceil((totalRecord+1)/currentPageSize),currentPageSize);
                    }else{
                        //显示失败信息

                        //有哪个字段的错误信息就显示哪个字段的；
                        if(undefined != result.extend.errorFields.itemDescription){
                            //显示邮箱错误信息
                            show_validate_msg("#itemDescription_add_input", "error", result.extend.errorFields.itemDescription);
                        }
                        if(undefined != result.extend.errorFields.startActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addStartActiveDate", "error", result.extend.errorFields.startActiveDate);
                        }
                        if(undefined != result.extend.errorFields.endActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addEndActiveDate", "error", result.extend.errorFields.endActiveDate);
                        }
                    }
                }
            });
        }
        if(startDateAddValue==""&&endDateAddValue!=""){
            $.ajax({
                url:"/item",
                type:"POST",
                data:{"itemDescription":$("#itemDescription_add_input").val(),
                    "itemUom":$("#itemAddUomSelect").val(),
                    "enabledFlag":$("#itemAddEnabledFlagSelect").val()=="是"?1:0,
                    "endActiveDate":getDate(endDateAddValue)},
                success:function(result){
                    //alert(result.msg);
                    if(result.code == 100){
                        //员工保存成功；
                        //1、关闭模态框
                        $("#itemAddModal").modal('hide');

                        //2、来到最后一页，显示刚才保存的数据
                        //发送ajax请求显示最后一页数据即可
                        //alert(Math.ceil(totalRecord/5));
                        to_page(Math.ceil((totalRecord+1)/currentPageSize),currentPageSize);
                    }else{
                        //显示失败信息

                        //有哪个字段的错误信息就显示哪个字段的；
                        if(undefined != result.extend.errorFields.itemDescription){
                            //显示邮箱错误信息
                            show_validate_msg("#itemDescription_add_input", "error", result.extend.errorFields.itemDescription);
                        }
                        if(undefined != result.extend.errorFields.startActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addStartActiveDate", "error", result.extend.errorFields.startActiveDate);
                        }
                        if(undefined != result.extend.errorFields.endActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addEndActiveDate", "error", result.extend.errorFields.endActiveDate);
                        }
                    }
                }
            });
        }
        if(startDateAddValue==""&&endDateAddValue==""){
            $.ajax({
                url:"/item",
                type:"POST",
                data:{"itemDescription":$("#itemDescription_add_input").val(),
                    "itemUom":$("#itemAddUomSelect").val(),
                    "enabledFlag":$("#itemAddEnabledFlagSelect").val()=="是"?1:0},
                success:function(result){
                    //alert(result.msg);
                    if(result.code == 100){
                        //员工保存成功；
                        //1、关闭模态框
                        $("#itemAddModal").modal('hide');

                        //2、来到最后一页，显示刚才保存的数据
                        //发送ajax请求显示最后一页数据即可
                        //alert(Math.ceil(totalRecord/5));
                        to_page(Math.ceil((totalRecord+1)/currentPageSize),currentPageSize);
                    }else{
                        //显示失败信息

                        //有哪个字段的错误信息就显示哪个字段的；
                        if(undefined != result.extend.errorFields.itemDescription){
                            //显示邮箱错误信息
                            show_validate_msg("#itemDescription_add_input", "error", result.extend.errorFields.itemDescription);
                        }
                        if(undefined != result.extend.errorFields.startActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addStartActiveDate", "error", result.extend.errorFields.startActiveDate);
                        }
                        if(undefined != result.extend.errorFields.endActiveDate){
                            //显示员工名字的错误信息
                            show_validate_msg("#addEndActiveDate", "error", result.extend.errorFields.endActiveDate);
                        }
                    }
                }
            });
        }
    }
});

//更新物料
$(document).on("click",".edit_btn",function(){

    //2、查出员工信息，显示员工信息
    getItem($(this).attr("edit-id"));

    //3、把员工的id传递给模态框的更新按钮
    $("#item_update_btn").attr("edit-id",$(this).attr("edit-id"));
    $("#itemUpdateModal").modal({
        backdrop:"static"
    });
});

function getItem(id){
    $.ajax({
        url:"/item/"+id,
        type:"GET",
        success:function(result){
            //console.log(result);
            var itemData = result.extend.item;
            $("#itemCode_update_static").text(itemData.itemCode);
            $("#itemDescription_update_input").val(itemData.itemDescription);
            $("#itemUpdateUomSelect").val(itemData.itemUom);
            $("#updateStartActiveDate").find("input").val(new Date(itemData.startActiveDate).getFullYear()+'-'+(new Date(itemData.startActiveDate).getMonth()+1)+'-'+new Date(itemData.startActiveDate).getDate());
            $("#updateEndActiveDate").find("input").val(new Date(itemData.endActiveDate).getFullYear()+'-'+(new Date(itemData.endActiveDate).getMonth()+1)+'-'+new Date(itemData.endActiveDate).getDate());
            $("#itemUpdateEnabledFlagSelect").val(itemData.enabledFlag==1?"是":"否");
        }
    });
}

//点击更新，更新员工信息
$("#item_update_btn").click(function(){

    //2、发送ajax请求保存更新的员工数据
    $.ajax({
        url:"/item/"+$(this).attr("edit-id"),
        type:"PUT",
        data:{
            "itemDescription":$("#itemDescription_update_input").val(),
            "itemUom":$("#itemUpdateUomSelect").val(),
            "startActiveDate":getDate($("#updateStartActiveDate").find("input").val()),
            "endActiveDate": getDate($("#updateEndActiveDate").find("input").val()),
            "enabledFlag":$("#itemUpdateEnabledFlagSelect").val()=="是"?1:0
        },
        success:function(result){
            //alert(result.msg);
            if(result.code == 100){
                //员工保存成功；
                //1、关闭模态框
                //1、关闭对话框
                $("#itemUpdateModal").modal("hide");
                //2、回到本页面
                to_page(currentPage,currentPageSize);
            }else{
                //显示失败信息

                //有哪个字段的错误信息就显示哪个字段的；
                if(undefined != result.extend.errorFields.itemDescription){
                    //显示描述错误信息
                    show_validate_msg("#itemDescription_update_input", "error", result.extend.errorFields.itemDescription);
                }
                if(undefined != result.extend.errorFields.startActiveDate){
                    //显示开始时间错误信息
                    show_validate_msg("#updateStartActiveDate", "error", result.extend.errorFields.startActiveDate);
                }
                if(undefined != result.extend.errorFields.endActiveDate){
                    //显示员工名字的错误信息
                    show_validate_msg("#updateEndActiveDate", "error", result.extend.errorFields.endActiveDate);
                }
            }


        }
    });
});

//单个删除
$(document).on("click",".delete_btn",function(){
    //1、弹出是否确认删除对话框
    var itemCode = $(this).parents("tr").find("td:eq(1)").text();
    var itemId = $(this).attr("del-id");
    //alert($(this).parents("tr").find("td:eq(1)").text());
    if(confirm("确认删除【"+itemCode+"】吗？")){
        //确认，发送ajax请求删除即可
        $.ajax({
            url:"/item/"+itemId,
            type:"DELETE",
            success:function(result){
                //回到本页
                if(currentPage>Math.ceil((totalRecord-1)/currentPageSize)){
                    to_page(Math.ceil((totalRecord-1)/currentPageSize,currentPageSize));
                }else{
                    to_page(currentPage,currentPageSize);
                }
            }
        });
    }
});

//完成全选/全不选功能
$("#check_all").click(function(){
    //attr获取checked是undefined;
    //我们这些dom原生的属性；attr获取自定义属性的值；
    //prop修改和读取dom原生属性的值
    $(".check_item").prop("checked",$(this).prop("checked"));
});

//check_item
$(document).on("click",".check_item",function(){
    //判断当前选择中的元素是否5个
    var flag = $(".check_item:checked").length==$(".check_item").length;
    $("#check_all").prop("checked",flag);
});

//点击全部删除，就批量删除
$("#item_delete_all_btn").click(function(){
    //
    var itemNames = "";
    var del_idstr = "";
    var checkedNum=0;
    $.each($(".check_item:checked"),function(){
        //this
        itemNames += $(this).parents("tr").find("td:eq(1)").text()+",";
        //组装员工id字符串
        del_idstr += $(this).parents("tr").find("td .delete_btn").attr("del-id")+"-";
        checkedNum=checkedNum+1;
    });
    //去除empNames多余的,
    itemNames = itemNames.substring(0, itemNames.length-1);
    //去除删除的id多余的-
    del_idstr = del_idstr.substring(0, del_idstr.length-1);
    if(confirm("确认删除【"+itemNames+"】吗？")){
        //发送ajax请求删除
        $.ajax({
            url:"/item/"+del_idstr,
            type:"DELETE",
            success:function(result){
                alert(result.msg);
                //回到当前页面
                if(currentPage>=Math.ceil((totalRecord-checkedNum)/5)){
                    to_page(Math.ceil((totalRecord-checkedNum)/currentPageSize),currentPageSize);
                }else{
                    to_page(currentPage,currentPageSize);
                }
            }
        });
    }
});

$("#queryExampleBtn").click(function () {
    isHasExample=true;
    to_page_by_example(1,2,true);
});

function to_page_by_example(pn,pageCountNum,isAsc) {
    $.ajax({
        url:"/itemsexample",
        data:{
            "pn":pn,
            "itemCode":$("#queryItemCode").val(),
            "itemUom":$("#queryItemUnion").val(),
            "itemDescription":$("#queryItemDescrption").val(),
            "startActiveDate":getDate($("#queryItemStartTime").val()),
            "endActiveDate":getDate($("#queryItemEndTime").val()),
            "enabledFlag":$("#queryEnabledFlag").val(),
            "isAsc":isAsc,
            "pageCountNum":pageCountNum
        },
        type:"POST",
        success:function(result){
            //构建页面列表
            build_items_table(result);
            //解析显示分页信息
            build_page_info(result)
            //构建分页条
            build_page_nav(result)
        }
    });
}

$("#queryEmptyTable").click(function () {
    isSored=false;
    isHasExample=false;
    to_page(1,currentPageSize);
    $("#querySortMethod").text("升序");
    currentPageSort=true;
});

$("#querySortMethod").click(function () {
    isSored=true;
    if($(this).text()=="升序"){
        currentPageSort=false;
        $(this).text("降序");
    }else {
        currentPageSort=true;
        $(this).text("升序");
    }
    to_page_asc(currentPage,currentPageSize,currentPageSort);
})

function to_page_asc(pn,pageCountNum,isAsc) {
    $.ajax({
        url:"/itemsisasc",
        data:{"pn":pn,"pageCountNum":pageCountNum,"isAsc":isAsc},
        type:"GET",
        success:function(result){
            //构建页面列表
            build_items_table(result);
            //解析显示分页信息
            build_page_info(result);
            //构建分页条
            build_page_nav(result);
        }
    });
}

// //获取页面所有主键id
// $(document).on("click","#getExcelBtn",function(){
//     var itemIds=[];
//     $("td button:contains('编辑')").each(function () {
//         itemIds.push($(this).attr("edit-id"));
//     })
//
// });

