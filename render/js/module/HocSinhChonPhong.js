function HocSinhChonPhong() {
    this.DLL = "Elearning.Core.Learning";
    this._Counter = 0;
    this._ButtonCooldownInterval;
    this.LopID_Selected;
    this.fgDsPhong = null;
    this.cookieDSPH = [0, 0, 0, 0];
    this.arr_HoanVi;
    this.gridHeight = 600;
    this.StoreMode = "0";
    this.arrCauHinhPDF = [];
    this.BaiHocs = null;
    this.root = null;
    this.arrListPhongHoc = [];

    this.LoaiPhongSelected = [0];//1: Chưa bắt đầu, 2: Da ket thuc, 0 đang diễn ra, 3: phòng cũ
    this.typySort = ''
    this.arrListPhongHocView = [];
    this.arrFilterMonS = [];
    this.cursorSort = ""
    this.setLoaiPhongSelected = (data) => {
        this.LoaiPhongSelected = data
    }

    this.ListSubChange = (id) => {

        console.log(id)

        if (this.handleChangePhongSel.contains(id)) {
            if (this.LoaiPhongSelected.length == 1) return
            this.handleChangePhongSel.remove(id)
        }
        else {
            this.handleChangePhongSel.add(id)
        }

        const ele = document.querySelectorAll('div.slide-bar-li-chill.on > li')[id]
        if (ele.classList.contains('on')) {
            ele.classList.remove('on')
        }
        else {
            ele.classList.add('on')
        }
    }

    this.handlReSize = (e) => {
        console.log(e)
    }

    this.handlslideBar = () => {
        const ele = document.getElementById('listPhongSlideBar');
        const listSub = document.querySelector('.list-div-left')
        if (ele.classList.contains('on')) {
            ele.classList.remove('on')
            ele.style.width = "0px"
            ele.style.opacity = '0'
            listSub.style.width = "calc(100%)"
            // display: none;
        }
        else {
            ele.classList.add('on')
            ele.style.width = "200px"
            ele.style.opacity = '1'
            listSub.style.width = "calc(100% - 200px)"
        }
    }

    this.clearFilter = () => {
        this.cursorSort = ''
        this.arrFilterMonS = []
    }

    this.setCursorSort = (mon) => {
        this.cursorSort = mon
    }

    this.setTypePhong = (type) => {
        this.typySort = type
    }

    this.handleSort = () => {
        var copyListPhongHoc = []
        if (this.arrFilterMonS.length == 0) {
            copyListPhongHoc = [...this.arrListPhongHoc]
        }
        else {
            this.arrListPhongHoc.forEach((e) => {
                if (this.arrFilterMonS.includes(e.TenMon)) {
                    copyListPhongHoc.push(e)
                }
            })
        }

        if (this.typySort != '') {
            copyListPhongHoc = copyListPhongHoc.filter(e => e.VaoPhong == this.typySort)
        }

        if (this.cursorSort != '') {
            copyListPhongHoc.sort((a, b) => {
                if (a[this.cursorSort] < b[this.cursorSort]) return -1
                else if (a[this.cursorSort] > b[this.cursorSort]) return 1
                else return 0
            })
        }

        return copyListPhongHoc
    }

    this.changeFilterMon = (mon) => {
        if (!mon) {

        }
        else if (this.arrFilterMonS.includes(mon)) {
            var index = this.arrFilterMonS.indexOf(mon);
            this.arrFilterMonS.splice(index, 1)
        }
        else {
            this.arrFilterMonS.push(mon)
        }
    }

    this.updateViewSub = () => {

        var copyArr = [...this.arrListPhongHoc]
        copyArr = this.changeFilterMon(null)
        copyArr = this.handleSort(copyArr, this.cursorSort, false)

        var arrChildren = [];
        copyArr.forEach(e => {
            arrChildren.push(React.createElement(Sub, {
                data: e,
                onClick: this.JoinRoom
            }))
        })

        const newListSub = React.createElement(React.Fragment, null, ...arrChildren)

        if (!this.root) {
            const subContainer = document.querySelector(".sub-view")
            this.root = ReactDOM.createRoot(subContainer)
        }
        this.root.render(newListSub)
    }

    this.renderInit = () => {
        checkloggin(() => {
            this.root = null
            Root.render(React.createElement(ListSub, {
                Classhscp: this
            }))
        })
    }

    this.Get_DsPhongHocServer = (callBack) => {
        this.arrListPhongHoc = []
        var dataReq = []
        var count = this.LoaiPhongSelected.length
        this.LoaiPhongSelected.forEach(e => {
            WSGet(function (result) {
                var Data = result.Data.getTable("Data").toJson();

                dataReq = [...dataReq, ...Data]

                count -= 1

                if (count == 0) {
                    this.arrListPhongHoc = dataReq
                    if (callBack) callBack(dataReq);
                }

            }.bind(this), this.DLL, "GetHSPhongHoc", e.toString());
        })
    }

    this.JoinRoom = (data) => {
        classttn = new ThiTracNghiem();
        console.log(data)
        classhtt.joinRoom(data)
    }

    this.init = () => {
        Root.render(React.createElement(ListSub, {
            Classhscp: this
        }))
    }
}