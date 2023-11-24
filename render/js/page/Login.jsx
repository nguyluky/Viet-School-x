function LoginPage(props) {
    const onClick = props.onClick;

    return (
        <React.Fragment>
            <div className="conten">

                <div className="conten-center">
                    <div className="conten-logo">
                        VietSchool
                    </div>
                    <div className="conten-from">
                        <div className='from input'>
                            <input id="username" required></input>
                            <label htmlFor='username'>User</label>
                        </div>

                        <div className='from pass'>
                            <input id='pass' type="password" required></input>
                            <label htmlFor='pass'>Password</label>
                        </div>

                        <div className='remender'>
                            <input id='remender' type='checkbox'></input>
                            <label htmlFor='remender'>duy chì đăng nhập</label>
                        </div>
                    </div>

                    <div className='content-button' onClick={() => {
                        onClick(
                            document.getElementById("username").value,
                            document.getElementById("pass").value,
                            document.getElementById("remender").checked
                        )
                    }}>
                        Login
                    </div>
                </div>
            </div>
        </React.Fragment>

    )

}

function ToastMessage(props) {
    return (
        <div className="toast">
            <div className="toast-top">
                <div className='toast-icon'>
                    <ion-icon name="close-circle"></ion-icon>
                </div>

                <div className="toast-title">
                    Login
                </div>
            </div>

            <div className="toast-body">
                <p>
                    Tài khoản bị đăng nhập ở thiết bị khác
                </p>

                <div className="toast-button">
                    <button>ok</button>
                    <button>cancel</button>

                </div>
            </div>
        </div>
    )
}