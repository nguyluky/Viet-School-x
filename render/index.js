var _Home_BaiHocGiaoVienID = null;
var _Home_BaiHocID = null;
var _Home_LopID = null;
var _Ttn_Timer;
var _Htt_Timer;
var _Web_Check_Timer;
var User;
let classhscp, classQLBaiHoc, classhtt, classttn, classChamBaiKTTT;
var Cookie = {}
var Setting = {}


const colorTheme = {
    dark: {
        '--background-main': '#1E1F22',
        '--background-content': '#313338',
        '--background-slide-bar': '#2B2D31',
        '--font-color': '#D2D3D7',
        '--color-button': '#5865F2',
        '--color-check': '#23A55A',
        '--filter-thumbnail': 'grayscale(0)',
        '--filter-img-dapan': 'invert(0)',
        '--background-chat': '#262524'
    },

    light: {
        '--background-main': ' #D9D9D9',
        '--background-content': ' #F5F5F5',
        '--background-slide-bar': ' #ECECEC',
        '--font-color': ' #202020',
        '--color-button': ' #5865F2',
        '--color-check': ' #00692c',
        '--filter-thumbnail': 'grayscale(0)',
        '--filter-img-dapan': 'invert(0)',
        '--background-chat': '#D9D9D9'

    }
}

this.DLL_Login = "Elearning.Core.Login"
const Root = ReactDOM.createRoot(document.getElementById("root"))

function logOut() {
    Cookie = {}
    CookieIpc.clear()
    checkloggin()
}

function handleLogin(user, pass, remender) {
    if (!(user && pass)) {
        showMsg("Login", "Bạn chưa nhập đầy đủ thông tin", '', 'war')
        return;
    }
    Cookie[ 'Remenber' ] = remender
    df_ShowLoading()
    Service.call((result) => {
        if (!result.Data) {
            console.log(result.Error)
            df_HideLoading()
            showMsg("Login", result.Error)

        }
        else {
            let data = result.Data;
            if (data instanceof DataTable) {
                if (data.Columns.exist('ID_Parent')) {
                    alert("cảm ơn đã thử dùng ứng dụng, do sự hạn chế bở quền hạn nê chỉ tối ưu hóa cho học sinh mà thôi")
                }

            }
            else {
                if (data.Error != undefined) {
                    console.log(data.Error)
                    showMsg("Login", result.data)
                    return;
                }
                else if (data.get('location') != undefined) {
                    getTNTokenID(data.get('location'), (e) => {

                        if (remender) {
                            CookieIpc.setAll(Cookie)
                        }
                        df_ShowLoading('đăng nhập thành công, đang lấy dữ liệu từ server')
                        WSGet(function (result) {
                            df_HideLoading()
                            var jsonResult = JSON.parse(result.Data);

                            if (jsonResult) {
                                User = jsonResult
                                classhscp = new HocSinhChonPhong();
                                classhscp.init();

                                classhtt = new HocTrucTuyen();
                                classttn = new ThiTracNghiem();
                            }


                        }, "Elearning.Core.Login", "CheckLogged");
                    })
                }
                else if (data.get('Error') != undefined) {
                    showMsg("Login", data.get('Error'))
                    df_HideLoading()
                    console.log(data.get('Error'))
                }
                else {
                    showMsg("Login", "Lỗi đăng nhập không sác định")
                    df_HideLoading()
                }

            }



        }
    }, 'Elearning.Core.Login', 'VietSchoolCheckLogin', user, pass, '', '', '2');
}

function checkloggin(callback) {
    WSGet(function (result) {
        var jsonResult = JSON.parse(result.Data);
        if (jsonResult) {
        }

        else {
            Root.render(React.createElement(LoginPage, { onClick: handleLogin }))
        }

        if (callback) callback()

    }, "Elearning.Core.Login", "CheckLogged");
}

async function fetchAsync(url) {
    let response = await fetch(url);
    let result = await response.text();

    Cookie[ 'LoginOTP' ] = 1
    let line = result.split('\n');
    line.forEach(element => {
        if (element.includes("var sessionid")) {
            var sessionid = element.split('=')[ 1 ].replaceAll("'", "");
            sessionid = sessionid.trim()
            sessionid = sessionid.replace(";", "");
            Cookie[ 'Net_SessionId' ] = sessionid
        }
        else if (element.includes("var token")) {
            var token = element.split('=')[ 1 ].replaceAll("'", "");
            token = token.trim()
            token = token.replace(";", "");
            console.log(token);
            Cookie[ 'TNTokenID' ] = token
        }
        else if (element.includes("var error")) {
            var error = element.split('=')[ 1 ].replaceAll("'", "");
            error = error.substr(1, error.length - 2);
            return;
        }
    });
    return;
}

function getTNTokenID(url, callback) {
    console.log(url)

    fetchAsync(url).then(() => {
        if (callback) callback()
    })
}

SettingIpc.getAll().then(e => {
    Setting = e;
})

CookieIpc.all().then(e => {
    Cookie = e;
})

function getSystemMod() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        SettingIpc.set('theme', 'dark')
        Object.keys(colorTheme.dark).forEach(e => {
            document.documentElement.style.setProperty(e, colorTheme.dark[ e ]);
        })
        return;
    }

    SettingIpc.set('theme', 'light')
    Object.keys(colorTheme.light).forEach(e => {
        document.documentElement.style.setProperty(e, colorTheme.light[ e ]);
    })

    return;

}

function setTheme(mode) {
    var ele = document.querySelectorAll('div.slide-bar-li-chill.on > li')
    ele.forEach(e => {
        e.classList.remove('on')
    })
    if (ele.length == 0)
        ele = null
    if (mode == "light") {
        if (ele)
            ele[ 0 ].classList.add('on')
        Setting[ "theme" ] = 'light'
        SettingIpc.set('theme', 'light')
        Object.keys(colorTheme.light).forEach(e => {
            document.documentElement.style.setProperty(e, colorTheme.light[ e ]);
        })
    }
    else if (mode == "dark") {
        if (ele)
            ele[ 1 ].classList.add('on')

        Setting[ "theme" ] = 'dark'
        SettingIpc.set('theme', 'dark')
        Object.keys(colorTheme.dark).forEach(e => {
            document.documentElement.style.setProperty(e, colorTheme.dark[ e ]);
        })
    }

    else if (mode == 'system') {
        if (ele)
            ele[ 2 ].classList.add('on')

        Setting[ "theme" ] = 'system'
        SettingIpc.set('theme', 'system')
        getSystemMod()
    }
}

function updateMessage(event, html) {
    console.log(html)
    document.querySelector('.appsetting-update-button').innerHTML = html
    if (html.indexOf('install') >= 0) {
        var old_element = document.querySelector('.appsetting-update-button');
        var new_element = old_element.cloneNode(true);
        new_element.onclick = () => {
            console.log('download update')
            App.downloadUpdate()
        }
        old_element.parentNode.replaceChild(new_element, old_element);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.bridge.updateMessage(updateMessage);
});


$(document).ready(() => {


    document.getElementById('close').addEventListener("click", () => {
        App.close()
    })
    document.getElementById('minimize').addEventListener("click", () => {
        App.minimize()
    })
    console.log("ok")
    setTheme(Setting.theme)


    if (!Cookie.LoginOTP) {
        setTimeout(() => {
            Root.render(React.createElement(LoginPage, { onClick: handleLogin }))
        }, 10)
    }
    else {
        df_ShowLoading('vui lòng đợi kết nối với server')
        connect(() => {
            WSGet(function (result) {
                df_HideLoading()
                var jsonResult = JSON.parse(result.Data);
                if (jsonResult) {
                    User = jsonResult
                    classhscp = new HocSinhChonPhong();
                    classhscp.init();

                    classhtt = new HocTrucTuyen();
                    classttn = new ThiTracNghiem();
                }

                else {
                    Root.render(React.createElement(LoginPage, { onClick: handleLogin }))
                }


            }, "Elearning.Core.Login", "CheckLogged");
        })

    }

}

)
