var _imgex = ["bmp", ".tif", "gif", "webp", 'png', 'jpg', 'jpeg'];
const fileTypes = [ 
    'doc', 'docx',
    'gif', 'jpg', 'png', 'jpeg',
    'zip', 'rar',
    'xlsx', 'xls',
    'txt',
    'ppt', 'pptx',
    'pdf',
    'm4a', 'mp4',
    'mp3',
]
const iconFile = [
    'svg/docx-8.svg',
    'svg/jpg-44.svg',
    'svg/zip-72.svg',
    'svg/xls-19.svg',
    'svg/txt-1-2.svg',
    'svg/ppt-65.svg',
    'svg/pdf-94.svg',
    'svg/mp4-22.svg',
    'svg/mp3-43.svg'
]

var df_arrCauHinhPDF = {};
var df_classImgView;
var df_toastID = 0;

function getSrcFileIcon(type) {
    switch (type) {
        case 'doc': case 'docx':
            return iconFile[0]
        case 'gif': case'jpg': case'png': case'jpeg':
            return iconFile[1]
        
        case 'zip': case 'rar':
            return iconFile[2]
        
        case 'xlsx': case 'xls':
            return iconFile[3]
        
        case 'txt':
            return iconFile[4]
        
        case 'ppt': case 'pptx':
            return iconFile[5]
        
        case 'pdf':
            return iconFile[6]
        
        case 'm4a': case 'mp4':
            return iconFile[7]

        case 'mp3':
            return iconFile[8]
    }
}

var arrId = []

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    if (arrId.indexOf(result) < 0) {
        arrId.push(result)
        return result;
    }

    else {
        return makeid(length)
    }

}

function tranSTTtoString(now_cauhoi,
        dapan) {
    var arr_HoanViID = convertJson2Array(classttn.arr_HoanVi, 'HoanViID');
    var poshv = arr_HoanViID.indexOf(now_cauhoi.hoanvi);
    var arr_HoanVi_CH = [];
    if (poshv != -1) {
        for (var i = 0; i < 4; i++) {
            arr_HoanVi_CH.push(classttn.arr_HoanVi[poshv + i]);
        }
    }

    var arr_HoanViID_fill = convertJson2Array(arr_HoanVi_CH, 'STTDapAn');
    var pos1 = arr_HoanViID_fill.indexOf(dapan);
    if (pos1 != -1) {
        dapan = arr_HoanVi_CH[pos1]['STT'];
    }

    if (dapan == 0)
        dapan = 'A';
    else if (dapan == 1)
        dapan = 'B';
    else if (dapan == 2)
        dapan = 'C';
    else
        dapan = 'D';
    return dapan;
}

function formatTime(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours != 0) {
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+"g " + minutes + "p " + seconds + "s"
    };

    if (minutes != 0){
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes + "p " + seconds + "s"
    }
    return seconds + "s"
}

function callService(functionname, arg, BLL, callback_Action, callback_ActionError) {
    if (arg != null) {
        Service.call(function (result) {
            $('#loading').hide();
            if (result.Error != "" && result.Error != null) {
                showMsg("Thông báo lỗi", result.Error, 'OK', 'error', function () { return; });
                if (callback_ActionError)
                    callback_ActionError(result);
            }
            else {
                callback_Action(result);
            }
        }, BLL, functionname, arg);
    }
    else {
        Service.call(function (result) {
            $('#loading').hide();
            if (result.Error != "" && result.Error != null) {
                showMsg("Thông báo lỗi", result.Error, 'OK', 'error', function () { return; });
                if (callback_ActionError)
                    callback_ActionError(result);
            }
            else {
                callback_Action(result);
            }
        }, BLL, functionname);
    }
}

//Generate datatable
function generateDatable(arr_data) {
    var dtInfo = new DataTable('dtInfo');
    dtInfo.Columns.add("column1", "String");
    dtInfo.Columns.add("column2", "String");
    if (arr_data.length % 2 == 0) {
        for (var i = 0; i < arr_data.length; i += 2) {
            dtInfo.Rows.add(arr_data[i], arr_data[i + 1]);

        }
        return dtInfo;
    }
    else {
        console.log('Sai cấu trúc dữ liệu');
        return 'Error';
    }
}

function generateDatableCol(arr_data, numcol) {
    var dtInfo = new DataTable('dtInfo');
    if (numcol != null) {
        for (var i = 1; i <= numcol; i++) {
            dtInfo.Columns.add("column" + i, "String");
        }
    }
    if (arr_data.length % numcol == 0) {
        for (var i = 0; i < arr_data.length; i += numcol) {
            dtInfo.Rows.add(arr_data[i], arr_data[i + 1]);

        }
        return dtInfo;
    }
    else {
        console.log('Sai cấu trúc dữ liệu');
        return 'Error';
    }
}

//Check Number
function proIsNumber(num) {
    var pattern = /^[0-9]{1,}$/;
    if (num.match(pattern)) {
        return true;
    }
    else {
        return false;
    }
}

function convertJson2Array(dataj, fi) {
    var arr;
    if (fi)
        arr = Object.keys(dataj).map(function (k) { return dataj[k][fi] });
    else
        arr = Object.keys(dataj).map(function (k) { return k });
    return arr;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function sortClass(arr_Class) {
    var arr_Khoi = [];
    if (arr_Class.length > 0) {
        var pat_num = /^[0-9]{1}$/;
        for (var j = 0; j < arr_Class.length; j++) {
            var value = arr_Class[j];
            var khoi = '';
            for (var i = 0; i < value.length; i++) {
                if (!value[i].match(pat_num)) {
                    break;
                }
                else {
                    khoi = khoi.toString() + value[i].toString();
                }
            }
            arr_Khoi.push(khoi);
        }
        arr_Khoi.sort(function (a, b) {
            return a - b;
        });
        var arr_Khoi_temp = [];
        for (var i = 0; i < arr_Khoi.length; i++) {
            if (i == 0)
                arr_Khoi_temp.push(arr_Khoi[i]);
            else if (arr_Khoi_temp.indexOf(arr_Khoi[i]) == -1)
                arr_Khoi_temp.push(arr_Khoi[i]);
        }
        arr_Khoi = [];
        var arr_ChiSoLop_TheoKhoi = [];
        for (var i = 0; i < arr_Khoi_temp.length; i++) {
            var arr_TenDem_TheoKhoi = [];
            var dodaitenlop = arr_Khoi_temp[i].length;
            for (var j = 0; j < arr_Class.length; j++) {
                if (arr_Class[j].indexOf(arr_Khoi_temp[i]) == 0 && !arr_Class[j][dodaitenlop].match(pat_num)) {
                    var ten_temp = arr_Class[j];
                    var tendem_temp = '';
                    for (var m = 0; m < ten_temp.length; m++) {
                        if (!ten_temp[m].match(pat_num))
                            tendem_temp = tendem_temp + ten_temp[m];
                    }
                    arr_TenDem_TheoKhoi.push(tendem_temp);
                    if (arr_ChiSoLop_TheoKhoi[arr_Khoi_temp[i] + tendem_temp])
                        arr_ChiSoLop_TheoKhoi[arr_Khoi_temp[i] + tendem_temp].push(arr_Class[j].substring(arr_Khoi_temp[i].length + tendem_temp.length, arr_Class[j].length));
                    else
                        arr_ChiSoLop_TheoKhoi[arr_Khoi_temp[i] + tendem_temp] = [arr_Class[j].substring(arr_Khoi_temp[i].length + tendem_temp.length, arr_Class[j].length)];
                }
            }
            arr_TenDem_TheoKhoi.sort();
            for (var j = 0; j < arr_TenDem_TheoKhoi.length; j++) {
                arr_Khoi.push(arr_Khoi_temp[i].toString() + arr_TenDem_TheoKhoi[j]);
            }
        }
        arr_Khoi_temp = [];
        for (var i = 0; i < arr_Khoi.length; i++) {
            if (i == 0)
                arr_Khoi_temp.push(arr_Khoi[i]);
            else if (arr_Khoi_temp.indexOf(arr_Khoi[i]) == -1)
                arr_Khoi_temp.push(arr_Khoi[i]);
        }
        var id_khoi = 0;
        for (var i = 0; i < arr_Khoi_temp.length; i++) {
            arr_ChiSoLop_TheoKhoi[arr_Khoi_temp[i]].sort(function (a, b) {
                return a - b;
            });
            for (var j = 0; j < arr_ChiSoLop_TheoKhoi[arr_Khoi_temp[i]].length; j++) {
                arr_Khoi[id_khoi] = arr_Khoi[id_khoi].toString() + arr_ChiSoLop_TheoKhoi[arr_Khoi_temp[i]][j];
                id_khoi++;
            }
        }
    }
    return arr_Khoi;
}


var df_AlertEnum = {
    primary: "modal-body alert alert-primary",
    secondary: "modal-body alert alert-secondary",
    success: "amodal-body lert alert-success",
    danger: "modal-body alert alert-danger",
    warning: "modal-body alert alert-warning",
    info: "modal-body alert alert-info",
    light: "modal-body alert alert-light",
    dark: "modal-body alert alert-dark"
}
var df_RowState = {
    Added: 0,
    Edited: 1,
    Deleted: 2,
    Normal: 4
}

function df_ShowLoading(text = 'Vui lòng đợi trong giây lát.') {
    document.getElementById('loading').style.display = "flex"
    document.querySelector('#loading > div.loading-mess > p').textContent = text
}

function df_HideLoading() {
    document.getElementById('loading').style.display = "none"
}

function df_FlashControl(selector, Isflash) {
    console.log('df_FlashControl')
}

/**
 * Check object is underfined
 * @param {any} obj ; object willbe check
 */
function df_unde(obj) {
    return (typeof obj === 'undefined');
}

/**
 * Check object is underfined or null
 * @param {any} obj
 */
function df_unnu(obj) {
    return (typeof obj === 'undefined') || obj == null;
}

/**
 * Add new option to select
 * @param {any} cboID select ID 
 * @param {any} key if datas is undefine: it's [key option] else it's [columnname of key]
 * @param {any} value if datas is undefine: it's [content option] else it's [columnname of content]
 * @param {any} datas is Rows of datatable object
 */
function df_CboAItems(cboID, key, value, datas, allKey, allValue, IsCollection) {
    var cbo = $("#" + cboID);

    if (df_unde(datas)) {
        var o = new Option(value, key);
        $(o).html(value);
        cbo.append(o);
    }
    else {
        cbo.html("");
        if (!df_unde(allKey) && !df_unde(allValue)) {
            var o = new Option(allValue, allKey);
            $(o).html(allValue);
            cbo.append(o);
        }
        try {
            datas.forEach(x => {
                var o = new Option(x.getCell(value), x.getCell(key));
                $(o).html(x.getCell(value));
                cbo.append(o);
            })
        }
        catch {
            datas.forEach(x => {
                var o = new Option(x[value], x[key]);
                $(o).html(x[value]);
                cbo.append(o);
            })
        }
    }
}
// Restricts input for the given textbox to the given inputFilter.
function df_setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

function df_invalid(eID, text) {
    var input = document.getElementById(eID);
    input.oninvalid = function (event) {
        event.target.setCustomValidity(text);
    }
}

function df_EleID(id) {
    return document.getElementById(id);
}

function df_remove(items, item) {
    const index = items.indexOf(item);
    if (index > -1) {
        items.splice(index, 1);
    }
}

function df_insert(items, itemold, itemnew, isInsertTop = false) {
    const index = items.indexOf(itemold);
    if (index > -1) {
        if (isInsertTop)
            items.splice(index, 0, itemnew);
        else
            items.splice(index + 1, 0, itemnew);
    }
    else {
        items.push(itemnew);
    }
}

function df_SetStatus(lbID, Status, StatusClass) {
    if (Status == "")// clear
    {
        $("#" + lbID).removeClass();
        $("#" + lbID).html('');
    }
    else {
        $("#" + lbID).removeClass();
        var ms = moment().format('DD-MM-YYYY HH:mm:ss') + " : " + Status;
        $("#" + lbID).html(ms);
        $("#" + lbID).addClass(StatusClass);
    }
}

/**
 * get thay doi giua item source & rows
 * @param {any} rows_DR: rows từ datatable
 * @param {any} items_Arr: itemsource từ lưới
 * @param {any} ID_str: key: khóa chính của bảng map với lưới
 * @param {any} Col_Arr columns binding in grid or ...null: all column in table
 */
function df_ItemSourceChanged(rows_DR, items_Arr, ID_str, Col_Arr = null) {
    // danh sach row trong giao dich
    var EditList = [];
    if (Col_Arr == null) // search het
        if (rows_DR.length > 0) // lay dc table
        {
            Col_Arr = [];
            rows_DR[0].DataTable.Columns.forEach(x => {
                Col_Arr.push(x.Name);
            });
        }
    rows_DR.forEach(row => {
        let tontai = false;
        let ID = row.getCell(ID_str);
        for (var j = items_Arr.length - 1; j >= 0; j--) {
            var item = items_Arr[j];
            if (item[ID_str] == ID) {// dung & co thay doi
                tontai = true;
                if (item.RowState == df_RowState.Edited) {
                    item.RowState = df_RowState.Normal; // đổi trạng thái lại
                    var colName_change = [];
                    for (var i = 0; i < Col_Arr.length; i++) {
                        if (row.getCell(Col_Arr[i]) != item[Col_Arr[i]])// thay doi
                        {
                            var data_type;
                            rows_DR[0].DataTable.Columns.forEach(x => {
                                if (x.Name == Col_Arr[i])// trùng tên
                                    data_type = x.Type;
                            })
                            // YYYY-MM-DD: nếu value is DateTime
                            var val = item[Col_Arr[i]];
                            var sss;
                            if (data_type == "DateTime") {
                                if (df_IsDate(val)) {
                                    sss = df_DateTime_SQL(new Date(val));
                                }
                                else {
                                    var d = moment(val, "dd-MM-YYYY").toDate();
                                    sss = df_DateTime_SQL(d);
                                }
                            }
                            else if (data_type == "Boolean")
                                sss = val ? 1 : 0;
                            else
                                sss = val;
                            var change = { col: Col_Arr[i], dt_ty: data_type, value: sss };
                            colName_change.push(change); // thêm cột thay đổi
                        }
                    }
                    if (colName_change.length > 0) {
                        EditList.push({ Ty: 'U', row: row, item: item, col_change: colName_change });
                    }
                }
                break; // break foreach
            }
        }
        if (!tontai)// item da bi xoa
        {
            EditList.push({ Ty: 'D', row: row });
        }
    });
    items_Arr.forEach(item => {
        if (item[ID_str] <= 0 || item.RowState == df_RowState.Added) {// new
            EditList.push({ Ty: 'C', item: item });
        }
    })
    return EditList;
}
/**
 * "YYYY-MM-DD HH:mm:ss"
 * @param {any} d
 */
function df_DateTime_SQL(d) {
    return d.getFullYear() + "-" + df_addZero(d.getMonth() + 1) + "-" + df_addZero(d.getDate()) + " " + df_addZero(d.getHours()) + ":" + df_addZero(d.getMinutes()) + ":" + df_addZero(d.getSeconds());
}

function df_addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function df_DataTableSelect(dt, options, isrows) {
    if (df_unde(dt)) return dt;
    var dtrs = [];
    for (var i = 0; i < dt.Rows.length; i++) {
        var row = dt.Rows[i];
        var ispush = true;
        for (var j = 0; j < options.length; j++) {
            var option = options[j];
            if (option[2] == "<>" && row.getCell(option[0]) == option[1]) {
                ispush = false;
                break;
            }
            else if (row.getCell(option[0]) != option[1]) {
                ispush = false;
                break;
            }
        }
        if (ispush) {
            dtrs.push(row);
        }
    }
    if (isrows)
        return dtrs;
    var dt_clone = dt.clone();
    dt_clone.Rows = dtrs;
    return dt_clone;
}

function df_ViewFile(id, type, href) {
    if (type == 'ms')
        href = 'https://view.officeapps.live.com/op/embed.aspx?src=' + href;
    else
        href = 'https://docs.google.com/gview?url=' + href + '&embedded=true';

    console.log('chua xong')
}

function df_fgCheckboxHeader(col) {
    if (col.isFmat != undefined) {
        return; // 1 lần
    }
    var localGrid = col.grid;
    col.allowSorting = false;
    col.isFmat = true;
    localGrid.formatItem.addHandler(function (s, e) {
        if (s.columns[e.col] == col) {
            // count true values to initialize checkbox
            var cnt = 0;
            for (var i = 0; i < localGrid.rows.length; i++) {
                if (localGrid.getCellData(i, col.index) == true) cnt++;
            }
            if (e.panel.cellType == wijmo.grid.CellType.ColumnHeader) {
                e._cell.innerHTML = '<input type="checkbox"> ' + e._cell.innerHTML;
                var cb = e._cell.firstChild;
                cb.checked = cnt > 0;
                cb.indeterminate = cnt > 0 && cnt < localGrid.rows.length;

                // apply checkbox value to cells
                cb.addEventListener('click', function (e) {
                    localGrid.beginUpdate();
                    for (var i = 0; i < localGrid.rows.length; i++) {
                        localGrid.setCellData(i, col.index, cb.checked);
                    }
                    localGrid.endUpdate();
                });
            }
        }
    });
}

function df_LSToByteArray(LSLamBai) {
    if (LSLamBai == undefined) return [];
    var ls_sp = LSLamBai.split(';');
    var length = ls_sp.length * 5; // 5 byte
    var array = new Uint8Array(length);
    for (var i = 0; i < ls_sp.length; i++) {
        if (ls_sp[i] != "") {
            var item_sp = ls_sp[i].split(',');
            var time = parseInt(item_sp[0]);
            var bit0 = parseInt(time / 65025);
            var bit1 = parseInt((time % 65025) / 255);
            var bit2 = time % 255;
            var bit3 = parseInt(item_sp[1]);
            var bit4 = parseInt(item_sp[2]);
            array[i * 5] = bit0;
            array[i * 5 + 1] = bit1;
            array[i * 5 + 2] = bit2;
            array[i * 5 + 3] = bit3;
            array[i * 5 + 4] = bit4;
        }
    }
    return array;
}


function df_LSFromArray(arr, giovao, fmat, LichSuChoLamLai) {
    var LSs = [];
    if (LichSuChoLamLai != undefined) {
        var cholamlai_sp = LichSuChoLamLai.split(';');
        var nextStep = 0;
        for (var i = 0; i < cholamlai_sp.length; i++) {
            if (cholamlai_sp[i].length > 0) {
                var item_sp = cholamlai_sp[i].split('.');
                if (item_sp.length == 2) {
                    var count = parseInt(item_sp[1]);
                    df_LSFromArray_Ex(LSs, arr, nextStep, count, item_sp[0], 'HH:mm:ss DD/MM/yyyy');
                    nextStep = count;
                }
            }
        }
        // cái cuối là cái hiện tại
        df_LSFromArray_Ex(LSs, arr, nextStep, arr.length, giovao, fmat);
    }
    else {
        df_LSFromArray_Ex(LSs, arr, 0, arr.length, giovao, fmat);
    }
    return LSs;
}

function df_LSFromArray_Ex(LSs, arr, start, end, giovao, fmat) {
    for (var i = start / 5; i < end / 5; i++) {
        var thoigian = moment(giovao, fmat);
        var bit0 = arr[i * 5];
        var bit1 = arr[i * 5 + 1];
        var bit2 = arr[i * 5 + 2];
        var bit3 = arr[i * 5 + 3];
        var bit4 = arr[i * 5 + 4];
        var giay = bit0 * 65025 + bit1 * 255 + bit2;
        thoigian.add(giay, 'seconds');
        var item = { STT: i + 1, ThoiGian: thoigian.format('DD/MM/yyyy HH:mm:ss'), CauHoi: bit3, DapAn: 'ABCD'[bit4], giay: giay };
        LSs.push(item);
    }
}

function df_string2Bin(str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
}

function df_bin2String(array) {
    return String.fromCharCode.apply(String, array);
}

function StringToDOMEle(string) {
    const div = document.createElement('div')

    div.innerHTML = string;
    
    return div.firstElementChild;
}

function showMsg(title, msg, labelyes = null, type = "error", callback = function () { return; }) {

    const color = {
        'success': 'yellowgreen',
        'error': 'tomato',
        'war': 'orange',
        'info' : "#FFFFFF"   
    }

    var ele = StringToDOMEle(`
    <div class="toast">
        <div class="toast-top" style="background: ${color[type]}">
            <div class='toast-icon'>
                <ion-icon name="close-circle"></ion-icon>
            </div>

            <div class="toast-title">
                ${title}
            </div>

            <div class="toast-close">
                <button>
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
        </div>

        <div class="toast-body">
            <p>
                ${msg}
            </p>
            <div class="toast-button li">
                ${labelyes ? `<button>${labelyes}</button>` : ''}
            </div>
        </div>
    </div>`)

    console.log(ele)
    if (labelyes) {
        ele.querySelector("div.toast-button > button").addEventListener('click' , () => {
            callback()
            ele.remove()
        })
    }

    ele.querySelector('div.toast-close > button').addEventListener('click', () => {
        ele.style.transform = "translateX(120%)"
        callback()
        setTimeout(() => {
            ele.remove()
        }, 300)
    })

    document.getElementById('message').prepend(ele)

    
}

function showConfirm(title, msg, labelyes, labelno, okCallback, cancelCallback) {
    var ele = StringToDOMEle(`
    <div class="toast">
        <div class="toast-top">
            <div class='toast-icon'>
                <ion-icon name="cube"></ion-icon>
            </div>

            <div class="toast-title">
                ${title}
            </div>

            <div class="toast-close">
                <button>
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
        </div>

        <div class="toast-body">
            <p>
                ${msg}
            </p>

            <div class="toast-button">
                <div class="toast-button">

                    ${labelyes ? `<button>${labelyes}</button>` : ''}
                    
                    ${labelno ? `<button>${labelno}</button>` : ''}
                </div>
            </div>
        </div>
    </div>`)

    ele.querySelector('div.toast-close > button').addEventListener('click', () => {
        ele.style.transform = "translateX(120%)"
        setTimeout(() => {
            ele.remove()
        }, 300)
    })


    ele.querySelector("div.toast-body > div > div > button:nth-child(2)").addEventListener('click' , () => {
        ele.style.transform = "translateX(120%)"
        if (cancelCallback) cancelCallback()
        setTimeout(() => {
            ele.remove()
        }, 300)
    })

    ele.querySelector("div.toast-body > div > div > button:nth-child(1)").addEventListener('click' , () => {
        ele.style.transform = "translateX(120%)"
        if (okCallback) okCallback()
        setTimeout(() => {
            ele.remove()
        }, 300)
    })
    
    document.getElementById('message').prepend(ele)   
}

function viewEleViewFile(name , type , url) {
    switch (type) {
        case "doc" | 'docx' | "pptx" | 'pps' | 'xlsx' | 'xls':
            break;
    }
}

function getFileSize(url , ele)
{
    var fileSize = '';
    var http = new XMLHttpRequest();
    http.open('HEAD', url, true); // true = Asynchronous
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            if (this.status === 200) {
                fileSize = this.getResponseHeader('content-length');
                console.log('fileSize = ' + fileSize);
            }
        }
    };
    http.send();
    console.log('lấy size file', url )
    return ;
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function getAverageRGB(imgEl) {
    
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
        
    if (!context) {
        return defaultRGB;
    }
    
    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
    context.drawImage(imgEl, 0, 0);
    
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */alert('x');
        return defaultRGB;
    }
    
    length = data.data.length;
    
    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }
    
    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    
    return (rgb.r + rgb.g + rgb.b) / 3 ;
    
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}