var tool = {

    /**
     * 删除所有
     */
    deleteReceiveRecord: function(){
        this.postForTool("deleteReceiveRecord");
    },

    /**
     * 同步缓存
     */
    syncInterfaceCache:function(){
        this.postForTool("syncInterfaceCache");
    },



    formJSON : function(){

        this.clearJSON();
        $("#jsonFormatModal").modal();
    },

    startFormJSON:function(){

        var result = formatJsonWithError($("#leftData").val());
        $("#rightData").val(result);
    },

    clearJSON:function(){
        $("#leftData").val("");
        $("#rightData").val("");
    },


    postForTool: function (url) {

        $.ajax({
            url: "/tool/" + url,
            type: "POST",
            data: {},
            success: function (data) {
                if (!data.success) {
                    showDialog(data.message, BootstrapDialog.TYPE_DANGER);
                } else {
                    showDialog("操作成功！", BootstrapDialog.TYPE_SUCCESS);
                }
            }
        })

    },


    upFile: function(){

        $("#fileUploadMould").modal();

    },

    uploadFile: function () {


            $("#fileType").removeAttr("disabled");
            var formData = new FormData($('#uploadForm')[0]);
            formData.append("path", $("#ftpPath").val());
            formData.append("fileType", $("#fileType").val());
            $(".layui-layer-shade").css("background-color", "rgba(0,0,0,0.2)");
            $.ajax({
                type: 'post',
                url: "http://172.16.8.104:8010/files/uploadPhotoHttp",
                data: formData,
                cache: false,
                processData: false,
                contentType: false
            }).success(function (data) {



            }).error(function () {
                $("#fileType").attr("disabled",true);
                alert("上传失败");
            });

    },


    //校验导入文件简单逻辑
    validFile: function () {

        var file = $("#file").val();
        if (file == '') {
            alert("请先选择文件！");
            return false;
        }


        var re = $("#fileType").val() === "1" ? /.*(.xml)$/ : /.*(.jpg|.png|.jpeg|.bmp)$/;
        var reg = new RegExp(re);
        if (!reg.test(file)) {
            alert("请导入正确格式的文件!");
            return false;
        }

        return true;
    },

};