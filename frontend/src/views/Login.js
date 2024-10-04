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

    const loginHandler = ()=>{
        const data = {
            username : email ,
            password : password
        };
        axios.post("/login", null,{ params : data}).then((response)=>{
            navigate("/home");
        }).catch((error)=>{
            console.log(error);
            Swal.fire({
                title : "로그인 실패",
                text : "이메일, 비밀번호를 잘 못 입력하셨습니다. 다시 한번 확인해주세요.",
                icon : "error"
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
                                            <Form.Control onChange={(e) => {
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
                                            <Form.Control onChange={(e) => {
                                                setPassword(e.target.value);
                                            }}
                                                          type="password"
                                            ></Form.Control>
                                        </Form.Group>
                                        <br/>
                                    </Col>
                                    <Col className="pl-1" md="6"/>
                                    <Col className="pl-1 myLoginHelper" md="5">
                                        <div onClick={(e) => {
                                            navigate("/register");
                                        }}>
                                            회원가입
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e) => {
                                            console.log(e.target.value);
                                        }}>
                                            이메일 찾기
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e) => {
                                            console.log(e.target.value);
                                        }}>
                                            비밀번호 찾기
                                        </div>
                                    </Col>
                                    <Col className="pl-1" md="3">
                                        <Button
                                            className="btn-fill pull-right"
                                            variant="info"
                                            onClick={(e) => {
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
                                        <a href="/oauth2/authorization/google">Google</a>
                                        &nbsp;|&nbsp;
                                        <a href="/oauth2/authorization/kakao">Kakao</a>
                                        &nbsp;|&nbsp;
                                        <a href="/oauth2/authorization/naver">Naver</a>
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
