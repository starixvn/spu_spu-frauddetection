/*
Description: Validate a logic expression, show the error messages and decorate the charactes that cause the errors
Author: Thai.Tran
Company: Nexcel Solution Corp.
*/

var expVal = (function () {

    //Node structure
    var Node = function (id, data) {
        this.id = id;
        this.data = data;
        this.error = false;
    };

    var arrExp = []; // array of nodes 
    var _isCheckChild = false;

    return {
        /*
        - Validate a logic expression = exp, with separate = sep, isCheckChildFormat : TRUE// it means checking every child logic MUST follow the rule: {V1} or {V1 opt V2}
        - Return "errMsg,exp"
        + Valid: errMsg = "", oldExp // oldEXp : the input exp
        + Invalid: errMsg != "", newExp  // newExp : the exp is formated (inject color, etc...)                                
        */
        validateLogicExpession: function (exp, sep, isCheckChildFormat) {

            _isCheckChild = (typeof (isCheckChildFormat) != "undefined" && isCheckChildFormat != null) ? isCheckChildFormat : false;

            var errCode = [];
            var errMsg = ["Expression is invalid", "Expression is missing (", "Expression is missing )"];

            var stack = [];
            var arr = exp.split(sep);

            // create a array of expressions with struct Item
            this.buildArrayExp(arr);

            // validate each chilf exp with couple () and build the stack by removing () from exp
            var i = 0;
            while (i < arrExp.length) {
                var currentNode = arrExp[i];
                if (currentNode.data != ")") {
                    stack.push(new Node(currentNode.id, currentNode.data));
                }
                else { // get stack for verify a chil exp
                    var arrChildExp = []; //child exp array

                    while (stack.length > 0 && (node = stack.pop(), node.data != "(")) //get the top child exp , ex: "2 + 1"
                    {
                        arrChildExp.push(new Node(node.id, node.data));
                    }

                    if (node.data != "(") {
                        this.detectError([currentNode]);
                        errCode.push(1);
                        //break;
                    }
                    else {
                        if (arrChildExp.length > 0) {
                            if (this.isValidLogic(arrChildExp) == false) {
                                this.detectError(arrChildExp);
                                errCode.push(0)
                                //break;
                            }
                            stack.push(new Node(-1, "T")); //replace with a simpler boolean expression , remove ( & )
                        }
                    }
                }

                i++;
            }

            // validate others
            if (stack.length > 0) {
                //check exp (in the stack) that has no ( ), Ex: exp is " ( a = b OR c =d ) AND e = f OR" => exp (in stack) is "T AND e = f OR"
                if (this.isValidLogic(stack) == false) {
                    this.detectError(stack);
                    errCode.push(0);
                }

                //check exp (in the stack) is missing ")" ?, Ex: exp = " ( ( ( a = b OR c =d ) AND ( e = f " => exp (in stack) is " ( ( T AND ( e = f"
                for (var i = 0; i < stack.length; i++) {
                    var node = stack[i];
                    if (node.data == "(") {
                        this.detectError([node]);
                        errCode.push(2);
                    }
                }
            }

            return this.getResult(errCode, errMsg);
        },

        buildArrayExp: function (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != "") {
                    arrExp.push(new Node(i, arr[i].trim()));
                }
            }
        },

        //to validate a boolean exp
        //ex: a AND b OR --> wrong (1)
        //    AND a AND b --> wrong (2)
        //    a AND OR b --> wrong  (3) 
        //    a b AND c OR d --> wrong  (4) 
        //    every item is NOT is a Operator nor Expression --> wrong (5)

        //    a AND b OR c OR d --> Right
        isValidLogic: function (exp) {
            var len = exp.length;

            if (this.isOperator(exp[0].data) || this.isOperator(exp[len - 1].data)) { // (1) & (2)
                return false;
            }

            var i = 0;
            while (i < len - 1) {

                if (exp[i].data != ")" && exp[i].data != "(") {
                    if (!this.isOperator(exp[i].data) && !this.isBoolExp(exp[i].data)) { // (5)
                        return false;
                    }

                    if (this.isOperator(exp[i].data) && this.isOperator(exp[i + 1].data)) { // (3)
                        return false;
                    }


                    if (this.isBoolExp(exp[i].data) && this.isBoolExp(exp[i + 1].data)) { // (4)
                        return false;
                    }
                }
                i++;
            }

            if (exp[len - 1].data != ")" && exp[len - 1].data != "(") {
                if (!this.isOperator(exp[len - 1].data) && !this.isBoolExp(exp[len - 1].data)) { // (5)
                    return false;
                }
            }

            return true;
        },

        isOperator: function (opt) {
            var operator = ["AND", "OR", "XOR", "NOT"];
            return operator.indexOf(opt.toUpperCase()) > -1;
        },

        // exp's format: 1. V1 , 2. V1 ope V2
        isBoolExp: function (exp) {
            if (this.isOperator(exp)) {
                return false;
            }

            if (!_isCheckChild) {
                return true;
            }
            var ope = [">", "<", "=", ">=", "<="];
            var arr = exp.split(' ');

            if (!(arr.length == 1 || arr.length == 3)) { // check length
                return false;
            }
            if (arr.length == 1 && (this.isOperator(arr[0]) || !this.isValidCharacter(arr[0]))) {
                return false;
            }
            if (arr.length == 3) {
                if (!this.isValidCharacter(arr[0]) || !(ope.indexOf(arr[1]) > -1) || !this.isValidCharacter(arr[2])) {
                    return false;
                }
            }

            return true;
        },

        isValidCharacter: function (str) {
            var regExp = /^[a-zA-Z0-9\/]*$/
            if (!regExp.test(str)) {
                return false;
            }
            else {
                return true;
            }
        },

        detectError: function (nodes) {
            for (var k = 0; k < nodes.length; k++) {
                var i = 0;
                while (i < arrExp.length && arrExp[i].id != nodes[k].id) {
                    i++;
                }

                if (i < arrExp.length) {
                    arrExp[i].error = true;
                }
            }
        },

        injectFormat: function () {
            var result = "";

            for (var i = 0; i < arrExp.length; i++) {
                if (arrExp[i].error) {
                    result += " " + "<font color='red'>" + arrExp[i].data + "</font>";
                }
                else {
                    result += " " + arrExp[i].data;
                }
            }

            return result;
        },

        injectErrorMsg: function (errCode, errMsg) {
            //get distinct error
            var err = errCode.reduce(function (a, b) {
                if (a.indexOf(b) < 0) a.push(b);
                return a;
            }, []);

            var result = "";

            for (var i = 0; i < err.length; i++) {
                result += errMsg[err[i]] + " , ";
            }

            return result;
        },

        getResult: function (errCode, errMsg) {

            var result = this.injectErrorMsg(errCode, errMsg) + "," + this.injectFormat();

            arrExp = [];

            return result;
        }

    }
})();