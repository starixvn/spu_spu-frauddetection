/// <reference path="/@JSense.js" />
/* File Created: April 23, 2015 */
/* exported  Home */
/* global site */
var home = (function () {
    "use strict";
    
    var me = {};
    var initUI = function () {
        
    };
    var initEvent = function () {
        var data = "<html><body>Sample data</body></html>"
        $("#btn_PopupDemo").click(function () {
            $('<div id="popup"></div>')
            .appendTo('body')
            .html(data)
            .dialog({
                modal: true,
                title: "Demo Popup",
                zIndex: 10000,
                autoOpen: true,
                width: '500px',
                resizable: false,
                close: function () {
                    $(this).remove();
                }
            });
            /*
            $.ajax({
                type: "POST",
                url: window.rootUrl + "BetSetting/LoadTeamplate",
                data: criteria,
                datatype: "html",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                beforeSend: function () {
                    invokeLoadingMsg(true);
                },
                error: function () {
                    invokeLoadingMsg(false);
                    alert(site.requestErrMsg);
                },
                success: function (data) {
                    var template = $.parseHTML(data);
                    if (template.length > 1) {
                        var hasSetting = template[0].value;

                        if (hasSetting !== undefined && hasSetting.toLowerCase() === "true") {
                            goToEditingPage(criteria);
                        } else {
                            $("#template-content").html(data);

                            setFooterControlStatus(true);
                            
                            $('table.table tbody input[type="text"].txt-max').number(true, 0);
                        }
                    }
                    else {
                        alert(noneTemplate);
                    }
                    invokeLoadingMsg(false);
                }
            }); */
        });
    };
    
    me.setup = function () {
        initUI();
        initEvent();
    };

    return me;
})();