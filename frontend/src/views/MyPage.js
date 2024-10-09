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
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormControl, FormControlLabel, InputLabel, Radio, RadioGroup, Switch} from "@mui/material";
import Select from "react-select";

function MyPage() {
    const navigate = useNavigate();
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

    const [user, setUser] = useState({});
    const [nickName, setNickName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userEmailPlat, setUserEmailPlat] = useState("");
    const [userGender, setUserGender] = useState(0);
    const [userBirth, setUserBirth] = useState("");
    const [userIntroduce, setUserIntroduce] = useState("");

    const [userGenderText, setUserGenderText] = useState("");
    const [userBirthText, setUserBirthText] = useState("");
    const [userBirthComp, setUserBirthComp] = useState(<></>);
    const [userGenderComp, setUserGenderComp] = useState(<></>);
    const [userEmailComp, setUserEmailComp] = useState(<></>);
    const [isUpdateOn, setIsUpdateOn] = useState(false);
    const [updateButton, setUpdateButton] = useState(
        <Button
            className="btn-fill pull-right"
            onClick={() => {
                setIsUpdateOn(!isUpdateOn);
            }}
        >
            프로필 변경
        </Button>
    );

    //profileIamge
    const [profileImage, setProfileImage] = useState({
        image_file: null,
        preview_Url: "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/profileImage/default_1728486344829.png"
    })
    const imgChangeHandler = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setProfileImage({
                    image_file: selectedFile,
                    preview_Url: e.target.result
                });
            }

            reader.readAsDataURL(selectedFile);
        }
    }

    const fileUploadHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (profileImage.image_file) {
            formData.append("profileImage", profileImage.image_file);
            console.log(formData.get("profileImage"));

            axios.post(`/api/user/update/profileImg`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: [
                    function () {
                        return formData;
                    },
                ],
            }).then((response) => {
                console.log(response.data);
                setProfileImage({
                    image_file: null,
                    preview_Url: response.data
                });
            }).catch((error) => {
                console.log(error);
            });
        } else {
            Swal.fire({
                title: "프로필 사진 업로드",
                text: "프로필 사진이 선택되지 않았습니다. 사진을 선택해주세요.",
                icon: "error"
            }).then(() => {

            })
        }
    }

    const getLoginUser = () => {
        axios.post("api/user/loginUser").then((response) => {
            console.log(response.data);
            if (response.data) {
                const userBirthText = (response.data.userBirth + "").split('T')[0];
                let userGenderText = "";
                if (response.data.userGender === 1) {
                    userGenderText = "남성";
                } else if (response.data.userGender === 2) {
                    userGenderText = "여성";
                } else {
                    userGenderText = "밝히고 싶지 않음";
                }

                if (response.data.profileImageUrl) {
                    setProfileImage({
                        image_file: null,
                        preview_Url: response.data.profileImageUrl
                    });
                }

                setUser(response.data);
                setNickName(response.data.nickName);
                setUserGenderText(userGenderText);
                setUserBirthText(userBirthText);

                setUserEmailComp(
                    <Form.Group>
                        <label>이메일</label>
                        <Form.Control
                            defaultValue={response.data.userEmail}
                            placeholder="Email"
                            type="email"
                            disabled
                        ></Form.Control>
                    </Form.Group>
                )
                setUserBirthComp(
                    <Form.Control
                        value={userBirthText}
                        placeholder="BirthDay"
                        type="text"
                        disabled
                    ></Form.Control>
                )
                setUserGenderComp(
                    <FormControl>
                        <RadioGroup row>
                            <FormControlLabel
                                control={<Radio size="small"/>}
                                checked
                                label={userGenderText}/>
                        </RadioGroup>
                    </FormControl>
                )
            } else {
                Swal.fire({
                    title: "마이 페이지",
                    text: "미로그인 상태입니다. 로그인 상태를 확인해주세요.",
                    icon: "error"
                }).then(() => {
                    navigate("/login");
                })
            }
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: "마이 페이지",
                text: "미로그인 상태입니다. 로그인 상태를 확인해주세요.",
                icon: "error"
            }).then(() => {
                navigate("/login");
            })
        })
    }

    const logoutHandler = () => {
        axios.post("/api/user/logout").then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            sessionStorage.clear();
            Swal.fire({
                title: "로그아웃",
                text: "로그아웃 하셨습니다.",
                icon: "warning"
            }).then(() => {
                navigate("/home");
            })
        })
    }

    const deleteHandler = () => {
        axios.delete("/api/user/delete").then((response) => {
            Swal.fire({
                title: "유저 정보 삭제",
                text: "유저 정보가 정상적으로 제거되었습니다.",
                icon: "success"
            }).then(() => {
                logoutHandler();
            })
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: "유저 정보 삭제",
                text: "유저 정보 제거 중 오류가 생겼습니다. 다시 한 번 시도해주세요.",
                icon: "error"
            }).then(() => {
            })
        })
    }

    useEffect(() => {
        getLoginUser();
    }, []);

    useEffect(() => {
        const updateHandler = () => {
            const email = userEmail + '@' + userEmailPlat;
            const url = `/api/user/register/checkEmail/${email}`;
            const user = {
                userEmail: email,
                nickName: nickName,
                userGender: userGender,
                userBirth: userBirth,
                userIntroduce: userIntroduce
            }

            axios.get(url).then((response) => {
                console.log(response.data);
                if (response.data) {
                    axios.put("/api/user/update", user).then((response) => {
                        Swal.fire({
                            title: "유저 정보 수정",
                            text: "유저 정보를 수정했습니다.",
                            icon: "success"
                        }).then(() => {
                            window.location.reload();
                        })
                    }).catch((error) => {
                        console.log(error);
                        Swal.fire({
                            title: "유저 정보 수정",
                            text: "정보 수정 중 오류가 발생했습니다. 다시 한 번 시도해주세요.",
                            icon: "error"
                        }).then(() => {

                        })
                    });
                } else {
                    Swal.fire({
                        title: "유저 정보 수정",
                        text: "중복되는 이메일이 있습니다. 다른 이메일로 시도해주세요.",
                        icon: "error"
                    }).then(() => {

                    })
                }
            }).catch((error) => {
                console.log(error);
            })
        }

        if (isUpdateOn) {
            //true
            //userEmailComp, userGenderComp, userBirthComp 변경
            setUserEmailComp(
                <Row>
                    <Col className="pl-1" md="6">
                        <Form.Group>
                            <label>이메일</label>
                            <Form.Control
                                required
                                placeholder="Email"
                                type="text"
                                onChange={(e) => {
                                    setUserEmail(e.target.value);
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                        <div className="myEmail">
                            <h4>
                                @
                            </h4>
                            <Form.Group>
                                <label>주소</label>
                                <Select options={addressList}
                                        placeholder="address.com"
                                        onChange={(e) => {
                                            setUserEmailPlat(e.value);
                                        }}
                                />
                            </Form.Group>
                        </div>
                    </Col>
                </Row>
            )

            setUserGenderComp(
                <FormControl>
                    <RadioGroup row onChange={(e) => {
                        setUserGender(e.target.value);
                    }}>
                        <FormControlLabel value={1} control={<Radio size="small"/>}
                                          label="남성"/>
                        <FormControlLabel value={2} control={<Radio size="small"/>}
                                          label="여성"/>
                    </RadioGroup>
                </FormControl>
            )

            setUserBirthComp(
                <Form.Control
                    defaultValue={userBirthText}
                    placeholder="BirthDay"
                    type="date"
                    onChange={(e) => {
                        setUserBirth(e.target.value);
                    }}
                ></Form.Control>
            )

            setUpdateButton(
                <>
                    <Button
                        className="myCancelButton"
                        onClick={() => {
                            setIsUpdateOn(false);
                        }}
                    >
                        취소
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                        className="mySaveButton"
                        onClick={() => {
                            updateHandler()
                        }}
                    >
                        저장
                    </Button>
                </>
            )
        } else {
            //false
            //userEmailComp, userGenderComp, userBirthComp 복귀
            setNickName(user.nickName);
            setUserEmailComp(
                <Form.Group>
                    <label>이메일</label>
                    <Form.Control
                        defaultValue={user.userEmail}
                        placeholder="Email"
                        type="email"
                        disabled
                    ></Form.Control>
                </Form.Group>
            );

            setUserGenderComp(
                <FormControl>
                    <RadioGroup row>
                        <FormControlLabel
                            control={<Radio size="small"/>}
                            checked
                            label={userGenderText}/>
                    </RadioGroup>
                </FormControl>
            )

            setUserBirthComp(
                <Form.Control
                    value={userBirthText + ""}
                    placeholder="BirthDay"
                    type="text"
                    disabled
                ></Form.Control>
            )

            setUpdateButton(
                <Button
                    className="btn-fill pull-right"
                    onClick={() => {
                        setIsUpdateOn(!isUpdateOn);
                    }}
                >
                    프로필 변경
                </Button>
            );
        }
    }, [isUpdateOn, nickName, userBirth, userEmail, userEmailPlat, userGender, userIntroduce])

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
                                                    value={nickName + ""}
                                                    placeholder="Username"
                                                    onChange={(e) => {
                                                        setNickName(e.target.value);
                                                    }}
                                                    disabled={!isUpdateOn}
                                                    type="text"
                                                ></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pl-1" md="8">
                                            {userEmailComp}
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row className="mySignUp">
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <InputLabel>성별</InputLabel>
                                                {userGenderComp}
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="10">
                                            <Form.Group>
                                                <label>생년월일</label>
                                                {userBirthComp}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {updateButton}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className={"myCoinCount"}>
                            남은코인 : {user.coinCount}
                        </Card>
                        <Card className="card-user">
                            <div className="card-image">

                            </div>
                            <Card.Body>
                                <div className="author">
                                    <input type={"file"} id={"profileImageInput"} hidden={true} onChange={(e) => {
                                        imgChangeHandler(e)
                                    }}/>
                                    <img
                                        hidden={isUpdateOn}
                                        alt="..."
                                        className="avatar border-gray"
                                        src={profileImage.preview_Url}
                                    ></img>
                                    <label htmlFor={"profileImageInput"} hidden={!isUpdateOn}>
                                        <img
                                            alt="..."
                                            className="avatar border-gray"
                                            src={profileImage.preview_Url}
                                        ></img>
                                    </label>
                                    <button hidden={!isUpdateOn} onClick={(e) => {
                                        fileUploadHandler(e)
                                    }}>upload
                                    </button>
                                    <h5 className="title">{user.userName}</h5>
                                    <p className="description">{user.nickName}</p>
                                </div>
                                <p className="description text-center"
                                   hidden={isUpdateOn}
                                   style={{
                                       whiteSpace: "pre-wrap"
                                   }}>
                                    {user.userIntroduce}
                                </p>
                                <textarea hidden={!isUpdateOn} onChange={(e) => {
                                    setUserIntroduce(e.target.value)
                                }}>

                                </textarea>
                            </Card.Body>
                            <hr></hr>
                            <div className="button-container mr-auto ml-auto">
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => logoutHandler()}
                                    variant="link"
                                >
                                    Logout
                                </Button>
                                <Button
                                    className="btn-simple btn-icon"
                                    href="#pablo"
                                    onClick={(e) => deleteHandler()}
                                    variant="link"
                                >
                                    Withdrawal
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
