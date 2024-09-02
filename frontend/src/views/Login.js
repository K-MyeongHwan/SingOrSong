import React from "react";

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

function Login() {
    const navigate = useNavigate();

    const handleKakaoApi = ()=>{
        axios.post("/api/oauth/kakao").then((response)=>{
            const Rest_api_key= response.data.rest_api_key;
            const redirect_uri = response.data.redirect_uri;
            const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

        }).catch((error)=>{
            console.log(error);
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
                                            <Form.Control
                                                type="text"
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1" md="6"/>
                                    <Col className="pl-1" md="6">
                                        <Form.Group>
                                            <label>비밀번호</label>
                                            <Form.Control
                                                type="text"
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

                                        }}>
                                            Gmail
                                        </div>
                                        &nbsp;|&nbsp;
                                        <div onClick={(e)=>{

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
