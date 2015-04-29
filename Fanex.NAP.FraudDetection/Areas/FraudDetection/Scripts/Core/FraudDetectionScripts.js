var FraudDetectionScripts = {
    MaximumNumberOfIPs: 32767, //size of  (smallint)
    Enums: {
        KeyCode: {
            A: 65,
            END: 35,
            DOWN_ARROW: 40,
            _0: 48,
            _9: 57,
            NUMPAD_0: 96,
            NUMPAD_9: 105
        },
        UserRole: {
            ITAdministrator: 1,
            Licensee: 2,
            LicenseeSubAccount: 3
        },
        ValidateRegex: {
            NameField: /^[a-zA-Z0-9_.]+$/,
            EmailField: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            WebsiteField: /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        }
    },
    numericTextBox: function (txtb) {
        $.fn.extend(FraudDetectionScripts.Enums.KeyCode, $.ui.keyCode);
        $(txtb).keydown(function (event) {
            var keyCodeEnum = FraudDetectionScripts.Enums.KeyCode;
            // Allow: backspace, delete, tab, escape, and enter
            // Allow: Ctrl+A
            // Allow: home, end, left, right
            // let it happen, don't do anything
            if (event.keyCode == keyCodeEnum.DELETE ||
                event.keyCode == keyCodeEnum.BACKSPACE ||
                event.keyCode == keyCodeEnum.TAB ||
                event.keyCode == keyCodeEnum.ESCAPE ||
                event.keyCode == keyCodeEnum.ENTER ||
                (event.keyCode == keyCodeEnum.A && event.ctrlKey === true) ||
                (event.keyCode >= keyCodeEnum.END && event.keyCode <= keyCodeEnum.DOWN_ARROW)) {
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey ||
                    (event.keyCode < keyCodeEnum._0 || event.keyCode > keyCodeEnum._9) &&
                    (event.keyCode < keyCodeEnum.NUMPAD_0 || event.keyCode > keyCodeEnum.NUMPAD_9)) {
                    event.preventDefault();
                }
            }
        });
    },
    validateIPString: function (ipaddr) {
        //Remember, this function will validate only Class C IP.
        //change to other IP Classes as you need
        ipaddr = ipaddr.replace(/\s/g, "");  //remove spaces for checking
        var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; //regex. check for digits and in
        //all 4 quadrants of the IP
        if (re.test(ipaddr)) {
            //split into units with dots "."
            var parts = ipaddr.split(".");
            //if the first unit/quadrant of the IP is zero
            if (parseInt(parseFloat(parts[0])) == 0) {
                return false;
            }

            //if the fourth unit/quadrant of the IP is zero
            if (parseInt(parseFloat(parts[3])) == 0) {
                return false;
            }

            //if any part is greater than 255
            for (var i = 0; i < parts.length; i++) {
                if (parseInt(parseFloat(parts[i])) > 255) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    },
    escapeHTML: function (str) {
        var escapeChar = { '"': '&quot;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            "/": '&#x2F;',
            "\\": "&#92;"
        };

        return str.replace(/[\"&<>'\/\\]/g, function (a) { return escapeChar[a]; });
    },
    unescapeHTML: function (str) {
        var unescapeChar = [{ Key: '&quot;', Value: '"' },
                            { Key: '&amp;', Value: '&' },
                            { Key: '&lt;', Value: '<' },
                            { Key: '&gt;', Value: '>' },
                            { Key: '&#39;', Value: "'" },
                            { Key: '&#x2F;', Value: "/" },
                            { Key: "&#92;", Value: "\\"}];

        var unescapeCharLength = unescapeChar.length;
        for (var i = 0; i < unescapeCharLength; i++) {
            var unescapeCharInfo = unescapeChar[i];
            str = str.replace(unescapeCharInfo.Key, unescapeCharInfo.Value, 'g');
        }

        return str;
    },
    formatFanexGridStringResult: function (strResult) {
        var result = strResult.replace("\\\\", "\\", "g");
        result = eval(result);
        if (result[0].data.length > 0) {
            var dataLength = result[0].data.length;
            for (var i = 0; i < dataLength; i++) {
                var columnsLength = result[0].data[i].Columns.length;
                for (var j = 0; j < columnsLength; j++) {
                    result[0].data[i].Columns[j].Value = FraudDetectionScripts.escapeHTML(result[0].data[i].Columns[j].Value);
                }
            }
        }

        return result;
    },
    confirmAfterSuccess: function (redirectUrl) {
        confirm('Successfull! Press OK to continue', function () {
            document.location = redirectUrl;
        });
    },
    informActionResult: function (actionResult, messageContainer) {
        if (actionResult != null && actionResult.IsSuccess == true) {
            messageContainer.empty()
                            .append("<ul><li>" + actionResult.ResultMessage + "</li></ul>")
                            .addClass("success-message-box")
                            .removeClass("error-message-box")
                            .removeClass("hidden");
        }
        else {
            messageContainer.empty()
                            .append("<ul><li>" + actionResult.ResultMessage + "</li></ul>")
                            .addClass("error-message-box")
                            .removeClass("success-message-box")
                            .removeClass("hidden");
        }
    },
    makeWatermask: function (wtrTextbox, wtrText, wtrFunction) {
        $(wtrTextbox).Watermark(wtrText);
        $(wtrTextbox).autocomplete({
            source: [],
            minLength: 1
        });

        if (typeof (wtrFunction) == "function") {
            $(wtrTextbox).keyup(function (e) {
                if (e.keyCode == $.ui.keyCode.ENTER) {
                    wtrFunction();
                }
            });
        }
    },
    insertAtIndex: function (array, index, item) {
        array.splice(index, 0, item);
        return array;
    },
    insertArrayAtIndex: function (array, index, items) {
        var arrayToInsert = array.splice.apply(arguments, [3]);
        return insertArrayAt(array, index, items, arrayToInsert);
    },
    validateNumberOfIP: function (action, numberOfIPs, IpTable) {
        var valid = true;
        var sum = FraudDetectionScripts.getNumberOfIP(IpTable);

        if (action == 'add' && sum >= numberOfIPs) {
            valid = false;
        }
        else if (action == 'save' && sum > numberOfIPs) {
            valid = false;
        }

        if (!valid) {
            FraudDetectionScripts.ShowError_ValidateNumberOfIP(numberOfIPs);
        }
        else {
            FraudDetectionScripts.HideError_ValidateNumberOfIP();
        }

        return valid;
    },
    getNumberOfIP: function (IpTable) {
        var sum = 0;

        $('#' + IpTable + ' tbody tr').each(function (index) {
            var columns = jQuery(this).children();
            if (columns.length > 1) {
                var inputFrom = jQuery(columns[0]).children()[0].value;
                var inputTo = jQuery(columns[1]).children()[0].value;

                var numberFrom = FraudDetectionScripts.convertIPToUint(inputFrom);
                var numberTo = FraudDetectionScripts.convertIPToUint(inputTo);

                if (numberFrom > 0 && numberTo > 0) {
                    sum += (numberTo - numberFrom) + 1;
                }
            }
        });

        return sum;
    },
    // --- Check if there is overlap ip range--- //
    validateIPRange: function () {
        var iplist = new Array();
        var arrayIndex = 0;
        $('#IpTable tbody tr').each(function (index) {
            var columns = jQuery(this).children();
            if (columns.length > 1) {
                var inputFrom = jQuery(columns[0]).children()[0].value;
                var inputTo = jQuery(columns[1]).children()[0].value;
                var iprange = new Array();
                iprange[0] = FraudDetectionScripts.convertIPToUint(inputFrom);
                iprange[1] = FraudDetectionScripts.convertIPToUint(inputTo);
                iplist[arrayIndex] = iprange;
                arrayIndex++;
            }
        });

        var valid = true;
        var errorMsg = "";
        // --- Check if there is an overlap ip range --- //
        var errorArr = [];
        for (var i = 0; i < arrayIndex; i++) {
            var iprange = iplist[i];
            for (var j = i + 1; j < arrayIndex; j++) {
                var temprange = iplist[j];
                // --- case Start2< Start1< End1<End2 --- //
                // --- case Start2< Start1< End2<End1 --- //
                if (iprange[0] >= temprange[0] && iprange[0] <= temprange[1]) {
                    errorArr.push("IP Range " + FraudDetectionScripts.convertUintToIP(iprange[0]) + ' -> ' + FraudDetectionScripts.convertUintToIP(iprange[1])
                                   + " is overlap with IP Range "
                                   + FraudDetectionScripts.convertUintToIP(temprange[0]) + ' -> ' + FraudDetectionScripts.convertUintToIP(temprange[1]));
                    valid = false;
                }
                // --- case Start1< Start2< End1<End2 --- //
                // --- case Start1< Start2< End2<End1 --- //
                else if (temprange[0] >= iprange[0] && temprange[0] <= iprange[1]) {
                    errorArr.push("IP Range " + FraudDetectionScripts.convertUintToIP(iprange[0]) + ' -> ' + FraudDetectionScripts.convertUintToIP(iprange[1])
                                   + " is overlap with IP Range "
                                   + FraudDetectionScripts.convertUintToIP(temprange[0]) + ' -> ' + FraudDetectionScripts.convertUintToIP(temprange[1]));
                    valid = false;
                }
            }
        }

        if (!valid) {
            alert(errorArr.join("<br />"));
        }

        return valid;
    },
    validateIP: function (action) {
        var valid = true;

        var rows = $('#IpTable tbody tr');
        if (rows.length > 0) {
            var lastRow = rows[rows.length - 1];
            var columns = $(lastRow).children();
            var inputFrom = $(columns[0]).children()[0].value;
            var inputTo = $(columns[1]).children()[0].value;

            //check validation for lastrow
            valid = FraudDetectionScripts.validateUpdatingIP(action, inputFrom, inputTo);

            //        //check maximum number of IP 
            //        if (valid) {
            //            valid = ValidateNumberOfIP(action);
            //        }
        }

        return valid;
    },
    validateUpdatingIP: function (action, inputFrom, inputTo) {
        // --- Validate --- //   
        var valid = true;
        var errorMsg = "Error!<br>";

        if (action == 'save') {
            // If IP From and IP To is null, ignore it
            if (inputFrom.length == 0 && inputTo.length == 0) {
                return true;
            }
        } else if (action == 'add') {
            // --- Check if user enter IP from and IP to --- //
            if (inputFrom.length == 0) {
                errorMsg += "Please enter the IP From<br>";
                valid = false;
            }
            if (inputTo.length == 0) {
                errorMsg += "Please enter the IP To<br>";
                valid = false;
            }
        }

        // --- Validate IP String --- ///
        if (valid) {
            if (!this.validateIPString(inputFrom)) {
                valid = false;
                errorMsg += "'" + inputFrom + "' is not a valid IP.<br>";
            }
            if (!this.validateIPString(inputTo)) {
                valid = false;
                errorMsg += "'" + inputTo + "' is not a valid IP.<br>";
            }
        }
        if (valid) {
            // --- Validate IP range --- ///
            var newIPFrom = FraudDetectionScripts.convertIPToUint(inputFrom);
            var newIPTo = FraudDetectionScripts.convertIPToUint(inputTo);
            if (newIPFrom > newIPTo) {
                valid = false;
                errorMsg += " The IP From must be less than IP To.<br>";
            }
        }
        // --- Check if overlap IP --- //
        if (!valid) alert(errorMsg);
        else valid = FraudDetectionScripts.validateIPRange();

        return valid;
    },
    convertUintToIP: function (ip) {
        var d = ip % 256;
        ip = (ip - d) / 256;
        var c = ip % 256;
        ip = (ip - c) / 256;
        var b = ip % 256;
        ip = (ip - b) / 256;
        var a = ip;
        return a + '.' + b + '.' + c + '.' + d;
    },

    convertIPToUint: function (ip) {
        ip = ip.trim();
        var data = ip.split('.');
        if (data.length == 4) {
            var a = Number(data[0]) * 256 * 256 * 256;
            var b = Number(data[1]) * 256 * 256;
            var c = Number(data[2]) * 256;
            var d = Number(data[3]);
            return a + b + c + d;
        }
        return 0;
    },

    ShowError_ValidateNumberOfIP: function (numberOfIPs) {
        //$("#errorStep2").empty().append("<ul><li>" + viewResources.MaximumNumberOfIPs.replace('{MaximumNumberOfIPs}', numberOfIPs) + "</li></ul>");
        //$("#errorStep2").show('fast');
        //$("#errorStep2").removeClass("hidden");
        
        $("#errorStep2_NumberOfIPs").addClass("validation-summary-errors");        
        $('#IpTable').addClass('error');
    },

    HideError_ValidateNumberOfIP:function(){
        //$("#errorStep2").addClass("hidden");
        $("#errorStep2_NumberOfIPs").removeClass("validation-summary-errors");
        $('#IpTable').removeClass('error');
    },

};