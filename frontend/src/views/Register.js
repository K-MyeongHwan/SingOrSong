import React, {useRef, useState} from "react";

// react-bootstrap components
import {
    Button,
    Card,
    Form,
    Container,
    Row,
    Col
} from "react-bootstrap";
import {FormControl, FormControlLabel, InputLabel, Radio, RadioGroup} from "@mui/material";
import {DatePicker} from "rsuite";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [nickName, setNickName] = useState('');
    const [checkDuplicates, setCheckDuplicates] = useState(Boolean());
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState(Boolean());
    const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
    const [gender, setGender] = useState(0);
    const [birth, setBirth] = useState(null);
    const [email, setEmail] = useState('');
    const [emailPlatform, setEmailPlatform] = useState('');
    const addressList = [
        {
            label: "naver.com",
            value: "naver.com"
        },
        {
            label: "gmail.com",
            value: "gmail.com"
        },
        {
            label: "daum.net",
            value: "daum.net"
        }
    ];

    const nickNameCheckDuplicates = (nickName) => {
        if (nickName === '') {
            Swal.fire({
                title: "회원가입 오류",
                text: "닉네임이 입력되지 않았습니다. 닉네임을 입력해주세요.",
                icon: "warning"
            });

            return;
        }

        const url = `/api/user/register/checkNick/${nickName}`
        axios.get(url).then((response) => {
            if (response.data) {
                setCheckDuplicates(true);
                Swal.fire({
                    title: "중복 체크",
                    text: "중복되는 닉네임이 없습니다.",
                    icon: "success"
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

    const finalCheckDuplicates = (User) => {
        const url = `/api/user/register/checkEmail/${User.userEmail}`;
        let result = false;
        axios.get(url).then((response) => {
            if (response.data) {
                insertUserRequest(User);
            } else {
                result = response.data;
                Swal.fire({
                    title: "회원가입 오류",
                    text: "중복되는 이메일이 있습니다. 다른 이메일을 사용해주세요.",
                    icon: "error"
                }).then(()=>{
                    navigate("/register");
                });
            }
        })

        return result;
    }

    const insertUserRequest = (User) => {
        axios.post(`/api/user/register/new`, User).then((response) => {
            console.log(response.data);
            Swal.fire({
                title: "회원가입 성공",
                text: "회원가입에 성공했습니다. 로그인을 진행해주세요.",
                icon: "success"
            }).then(() => {
                navigate("/login");
            });
        }).catch((e) => {
            Swal.fire({
                title: "회원가입 오류",
                text: "회원가입에 실패했습니다. 잠시 뒤에 다시 한번 시도해주세요.",
                icon: "error"
            }).then(() => {
                navigate("/register");
            });
        });
    }

    const checkRegisterElement = () => {
        if (checkDuplicates && checkPassword && gender !== 0 && birth !== null && emailPlatform !== '') {
            const User = {
                userName: userName,
                userEmail: email + '@' + emailPlatform,
                nickName: nickName,
                userPassword: password,
                userGender: gender,
                userBirth: birth
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
            } else if (!checkDuplicates) {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "닉네임 중복체크를 진행해주세요.",
                    icon: "error"
                });
            } else if (!checkPassword) {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "비밀번호 확인란을 비밀번호와 같게 입력해주세요.",
                    icon: "error"
                });
            } else if (email === '') {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "이메일이 입력되지 않았습니다. 이메일을 입력해주세요.",
                    icon: "error"
                });
            } else if (gender === 0) {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "성별이 선택되지 않았습니다. 성별을 선택해주세요.",
                    icon: "error"
                });
            } else if (birth === null) {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "생년월일이 입력되지 않았습니다. 생년월일을 선택해주세요.",
                    icon: "error"
                });
            } else if (emailPlatform === '') {
                Swal.fire({
                    title: "회원가입 오류",
                    text: "이메일 플랫폼이 선택되지 않았습니다. 이메일 플랫폼을 선택해주세요.",
                    icon: "error"
                });
            }
        }
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title className="myTitle">회원가입</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <form>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <label>이름</label>
                                                <Form.Control
                                                    required
                                                    placeholder="Name"
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUserName(e.target.value);
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <label>닉네임</label>
                                                <Form.Control
                                                    required
                                                    placeholder="NickName"
                                                    type="text"
                                                    onChange={(e) => {
                                                        setNickName(e.target.value);
                                                        setCheckDuplicates(false);
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="1">
                                            <Form.Group>
                                                <label>&nbsp;</label>
                                                <Form.Control
                                                    className="myCheckButton"
                                                    defaultValue="중복확인"
                                                    type="Button"
                                                    onClick={() => {
                                                        nickNameCheckDuplicates(nickName);
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <label>이메일</label>
                                                <Form.Control
                                                    required
                                                    placeholder="Email"
                                                    type="text"
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="3">
                                            <div className="myEmail">
                                                <h4>
                                                    @
                                                </h4>
                                                <Form.Group>
                                                    <label>주소</label>
                                                    <Select options={addressList}
                                                            placeholder="address.com"
                                                            onChange={(e) => {
                                                                setEmailPlatform(e.value);
                                                            }}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="6">
                                            <Form.Group>
                                                <label>비밀번호</label>
                                                <Form.Control
                                                    required
                                                    placeholder="Password"
                                                    type="password"
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                        setCheckPassword(false);
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="6">
                                            <Form.Group>
                                                <label>비밀번호 확인</label>
                                                <Form.Control
                                                    required
                                                    placeholder="Password"
                                                    type="password"
                                                    onChange={(e) => {
                                                        if (e.target.value === password) {
                                                            setPasswordCheckMessage('');
                                                            setCheckPassword(true);
                                                        } else {
                                                            setPasswordCheckMessage('비밀번호를 다르게 입력했어요.');
                                                            setCheckPassword(false);
                                                        }
                                                    }}
                                                ></Form.Control>
                                                <h6 style={{color: "red"}}>{passwordCheckMessage}</h6>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <InputLabel>성별</InputLabel>
                                                <FormControl>
                                                    <RadioGroup row onChange={(e) => {
                                                        setGender(e.target.value);
                                                    }}>
                                                        <FormControlLabel value={1} control={<Radio size="small"/>}
                                                                          label="남성"/>
                                                        <FormControlLabel value={2} control={<Radio size="small"/>}
                                                                          label="여성"/>
                                                    </RadioGroup>
                                                </FormControl>
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <InputLabel>생년월일</InputLabel>
                                                <Form.Control
                                                    placeholder="UserBirthDay"
                                                    type="date"
                                                    onChange={(e)=>{
                                                        setBirth(e.target.value);
                                                    }}
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Col className="pl-1" md="3">
                                        <Button
                                            className="btn-fill pull-right"
                                            variant="info"
                                            onClick={() => {
                                                checkRegisterElement()
                                            }}
                                        >
                                            회원가입
                                        </Button>
                                    </Col>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
        ;
}

export default Register;
