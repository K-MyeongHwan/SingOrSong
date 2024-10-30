import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
    const [containerClass, setContainerClass] = useState("container");
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //register
    const [regiEmail, setRegiEmail] = useState();
    const [regiPassword, setRegiPassword] = useState();
    const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [nickName, setNickName] = useState('');
    const [checkDuplicates, setCheckDuplicates] = useState(Boolean());
    const [checkPassword, setCheckPassword] = useState(Boolean());

    const loginHandler = () => {
        const data = {
            username: email,
            password: password
        };
        axios.post("/login", null, {params: data}).then((response) => {
            navigate(0);
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: "로그인 실패",
                text: "이메일, 비밀번호를 잘 못 입력하셨습니다. 다시 한번 확인해주세요.",
                icon: "error"
            })
        })
    }


    const getLoginUser = () => {
        axios.post("/api/user/isLogin").then((response) => {
            console.log(response.data);
            if (response.data) {
                sessionStorage.setItem("loginUser", response.data.loginUser);
                sessionStorage.setItem("loginUserRole", response.data.loginUserRole);

                navigate("/myPage");
            } else {

            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const finalCheckDuplicates = (User) => {


        if (nickName === '') {
            Swal.fire({
                title: "회원가입 오류",
                text: "닉네임이 입력되지 않았습니다. 닉네임을 입력해주세요.",
                icon: "warning"
            });
            return;
        }

        const nickUrl = `/api/user/register/checkNick/${nickName}`
        let nickResult = false;
        axios.get(nickUrl).then((response) => {
            if (response.data) {
                const emailUrl = `/api/user/register/checkEmail/${regiEmail}`;
                axios.get(emailUrl).then((response) => {
                    if (response.data) {
                        insertUserRequest(User);
                    } else {
                        Swal.fire({
                            title: "회원가입 오류",
                            text: "중복되는 이메일이 있습니다. 다른 이메일을 사용해주세요.",
                            icon: "error"
                        }).then(() => {
                            navigate("/register");
                        });
                    }
                });
            } else {
                Swal.fire({
                    title: "중복 체크",
                    text: "중복되는 닉네임이 있습니다. 다른 닉네임을 사용해주세요.",
                    icon: "error"
                });
            }
        })
    }


    const checkRegisterElement = () => {
        if (checkPassword) {
            const User = {
                userName: userName,
                userEmail: regiEmail,
                nickName: nickName,
                userPassword: regiPassword,
            }
            console.log(User);
            finalCheckDuplicates(User);

        } else {
            if (userName === '') {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "이름이 입력되지 않았습니다. 이름을 입력해주세요.",
                    icon: "error"
                });
            }
             else if (!checkPassword) {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "비밀번호 확인란을 비밀번호와 같게 입력해주세요.",
                    icon: "error"
                });
            } else if (regiEmail === '') {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "이메일이 입력되지 않았습니다. 이메일을 입력해주세요.",
                    icon: "error"
                });
            }
        }
    }

    const insertUserRequest = (User) => {
        axios.post(`/api/user/register/new`, User).then((response) => {
            console.log(response.data);
            Swal.fire({
                title: "회원가입 성공",
                text: "회원가입에 성공했습니다. 로그인을 진행해주세요.",
                icon: "success"
            }).then(() => {
                navigate(0);
            });
        }).catch((e) => {
            Swal.fire({
                title: "회원가입 오류",
                text: "회원가입에 실패했습니다. 잠시 뒤에 다시 한번 시도해주세요.",
                icon: "error"
            }).then(() => {
                navigate(0);
            });
        });
    }

    useEffect(() => {
        console.log(sessionStorage.getItem("loginUser"));
        getLoginUser();
    }, []);

    return (
        <div className="myLoginContainer">
            <div className={containerClass} id="container">
                <div className="form-container sign-up-container">
                    <form action="#" style={{
                        overflow: "scroll",
                    }}>
                        <div className="social-container">
                            <h2>회원가입</h2>

                            <a href="/oauth2/authorization/google" className="social"><img className="social-logo"
                                                                                           alt="..."
                                                                                           src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/google_logo.png"/></a>
                            <a href="/oauth2/authorization/kakao" className="social"><img className="social-logo"
                                                                                          alt="..."
                                                                                          src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/kakao_logo.png"/></a>
                            <a href="/oauth2/authorization/naver" className="social"><img className="social-logo"
                                                                                          alt="..."
                                                                                          src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/naver_logo.png"/></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" onChange={(e) => {
                            setUserName(e.target.value);
                        }}/>
                        <input type="text" placeholder="NickName" onChange={(e) => {
                            setNickName(e.target.value);
                        }}/>
                        <input type="email" placeholder="Email" onChange={(e) => {
                            setRegiEmail(e.target.value);
                        }}/>
                        <input type="password" placeholder="Password" onChange={(e) => {
                            setRegiPassword(e.target.value);
                        }}/>
                        <input type="password" placeholder="Password Check" onChange={(e) => {
                            setCheckPassword(e.target.value);
                        }}/>
                        <button onClick={() => {
                            checkRegisterElement()
                        }}>Sign Up
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#">
                        <h1>로그인</h1>
                        <div className="social-container">
                            <a href="/oauth2/authorization/google" className="social"><img className="social-logo"
                                                                                           alt="..."
                                                                                           src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/google_logo.png"/></a>
                            <a href="/oauth2/authorization/kakao" className="social"><img className="social-logo"
                                                                                          alt="..."
                                                                                          src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/kakao_logo.png"/></a>
                            <a href="/oauth2/authorization/naver" className="social"><img className="social-logo"
                                                                                          alt="..."
                                                                                          src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/naver_logo.png"/></a>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                        <input type="password" placeholder="Password" onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                        <hr/>
                        <button onClick={(e) => {
                            loginHandler();
                        }}>로그인
                        </button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>반갑습니다!</h1>
                            <p>당신이 업로드한 커버 곡을 확인해보세요!</p>
                            <button className="ghost" id="signIn" onClick={() => {
                                setContainerClass("container");
                            }}>Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>어서오세요!</h1>
                            <p>지금 가입해서 노래를 부르고, 업로드 해보세요!</p>
                            <button className="ghost" id="signUp" onClick={() => {
                                setContainerClass("container right-panel-active");
                            }}>Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;