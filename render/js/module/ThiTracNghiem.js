function ThiTracNghiem() {
    this.isFile = false
    this.now_slide = 1;
    this.arr_Data = [];
    this.arr_DoanVan = [];
    this.arr_Bailam = [];
    this.arr_Dapan_Dung = [];
    this.arr_HoanVi = [];
    this.limit_minute = 0; // mặc định
    this.second_Bailam = 0;
    this.second_Bailam_TruocDongBo = 0;
    this.next_prev = '';
    this.DLL = "Elearning.Core.LearningRoom";
    this.isNopBai = false;
    this.isBaiGiai = false;
    this.isBaiOnTap = 0;
    this.owlTracNghiem;
    this.allowChangeSlide = true;
    this.dtSave = new DataTable();
    this.dtSave.Columns.add('ID_Save', 'String');
    this.dtSave.Columns.add('CauHoiID', 'String');
    this.dtSave.Columns.add('NoiDungBaiLam', 'String');
    this.dtSave.Columns.add('STTDapAn', 'String');
    this.saveID = 0;
    this.myVarTimer = undefined;
    this.timeOut = false;
    this.GioHienHanh = '';
    this.GioBatDauLamBai_Client;
    this.errorChangeCauHoi = '';
    this.AndrWebView = false;
    this.CauHoiDapAn_Height = 1000;
    this.TimeEnd = null;
    this.lostfc = false;
    this.timelostfc = null;
    this.timecount = 0;
    this.timeenable = false;
    this.isConThoiGianLamBai = false;
    this.countInactive = 0;
    this.chdaHeight = 1000;
    this.doanvan_cauhoi = [];
    this.tuLuanHeight = 200;
    this.TyleDapAn = 0.5;
    this.Diachitemp = '';
    this.BaiHocLopID = "-1";
    this.classImgView;
    this.BaiHocHSID;
    this.IsRegisterSuccess;
    this.LSLamBai;
    this.LastTimeViPham;
    this.SoLanViPham_NopBaiWeb = 0;
    this.LyDoNopBai = '';
    this.arr_Diem = []

    this.backSlide = function() {
        this.now_slide -= 1;
        if (this.now_slide <= 0) {
            this.now_slide = this.arr_Data.length;
        }

        this.updateCauHoi(this.now_slide - 1)
        document.getElementById('bottom-dalam').textContent = this.arr_Bailam.length + '/' + this.arr_Data.length
    }

    this.changeCauChon = function() {
        var cauChon = Array.from(document.querySelectorAll('div.dapan > div.dp')).map(e => e.querySelector('input').checked).indexOf(true)
        if (cauChon != -1) {
            this.updateBaiLam(this.now_slide, classhtt.MappingID2Char[cauChon])
            console.log("câu", this.now_slide, 'chọn', classhtt.MappingID2Char[cauChon])
            document.getElementById('bottom-dalam').textContent = this.arr_Bailam.length + '/' + this.arr_Data.length

            if (classhtt.slideBarTab == 2) {
                var templayArrBaiLam = this.arr_Data.map((e, index) => {
                    var cau = this.arr_Bailam.filter(j => j.cau == index + 1)
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

                classhtt.updateRootChat(React.createElement(ListViewCauHoi, {
                    data: templayArrBaiLam
                }))
            }
        }

    }

    this.checkLuuBai = function() {
        document.getElementById('bottom-timer').textContent = "0000"
    }

    this.copyBaiLam = function() {
        var data = {}
        this.arr_Bailam.forEach(e => {
            const cau = this.arr_Data[e.cau - 1]
            data[cau.cauhoiid] = this.tranStringtoSTT(cau, e.dapan)
        })
        return data
    }

    this.copyDapAnDung = function() {
        var data = {}
        if (this.arr_Dapan_Dung.length > 0) {
            this.arr_Dapan_Dung.forEach(e => {
                data[e.cauhoiid] = this.arr_Data[e.STTCau - 1].dapan[e.dapan].noidung
            })
        }
        return data;
    }

    this.doSave = function(IsThuCong, SuccessCallback = null) {
        if (this.isFile) return
        var arr_Cau_dalam = convertJson2Array(this.arr_Bailam, 'cau');
        var pos = arr_Cau_dalam.indexOf(this.now_slide);
        if (this.dtSave.Rows.length >= 8) { // đã không thể lưu được 8 câu
            console.log("Cảnh báo", '<p style="color:red"><b>Không thể lưu bài làm của bạn, vui lòng lưu nháp đáp án và tải lại trang (hoặc nhấn F5)</b></p>' + this.GetCauChuaLuuText(), "Đồng ý", 'error', function() {
                return;
            })
        }
        if (this.timeOut || IsThuCong || this.dtSave.Rows.length >= 5 || (pos != -1 && this.arr_Bailam[pos]['dapan'] == 'Tự luận')) {
            this.saveID++;
            var id = this.saveID++;
            this.dtSave.Rows.forEach(function(el) {
                el.setCell("ID_Save", id);
            });
            if (this.timeOut || IsThuCong || this.dtSave.Rows.length > 0) {
                // gửi lịch sử chọn đáp án, nếu lưu dc thì xoá lịch sử luôn
                var arr = df_LSToByteArray(this.LSLamBai);
                // convert to string
                var strLS = df_bin2String(arr);
                WSGet(function(result) {
                    if (result.ErrorNumber == 0) {
                        var iID = parseInt(result.Data);
                        if (iID > 0) {
                            var i = 0;
                            while (i < this.dtSave.Rows.length)
                                if (this.dtSave.getCell(i, "ID_Save") == iID)
                                    this.dtSave.Rows.remove(i);
                                else
                                    i++;
                        }
                        if (IsThuCong) {
                            if (SuccessCallback != null)
                                SuccessCallback();
                        }
                        // Nếu nộp bài thì phải đợi tại đây
                        if (this.timeOut == true) {
                            this.isNopBai = true;
                            this.checkLuuBai();
                            this.getDapAn(function() {
                                this.updateCauHoi(this.now_slide - 1)
                            }.bind(this))
                            classttn.getDiemBaiTap(() => {
                                document.querySelector('div.phonghoc-content > div.phonghoc-content-top.baitap > div').textContent = `${this.arr_Diem.TongDiem}Đ - ${this.arr_Diem.TNDung}/${this.arr_Data.length}`
                            })

                            document.querySelector('div.chat-bottom > button:nth-child(3)').disabled = true


                            if ((!this.isBaiGiai && !classhtt.isKiemTra) || classhtt.isKiemTra || classhtt.arr_Data_BaiHoc['ChoXemLaiBaiLam'] == false)
                                clearInterval(_Ttn_Timer);

                            showMsg("Thông báo nộp bài", 'Bạn đã nộp bài', 'Đồng ý', 'success', function() {
                                return;
                            })
                            // console.log("Thông báo nộp bài", '<p><b>Bạn đã nộp bài!</b></br>' + this.LyDoNopBaiHienThi + '</br>- Bấm vào nút tải kết quả để lưu trữ lại kết quả đã nộp. Sử dụng kết quả này để đối chiếu khi cần thiết.</p>', 'Tải kết quả', 'Không tải', function () { classttn.LuuMinhChung(true); }, function () { return; })
                        }
                        this.LSLamBai = "";
                    } else { //đang bị lỗi
                        if (this.timeOut == true) // nộp bài
                        {
                            var errMess = result.ErrorMessage.replace("\\r\\n", "</br>");
                            if (errMess == 'Timeout') {
                                errMess = '<p>Hệ thống chưa lưu được bài làm, vui lòng thử bấm nút "Nộp bài" lần nữa. Nếu vẫn không được bạn liên hệ giáo viên để nhờ hỗ trợ.</p>';
                            } else { // server gửi về
                                //const indexOfFirst = errMess.indexOf(':');
                                //errMess = errMess.substring(indexOfFirst + 1);
                            }
                            // xử lý câu lỗi
                            console.log('Thông báo lỗi nộp bài', errMess, 'Chấp nhận', 'error', function() {
                                return;
                            });
                        } else {
                            var errMess = result.ErrorMessage.replace("\\r\\n", "</br>");
                            if (errMess == 'Timeout') {
                                errMess = '<p>Không thể lưu bài làm của bạn, vui lòng lưu nháp đáp án và tải lại trang (hoặc nhấn F5).</p>' + this.GetCauChuaLuuText();
                            } else {
                                //const indexOfFirst = errMess.indexOf(':');
                                //errMess = errMess.substring(indexOfFirst + 1);
                            }
                            console.log('Thông báo lỗi lưu bài', errMess, 'Chấp nhận', 'error', function() {
                                return;
                            });
                        }
                    }
                }.bind(this), this.DLL, 'ElearningSaveBaiLam_NhieuCau', classhtt.BaiHocGiaoVienID.toString(), this.dtSave, this.timeOut.toString(), this.BaiHocLopID.toString(), strLS);
            }
        }
    }

    this.exportBaiLam = function(path, stt) {
        if (stt > this.arr_Data.length) {
            showMsg('Thông báo', "Xuất ảnh thành công", "ok", 'success')
            return false
        }
        this.now_slide = stt
        this.updateCauHoi(this.now_slide - 1)

        var images = document.querySelectorAll('#content > div.div-cauhoi img')

        var imagesLoaded = 0
        if (images.length > 0) {
            for (var i = 0; i < images.length; i++) {
                var img = new window.Image();
                img.src = images[i].src;
                img.onload = function() {
                    imagesLoaded++;
                    if (imagesLoaded == images.length) {
                        setTimeout(() => {
                            App.screenshot(`${path}\\${classhtt.arr_Data_BaiHoc.TenBaiHoc.replaceAll(' ', '-')}-cau-${classttn.now_slide}.png`).then(rs => {
                                if (rs) {
                                    console.log(classttn.now_slide + 1)
                                    classttn.exportBaiLam(path, classttn.now_slide + 1)
                                }
                            })
                        }, 100)
                    }
                }
            }
        } else {
            setTimeout(() => {
                App.screenshot(`${path}\\${classhtt.arr_Data_BaiHoc.TenBaiHoc.replaceAll(' ', '-')}-cau-${classttn.now_slide}.png`).then(rs => {
                    if (rs) {
                        console.log(classttn.now_slide + 1)
                        classttn.exportBaiLam(path, classttn.now_slide + 1)
                    }
                })
            }, 50)
        }

    }

    this.exportBaiLamToFile = function() {
        var data = {
            name: "hello",
            arrData: classttn.arr_Data,
            arrDapAn: classttn.arr_Dapan_Dung
        }

        console.log(JSON.stringify(data))
    }

    this.getBaiLam_TuLuan = function(showmessage = true) {
        var tuluan = null;
        if (this.AndrWebView) {
            var text = $(classhtt.editortuluanid).html();
            tuluan = text;
        } else
            tuluan = tinymce.get(classhtt.editortuluanid.substring(1)).getContent();
        if (tuluan.length > 1048576) {
            if (showmessage)
                // showMsg('Thông báo lỗi', 'Nội dung tự luận không được vượt quá 1 Mb dữ liệu, nếu bạn có chèn hình ảnh vui lòng xóa đi và sử dụng nút Upload file trên thanh công cụ để chèn hình ảnh chứ đừng copy - paste trực tiếp.', 'Đồng ý', 'error');
                return null;
        } else return tuluan;
    }

    this.getDapAn = function(callback) {
        if (this.isFile) return
        WSGet(function(rs) {
            if (CheckResult(rs)) {
                this.arr_Dapan_Dung = rs.Data.getTable('DapAn').toJson();
                if (callback) callback()
            } else {}
        }.bind(this), 'Elearning.Core.LearningRoom', 'ElearningGetDapAn', classhtt.BaiHocGiaoVienID.toString(), classhtt.StoreMode, classhtt.LopID.toString());
    }

    this.getDiemBaiTap = function(callback) {
        if (this.isFile) return
        WSDBGet(function(rs) {
            if (CheckResult(rs)) {
                this.arr_Diem = rs.Data.getTable("Data").toJson()[0]
                if (callback) callback()
            }
        }.bind(this), 'HS.LamLaiBaiLuyenTap', 'BaiHocGiaoVienID', classhtt.BaiHocGiaoVienID.toString(), "BaiHocLopID", classhtt.BaiHocLopID.toString(), "BaiHocHSID", classhtt.arr_BHHS.BaiHocHSID.toString(), "Type", "ChamBai", "Store", classhtt.StoreMode);

    }

    this.getTime_End = function() {
        if (this.TimeEnd == null) {
            //if (classhtt.arr_Data_BaiHoc['HCNB'])
            //    this.TimeEnd = new Date(classhtt.arr_Data_BaiHoc['HCNB'].replace(" ", "T"));
            //else
            if (classhtt.arr_Data_BaiHoc['TGKT'])
                this.TimeEnd = new Date(classhtt.arr_Data_BaiHoc['TGKT'].replace(" ", "T"));
        }
    }

    this.handlNopBai = function() {
        if (!this.isNopBai) {
            console.log('nopbai')
            if (!this.isConThoiGianLamBai) {
                showMsg('Thông báo', 'Đã hết thời gian nộp bài!', 'OK', 'error', function() {
                    return;
                });
                return false;
            }
            var arr_Dapan = convertJson2Array(this.arr_Bailam, 'dapan');
            var count_dapan = 0;
            var count_noidungTLChuaLam = 0;
            for (var i = 0; i < arr_Dapan.length; i++) {
                if (arr_Dapan[i])
                    count_dapan++;
                if (!this.arr_Data[i].tracnghiem) // tự luận
                {
                    count_dapan++;
                    if (df_unde(this.arr_Bailam[i].noidung) || this.arr_Bailam[i].noidung == '') {
                        count_noidungTLChuaLam++;
                    }
                }
            }
            var smg = '';
            var isThongBao = true;
            if (count_dapan < this.arr_Data.length) {
                isThongBao = true;
                smg = 'Bạn chưa hoàn thành hết các câu hỏi.';
            }
            if (count_noidungTLChuaLam > 0) {
                isThongBao = true;
                smg += ' Bạn chưa hoàn thành hết các câu tự luận';
            }
            var arr_Xemlai = convertJson2Array(this.arr_Bailam, 'xemlai');
            var count_xemlai = 0;
            for (var i = 0; i < arr_Dapan.length; i++) {
                if (arr_Xemlai[i] && arr_Xemlai[i] == 1)
                    count_xemlai++;
            }

            if (count_xemlai > 0) {
                isThongBao = true;
                if (smg != '')
                    smg += ' và Bạn còn câu hỏi cần xem lại';
                else
                    smg = 'Bạn còn câu hỏi cần xem lại';
            }
            if (this.now_slide - 1 > 0 && this.now_slide - 1 < this.arr_Data.length) { // co now_slide
                var now_cauhoi = this.arr_Data[this.now_slide - 1];
                var checkdiff = false;
                if (!now_cauhoi.tracnghiem) {
                    var arr_Cau_dalam = convertJson2Array(this.arr_Bailam, 'cau');
                    var pos = arr_Cau_dalam.indexOf(this.now_slide);
                    var content = this.getBaiLam_TuLuan();
                    if (content == null) checkdiff = true;
                    else {
                        if (pos != -1) {
                            var noidung = this.arr_Bailam[pos]['noidung'];
                            if (noidung != content)
                                checkdiff = true;
                        } else if (content != '') {
                            checkdiff = true;
                        }
                    }

                    console.log(checkdiff)
                    if (checkdiff == true) {
                        showConfirm('Thông báo', 'Bạn chưa chọn <b>"Lưu bài"</b>.<br/> Vui lòng lưu bài tự luận trước khi nộp bài. Quay lại để lưu bài tự luận <b>[Quay lại]</b> hoặc tiếp tục nộp bài <b>[Nộp bài không lưu tự luận]</b> nhưng không lưu tự luận?', 'Nộp bài không lưu tự luận', 'Quay lại',
                            function() {
                                this.LuuBaiCoThongBao(isThongBao, smg);
                            }.bind(this),
                            function() {
                                return;
                            }.bind(this));
                    } else {
                        this.LuuBaiCoThongBao(isThongBao, smg);
                    }
                } else
                    this.LuuBaiCoThongBao(isThongBao, smg);
            } else {
                this.LuuBaiCoThongBao(isThongBao, smg);
            }
        }
    }

    this.keyDowEvent = (event) => {
        switch (event.code) {
            case "ArrowRight":
                this.nextSlide();
                break;

            case "ArrowLeft":
                this.backSlide()
                break;

            case "ArrowDown":
                this.nextSlide();
                this.nextSlide();
                break;

            case "ArrowUp":
                this.backSlide();
                this.backSlide();
                break;
        }

    }

    this.initTimer = function() {

        this.isBaiOnTap = classhtt.isOnTap;

        this.arr_Bailam.forEach(e => {
            var value = this.arr_Data[e.cau - 1];
            var dapan = tranSTTtoString(value, e.dapan);

            e.dapan = dapan;
            e.xemlai = 0
            e.isdaluu = true
        })

        clearInterval(_Ttn_Timer);
        clearInterval(_Web_Check_Timer);
        this.BaiHocHSID = classhtt.arr_BHHS.BaiHocHSID;
        classhtt.BaiHocHSID = classhtt.arr_BHHS.BaiHocHSID;
        this.BaiHocLopID = classhtt.BaiHocLopID
        try {
            var loicau = [];

            for (var i = 0; i < this.arr_Data.length; i++) {
                var chda = this.arr_Data[i];
                if (chda.tracnghiem == true) {
                    if (df_unde(chda.dapan) || chda.dapan.length != chda.SoDapAn) {
                        loicau.push(i + 1);
                    }
                }
                if (!df_unde(chda.doanvan)) {
                    if (df_unde(this.doanvan_cauhoi['dv' + chda.doanvan]))
                        this.doanvan_cauhoi['dv' + chda.doanvan] = [];
                    this.doanvan_cauhoi['dv' + chda.doanvan].push(i + 1);
                }
            }
            if (loicau.length > 0) {
                console.log('Thông báo lỗi' + '<p>Phát hiện đề kiểm tra học sinh có <b>' + loicau.length + '</b> câu bị lỗi không đủ đáp án là các câu: <b style="word-break: break-all;">' + loicau.join(',') + '</b> , hãy thử tải lại trang, nếu thử vài lần không được hãy liên hệ giáo viên xem lại danh sách câu hỏi và phương pháp ra đề.</p>')
                return;
            }
            if (this.second_Bailam < this.limit_minute * 60)
                this.isConThoiGianLamBai = true;

            if (this.arr_Bailam.length > 0 && this.arr_Data.length > 0) { // đã làm/ câu hỏi
                for (var i = 0; i < this.arr_Bailam.length; i++) {
                    this.arr_Bailam[i].isdaluu = true;
                }
                console.log('Đã làm: ' + this.arr_Bailam.length + '/' + this.arr_Data.length);
            }

            if (this.GioBatDauLamBai_Client == undefined) { // lúc chuyển tab qua lại sẽ không reset thời gian
                this.GioBatDauLamBai_Client = new Date();
                this.second_Bailam = 0;
            }

            if (classhtt.arr_BHHS.ThoiGianNopBai && classhtt.arr_BHHS.ThoiGianNopBai != null && classhtt.arr_BHHS.ThoiGianNopBai.trim() != "") {
                this.isNopBai = true;
                console.log("đã nộp bài")
            } else {
                console.log("bình thường")
            }

            this.getTime_End();
            var now_fixed = new Date(this.GioHienHanh);
            if (!this.isNopBai && this.TimeEnd > now_fixed) {
                _Ttn_Timer = setInterval(function() {
                    this.second_Bailam++;
                    var ThoiGianLamBai_Client = parseInt((new Date() - this.GioBatDauLamBai_Client) / 1000); // giay
                    this.second_Bailam_TruocDongBo = this.second_Bailam;

                    if (this.second_Bailam >= this.limit_minute * 60) {
                        /*classhtt.isKiemTra && */
                        this.isConThoiGianLamBai = false;
                        clearInterval(_Ttn_Timer);

                        console.log("time end")
                    }

                    this.isConThoiGianLamBai = true;

                }.bind(this), 1000)
            }
        } catch (e) {
            console.log('Thông báo lỗi' + '<p>Phát hiện lỗi trong khi xử lý dữ liệu hãy thử tải lại trang, nếu thử vài lần không được hãy liên hệ giáo viên.</p>' + 'Tải lại trang' + 'error')
        }

    }

    this.lamBaiLai = function(isLamLai) {

        if (this.isFile) return

        if (isLamLai) {
            showConfirm("Làm bài lại - bảo lưu", "Khi làm bài lại:<br/>- Các câu hỏi,đáp án, vị trí câu hỏi và đáp án vẫn được bảo lưu.<br/>- Thời gian sẽ được bắt đầu lại.", 'Đồng ý', 'Bỏ qua', function() {
                console.log("continu")
                WSDBGet(function(rs) {
                    df_HideLoading();
                    if (CheckResult(rs)) {
                        var code = rs.Data.Tables[0].Rows[0].getCell('Code');
                        var KetQua = rs.Data.Tables[0].Rows[0].getCell('KetQua');
                        if (code == true || code == 1) {
                            showMsg("Thông báo", KetQua, undefined, 'success', function() {
                                classttn = new ThiTracNghiem();
                                classhtt.isLoasdBaiTap = false
                                classhtt.getBaiTap(() => {
                                    classttn.initTimer()
                                    classttn.readerCauhoi()
                                    classhtt.slideBarTabTemplay.filter(e => e.title == "Câu hỏi")[0].onClick()

                                })
                            });
                        } else {
                            showMsg('Thông báo lỗi', KetQua);
                        }

                    }
                }.bind(this), 'HS.LamLaiBaiLuyenTap', 'BaiHocGiaoVienID', classhtt.BaiHocGiaoVienID, "BaiHocLopID", classttn.BaiHocLopID, "BaiHocHSID", classhtt.arr_BHHS.BaiHocHSID, "IsLamLai", isLamLai, "Type", "HSLamBaiLai", "Store", classhtt.StoreMode)
            }.bind(this), function() {
                return;
            })
        } else {
            showConfirm("Làm bài mới - không bảo lưu", "Khi làm bài mới:<br/>- Các câu hỏi,đáp án, vị trí câu hỏi và đáp án sẽ được làm mới.<br/>- Thời gian sẽ được bắt đầu lại.", 'Đồng ý', 'Bỏ qua', function() {
                console.log("continu")
                WSDBGet(function(rs) {
                    df_HideLoading()
                    if (CheckResult(rs)) {
                        var code = rs.Data.Tables[0].Rows[0].getCell('Code');
                        var KetQua = rs.Data.Tables[0].Rows[0].getCell('KetQua');
                        if (code == true || code == 1) {
                            showMsg("Thông báo", KetQua, undefined, 'success', function() {
                                classttn = new ThiTracNghiem();
                                classhtt.isLoadBaiTap = false
                                classhtt.getBaiTap(() => {
                                    classttn.initTimer()
                                    classttn.readerCauhoi()
                                    
                                    classhtt.slideBarTabTemplay.filter(e => e.title == "Câu hỏi")[0].onClick()

                                })
                            });
                        } else {
                            showMsg('Thông báo lỗi', KetQua);
                        }

                    }
                }.bind(this), 'HS.LamLaiBaiLuyenTap', 'BaiHocGiaoVienID', classhtt.BaiHocGiaoVienID, "BaiHocLopID", classttn.BaiHocLopID, "BaiHocHSID", classhtt.arr_BHHS.BaiHocHSID, "IsLamLai", isLamLai, "Type", "HSLamBaiLai", "Store", classhtt.StoreMode)
            }.bind(this), function() {
                return;
            })
        }
    }

    this.LuuBaiCoThongBao = function(isThongBao, smg) {
        var ThoiGianLamBai_Client = parseInt((new Date() - this.GioBatDauLamBai_Client) / 1000); // giay
        if (isThongBao) {
            smg = '<b style="color:red">' + smg + '</b><p>Đã nộp bài là kết thúc bài làm, không còn làm bài được nữa. Bạn có chắc chắn muốn nộp bài?</p>';
            showConfirm('Thông báo', smg, 'Có, nộp bài', 'Không, về làm bài', function() {
                this.saveBailamAll();
                this.WriteLog(ThoiGianLamBai_Client, 'Web: Học sinh nhấn nút lưu bài.');
            }.bind(this), function() {
                return
            });
        } else {
            smg = '<p style="color:red">Đã nộp bài là kết thúc bài làm, không còn làm bài được nữa. Bạn có chắc chắn muốn nộp bài?</p>';
            showConfirm('Thông báo', smg, 'Có, nộp bài', 'Không, về làm bài', function() {
                this.saveBailamAll();
                this.WriteLog(ThoiGianLamBai_Client, 'Web: Học sinh nhấn nút lưu bài.');
            }.bind(this), function() {
                return
            });
        }
    }

    this.nextSlide = function() {


        this.now_slide += 1;
        if (this.now_slide > this.arr_Data.length) {
            this.now_slide = 1;
        }
        this.updateCauHoi(this.now_slide - 1)
        document.getElementById('bottom-dalam').textContent = this.arr_Bailam.length + '/' + this.arr_Data.length

    }

    this.readerCauhoi = function() {
        if (!classhtt.rootContent) {
            classhtt.rootContent = ReactDOM.createRoot(document.getElementById('content'))
        }

        document.getElementById('bottom-dalam').textContent = this.arr_Bailam.length + '/' + this.arr_Data.length
        this.updateCauHoi(this.now_slide - 1)
        if (this.isNopBai) {
            this.checkLuuBai()
            document.querySelector('div.chat-bottom > button:nth-child(3)').disabled = true
            document.querySelector('div.phonghoc-content > div.phonghoc-content-top.baitap > div').textContent = `${this.arr_Diem.TongDiem}Đ - ${this.arr_Diem.TNDung}/${this.arr_Data.length}`
        } else {
            var thoigianconlai = this.limit_minute * 60 - this.second_Bailam;
            var str = formatTime(Math.floor(thoigianconlai))
            // console.log(str)
            document.getElementById('bottom-timer').textContent = str;
            document.querySelector('div.phonghoc-content > div.phonghoc-content-top.baitap > div').textContent = ``
            document.querySelector('div.chat-bottom > button:nth-child(3)').disabled = false
        }


        document.querySelectorAll('div.dapan > div.dp').forEach(e => {
            if (this.isNopBai)
                e.querySelector('input').disabled = true
            else
                e.querySelector('input').disabled = false
        })
    }

    this.resetFieldTracNghiem = function() {
        this.TimeEnd = null;
        this.timeOut = false;
        this.isNopBai = false;
        this.allowChangeSlide = true;
        this.lostfc = false;
        this.timelostfc = null;
        this.timecount = 0;
        this.isBaiGiai = false;
        this.LyDoNopBai = '';
    }

    this.saveBailamAll = function() {
        this.timeOut = true;
        this.doSave(false)
    }

    this.tranDapAn = function(dapan, arr) {
        var stt = undefined;
        if (dapan == 'A')
            stt = arr[0].stt.toString();
        else if (dapan == 'B')
            stt = arr[1].stt.toString();
        else if (dapan == 'C')
            stt = arr[2].stt.toString();
        else if (dapan == 'D')
            stt = arr[3].stt.toString();
        return stt;
    }

    this.tranStringtoSTT = function(now_cauhoi, dapan) {
        const arrString = ['A', 'B', 'C', 'D']
        if (!isNumeric(dapan))
            dapan = arrString.indexOf(dapan)
        var arr_HoanViID = convertJson2Array(classttn.arr_HoanVi, 'HoanViID');
        var poshv = arr_HoanViID.indexOf(now_cauhoi.hoanvi);
        var arr_HoanVi_CH = [];
        if (poshv != -1) {
            for (var i = 0; i < 4; i++) {
                arr_HoanVi_CH.push(classttn.arr_HoanVi[poshv + i]);
            }
        }

        var arr_HoanViID_fill = convertJson2Array(arr_HoanVi_CH, 'STT');
        var pos1 = arr_HoanViID_fill.indexOf(dapan);
        if (pos1 != -1) {
            dapan = arr_HoanVi_CH[pos1]['STTDapAn'];
        }

        return dapan;
    }

    this.updateBaiLam = function(cau, dapan) {
        if (!this.isConThoiGianLamBai || this.isNopBai) {
            showMsg('Thông báo', (this.isNopBai ? 'Bạn đã nộp bài' : 'Đã qua thời gian cho phép làm bài') + '. Không thể chọn đáp án hoặc lưu bài!', 'OK', 'error', function() {
                return;
            });
            return false;
        }

        var now_cauhoi = this.arr_Data[cau - 1];
        var arr_Cau_dalam = convertJson2Array(this.arr_Bailam, 'cau');
        var pos = arr_Cau_dalam.indexOf(cau);
        if (pos != -1 && now_cauhoi.tracnghiem && this.arr_Bailam[pos].dapan == dapan) {
            return; // câu trắc nghiệm không đổi đáp án
        }

        var item = {};
        item['cau'] = cau;
        if (now_cauhoi.tracnghiem)
            item['dapan'] = dapan;
        else {
            item['dapan'] = 'Tự luận';
            var content = this.getBaiLam_TuLuan();
            if (content != null)
                item['noidung'] = content;
        }
        item['isdaluu'] = false;

        if (pos != -1) {
            item['xemlai'] = this.arr_Bailam[pos]['xemlai'];
            this.arr_Bailam[pos] = item;
        } else
            this.arr_Bailam.push(item);

        arr_Cau_dalam = convertJson2Array(this.arr_Bailam, 'cau');
        pos = arr_Cau_dalam.indexOf(cau);

        if (now_cauhoi.tracnghiem)
            this.WriteHist(cau, 'ABCD'.indexOf(dapan));


        var arr_Cau_dalam = convertJson2Array(this.arr_Bailam, 'cau');
        var pos = arr_Cau_dalam.indexOf(this.now_slide);
        var dapan = null,
            noidung = null;
        if (pos != -1) {
            if (this.arr_Bailam[pos]['dapan'] && this.arr_Bailam[pos]['dapan'] != 'Tự luận')
                dapan = this.arr_Bailam[pos]['dapan'];
            else if (this.arr_Bailam[pos]['noidung']) {
                noidung = this.arr_Bailam[pos]['noidung'];
            }
        }

        var cauhoi = this.arr_Data[cau - 1];
        var stt = undefined;
        if (dapan == 'A')
            stt = cauhoi.dapan[0].stt.toString();
        else if (dapan == 'B')
            stt = cauhoi.dapan[1].stt.toString();
        else if (dapan == 'C')
            stt = cauhoi.dapan[2].stt.toString();
        else if (dapan == 'D')
            stt = cauhoi.dapan[3].stt.toString();

        if (classhtt.arr_Data_BaiHoc.ChoHoanVi) {
            if (cauhoi.hoanvi && cauhoi.hoanvi != 0) {
                var arr_HoanViID = convertJson2Array(this.arr_HoanVi, 'HoanViID');
                var pos = arr_HoanViID.indexOf(cauhoi.hoanvi);
                if (pos != -1) {
                    var arr_HoanVi_CH = [];
                    for (var i = 0; i < 4; i++) {
                        arr_HoanVi_CH.push(this.arr_HoanVi[pos + i]);
                    }
                    var arr_HoanViID_fill = convertJson2Array(arr_HoanVi_CH, 'STT');
                    var pos1 = arr_HoanViID_fill.indexOf(parseInt(stt));
                    if (pos1 != -1) {
                        stt = arr_HoanVi_CH[pos1]['STTDapAn'].toString();
                    }
                }
            }
        }

        var r = this.dtSave.select(function(r) {
            return r.getCell("CauHoiID") == cauhoi.cauhoiid.toString()
        });
        if (r.length === 0) {
            this.dtSave.Rows.add(0, cauhoi.cauhoiid.toString(), noidung, stt);
        } else {
            r[0].setCell('STTDapAn', stt);
            r[0].setCell('NoiDungBaiLam', noidung);
        }
        this.doSave(true, () => {
            var arr_Cau_dalam = convertJson2Array(this.arr_Bailam, 'cau');
            var pos = arr_Cau_dalam.indexOf(cau);
            this.arr_Bailam[pos].isdaluu = true
            console.log("đã lưu câu", cau)
        });
    }

    this.updateCauHoi = function(index) {
        var items = document.querySelectorAll('#slideBarContent > div > div .list-cauhoi-ele')
        items.forEach(e => {
            e.classList.remove('on')
        })
        items[index].classList.add('on')
        document.querySelectorAll('div.dapan > div.dp').forEach(e => {
            e.querySelector('input').checked = false
            e.style.background = ''

        })
        const cau = this.arr_Data[index]

        const dalam = this.arr_Bailam.filter(e => e.cau == index + 1)[0]
        if (!this.isNopBai) {
            if (dalam) {
                document.querySelectorAll('div.dapan > div.dp')[classhtt.MappingID2Char.indexOf(dalam.dapan)].querySelector('input').checked = true
            }
        } else {
            const dapAnDung = this.arr_Dapan_Dung.filter(e => e.cauhoiid == cau.cauhoiid)[0]
            if (dalam) {
                document.querySelectorAll('div.dapan > div.dp')[classhtt.MappingID2Char.indexOf(dalam.dapan)].style.background = "#D5504D"
            }

            if (dapAnDung) {
                document.querySelectorAll('div.dapan > div.dp')[dapAnDung.dapan].style.background = "#409972"
            }

        }


        document.querySelector('div.cauhoi > span.stt').innerHTML = `Câu ${index + 1}: `
        document.getElementById('noidungcauhoi').innerHTML = cau.cauhoi;
        document.getElementById('noidung-da-A').innerHTML = cau.dapan[0].noidung
        document.getElementById('noidung-da-B').innerHTML = cau.dapan[1].noidung
        document.getElementById('noidung-da-C').innerHTML = cau.dapan[2].noidung
        document.getElementById('noidung-da-D').innerHTML = cau.dapan[3].noidung


        document.querySelectorAll('.div-cauhoi img').forEach(e => {
            var rgbArg = getAverageRGB(e);
            if (rgbArg < 10) {
                e.style.filter = "invert(1)"
            }
        })

    }



    this.WriteHist = function(stt, dapan) {
        if (this.LSLamBai == undefined) { // get store
            this.LSLamBai = ''
            if (this.LSLamBai == null) {
                this.LSLamBai = "";
            }
        }
        this.LSLamBai += (classhtt.Log_SoGiayBatDau + this.second_Bailam) + ',' + stt + "," + dapan + ";";
    }




    this.WriteLog = function(ThoiGianLamBai_Client, LyDoNopBai) {
        WSDBGet(function(rs) {
            //df_HideLoading();
            //if (CheckResult(rs)) {
            //
            console.log("Ghi log " + rs.ErrorNumber)
            //}
        }.bind(this), "HS.TTN.WriteLog", "BaiHocHSID", this.BaiHocHSID.toString(), "ThoiGianLamBai_Client", ThoiGianLamBai_Client.toString(), "second_Bailam", this.second_Bailam_TruocDongBo.toString(), "GioHienHanh_Server", df_DateTime_SQL(new Date(this.GioHienHanh)), "GioHienHanh_Client", df_DateTime_SQL(classttn.GioBatDauLamBai_Client), "limit_minute", this.limit_minute.toFixed(2), "SoGiayLamBai", (df_unnu(classhtt.arr_BHHS.SoGiayLamBai) ? "0" : classhtt.arr_BHHS.SoGiayLamBai.toString()), "GioClient_LucLayCauHoi", df_DateTime_SQL(classhtt.GioClient_LucLayCauHoi), "GioClient_LucGoiHamLuu", df_DateTime_SQL(new Date()), "IsKiemTra", classhtt.isKiemTra, "LyDoNopBai", LyDoNopBai);

    }
}