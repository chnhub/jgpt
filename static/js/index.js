$(function () {
    index.init();
});

var index = {

    init: function () {
        var height = document.documentElement.clientHeight;
        document.getElementById('iframe-html-content').style.height = height + 'px';
    },

    //标签页点击
    tabClick: function (index) {


        $("#menuNav li a").removeClass("active");
        $("#menu" + index).addClass("active");
        $("#tabcontent div").hide();
        $("#tabs a").removeClass("active");
        $("#tab" + index + "_content").show(); //展示当前tab内容
        $("#tab" + index).addClass("active"); //当前tab置为 活跃
        //标签点击进行刷新
        //$("#myIframe" + index)[0].src = $("#myIframe" + index)[0].src;
    },

    //将紧挨删除的下一个标签对应页面置为active
    //仅当活跃的tab页与需删除的 tab页一致时需要将末尾页面置为活跃， 某则只需要单纯删除，
    tabRemove: function (index) {

        var event = window.event;
        event.stopPropagation();

        //获取页面 div对象
        var div = document.getElementById("tab" + index + "_content");
        var divParent = div.parentElement;

        //获取标签父 对象
        var currentTab = document.getElementById("tab" + index);
        var tabParent = currentTab.parentElement;

        //当前活跃的tab标签
        var activeLiId = $("#tabs a.active")[0].id;
        var activeIndex = activeLiId.substr(activeLiId.length - 1, 1);
        if (index == activeIndex) {

            var divNode = div.nextElementSibling == null ? div.previousSibling : div.nextElementSibling;
            $("#tabcontent div").hide();
            $("#" + divNode.id).show();

            var tabNode = currentTab.nextElementSibling == null ? currentTab.previousSibling : currentTab.nextElementSibling;
            $("#" + tabNode.id).addClass("active");

            var newActiveIndex = tabNode.id.substr(tabNode.id.length - 1, 1);
            $("#menu" + newActiveIndex).addClass("active");

        }

        //页面内容关闭
        divParent.removeChild(div);
        //上方tab标签关闭
        tabParent.removeChild(currentTab);
        //左侧菜单移除class
        $("#menu" + index).removeClass("active");
    },

    //菜单栏点击
    menuClick: function (menuUrl, menuName, index) {

        $("#menuNav li a").removeClass("active");
        $("#menu" + index).addClass("active");
        //隐藏当前页面
        $("#tabs a").removeClass("active");
        $("#tabcontent div").hide();

        //跳转到 已打开的tab页
        if ($("#tab" + index).length != 0) {
            $("#tab" + index).addClass("active");
            $("#tab" + index + "_content").show();
            return;
        }

        $("#tabs").append(
            "<a onclick='index.tabClick(" + index + ")' class='active J_menuTab' id='tab" + index + "'>" + menuName
            + "  <i class='fa fa-times-circle' onclick='index.tabRemove(" + index + ")'></i></a>"
        );

        var $div = $("<div id='tab" + index + "_content'></div>");
        var $iframe = $("<iframe  id='myIframe" + index + "'  style='width:100%;height:600px;display:block;border:0' " +
            "marginwidth='0'marginheight='0' scrolling='no' allowtransparency='yes'></iframe>");
        $iframe.attr("src", menuUrl);
        $div.append($iframe);
        $("#tabcontent").append($div);
    }
}