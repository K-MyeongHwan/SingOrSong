import React, {useContext, useEffect, useState} from "react";

// react-bootstrap components
import {
    Badge,
    Button,
    Card,
    Form,
    Navbar,
    Nav,
    Container,
    Row,
    Col
} from "react-bootstrap";
import axios from "axios";
import {MainContext} from "../layouts/Main";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormControl, FormControlLabel, InputLabel, Radio, RadioGroup} from "@mui/material";

function MyPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const {isLogin, setIsLogin} = useContext(MainContext);
    const [userGender, setUserGender] = useState("");
    const [userBirth, setUserBirth] = useState();

    const getLoginUser = () => {
        axios.post("api/user/loginUser").then(async (response) => {
            console.log(response.data);
            if (!response.data) {
                Swal.fire({
                    title: "마이 페이지",
                    text: "미로그인 상태입니다. 로그인 상태를 확인해주세요.",
                    icon: "error"
                }).then(() => {
                    navigate("/login");
                })
            }

            if (response.data.userGender === 1) {
                setUserGender("남성");
            } else if (response.data.userGender === 2) {
                setUserGender("여성");
            } else {
                setUserGender("밝히고 싶지 않음");
            }
             setUser(response.data);

        }).catch((error) => {
            console.log(error);
        })
    }

    const logoutHandler = () => {
        axios.post("/api/user/logout").then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLogin(false);
            Swal.fire({
                title: "로그아웃",
                text: "로그아웃 하셨습니다.",
                icon: "warning"
            }).then(() => {
                navigate("/home");
            })
        })
    }

    useEffect( () => {
        getLoginUser();
    }, []);

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md="8">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">My Page</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col className="pl-1" md="5">
                                            <Form.Group>
                                                <label>이름</label>
                                                <Form.Control
                                                    defaultValue={user.userName}
                                                    disabled
                                                    placeholder="Username"
                                                    type="text"
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="px-1" md="5">
                                            <Form.Group>
                                                <label>닉네임</label>
                                                <Form.Control
                                                    defaultValue={user.nickName}
                                                    placeholder="Username"
                                                    disabled
                                                    type="text"
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pl-1" md="8">
                                            <Form.Group>
                                                <label>이메일</label>
                                                <Form.Control
                                                    defaultValue={user.userEmail}
                                                    placeholder="Email"
                                                    type="email"
                                                    disabled
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <InputLabel>성별</InputLabel>
                                                <FormControl>
                                                    <RadioGroup row>
                                                        <FormControlLabel value={user.userGender} control={<Radio size="small"/>}
                                                                          checked
                                                                          label={userGender}/>
                                                    </RadioGroup>
                                                </FormControl>
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="10">
                                            <Form.Group>
                                                <label>생년월일</label>
                                                <Form.Control
                                                    defaultValue={user.userBirth}
                                                    placeholder="Year"
                                                    type="text"
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button
                                        className="btn-fill pull-right"
                                        type="submit"
                                        variant="info"
                                    >
                                        Update Profile
                                    </Button>
                                    <div className="clearfix"></div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="card-user">
                            <div className="card-image">
                                <img
                                    alt="..."
                                    src={require("../assets/img/photo-1431578500526-4d9613015464.jpeg")}
                                ></img>
                            </div>
                            <Card.Body>
                                <div className="author">
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        <img
                                            alt="..."
                                            className="avatar border-gray"
                                            src={require("../assets/img/faces/face-3.jpg")}
                                        ></img>
                                        <h5 className="title">Mike Andrew</h5>
                                    </a>
                                    <p className="description">michael24</p>
                                </div>
                                <p className="description text-center">
                                    "Lamborghini Mercy <br></br>
                                    Your chick she so thirsty <br></br>
                                    I'm in that two seat Lambo"
                                </p>
                            </Card.Body>
                            <hr></hr>
                            <div className="button-container mr-auto ml-auto">
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    variant="link"
                                >
                                    <i className="fab fa-facebook-square"></i>
                                </Button>
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    variant="link"
                                >
                                    <i className="fab fa-twitter"></i>
                                </Button>
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    variant="link"
                                >
                                    <i className="fab fa-google-plus-square"></i>
                                </Button>
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => logoutHandler()}
                                    variant="link"
                                >
                                    Logout
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MyPage;
