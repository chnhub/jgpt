$(function () {
    receiveRecord.init();
});


var receiveRecord = {

    clickIndex: 0, //当前点击记录 index
    currentMaxIndex: 0, //当前页最大下标

    init: function () {
        this.prepareSelections();
        this.initTable();
    },

    prepareSelections: function () {

        $.ajax({
            url: "/receiveRecord/interfaceList",
            type: "POST",
            success: function (data) {
                if (data.success == '1') {
                    receiveRecord.initSelections(data.data);
                } else {
                    showDialog("初始接口失败", BootstrapDialog.TYPE_DANGER);
                }
            }
        })
    },

    initSelections: function (list) {

        var html = "<option value=''></option>";
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                html += "<option value=" + list[i].ID + ">" + list[i].NAME + "</option>";
            }
        }
        $("#receiveUrl").html(html);
    },


    initTable: function () {

        var queryParams = {
            "requestId": $("#receiveUrl").val(),
            "fromIp": $("#qFromIp").val()
        };
        var columns = [
            {field: 'id', visible: false},
            {field: 'requestId', visible: false},
            {field: 'urlParams', visible: false},
            {field: 'bodyParams', visible: false},
            {field: 'filePath', visible: false},
            {
                title: '序号',
                width: '4%',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                   return index + 1;
                }
            },
            {title: '来源ip', field: 'fromIp', width: '11%', align: "center"},
            {title: '访问接口', field: 'description', width: '14%', align: "center"},
            {title: '接口规则', field: 'urlRegex', width: '21%', align: "center"},
            {title: '访问路径', field: 'requestUrl', width: '21%', align: "center"},
            {title: '访问时间', field: 'requestTime', width: '19%', align: "center"},
            {
                title: '操作',
                field: 'StatusAndDo',
                width: '9%',
                align: 'center',
                valign: 'middle',
                formatter: receiveRecord.opera
            }
        ];

        $('#receiveTable').bootstrapTable({
            url: '/receiveRecord/getRequestLogList',
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            height: 310,
            queryParamsType: 'limit',
            queryParams: function (param) {
                return $.extend(queryParams, param);
            },
            uniqueId: "id",
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            sortable: true,
            sortOrder: "desc",
            sidePagination: "server",
            striped: true,
            silent: true,
            overflow: "scroll",
            columns: columns,
            pageList: [5, 10, 20, 50],
            smartDisplay: false
        });
    },

    search: function () {

        $('#receiveTable').bootstrapTable('refresh', {
            pageNumber: 1,
            query: {
                requestId: $("#receiveUrl").val(),
                fromIp: $("#qFromIp").val()
            }
        });
    },

    reset: function () {
        $("#receiveUrl").val('');
        $("#qFromIp").val('');
    },

    opera: function (value, row, index) {
        return '<button class="btn btn-success btn-sm" onclick="receiveRecord.clickToshowDetail(\'' + index + '\')" >详细</button> ';
    },


    //点击展示请求详情
    clickToshowDetail: function (index) {
        receiveRecord.clickIndex = index;
        receiveRecord.showDetail(index);
    },

    checkIsSide: function () {
        $("#c_back").attr("disabled", receiveRecord.clickIndex <= 0);
        $("#c_next").attr("disabled", receiveRecord.clickIndex >= receiveRecord.currentMaxIndex);
    },

    //后退
    localBack: function () {

        receiveRecord.checkIsSide();
        if (receiveRecord.clickIndex > 0) {
            receiveRecord.clickIndex--;
            receiveRecord.showDetail(receiveRecord.clickIndex);
        }
    },

    //前进
    localNext: function () {
        receiveRecord.checkIsSide();
        if (receiveRecord.clickIndex < receiveRecord.currentMaxIndex) {
            receiveRecord.clickIndex++;
            receiveRecord.showDetail(receiveRecord.clickIndex);
        }
    },

    showDetail: function (index) {
        var datas = $('#receiveTable').bootstrapTable('getData');
        receiveRecord.currentMaxIndex = datas.length - 1;
        receiveRecord.checkIsSide();
        var data = datas[index];
        $("#receiveDetailModal").modal();
        $("#c_receiveInterface").val(data['description']);
        $("#c_receiveTime").val(data['requestTime']);
        $("#c_url").val(data['requestUrl']);
        $("#c_urlRegex").val(data['urlRegex']);
        $("#c_bodyParam").val(formatJsonIfNecessary(data['bodyParams']));
        $("#c_urlParam").val(formatJsonIfNecessary(data['urlParams']));
        receiveRecord.showFile(data['filePath']);
    },

    showFile: function (filePath) {

        //无文件则隐藏
        if (filePath == null || filePath == '') {
            $("#c_file").html('');
            $("#c_fileDiv").css('display', 'none');
            return;
        }
        $("#c_fileDiv").css('display', 'block');
        var innerHtml = '';
        if (isImageTypeInPath(filePath)) {
            innerHtml = '<img src="' + filePath + '" style="width:100%;height:300px"/>';
        } else {
            var index = filePath.lastIndexOf("/");
            var filename = filePath.substr(index + 1);
            innerHtml = '<a href="' + filePath + '" style="text-underline: auto">' + filename + '</a>';
        }
        $("#c_file").html(innerHtml);
    }

};



