
function HocTrucTuyen() {
    this.BaiHocGiaoVienID = null;
    this.BaiHocID;
    this.DLL_LearningRoom = "Elearning.Core.LearningRoom";
    this.DLL_Login = "Elearning.Core.Login";
    this.DLL_File = "Elearning.Core.FileManager";
    this.arr_Data_Online = [];
    this.arr_Lop_Online = [];
    this.arr_HS_Online = [];
    this.arr_Data_Chat = [];
    this.arr_Data_BaiHoc = {};
    this.arr_BHHS = [];
    this.arr_LockComment = [];
    this.DsLop_ThanhVien = [];
    this.LopID_ThanhVien_Act = null;
    this.tabActive = 0;
    this.arrCauHinhPDF = {};
    this.dtsCauHoi;
    this.dgvBaiHoc_CauHoi = null;
    this.MappingID2Char = ['A', 'B', 'C', 'D'];
    this.isKiemTra = false;
    this.lockBaiHoc = false;
    this.lockKiemTra = false;
    this.pageChat = 0;
    this.IsLoadLive = false;
    this.IsLoadChat = false;
    this.BaiHocLopID = null;
    this.LoaiPhongHoc = 0;
    this.LinkHopTrucTuyen = null;
    this.editortuluanid = '#editor-bailam-tuluan' + Math.random().toString().substring(2);
    this.StoreMode = "0"; //0: bài học mới, 1: Bài học cũ
    this.ChoHSChamDiem = false;
    this.CountCheckGioClient = 0;
    this.GioClient_LucLayCauHoi;
    this.GS_BaiHocHSIDs = [];
    this.GS_BatGiamSat = false;
    this.GS_BatGiamSatWeb = false;
    this.GS_DSHSs = [];
    this.GS_Mode = 1;
    this.GS_Timmer;
    this.GS_LanCuoiCapNhat;
    this.GS_TreeView;
    this.Log_SoGiayBatDau = 0;
    this.fgViPham1HS;
    this.GS_BaiHocHSID_ChiTiet;
    this.GS_HocSinhID_ChiTiet;
    this.LopID;
    this.GS_HocSinhCamera = [];
    this.classGiamSatWeb;
    this.rootContent = null;
    this.rootChat = null;
    this.rootSlideBar = null
    this.rootChatTop = null
    // this.isOpenListCauHoi = false
    this.slideBarTab = 0
    this.isLoadBaiTap = false;
    this.isSideBar = true
    this.isOnTap = false
    this.isLoadThanhVien = false
    this.LopID = null
    this.tabFileData = []
    this.rootMessBody = null

    this.sliderBarView = [
        {
            type: "radio",
            on: () => this.tabActive == 0,
            nameIcon: "book-outline",
            title: "Lý thuyết",
            onClick: function() {
                classhtt.tabActive = 0; 
                classhtt.handlSideBar.baiHoc()
            }
        },

        {
            type:"radio",
            on: () => this.tabActive == 1,
            nameIcon:"videocam-outline",
            title:"Live",
            onClick: function() {
                classhtt.tabActive = 1
            }
        },
    ]

    this.slideBarTabTemplay = [
        {
            title: 'Thành viên',
            iconName: 'people',
            onClick: () => {
                this.slideBarTab = 0
                this.updataRootChatTop(React.createElement(ChatSlideHeader , {data: classhtt.slideBarTabTemplay}))
                
                if (!this.isLoadThanhVien) {
                    this.slideBarShowLoading()
                    this.getThanhVien(() => {
                        var cou = this.arr_Lop_Online.length
                        this.arr_Lop_Online.forEach(e => {
                            console.log(e)
                            this.getHocSinhOnline(e , () => {
                                cou = cou - 1
                                if (cou == 0) {
                                    this.isLoadThanhVien = true
                                    console.log("get hoc sinh do")
                                    this.updateRootChat(React.createElement(ListHocSinh , {data: this.DsLop_ThanhVien}))
                                }
                            })
                        })
                    })
                }
                else {
                    this.updateRootChat(React.createElement(ListHocSinh , {data: this.DsLop_ThanhVien}))
                }
            }
        },
        {
            title: 'chat',
            iconName: 'chatbox',
            onClick: () => {
                this.slideBarTab = 1
                this.updataRootChatTop(React.createElement(ChatSlideHeader , {data: classhtt.slideBarTabTemplay}))
                if (!this.IsLoadChat) {
                    console.log('get thảo luận')
                    this.getThaoLuan(() => {
                        this.updateRootChat(React.createElement(ChatPage , {data: this.arr_Data_Chat}))
                        setTimeout(() => {
                            document.getElementById('chat-mess-body').scrollBy({
                                top: document.querySelector('#chat-mess-body > div').scrollHeight,
                                behavior: 'smooth'
                            })
                        } , 100)
                    })
                }
                else {
                    this.updateRootChat(React.createElement(ChatPage , {data: this.arr_Data_Chat}))
                    setTimeout(() => {
                        document.getElementById('chat-mess-body').scrollBy({
                            top: document.querySelector('#chat-mess-body > div').scrollHeight,
                            behavior: 'smooth'
                        })
                    } , 100)
                }
            }
        }
    ]

    this.handlSideBar = {
        isSideBar: () => this.isSideBar,

        out: () => {
            this.rootChat = null
            this.rootContent = null
            this.arr_Data = []

            classttn.resetFieldTracNghiem()
            clearInterval(_Ttn_Timer);

            var arrTitle = convertJson2Array(this.slideBarTabTemplay, 'title');
            var index = arrTitle.indexOf('Câu hỏi')
            if (index != -1) {
                this.slideBarTabTemplay.splice(index, 1)
                this.slideBarTab = 0
            }

            this.outRoom()
        },

        baiHoc: () => {
            var arrTitle = convertJson2Array(this.slideBarTabTemplay, 'title');
            var index = arrTitle.indexOf('Câu hỏi')
            if (index != -1) {
                this.slideBarTabTemplay.splice(index, 1)
                document.querySelector('#side-bar > div.chat-top > div:nth-child(1)').click()
            }
            this.updataRootChatTop(React.createElement(ChatSlideHeader , {data: classhtt.slideBarTabTemplay}))
            document.querySelector('div.phonghoc-chat-conter > div.phonghoc-content > div.phonghoc-content-top > div').style.display = 'none'
            // document.removeEventListener("keydown" , classttn.keyDowEvent)
            clearInterval(_Ttn_Timer);
            document.querySelector(".phonghoc-content-top").classList.remove('baitap')
            document.querySelector('#side-bar div.chat-top').classList.remove('baitap')
            this.updateRootContent(React.createElement(BaiHoc))
            setTimeout(() => {
                this.setContent(this.arr_Data_BaiHoc.NoiDungBaiHoc)
            }, 10)

        },

        baiTap: () => {
            var index = this.slideBarTabTemplay.length
            if (this.tabActive != 2)

                index = this.slideBarTabTemplay.push(
                    {
                        title: 'Câu hỏi',
                        iconName: 'checkbox',
                        onClick: () => {
                            this.slideBarTab = 2
                            this.updataRootChatTop(React.createElement(ChatSlideHeader , {data: classhtt.slideBarTabTemplay}))
                            var templayArrBaiLam = classttn.arr_Data.map((e , index) => {
                                var cau = classttn.arr_Bailam.filter(j => j.cau == index + 1)
                                var dapAn = null
                                var xemLai = 0
                                if (cau.length == 1) {
                                    dapAn = cau[0].dapan
                                    xemLai = cau[0].xemlai
                                }
                                var item = {
                                    "cau": index + 1,
                                    "dapan": dapAn,
                                    "xemlai": xemLai,
                                }
                                return item
                            })
                            this.updateRootChat(React.createElement(ListViewCauHoi , {data: templayArrBaiLam}))
                        }
                    }
                )
            this.slideBarTabTemplay[index - 1].onClick()
            this.updataRootChatTop(React.createElement(ChatSlideHeader , {data: this.slideBarTabTemplay}))
            this.updateRootContent(React.createElement(BaiTap, {
                classttn: classttn
            }))


            document.querySelector('div.phonghoc-chat-conter > div.phonghoc-content > div.phonghoc-content-top > div').style.display = 'block'
            // classttn.readerCauhoi()
            console.log("no dow")
            setTimeout(() => {
                if (!classttn.isNopBai)
                    _Ttn_Timer = setInterval(function () {
                        this.second_Bailam++;
                        var ThoiGianLamBai_Client = parseInt((new Date() - this.GioBatDauLamBai_Client) / 1000); // giay
                        this.second_Bailam_TruocDongBo = this.second_Bailam;

                        if (this.second_Bailam >= this.limit_minute * 60) {/*classhtt.isKiemTra && */
                            this.isConThoiGianLamBai = false;
                            clearInterval(_Ttn_Timer);
                            console.log("time end")
                        }

                        this.isConThoiGianLamBai = true;
                        var thoigianconlai = this.limit_minute * 60 - this.second_Bailam;
                        var str = formatTime(Math.floor(thoigianconlai))
                        // console.log(str)
                        document.getElementById('bottom-timer').textContent = str;
                    }.bind(classttn), 1000)
                classttn.readerCauhoi()
            }, 50)

            document.querySelector(".phonghoc-content-top").classList.add('baitap')
            document.querySelector('#side-bar div.chat-top').classList.add('baitap')
        },

        chatOnOff: (on) => {
            this.isSideBar = !on;
            const ele = document.getElementById('side-bar')
            if (!on) {
                ele.querySelector('#slideBarContent').style.display = 'block'
                ele.querySelector('.chat-bottom').style.display = 'flex'
                ele.classList.remove('off');
                ele.style = {}
            }

            else {
                ele.classList.add('off');
                ele.style.width = "0px"
                ele.style.margin = "0"
                ele.style.opacity = "0";

                setTimeout(() => {
                    ele.querySelector('#slideBarContent').style.display = 'none'
                    ele.querySelector('.chat-bottom').style.display = 'none'
                }, 200)
            }
        }
    }

    this.getThaoLuan = function(callback) {
        // this.slideBarShowLoading()
        WSGet(function (result) {
            if (CheckResult(result)) {
                console.log(result)
                if (result.Data.getTable('LockComment'))
                    this.arr_LockComment = result.Data.getTable('LockComment').toJson();
                if (result.Data.getTable('Comment'))
                    this.arr_Data_Chat = result.Data.getTable('Comment').toJson();
                // this.generateDockChat();
                this.IsLoadChat = true;
                if (callback) callback()
            }
        }.bind(this), this.DLL_LearningRoom, 'ElearningInitThaoLuan', this.BaiHocGiaoVienID, this.StoreMode);
    }

    this.getThanhVien = function(callback) {
        WSGet(function (result) {
            if (CheckResult(result)) {
                // this.dtThanhVien_Lop = result.Data.Tables[0];
                this.arr_Lop_Online = result.Data.Tables[0].toJson();
                console.log('get thanh vien')

                if (callback) 
                    callback()
                // this.generateDockOnline('LOP', 'div-online-content');
                // this.generateDockOnline('LOP', 'div-online-content-desk');
            }
        }.bind(this), this.DLL_LearningRoom, 'ElearningInitThanhVien', this.BaiHocGiaoVienID.toString(), this.LopID.toString(), this.StoreMode);
    }

    this.getHocSinhOnline = function(lopid, callback) {
        WSGet(function (rs) {
            df_HideLoading();
            if (CheckResult(rs)) {
                if (rs.Data.getTable('Online'))
                    this.DsLop_ThanhVien[lopid.LopID] = rs.Data.getTable('Online').toJson();

                if (callback) 
                    callback()
            }
        }.bind(this), this.DLL_LearningRoom, 'ElearningGetOnline', this.BaiHocGiaoVienID, lopid.LopID.toString(), this.StoreMode);
    }

    this.getBaiHoc = function(callback) {
        WSGet(function (result) {

            if (result.ErrorNumber != 0) {
                showMsg('Phòng học', result.ErrorMessage , '' , 'error' , () => {
                    classhtt.outRoom()
                    df_HideLoading()
                })
                return ;
            }

            if (result.Data.getTable('GioHienHanh')) {

                let arrGio = result.Data.getTable('GioHienHanh').toJson();
                this.GioHienHanh = arrGio[0].GioHienHanh.replace(" ", "T");
                this.GioHienHanhClient = new Date();
                if (result.Data.getTable('BaiHoc'))
                    this.arr_Data_BaiHoc = result.Data.getTable('BaiHoc').toJson();

                if (this.arr_Data_BaiHoc.length > 0) {
                    this.arr_Data_BaiHoc = this.arr_Data_BaiHoc[0];

                    if (this.arr_Data_BaiHoc['LaKiemTra'])
                        this.isKiemTra = true;
                    if (this.arr_Data_BaiHoc['ChoCameraGiamSat'])
                        this.GS_BatGiamSat = true;
                    if (this.arr_Data_BaiHoc['ChoWebGiamSat'])
                        this.GS_BatGiamSatWeb = true;
                    if (this.arr_Data_BaiHoc['TGKT']) // TGKT not null
                    {
                        if (this.arr_Data_BaiHoc.ChoHienBaiGiai)
                            this.isBaiGiai = true;

                        this.BaiHocID = this.arr_Data_BaiHoc['BaiHocID'].toString();
                        this.lockBaiHoc = this.arr_Data_BaiHoc['KhongHienBaiHoc'];
                        this.lockKiemTra = this.arr_Data_BaiHoc['KhongHienBaiTap'];
                        if (!this.lockBaiHoc && !this.isKiemTra) {
                            
                            this.arr_Data_BaiHoc['NoiDungBaiHoc'] = this.formatNoiDungBaiHoc(this.arr_Data_BaiHoc['NoiDungBaiHoc'])
                            this.setContent(this.arr_Data_BaiHoc['NoiDungBaiHoc']);
                            this.ChoHSChamDiem = this.arr_Data_BaiHoc["ChoHSChamDiem"];
                        }
                    }
                }

            }

            else {
                showMsg("Phòng hoc" , 'không thể lấy bài học')
                console.log('lỗi lấy bài học')
            }

            if (callback) callback()
        }.bind(this), this.DLL_LearningRoom, 'ElearningInit', this.BaiHocGiaoVienID, this.StoreMode)
    }

    this.getBaiTap = function(callback) {
        WSGet(function (result) {
            try {
                if (CheckResult(result)) {
                    let arrGio = result.Data.getTable('GioHienHanh').toJson();
                    this.GioHienHanh = arrGio[0].GioHienHanh.replace(" ", "T");
                    this.GioHienHanhClient = new Date();
                    if (result.Data.getTable('HoanVi'))
                        classttn.arr_HoanVi = result.Data.getTable('HoanVi').toJson();
                    if (classttn.arr_HoanVi == undefined || classttn.arr_HoanVi.length == 0) {
                        classttn.errorChangeCauHoi = 'Không tải được bảng hoán vị, vui lòng liên hệ giáo viên dạy bạn.';
                        showMsg('Thông báo lỗi', classttn.errorChangeCauHoi);
                        return false;
                    }
                    if (result.Data.getTable('DoanVan'))
                        classttn.arr_DoanVan = result.Data.getTable('DoanVan').toJson();
                    var arr_DapAn = [];
                    if (result.Data.getTable('DapAn'))
                        arr_DapAn = result.Data.getTable('DapAn').toJson();
                    var arr_DapAn_CauHoiID = convertJson2Array(arr_DapAn, 'CauHoiID');
                    if (result.Data.getTable('CauHoi')) {
                        var arr_Cauhoi_temp = result.Data.getTable('CauHoi').toJson();
                        var arr_Cauhoi = [];
                        if (arr_Cauhoi_temp.length > 0) {
                            for (var ch = 0; ch < arr_Cauhoi_temp.length; ch++) {
                                var value = arr_Cauhoi_temp[ch];

                                var item = {};
                                item.SoDapAn = value.SoDapAn;
                                item['cauhoiid'] = value.CauHoiID;
                                item['cauhoi'] = value.NoiDungCauHoi;
                                item['doanvan'] = value.DoanVanID;
                                item['dapan'] = [];
                                item['tracnghiem'] = value.TracNghiem;
                                if (value.TracNghiem) {
                                    var pos = arr_DapAn_CauHoiID.indexOf(item['cauhoiid']);
                                    if (pos == -1) {
                                        arr_Cauhoi = [];
                                        classttn.errorChangeCauHoi = 'Giáo viên đã thay đổi dữ liệu câu hỏi. Vui lòng liên hệ giáo viên để làm mới bài tập! Nội dung câu hỏi có thay đổi: ' + item['cauhoi'];
                                        showMsg('Thông báo lỗi', classttn.errorChangeCauHoi);
                                        return false;
                                    }
                                    var arr_HoanViID = convertJson2Array(classttn.arr_HoanVi, 'HoanViID');
                                    var poshv = arr_HoanViID.indexOf(value.HoanViID);
                                    var arr_HoanVi_CH = [];
                                    if (poshv != -1) {
                                        for (var i = 0; i < 4; i++) {
                                            arr_HoanVi_CH.push(classttn.arr_HoanVi[poshv + i]);
                                        }
                                    }
                                    var arr_DapAn_Temp = [];
                                    for (var i = pos; i < pos + item.SoDapAn; i++) {
                                        if (arr_DapAn_CauHoiID[i] == item['cauhoiid'])
                                            arr_DapAn_Temp.push(arr_DapAn[i]);
                                    }

                                    if (arr_HoanVi_CH.length >= item.SoDapAn && arr_DapAn_Temp.length == item.SoDapAn) {
                                        for (var j = 0; j < arr_HoanVi_CH.length; j++) {
                                            for (var i = 0; i < arr_DapAn_Temp.length; i++) {
                                                if (arr_DapAn_Temp[i].STTDapAn == arr_HoanVi_CH[j].STTDapAn) {
                                                    item['dapan'].push({ 'stt': j, 'noidung': arr_DapAn_Temp[i].NoiDung });
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        classttn.errorChangeCauHoi = 'HTT: Câu hỏi không đủ số lượng đáp án, vui lòng liên hệ giáo viên để kiểm tra lại. Nội dung câu hỏi:' + item['cauhoi'];
                                        showMsg('Thông báo lỗi', classttn.errorChangeCauHoi);
                                        return false;
                                    }
                                }
                                item['hoanvi'] = value.HoanViID;
                                arr_Cauhoi.push(item);
                            }
                        }
                        classttn.arr_Data = arr_Cauhoi;

                    }
                    if (result.Data.getTable('BaiLam')) {
                        classttn.arr_Bailam = result.Data.getTable('BaiLam').toJson();
                    }
                    if (result.Data.getTable('BHHS')) {
                        var BHHS = result.Data.getTable('BHHS');
                        if (BHHS) {
                            var datas = BHHS.toJson();
                            if (datas.length > 0) {
                                classhtt.arr_BHHS = datas[0];
                                classttn.GioHienHanh = classhtt.arr_BHHS['GioHienHanh'].replace(" ", "T");
                            }
                        }
                        else
                            classhtt.arr_BHHS = [];
                        // không có BHHS
                    }
                    if (classhtt.arr_Data_BaiHoc['TGKT'] == undefined) {
                        showMsg('Thông báo lỗi', "Không thể lấy được thời gian kết thúc bài học, Hãy vào phòng lại hoặc làm tươi (F5) trang web.", 'OK', 'error', function () { return; });
                    }
                    else {
                        classhtt.tinhThoiGianLamBai();
                        if (callback)
                            callback(result);
                    }


                }
                else {
                    if (!classhtt.isGV) {
                        if (result.ErrorMessage == "ElearningInitCauHoi_Upgade : Bài này không có bài tập.") {
                            classttn.arr_Data = [];
                            if (callback)
                                callback(result);
                        }
                        else {
                            // window.location.href = '/#/HocSinhChonPhong/' + classhtt.LoaiPhongHoc;
                            // loadpage('#/HocSinhChonPhong/' + classhtt.LoaiPhongHoc);
                            // clearInterval(_Htt_Timer);
                            clearInterval(_Ttn_Timer);
                        }
                    }
                }

                callback(false);

            }
            catch (error) {
                showMsg('Thông báo lỗi', error, 'OK', 'error', function () { return; });
            }
        }.bind(this), classhtt.DLL_LearningRoom, 'ElearningInitCauHoi_Upgade', classhtt.BaiHocGiaoVienID, classhtt.BaiHocLopID, this.StoreMode);
    }

    this.formatNoiDungBaiHoc = function(str) {

        str = str.replaceAll('src="//' , 'src="https://')    
        var ele = document.createElement('div')
        ele.innerHTML = str
        var allAEle = ele.querySelectorAll('a')
        // console.log(allAEle)

        allAEle.forEach(e => {
            const fullNameFile = e.textContent
            const type = fullNameFile.substring(fullNameFile.lastIndexOf(".") + 1 , fullNameFile.length).toLowerCase()
            if (fileTypes.includes(type.toLowerCase()) && e.href.indexOf('https://file.vietschool.vn/') >= 0) {
                const name = fullNameFile.substring(0 , fullNameFile.lastIndexOf("."))

                // console.log('make view file' , type)

                const id = e.href.substring(e.href.lastIndexOf('/') + 1 , e.href.length)
                

                var divFileView = document.createElement('div')
                divFileView.className = `file-view file${id}`
                divFileView.title = fullNameFile;
                var iconSrc = getSrcFileIcon(type)

                divFileView.innerHTML = `
                <div class="file-icon-body">
                    <div class="file-icon">
                        <ion-icon src="${iconSrc}"></ion-icon>
                    </div>
                
                    <div class="file-body">
                        <div class="file-fullname">
                            <p class="file-name">${name}</p>
                            <p class="file-type">.${type}</p>
                        </div>
                
                        <div class="file-size">20kb</div>
                    </div>
                </div>
                
                <div class="file-dow">
                        <button class="file-button" title="Download">
                            <ion-icon src="./svg/download-347.svg"></ion-icon>
                        </button>
                </div>

                <div class="load">
                    <div></div>
                </div>
                `

                divFileView.querySelector('.file-button').onclick = function() {
                    App.showOpenDialog().then(path => {
                        if (path) {
                            App.downloadFile( {
                                id : id,
                                info: {
                                    url: e.href,
                                    properties: {directory: path}
                                }
                            })
                        }
                    })
                }

                divFileView.querySelector('.file-icon-body').onclick = () => {
                    console.log(e.href)
                    this.renderFileView(e.href , iconSrc , name)
                }

                const parent = e.parentNode;
                parent.removeChild(e)
                parent.appendChild(divFileView)
            }

            else {
                var newTagA = document.createElement('div')
                newTagA.className="div_tag_a"
                newTagA.textContent = e.textContent
                newTagA.onclick = () => {
                    App.openLink(e.href)
                }
                const parent = $(e).closest( "p" )[0];
                console.log(parent)
                if (parent) {
                    parent.innerHTML = ''
                    parent.appendChild(newTagA)
                }
            }
        })

        var allImgEle = ele.querySelectorAll("img")
        allImgEle.forEach(e => {
            var url = e.src
            var newImg = document.createElement('img')
            newImg.src = url
            newImg.className = "imgView"
            var Average = getAverageRGB(newImg)
            if (Average < 10 ) {
                newImg.style.transform = "invert(1)";
            }
            var patder = e.parentElement
            e.remove()
            patder.appendChild(newImg)
        })
        return ele;
    }

    this.updateFileDow = function(id, status) {
        console.log(id , status)
    }

    this.fileDowShow = function() {
        document.querySelector('div.file-view > div.load').style.display = "block"
    }

    this.updataRootChatTop = function(ele) {
        if (!this.rootChatTop)
            this.rootChatTop = ReactDOM.createRoot(document.querySelector('#side-bar > div.chat-top'))

        this.rootChatTop.render(ele)
    }

    this.updateRootContent = function(ele) {
        if (!classhtt.rootContent) {
            classhtt.rootContent = ReactDOM.createRoot(document.getElementById('content'))
        }

        classhtt.rootContent.render(ele)
    }

    this.updateRootSideBar = function(ele) {
        if (!this.rootSlideBar) {
            this.rootSlideBar = ReactDOM.createRoot(document.getElementById('slidebar'))
        }

        this.rootSlideBar.render(ele)
    }

    this.updateRootChat = function(ele) {
        if (!this.rootChat) 
            this.rootChat = ReactDOM.createRoot(document.getElementById('slideBarContent'))

        this.rootChat.render(ele)
    }

    this.renderFileView = function(url , iconSrc , name) {
        var id = url.substring(url.lastIndexOf('/') + 1 , url.length)
        var file = this.tabFileData.filter(e => e.id = id)
        if (file.length == 0) {
            var item = {
                id: id,
                url: url,
                name: name,
                iconSrc: iconSrc,
                index: this.sliderBarView.length
            }
            const index = this.sliderBarView.length
            classhtt.tabActive = index

            var tabFile = {
                type:"radio",
                on: () => this.tabActive == index,
                srcIcon: iconSrc,
                onClick: function() {
                    classhtt.tabActive = index;
                    classhtt.renderFileView(url, iconSrc ,name )
                }
            }
        
            this.tabFileData.push(item)
            this.sliderBarView.push(tabFile)
            this.updateRootSideBar(React.createElement(SideBar , {data: this.sliderBarView}))
            this.updateRootContent(React.createElement(ViewFile , {url : `https://view.officeapps.live.com/op/embed.aspx?src=${url}`}))
        }
        else {
            this.tabActive = file[0].index
            document.querySelectorAll('div.action-top > div.action-button.radio')[this.tabActive].click()
            this.updateRootSideBar(React.createElement(SideBar , {data: this.sliderBarView}))
            this.updateRootContent(React.createElement(ViewFile , {url : `https://view.officeapps.live.com/op/embed.aspx?src=${url}`}))
        }

    }

    this.setContent = (data) => {
        var count = document.getElementById("noidungbaihoc").innerHTML = ''
        document.getElementById("noidungbaihoc").appendChild(data)
        document.getElementById("noidungbaihoc")

    }

    this.send = function(str)  {
        if (!str) {
            str = document.querySelector('#slideBarContent > div > div.chat-input > span').innerText
            document.querySelector('#slideBarContent > div > div.chat-input > span').textContent = ''
            console.log(str)
        }
        var jsonBroadcast = this.generateJsonBroadcast('comment_add', { 'ID': User.HocSinhID, 'msg': str }, User.FullName, "HS");
        WSGet(function (result) {
            if (CheckResult(result)) {
                
        
                const nowTime = new Date;
                var item = {
                    "CommentID": null,
                    "Comment": str,
                    "HocSinhID": User.HocSinhID,
                    "ThoiGianTao": `${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()} ${nowTime.getDate()}/${nowTime.getMonth()}/${nowTime.getFullYear()}`,
                    "BaiHocGiaoVienID": null,
                    "HoTen": User.FullName,
                    "ThoiGianChat": `${nowTime.getHours()}:${nowTime.getMinutes()}`
                }
        
                this.arr_Data_Chat.push(item)
                if (this.slideBarTab == 1)
                    this.updateRootChat(React.createElement(ChatPage , {data: this.arr_Data_Chat}))
                    setTimeout(() => {
                        document.getElementById('chat-mess-body').scrollBy({
                            top: document.querySelector('#chat-mess-body > div').scrollHeight,
                            behavior: 'smooth'
                        })
                    } , 100)
            }
        }.bind(this), this.DLL_LearningRoom, 'ElearningSaveComment', this.BaiHocGiaoVienID, str, jsonBroadcast);
    }

    this.generateJsonBroadcast = function(command, para, from, usertype) {
        var jsonBroadcast = {};
        jsonBroadcast['Command'] = command;
        jsonBroadcast['Para'] = para
        jsonBroadcast['From'] = from;
        jsonBroadcast['UserType'] = usertype;
        jsonBroadcast = JSON.stringify(jsonBroadcast);
        return jsonBroadcast;
    }

    this.outRoom = () => {
        this.rootContent = null
        this.rootChat = null
        this.rootSlideBar = null
        this.rootChatTop = null
        
        this.isLoadBaiTap = false;
        this.isOnTap = false
        this.isLoadThanhVien = false

        this.sliderBarView = [
            {
                type: "radio",
                on: () => this.tabActive == 0,
                nameIcon: "book-outline",
                title: "Lý thuyết",
                onClick: function() {
                    classhtt.tabActive = 0; 
                    classhtt.handlSideBar.baiHoc()
                }
            },
    
            {
                type:"radio",
                on: () => this.tabActive == 1,
                nameIcon:"videocam-outline",
                title:"Live",
                onClick: function() {
                    classhtt.tabActive = 1
                }
            },
        ]

        df_ShowLoading()

        WSGet(function () {
            df_HideLoading()
            console.log('out room')
            classhscp.renderInit()
        }.bind(this), "Elearning.Core.RoomManager", "OutRoom", this.BaiHocGiaoVienID.toString())
    }

    this.renderInit = () => {
        checkloggin()
        Root.render(React.createElement(PhongHoc, {classhtt: this}))
    }

    this.joinRoomIfYes = (callback) => {
        WSGet(function (rs1) {
            console.log(rs1)
            if (callback)
                callback()
        }.bind(this),
            this.DLL_LearningRoom,
            'ElearningCheckRoom', this.BaiHocGiaoVienID.toString(),
            (df_unnu(this.BaiHocLopID) ? "" : this.BaiHocLopID.toString()),
            (this.isKiemTra ? "1" : "0"),
            this.StoreMode,
            df_DateTime_SQL(new Date))
    }

    this.socketMessage = (ms) => {
        try {
            const data = JSON.parse(ms)
            console.log(data)

            switch (data.Command) {
                case "comment_add":
                    const nowTime = new Date();
                    var item = {
                        "CommentID": null,
                        "Comment": data.Para.msg,
                        "HocSinhID": data.Para.ID,
                        "ThoiGianTao": `${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()} ${nowTime.getDate()}/${nowTime.getMonth()}/${nowTime.getFullYear()}`,
                        "BaiHocGiaoVienID": null,
                        "HoTen": data.From,
                        "ThoiGianChat": `${nowTime.getHours()}:${nowTime.getMinutes()}`
                    }

                    this.arr_Data_Chat.push(item)
                    if (this.slideBarTab == 1)
                        this.updateRootChat(React.createElement(ChatPage , {data: this.arr_Data_Chat}))
                        setTimeout(() => {
                            document.getElementById('chat-mess-body').scrollBy({
                                top: document.querySelector('#chat-mess-body > div').scrollHeight,
                                behavior: 'smooth'
                            })
                        } , 100)
                    break;
                
                case "room_join":
                    var para = JSON.parse(data.Para)
                    var fromId = para.HocSinhID
                    var classID = para.LopID

                    this.DsLop_ThanhVien[classID].forEach(e => {
                        if (e.HocSinhID == fromId) {
                            console.log(data.From, 'đã vào phòng')
                            e.Online = 1
                        }
                    })
                    if (this.slideBarTab == 0)
                        this.updateRootChat(React.createElement(ListHocSinh , {data: this.DsLop_ThanhVien}))
                    break;
                case "room_out":
                    var para = JSON.parse(data.Para)
                    var fromId = para.HocSinhID
                    var classID = para.LopID

                    this.DsLop_ThanhVien[classID].forEach(e => {
                        if (e.HocSinhID == fromId) {
                            console.log(data.From, 'đã ra khỏi phòng')
                            e.Online = 0
                        }
                    })
                    if (this.slideBarTab == 0)
                        this.updateRootChat(React.createElement(ListHocSinh , {data: this.DsLop_ThanhVien}))
                    break;
            }
        }
        catch (e) {

        }
    }

    this.joinRoom = (data) => {
        df_ShowLoading('đang tải dữ liệu')
        this.BaiHocGiaoVienID = data.BaiHocGiaoVienID.toString();
        this.BaiHocLopID = data.BaiHocLopID.toString();
        this.LoaiPhongHoc = data.TrangThaiID;
        this.arr_Data_BaiHoc = data
        this.LopID = data.LopID;
        this.isOnTap = data.VaoPhong == "Ôn Tập" ? true : false
        this.arr_Lop_Online = null
        this.StoreMode = data.TrangThaiID.toString()
        this.isLoadThanhVien = false
        this.isLoadBaiTap = false
        this.IsLoadChat = false
        this.tabActive = 0
        this.tabFileData = []
        ws.registerOnMessageFunction(this, this.socketMessage);
        this.renderInit()
        this.joinRoomIfYes(() => {
            var count = 2
            // document.querySelector('#slidebar > div.action-top > div.action-button:nth-child(3)').style.display = 'none'
            this.getBaiHoc(() => {
                count -= 1
                if (count == 0)
                    df_HideLoading()
                    this.updateRootSideBar(React.createElement(SideBar , {data: this.sliderBarView}))
                this.slideBarTabTemplay[this.slideBarTab].onClick()
            })

            this.getBaiTap((data) => {
                this.isLoadBaiTap = true
                count -= 1
                if (count == 0)
                    df_HideLoading()
                    this.updateRootSideBar(React.createElement(SideBar , {data: this.sliderBarView}))


                if (data) {
                    const index = this.sliderBarView.length
                    this.sliderBarView.push(
                        {
                            type:"radio",
                            on: () => this.tabActive == index,
                            nameIcon:"create-outline",
                            title:"Bài tập",
                            onClick: function() {
                                classhtt.handlSideBar.baiTap()
                                classhtt.tabActive = 2; 
                            }
                        })
                    classttn.initTimer()
                    if (classttn.isNopBai) {
                        classttn.getDapAn()
                        classttn.getDiemBaiTap()
                    }
                }
            })
        })


    }

    this.tinhThoiGianLamBai = function () {
        this.GioClient_LucLayCauHoi = new Date();
        classttn.GioBatDauLamBai_Client = this.GioClient_LucLayCauHoi;
        classttn.second_Bailam = 0;
        var t_TGKT = new Date(this.arr_Data_BaiHoc['TGKT'].replace(" ", "T"));
        var t_TGHH = new Date(this.GioHienHanh);
        var timespan = (t_TGKT - t_TGHH) / 60000; //phut

        // Nếu là kiểm tra thì bước này load Bài kiểm tra lên để lấy SoGiayLamBai
        if (!this.arr_BHHS['SoGiayLamBai'] || this.arr_BHHS['SoGiayLamBai'] == 0
            || !this.arr_Data_BaiHoc.SoPhutLamBai || this.arr_Data_BaiHoc.SoPhutLamBai == 0) { // chưa làm bài
            if (this.arr_Data_BaiHoc.SoPhutLamBai && this.arr_Data_BaiHoc.SoPhutLamBai != 0) {
                if (this.arr_Data_BaiHoc.SoPhutLamBai < timespan)
                    classttn.limit_minute = this.arr_Data_BaiHoc.SoPhutLamBai;
                else
                    classttn.limit_minute = timespan;
            }
            else {
                if (timespan > 0)
                    classttn.limit_minute = timespan;// SV_TGKT- SV_TGHH
            }
        }
        else {//xet neu co gio vao roi, thì lấy sophutlambai(neu co) tru di so giay da lam => ra duoc so giay quy dinh
            var sophutquydinh = this.arr_Data_BaiHoc.SoPhutLamBai - this.arr_BHHS['SoGiayLamBai'] / 60;
            if (sophutquydinh > 0) {
                if (sophutquydinh < timespan)
                    classttn.limit_minute = sophutquydinh;
                else
                    classttn.limit_minute = timespan;
            }
            else {
                classttn.limit_minute = 0;// Hết giờ
            }
        }
        var GioVao = moment(this.arr_BHHS.GioVao, 'DD/MM/yyyy HH:mm:ss');
        var HienHanh = new Date(this.arr_BHHS.GioHienHanh);
        this.Log_SoGiayBatDau = parseInt((HienHanh - GioVao) / 1000);
        classttn.LSLamBai = ''

    }

    this.slideBarShowLoading = function() {
        this.updateRootChat(React.createElement(SideBarLoading))
    }
}