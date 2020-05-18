function showDialog(info, type) {
    BootstrapDialog.show({
        type: type,
        title: '操作提示',
        message: '<span style="font-size: 16px">' + info + '</span>'
    });
}


function formatJsonIfNecessary(str) {
    var result = str;
    try {
        result = formatJson(str)
    } catch (err) {
    }
    return result;
}


function formatJsonWithError(str) {
    var result = str;
    try {
        result = formatJson(str)
    } catch (err) {
        result = '非法json字符串。错误信息： ' + err;
    }
    return result;
}

function checkJSONIsError(str){

    try {
        formatJson(str)
    } catch (err) {
       return '非法json字符串。错误信息： ' + err;
    }
    return '';
}



/**
 * 根据文件路径判断文件类型
 */
function isImageTypeInPath(filePath) {

    var index = filePath.lastIndexOf(".");
    var suffix = filePath.substr(index + 1);
    return ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp', 'psd', 'svg']
        .indexOf(suffix.toLowerCase()) !== -1;
}

function tab(obj) {
    if (event.keyCode == 9) {
        obj.value = obj.value + "  ";
        event.returnValue = false;
    }
}

