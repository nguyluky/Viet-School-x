var ws;
var __inroom;
var __inited;
var __client_lost_counter = 0;
var __client_hienthongbao = false;

//var url = "wss://192.168.1.241:4985/vs";
var urls =
    [
        "wss://tracnghiem1.vietschool.vn:4989/vs",
        "wss://tracnghiem2.vietschool.vn:4989/vs",
        "wss://tracnghiem3.vietschool.vn:4989/vs",
        "wss://tracnghiem4.vietschool.vn:4989/vs"
    ]

function getRandomInt(max) {
    var n;
    for (var i = 0; i < 20; i++)
        n = Math.floor(Math.random() * max);
    return n;
}

//if (window.location.host == 'localhost:10382' || window.location.host == 'localhost:10383' || window.location.host == 'localhost:2605')
//    url = "wss://" + window.location.host + "/api/WS";
//else
//if (window.location.host == 'manghocsinh.vn')
//    url = "wss://" + window.location.host + "/api/WS";
//else
//url = "wss://tracnghiem.vietschool.vn/api/WS";


function connect(callback) {
    ws = new ProSocket({ urls: urls, token: null });
    ws.onopen = () => {
        __lastSocketOK = true;
        __showSocketOpened()
        callback();
        console.log("Socket was opened");
        if (__inroom)   
            Rejoin();
        __inited = true;
        WSGet.apply(null, __arg);
        __arg = undefined;
    };
    ws.onerror = function (evt) {
        console.log('Connect fail!');
        __client_lost_counter++;
    };
    ws.onclose = function () {
        __showSocketClosed();
        __lastSocketOK = false;
    };

    ws.registerOnMessageFunction(this, socketMessage);
}
function socketMessage(msg) {
    // console.log(msg)
}

var __arg;
function socketOpen() {
    // GetUserInfor();
    // GetListRoom(0);
    
}

function connectAutoParam() {
    __arg = arguments;
}

function ConvertFCL2ID(fullClassName) {
    if (fullClassName.indexOf("Elearning.Core.") >= 0) return 1001;
    else return -1;
}


function CheckResult(result, showDiv) {
    if (result.ErrorNumber == 0) { return true; }
    else {
        var errMess = result.ErrorMessage.replace("\\r\\n", "</br>");
        if (errMess == 'Timeout') {
            errMess = 'Yêu cầu quá thời gian thực thi, Vui lòng thao tác lại.';
            df_HideLoading();// đóng loading khi timeout
        }
        else {

        }
        const indexOfFirst = errMess.indexOf(':');
        errMess = errMess.substring(indexOfFirst + 1);
        console.error(errMess , 1)
        return false;
    }
}

var __lastSocketOK = false;
function WSGet() {
    if (arguments.length > 0) {
        if (!__inited)
            connectAutoParam.apply(null, arguments);
        else {
            if (ws.readyState == WebSocket.OPEN) {
                __lastSocketOK = true;
                var TNTokenID = Cookie["TNTokenID"];
                //var TNTokenID = ws.token;
                //WSGet(function (callback1, DLL, "SaveBaiHoc", SchoolID, BaiHocID, TenBaiHoc, NoiDungBaiHoc, KhoiID, MonID);   --Mine
                //ws.get(callback1, route, token, class, function, para1, para2, ...);      --Their
                var fixArguments = [arguments[0], ConvertFCL2ID(arguments[1]), TNTokenID, arguments[1], arguments[2]];
                for (var i = 3; i < arguments.length; i++)
                    fixArguments.push(arguments[i]);
                ws.get.apply(ws, fixArguments);
            }
            else {
                if (__lastSocketOK) {
                    __showSocketClosed();
                }
                __lastSocketOK = false;
            }
        }
    }
}

//callback, functionName, field1, value1, field2, value2, ...
function WSDBGet() {
    //console.log(arguments);
    if (arguments.length > 0) {
        if (!__inited)
            connectAutoParam.apply(null, arguments);
        else {
            if (ws.readyState == WebSocket.OPEN) {
                __lastSocketOK = true;
                var TNTokenID = Cookie["TNTokenID"];
                //var TNTokenID = ws.token;
                //WSGet(function (callback1, DLL, "SaveBaiHoc", SchoolID, BaiHocID, TenBaiHoc, NoiDungBaiHoc, KhoiID, MonID);   --Mine
                //ws.get(callback1, route, token, class, function, para1, para2, ...);      --Their
                var fixArguments = [arguments[0], 1001, TNTokenID, '', arguments[1]];
                var tb = new DataTable();
                tb.Columns.add('Field', 'String');
                tb.Columns.add('Value', 'String');
                for (var i = 2; i < arguments.length; i++)
                    tb.Rows.add(arguments[i], arguments[++i]);
                fixArguments.push(tb);
                ws.get.apply(ws, fixArguments);
            }
            else {
                if (__lastSocketOK) {
                    __showSocketClosed();
                }
                __lastSocketOK = false;
            }
        }
    }
}

var __bootbox;
function __showSocketClosed() {
    console.error('mất kết nối với máy chủ' , 1)
    document.querySelector('div.title-l > div').style.background = "#D5504D"
}

function __showSocketOpened() {
    document.querySelector('div.title-l > div').style.background = "#409972"
}

function Rejoin(callback) {
    WSGet(function (result) {

    }, "Elearning.Core.RoomManager", "RejoinRoom");
};

