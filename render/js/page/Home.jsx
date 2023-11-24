const name2url = {
    'Toán': "./img/Toan.jpg",
    "Vật lí": "./img/VatLy.jpg",
    "Hóa học": "./img/HoaHoc.jpg",
    "Sinh học": "./img/SinhHoc.jpg",
    "Tin học": "./img/TinHoc.jpg",
    "GD QP-AN": "./img/GDCP.jpg",
    "Công nghệ": "./img/CongNghe.jpg",
    "Ngữ văn": "./img/Van.jpg",
    "Lịch Sử": "./img/LinhSu.jpg",
    "Địa Lí": "./img/DiaLy.jpg",
    'GDCD': "./img/GDCD.jpg",
    "Thể dục": "",
    "Ngoại ngữ": "./img/TienAnh.jpg",
    "Tin học": "./img/TinHoc.jpg",
};

function ListButton(props) {
    const contenEle = React.useRef()

    const [onActive, setOnActive] = React.useState(false)

    React.useEffect(() => {
        return (() => {
            document.removeEventListener("click", turnOff)
        })
    }, [])

    const turnOff = (event) => {
        var target = $(event.target);
        // kiểm tra xem có phải là con của "div.filter-conten"
        if (target.parents('div.filter-conten').length) return

        var ele = contenEle.current
        if (ele) ele.style.transform = 'scaleY(0)'

        setTimeout(() => {
            document.removeEventListener("click", turnOff)
        }, 100)

        setTimeout(() => {
            setOnActive(false)
        }, (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--time-animation').replace('s', '')) + 0.1) * 1000)
    }

    const turnOn = props.onClick || function (event) {
        if (onActive) return
        setTimeout(() => {
            document.addEventListener("click", turnOff)
        }, 100)
        setOnActive(true)
    }

    return (
        <div className="filter-button">
            <div className="filter-title" onClick={turnOn}>
                <ion-icon name={props.Icon}></ion-icon>
                <span>{props.Text}</span>
            </div>

            {onActive && props.children ? (
                <div className="templay">
                    <div className="filter-conten" ref={contenEle}>
                        {props.children}
                    </div>
                </div>
            ) : ''}



        </div>
    )
}

function Filter(props) {

    const arrMonHoc = Array.from(new Set(props.data.arrListPhongHoc.map(e => e.TenMon)))
    const arrTypePhong = Array.from(new Set(props.data.arrListPhongHoc.map(e => e.VaoPhong)))
    const [onMonSele, setMonSele] = React.useState(props.data.arrFilterMonS)
    const [proSeleSort, setProSeleSort] = React.useState(props.data.lastSort)

    return (
        <div className="filter">
            <div className="type-filter">
                <ListButton Icon="book" Text="Môn">
                    <div className="mon-view-sel">
                        {arrMonHoc.map((e, index) => {
                            return (

                                <div className="mon-ops" key={index} style={[...onMonSele].includes(e) ? { background: 'yellowgreen', color: '#000' } : {}} onClick={() => {
                                    setMonSele(arr => {
                                        var newArr = [...arr]
                                        if (newArr.includes(e)) {
                                            newArr.splice(newArr.indexOf(e), 1)
                                        }
                                        else {
                                            newArr.push(e)
                                        }

                                        return newArr
                                    })
                                    classhscp.changeFilterMon(e)
                                    props.update()
                                }}>
                                    {e}
                                </div>
                            )


                        })}
                    </div>
                </ListButton>

                <ListButton Icon="list" Text="Loại phòng">
                    <div className="sort-view-sele">
                        {arrTypePhong.map((e, index) => {
                            return (
                                <div className="mon-ops" key={index} style={classhscp.typySort == e ? { background: 'yellowgreen', color: '#000' } : {}} onClick={() => {
                                    if (classhscp.typySort == e)
                                        classhscp.setTypePhong('')
                                    else
                                        classhscp.setTypePhong(e)
                                    props.update()
                                }}>
                                    {e}
                                </div>
                            )
                        })}
                    </div>
                </ListButton>


                <ListButton Icon="funnel" Text="Sort">
                    <div className="sort-view-sele">
                        <div className={"GioDay" == proSeleSort ? "sort-ops on" : "sort-ops"} onClick={() => {
                            var current = ''
                            if (proSeleSort == "GioDay") {
                                current = ''
                            }
                            else {
                                current = "GioDay"
                            }
                            classhscp.setCursorSort(current)
                            props.update()
                            setProSeleSort(current)

                        }}>
                            <ion-icon name="calendar-number"></ion-icon>
                            <p>
                                Thời gian tải lên
                            </p>
                        </div>
                        <div className={"TenBaiHoc" == proSeleSort ? "sort-ops on" : "sort-ops"} onClick={() => {
                            var current = ''
                            if (proSeleSort == "TenBaiHoc") {
                                current = ''
                            }
                            else {
                                current = "TenBaiHoc"
                            }

                            classhscp.setCursorSort(current)
                            props.update()
                            setProSeleSort(current)
                        }}>
                            <ion-icon src="svg/sort-alpha-down-svgrepo-com.svg"></ion-icon>
                            <p>
                                Tên bài học
                            </p>
                        </div>
                    </div>
                </ListButton>


                <ListButton Icon="close" Text="Clear" onClick={() => {
                    setMonSele([])
                    setProSeleSort('')
                    classhscp.clearFilter()
                    props.update()
                }}>
                </ListButton>

                <ListButton Icon="refresh" Text="refresh" onClick={() => { console.log('hello') }}>

                </ListButton>
            </div>
            <div
                className="slide-bar-button"
                onClick={() => {
                    props.slideBar();
                }}
            >
                <ion-icon name="menu-outline"></ion-icon>
            </div>
        </div>
    )
}

function Sub(props) {
    const backgrounds = ["yellowgreen", "orange", "tomato"];
    var data = props.data;
    // console.log(data)
    var onJoinRoom = props.onClick;
    return (
        <div className="sub" onClick={() => { onJoinRoom(data); }}>
            <div className="sub-sta" style={{ background: backgrounds[data.TrangThaiID], }} >
                {data.VaoPhong}
            </div>

            <div className="sub-save">
                <ion-icon name="star-outline"></ion-icon>
            </div>
            <div className="sub-img">
                <img src={name2url[data.TenMon]} alt="" />
            </div>
            <div className="sub-title">
                <p className="title">{data.TenBaiHoc}</p>
            </div>
            <p className="sub-TenGiaoVien li">
                {data.TenGiaoVien} - {data.TenMon}
            </p>
            <p className="sub-date li">{data.NgayDayHienThi}</p>
        </div>
    );
}


function TabSlideBar({ title, iconName, iconScr, children }) {
    const [active, SetActive] = React.useState(false);
    // console.log(children)
    return (
        <div className="slide-bar-li">
            <div className="slide-bar-li-title" onClick={() => {
                SetActive((e) => !e);
            }}>
                <ion-icon {...(iconName ? { "name": iconName } : { src: iconScr })}></ion-icon>
                <p>{title}</p>
                <div className="slide-bar-end">
                    <ion-icon name="caret-down"></ion-icon>
                </div>
            </div>

            <div className="slide-bar-li-chill" style={!active ? { height: '0px', opacity: 0 } : { height: `${children.length * 25 + 3}px`, opacity: 1 }}>
                {children}
            </div>
        </div>
    )
}

function SlideBar(props) {

    const [theme, setThemeState] = React.useState(Setting.theme)

    // const []
    var loaiPhongSele = props.loaiPhongSele
    const setLoaiPhongSele = props.handelSetLoaiPhongSele
    const handelSetLoaiPhongSele = (id) => {

        var newData = [...loaiPhongSele]
        if (newData.includes(id)) {
            if (newData.length == 1) return newData
            newData.splice(newData.indexOf(newData), 1);
            classhscp.setLoaiPhongSelected(newData)
            setLoaiPhongSele(newData)
        }

        else {
            classhscp.setLoaiPhongSelected([...newData, id])
            setLoaiPhongSele([...newData, id])
        }
    }

    return (
        <div className="slide-bar-connet">
            <div className="slide-bar-top">

                <TabSlideBar title="Phòng học" iconName="home">
                    <li className={loaiPhongSele.includes(0) ? 'on' : ''} onClick={() => {
                        handelSetLoaiPhongSele(0)
                    }}>
                        <p>Đang diễn ra</p>
                    </li>
                    <li className={loaiPhongSele.includes(1) ? 'on' : ''} onClick={() => {
                        handelSetLoaiPhongSele(1)
                    }}>
                        <p>Chưa bắt đầu</p>
                    </li>
                    <li className={loaiPhongSele.includes(2) ? 'on' : ''} onClick={() => {
                        handelSetLoaiPhongSele(2)
                    }}>
                        <p>Đã kết thúc</p>
                    </li>
                </TabSlideBar>

                <TabSlideBar title="Điểm" iconName="bar-chart">
                    <li>
                        <p>Điểm lớp học</p>
                    </li>
                    <li>
                        <p>Điểm trên trường</p>
                    </li>
                </TabSlideBar>

                <TabSlideBar title="Theme" iconName="contrast">
                    <li onClick={() => { setTheme('light'); setThemeState('light') }} className={theme == 'light' ? 'on' : ''}>
                        <p>Light mod</p>
                    </li>
                    <li onClick={() => { setTheme('dark'); setThemeState('dark') }} className={theme == 'dark' ? 'on' : ''}>
                        <p>Dark mod</p>
                    </li>
                    <li onClick={() => { setTheme('system'); setThemeState('system') }} className={theme == 'system' ? 'on' : ''}>
                        <p>System mod</p>
                    </li>
                </TabSlideBar>

                <div className="slide-bar-li">
                    <div className="slide-bar-li-title">
                        <ion-icon name="calendar-clear-outline"></ion-icon>
                        <p>Thời khóa biểu</p>
                    </div>
                </div>
            </div>
            <div className="slide-bar-bottom">
                <div className="slide-bar-li">
                    <div className="slide-bar-li-title" >
                        {/* <ion-icon name="bar-chart"></ion-icon> */}
                        <div className="slide-bar-tar" onClick={() => { logOut() }}>
                            <ion-icon name="log-out-outline"></ion-icon>
                            <p>Đăng xuất</p>
                        </div>
                        <div className="slide-bar-setting" onClick={() => { console.log('setting'); SettingInitRender() }}>
                            <ion-icon name="settings-sharp"></ion-icon>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ListSub(props) {

    const domDivTop = React.useRef();
    const Classhscp = props.Classhscp;

    const [arrSub, setArrSub] = React.useState(Classhscp.handleSort())
    const [loaiPhongSele, setLoaiPhongSele] = React.useState(Classhscp.LoaiPhongSelected)
    const [isLoad, setIsLoad] = React.useState(true)

    const update = () => {
        setArrSub(Classhscp.handleSort())
    }

    React.useEffect(() => {
        setIsLoad(true)
        console.log('get Get_DsPhongHocServer')
        Classhscp.Get_DsPhongHocServer((data) => {
            update()
            setIsLoad(false)
        })
    }, [loaiPhongSele])

    return (
        <React.Fragment>
            <div className="list-sub">
                <div className="list-div-left">
                    <Filter
                        handelSetLoaiPhongSele={setLoaiPhongSele}
                        update={update}
                        onClick={Classhscp.handleFilter}
                        slideBar={Classhscp.handlslideBar}
                        data={Classhscp}
                    />
                    <div className="lis-sub-bottom">
                        {
                            isLoad ? (
                                <div className="Loading-screen">
                                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                </div>
                            ) : (
                                <React.Fragment>
                                    <div className="div_top" ref={domDivTop}></div>
                                    <div className="sub-view" onScroll={e => {
                                        if (e.target.scrollTop == 0) {
                                            domDivTop.current.style.opacity = 0;
                                        }
                                        else {
                                            domDivTop.current.style.opacity = 1;
                                        }
                                    }}>
                                        {arrSub.map((e, index) => (<Sub key={index} data={e} onClick={Classhscp.JoinRoom} />))}
                                    </div>
                                </React.Fragment>
                            )
                        }

                    </div>
                </div>
                <div className="slide-bar" id="listPhongSlideBar">
                    <SlideBar handelSetLoaiPhongSele={setLoaiPhongSele} loaiPhongSele={loaiPhongSele} />
                </div>
            </div>


        </React.Fragment>
    );
}
