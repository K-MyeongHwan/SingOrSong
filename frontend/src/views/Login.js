import React, {useContext, useState} from "react";

// react-bootstrap components
import {
    Badge,
    Button,
    Card,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col, Form,
} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Main, {MainContext} from "../layouts/Main";

function Login() {
    const navigate = useNavigate();
    const {isLogin, setIsLogin} = useContext(MainContext);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleKakaoApi = ()=>{
        axios.post("/api/oauth/kakao").then((response)=>{
            const client_id= response.data.client_id;
            const redirect_uri = response.data.redirect_uri;
            const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;

            window.location.href = kakaoURL;
        }).catch((error)=>{
            console.log(error);
        })
    }

    const handleGoogleApi = ()=>{
        axios.post("/api/oauth/google").then((response)=>{
            const client_id= response.data.client_id;
            const redirect_uri = response.data.redirect_uri;
            const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email profile`;

            window.location.href = googleURL;
        }).catch((error)=>{
            console.log(error);
        })
    }

    const handleNaverApi = ()=>{
        axios.post("/api/oauth/naver").then((response)=>{
            const client_id= response.data.client_id;
            const redirect_uri = response.data.redirect_uri;
            const state = encodeURI("naverApi");

            const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}`;

            window.location.href = naverURL;
        }).catch((error)=>{
            console.log(error);
        })
    }

    const loginHandler = ()=>{
        console.log(email + "." + password);
        const data = {
            userEmail : email ,
            userPassword : password
        };
        axios.post("/api/user/login", null,{ params : data}).then((response)=>{
            if(response.data) {
                Swal.fire({
                   title : "로그인",
                   text : "로그인에 성공했습니다",
                    icon : "success"
                }).then(()=>{
                    setIsLogin(true);
                    navigate("/home");
                })
            } else {
                Swal.fire({
                    title : "로그인",
                    text : "로그인에 실패했습니다, \n 이메일, 비밀번호를 다시 확인해주세요.",
                    icon : "error"
                }).then(()=>{

                })
            }
        }).catch((error)=>{
            console.log(error);
            Swal.fire({
                title : "로그인",
                text : "로그인에 실패했습니다, \n 이메일, 비밀번호를 다시 확인해주세요.",
                icon : "error"
            }).then(()=>{

            })
        })
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title className="myTitle">로그인</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="pl-1" md="6">
                                        <Form.Group>
                                            <label>이메일</label>
                                            <Form.Control onChange={(e)=>{
                                                setEmail(e.target.value);
                                            }}
                                                type="text"
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1" md="6"/>
                                    <Col className="pl-1" md="6">
                                        <Form.Group>
                                            <label>비밀번호</label>
                                            <Form.Control onChange={(e)=>{
                                                setPassword(e.target.value);
                                            }}
                                                type="password"
                                            ></Form.Control>
                                        </Form.Group>
                                        <br/>
                                    </Col>
                                    <Col className="pl-1" md="6"/>
                                    <Col className="pl-1 myLoginHelper" md="5">
                                        <div onClick={(e)=>{
                                            navigate("/register");
                                        }}>
                                            회원가입
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e)=>{
                                            console.log(e.target.value);
                                        }}>
                                            이메일 찾기
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e)=>{
                                            console.log(e.target.value);
                                        }}>
                                            비밀번호 찾기
                                        </div>
                                    </Col>
                                    <Col className="pl-1" md="3">
                                        <Button
                                            className="btn-fill pull-right"
                                            variant="info"
                                            onClick={(e)=>{
                                                loginHandler();
                                            }}
                                        >
                                            로그인
                                        </Button>
                                    </Col>
                                </Row>
                                <Col className="pl-1" md="3">
                                    <hr/>
                                    <h5>또는</h5>
                                </Col>
                                <Row>
                                <Col className="pl-1 myLoginHelper" md="5">
                                        <div onClick={(e)=>{
                                            handleKakaoApi();
                                        }}>
                                            KaKao
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e)=>{
                                            handleGoogleApi();
                                        }}>
                                            Google
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e)=>{
                                            handleNaverApi();
                                        }}>
                                            Naver
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;
