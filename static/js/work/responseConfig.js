$(function () {
    responseConfig.init();
});


var responseConfig = {

    rootPid: 0,
    isIncrease: true,
    clickNodeId: null,
    clickPid: null,
    originRegex: '',

    init: function () {
        this.initTree();
        this.bind();
    },

    bind: function () {
        //菜单类型选择 绑定参数
        $("#menuType").change(responseConfig.menTypeChange);
    },

    menTypeChange: function () {
        $("#urlRegexDiv").css("display", $("#menuType").val() == 2 ? "block" : "none");
    },


    //保存菜单节点
    saveMenuNode: function () {
        if (responseConfig.validNodeForSave()) {
            $.ajax({
                url: "/responseConfig/saveMenuNode",
                type: "POST",
                data: {
                    isIncrease: responseConfig.isIncrease,
                    id: responseConfig.isIncrease ? null : responseConfig.clickNodeId,
                    pid: responseConfig.isIncrease ? responseConfig.clickNodeId : null,
                    name: $("#menuName").val(),
                    type: $("#menuType").val(),
                    originRegex: responseConfig.originRegex,
                    urlRegex: $("#menuType").val() == 2 ? $("#urlRegex").val() : null
                },
                success: responseConfig.initResponseConfigPage
            });
        }
    },

    //新增节点后的处理方法
    initResponseConfigPage: function (data) {

        showDialog(data.msg, BootstrapDialog.TYPE_SUCCESS);
        if (data.success == 0) {
            //重置所在子树
            $("#menuEditModal").modal('hide');
            if(responseConfig.isIncrease) { //新增操作
                var treeObj = $.fn.zTree.getZTreeObj("requestResourceTree");
                var node = treeObj.getNodeByParam("id",responseConfig.clickNodeId);
                responseConfig.refreshChildTree(node);
                //新加节点变更为选中节点
                responseConfig.clickNodeId = data.newNodeId;
                //接口新增 展示右侧响应信息
                if ($("#menuType").val() == 2) {
                    //填充右侧基础参数 与隐藏域信息
                    $("#interfaceId").val(data.newNodeId);
                    $("#posturl").val(data.urlRegex);
                    $("#interfaceName").val($("#menuName").val());
                    $("#waitTime").val(data.waitTime == null ? 0 : data.waitTime);
                    $("#responseContent").val(formatJsonIfNecessary(data.content));
                    $("#responseBodyDiv").css("display", "block");
                } else {
                    //菜单类型节点新增后 清空右侧信息
                    responseConfig.clear();
                }
            }else{ //修改操作

                var treeObj = $.fn.zTree.getZTreeObj("requestResourceTree");
                var node = treeObj.getNodeByParam("id",responseConfig.clickPid);
                responseConfig.refreshChildTree(node);
                if($("#menuType").val() == 2) {

                    $("#waitTime").val(data.waitTime == null ? 0 : data.waitTime);
                    $("#responseContent").val(formatJsonIfNecessary(data.content));
                    $("#responseBodyDiv").css("display", "block");
                    $("#posturl").val($("#urlRegex").val());
                    $("#interfaceName").val($("#menuName").val());
                }else{
                    responseConfig.clear();
                }
            }
        }
    },


    validNodeForSave: function () {

        if ($("#menuName").val() == '' || $("#menuName").val() == null) {
            showDialog('请输入名称!', BootstrapDialog.TYPE_DANGER);
            return false;
        }
        if ($("#menuType").val() == 2 && ($("#urlRegex").val() == '' || $("#urlRegex").val() == null)) {
            showDialog('请输入接口url规则!', BootstrapDialog.TYPE_DANGER);
            return false;
        }
        return true;
    },


    initTree: function () {

        var settings = {
            view: {
                dblClickExpand: false,
                selectedMulti: false,
                addDiyDom: responseConfig.addDiyDom
            },
            data: {simpleData: {enable: true}},
            callback: {
                onClick: responseConfig.treeOnclick,
                onExpand: responseConfig.onExpand
            }
        };

        $.ajax({
            url: "/responseConfig/childTree",
            type: "POST",
            data: {pid: 0},
            success: function (data) {
                $.fn.zTree.init($("#requestResourceTree"), settings, data);
            }
        });
    },


    /**
     * treeNode 父节点
     * 刷新子树
     */
    refreshChildTree: function (treeNode) {
        $.ajax({
            url: "/responseConfig/childTree",
            type: "POST",
            data: {pid: treeNode.id},
            success: function (data) {
                var treeObj = $.fn.zTree.getZTreeObj("requestResourceTree");
                treeObj.removeChildNodes(treeNode);
                treeObj.addNodes(treeNode, data, false);
            }
        });
    },


    /**
     * 节点右侧 功能按钮
     */
    addDiyDom: function (treeId, treeNode) {

        var preview = "";
        var dele = "<a style='font-weight:bold' onclick='responseConfig.deleteNode(\""
            + treeNode.id + "\",\"" + treeNode.pid + "\",\"" + treeNode.urlRegex + "\",\""
            + treeNode.menutype + "\",\"" + treeNode.name + "\" )'><font color='#FF0000'>删除</span></a>";

        var update = "<a style='font-weight:bold' onclick='responseConfig.updateNode(\""
            + treeNode.id + "\",\"" + treeNode.urlRegex + "\",\"" + treeNode.name + "\",\""
            + treeNode.menutype + "\" ,\"" + treeNode.pid + "\")'>修改</a>";

        var add = "<a style='font-weight:bold' onclick='responseConfig.addNode(\""
            + treeNode.id + "\",\"" + treeNode.menutype + "\")'>新增</a>";

        if (responseConfig.rootPid == treeNode.pid) {
            preview = "<div style='float:right'>" + add + "</div>";
        } else if (!treeNode.isParent) {
            preview = "<div style='float:right'>" + dele + "&nbsp;" + update + "</div>";

        } else {
            preview = "<div style='float:right'>" + dele + "&nbsp;" + update + "&nbsp;" + add + "</div>";
        }
        var aObj = $("#" + treeNode.tId + "_a");
        aObj.after(preview);
    },


    /**
     * 判断树节点有无子节点
     */
    noChildNode: function (treeNode) {
        return treeNode.children == null || treeNode.children.length === 0;
    },

    /**
     * 展开树节点，发起查询请求
     */
    onExpand: function (e, treeId, treeNode) {

        if (responseConfig.noChildNode(treeNode)) {
            responseConfig.refreshChildTree(treeNode);
        }
    },

    /**
     * 菜单树新加节点
     */
    addNode: function (id, type) {
        responseConfig.isIncrease = true;
        responseConfig.clickNodeId = id;
        $("#menuType").val(2);
        $("#menuName").val('');
        $("#urlRegex").val('');
        responseConfig.menTypeChange();
        $("#menuEditModal").modal();
        $('#menuType').removeAttr("disabled");
    },

    updateNode: function (id, url, name, type, pid) {

        responseConfig.originRegex = url;
        responseConfig.isIncrease = false;
        responseConfig.clickNodeId = id;
        responseConfig.clickPid = pid;

        $("#menuEditModal").modal();
        $("#menuName").val(name);
        $("#menuType").val(type);
        $("#urlRegex").val(url);
        responseConfig.menTypeChange();
        $("#menuType").attr("disabled", "true");
    },


    deleteNode: function (id, pid, url, type, name) {


        BootstrapDialog.confirm({
            type: BootstrapDialog.TYPE_DANGER,
            container: '.bootbox-container',
            title: "操作提示",
            closeButton: false,
            message: "是否删除节点" + name,
            btnCancelLabel: '取消',
            btnOKLabel: '确定',
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: "/responseConfig/deleteNode",
                        type: "POST",
                        data: {
                            urlRegex: url,
                            nodeId: id,
                            menuType: type
                        },
                        success: function (data) {
                            if (data.success == '0') {
                                showDialog("操作成功", BootstrapDialog.TYPE_SUCCESS);
                                responseConfig.clear();
                                var treeObj = $.fn.zTree.getZTreeObj("requestResourceTree");
                                var node = treeObj.getNodeByParam("id", pid);
                                responseConfig.refreshChildTree(node);
                            } else {
                                showDialog(data.msg, BootstrapDialog.TYPE_DANGER);
                            }
                        }
                    })
                }
            }
        });
    },


    /**
     * 节点点击事件
     */
    treeOnclick: function (event, treeId, treeNode, clickFlag) {

        responseConfig.clear();
        if (treeNode.menutype == 2) {
            $("#responseBodyDiv").css("display", "block");
            $("#interfaceId").val(treeNode.id);
            $("#interfaceName").val(treeNode.name);
            $("#posturl").val(treeNode.urlRegex);
            responseConfig.search();
        }

    },

    search: function () {

        $.ajax({
            url: "/responseConfig/search",
            type: "POST",
            data: {
                posturl: $("#posturl").val(),
                requestId: $("#interfaceId").val()
            },
            success: function (data) {
                if (data.success == '1') {
                    $("#responseContent").val(formatJsonIfNecessary(data.content));
                    $("#waitTime").val(data.waitTime);
                } else {
                    showDialog("操作失败", BootstrapDialog.TYPE_DANGER);
                }
            }
        })

    },


    //清除右侧响应配置页面
    clear: function () {
        $("#interfaceId").val('');
        $("#interfaceName").val('');
        $("#posturl").val('');
        $("#responseContent").val('');
        $("#waitTime").val(0);
        $("#responseBodyDiv").css("display", "none");
    },


    valid: function(){

        var checkResult = checkJSONIsError($("#responseContent").val());
        if(checkResult === ''){
            return true;
        }else{
            showDialog("响应数据配置出错：\n" + checkResult, BootstrapDialog.TYPE_DANGER);
            return false;
        }
    },

    save: function (saveDb) {
        if(responseConfig.valid()) {
            $.ajax({
                url: "/responseConfig/save",
                type: "POST",
                data: {
                    isSaveToDb: saveDb,
                    requestId: $("#interfaceId").val(),
                    posturl: $("#posturl").val(),
                    waitTime: $("#waitTime").val() == null ? 0 : $("#waitTime").val(),
                    content: $("#responseContent").val()
                },
                success: function (data) {
                    if (data.success == '1') {
                        showDialog("保存成功", BootstrapDialog.TYPE_SUCCESS);
                    } else {
                        showDialog("操作失败! " + data.msg, BootstrapDialog.TYPE_DANGER);
                    }
                }
            })
        }

    }


};



