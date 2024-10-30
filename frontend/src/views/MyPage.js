import React, {useContext, useEffect, useState} from "react";

// react-bootstrap components
import {
    Badge, Button, Card, Form, Navbar, Nav, Container, Row, Col
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormControl, FormControlLabel, InputLabel, Radio, RadioGroup, Switch} from "@mui/material";
import Select from "react-select";
import {DataGrid} from "@mui/x-data-grid";
import AudioPlayer from "react-h5-audio-player";
import Modal from "react-modal";

function MyPage() {
    const navigate = useNavigate();
    const inputStyle = {
        backgroundColor: "transparent"
    }

    const [isModalOpen, setIsModalOpen] = useState({
        isOpen: false, selectedRecordUrl: null
    });

    let columns = [{
        field: "recordId", headerName: "커버 번호",
        headerClassName: 'super-app-theme--header',
        width: 150
    }, {
        field: "songAlbum", headerName: "노래 앨범", width: 80,
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
            return (<div>
                <img
                    className="songListAlbum border-gray"
                    src={params.row.song.songImageUrl}
                />
            </div>)
        }
    }, {
        field: "songName", headerName: "곡 이름", width: 250,
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
            return (<div onClick={(e) => {
                navigate(`/song/${params.row.song.songNum}`);
            }}>
                {params.row.song.songName}
            </div>)
        }
    }, {
        field: "user", headerName: "이름", width: 250,
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
            return (<div>
                {params.row.user.nickName}
            </div>)
        }
    }, {
        field: "viewCount", headerName: "조회수", width: 100,
        headerClassName: 'super-app-theme--header'
    }, {
        field: "isPublic", headerName: "업로드 여부", width: 90,
        headerClassName: 'super-app-theme--header',
        renderCell: (params) => {
            return (<div style={{
                marginTop: "20px"
            }}>
                <input
                    style={{
                        display: "flex", margin: "auto",
                    }} type="checkbox"
                    defaultChecked={params.row.isPublic}
                    onChange={(e) => {
                        publicHandler(e.target.checked, e.currentTarget, params.row);
                    }}
                />
            </div>)
        }
    }, {
        field: "recordSound", headerName: "듣기", width: 100,
        headerClassName: 'super-app-theme--header',
        flex: 1,
        renderCell: (params) => {
            return (<div style={{
                display : "flex",
                justifyContent : "center",
                margin: "auto"
            }}>
                <Button
                    className="mySaveButton"

                    onClick={() => {
                        setIsModalOpen({
                            isOpen: true, selectedRecordUrl: params.row.recordSoundUrl
                        });
                    }}
                >
                    듣기
                </Button>
            </div>)
        }
    }]

    const [user, setUser] = useState({});
    const [nickName, setNickName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userEmailPlat, setUserEmailPlat] = useState("");
    const [userGender, setUserGender] = useState(0);
    const [userBirth, setUserBirth] = useState("");
    const [userIntroduce, setUserIntroduce] = useState("");
    const [recordList, setRecordList] = useState([]);

    const [userGenderText, setUserGenderText] = useState("");
    const [userBirthText, setUserBirthText] = useState("");
    const [userBirthComp, setUserBirthComp] = useState(<></>);
    const [userGenderComp, setUserGenderComp] = useState(<></>);
    const [userEmailComp, setUserEmailComp] = useState(<></>);
    const [isUpdateOn, setIsUpdateOn] = useState(false);
    const [updateButton, setUpdateButton] = useState(<Button
        className="btn-fill pull-right"
        onClick={() => {
            setIsUpdateOn(!isUpdateOn);
        }}
    >
        프로필 변경
    </Button>);

    //profileIamge
    const [profileImage, setProfileImage] = useState({
        image_file: null,
        preview_Url: "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/profileImage/default_1728486344829.png"
    });
    const [profileImageOriName, setProfileImageOriName] = useState("");
    const imgChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setProfileImageOriName(selectedFile.name);
        }

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setProfileImage({
                    image_file: selectedFile, preview_Url: e.target.result
                });
            }

            reader.readAsDataURL(selectedFile);
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
                        image_file: null, preview_Url: response.data.profileImageUrl
                    });
                }

                setUser(response.data);
                setNickName(response.data.nickName);
                setUserIntroduce(response.data.userIntroduce);
                setUserGenderText(userGenderText);
                setUserBirthText(userBirthText);
                setUserBirth(userBirthText);
                setProfileImageOriName(response.data.profileImageOriName);

                setUserEmailComp(<Form.Group>
                    <label>이메일</label>
                    <Form.Control
                        style={inputStyle}
                        defaultValue={response.data.userEmail}
                        placeholder="Email"
                        type="email"
                        disabled
                    ></Form.Control>
                </Form.Group>)
                setUserBirthComp(<Form.Control
                    style={inputStyle}
                    value={userBirthText}
                    placeholder="BirthDay"
                    type="text"
                    disabled
                ></Form.Control>)
                setUserGenderComp(<FormControl>
                    <RadioGroup row>
                        <FormControlLabel
                            control={<Radio size="small"/>}
                            checked
                            label={userGenderText}/>
                    </RadioGroup>
                </FormControl>)
            } else {
                Swal.fire({
                    title: "마이 페이지", text: "미로그인 상태입니다. 로그인 상태를 확인해주세요.", icon: "error"
                }).then(() => {
                    sessionStorage.clear();
                    navigate("/login");
                })
            }
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: "마이 페이지", text: "미로그인 상태입니다. 로그인 상태를 확인해주세요.", icon: "error"
            }).then(() => {
                sessionStorage.clear();
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
                title: "로그아웃", text: "로그아웃 하셨습니다.", icon: "warning"
            }).then(() => {
                navigate("/home");
            })
        })
    }

    const deleteHandler = () => {
        axios.delete("/api/user/delete").then((response) => {
            Swal.fire({
                title: "유저 정보 삭제", text: "유저 정보가 정상적으로 제거되었습니다.", icon: "success"
            }).then(() => {
                logoutHandler();
            })
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: "유저 정보 삭제", text: "유저 정보 제거 중 오류가 생겼습니다. 다시 한 번 시도해주세요.", icon: "error"
            }).then(() => {
            })
        })
    }

    const publicHandler = (bool, target, record) => {

        if (bool) {
            Swal.fire({
                title: "커버 곡 업로드", text: "커버 곡을 공개하시겠습니까?", icon: "warning", showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    record.isPublic = true;
                    axios.post('/api/record/update', record).then((response) => {
                        Swal.fire({
                            title: "커버 곡 업로드", text: "커버 곡이 공개되었습니다", icon: "success",
                        }).then(() => {
                            navigate(0);
                        });
                    });

                    target.checked = true;
                } else {
                    target.checked = false;
                }
            })
        } else {
            Swal.fire({
                title: "커버 곡 업로드", text: "커버 곡을 비공개하시겠습니까?", icon: "warning", showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    record.isPublic = false;
                    axios.post('/api/record/update', record).then((response) => {
                        Swal.fire({
                            title: "커버 곡 업로드", text: "커버 곡이 비공개되었습니다", icon: "success",
                        }).then(() => {
                            navigate(0);
                        });
                    });

                    target.checked = false;
                } else {
                    target.checked = true;
                }
            })
        }
    }

    useEffect(() => {
        getLoginUser();

        axios.get(`/api/record/${sessionStorage.getItem("loginUser")}`).then((response) => {
            console.log(response.data);
            response.data.map((record) => {
                record.id = record.recordId;

                if (!record.viewCount) {
                    record.viewCount = 0;
                }

                if (!record.likeRecordCount) {
                    record.likeRecordCount = 0;
                }
            })
            setRecordList(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    useEffect(() => {
        const updateRequest = (changeUser) => {

            if (userGender == 0) {
                changeUser.userGender = user.userGender;
            }

            console.log(changeUser);

            axios.put("/api/user/update", changeUser).then((response) => {
                Swal.fire({
                    title: "유저 정보 수정", text: "유저 정보를 수정했습니다.", icon: "success"
                }).then(() => {
                    console.log("file : " + profileImageOriName != user.profileImageOriName);

                    if (profileImageOriName != user.profileImageOriName) {
                        const formData = new FormData();

                        if (profileImage.image_file) {
                            formData.append("profileImage", profileImage.image_file);
                            console.log(formData.get("profileImage"));

                            axios.post(`/api/user/update/profileImg`, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                }, transformRequest: [function () {
                                    return formData;
                                },],
                            }).then((response) => {
                                console.log(response.data);
                                setProfileImage({
                                    image_file: null, preview_Url: response.data
                                });
                                Swal.fire({
                                    title: "프로필 사진 업로드", text: "프로필 사진이 성공적으로 업로드 되었습니다.", icon: "success"
                                }).then(() => {
                                    window.location.reload();
                                })
                            }).catch((error) => {
                                console.log(error);
                            });
                        } else {
                            Swal.fire({
                                title: "프로필 사진 업로드", text: "프로필 사진이 선택되지 않았습니다. 사진을 선택해주세요.", icon: "error"
                            }).then(() => {

                            })
                        }
                    } else {
                        window.location.reload();
                    }
                })
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    title: "유저 정보 수정", text: "정보 수정 중 오류가 발생했습니다. 다시 한 번 시도해주세요.", icon: "error"
                }).then(() => {

                })
            });

        }

        const updateHandler = () => {
            const email = userEmail + '@' + userEmailPlat;
            const url = `/api/user/register/checkEmail/${email}`;
            const changedUser = {
                userEmail: email,
                nickName: nickName,
                userGender: userGender,
                userBirth: userBirth,
                userIntroduce: userIntroduce
            }
            console.log(changedUser);
            if (!userEmail || !userEmailPlat) {
                changedUser.userEmail = user.userEmail;
            }

            if (changedUser.userEmail === user.userEmail) {
                updateRequest(changedUser);
                console.log(changedUser);
            } else {
                axios.get(url).then((response) => {
                    console.log(response.data);
                    if (response.data) {
                        updateRequest(changedUser);
                    } else {
                        Swal.fire({
                            title: "유저 정보 수정", text: "중복되는 이메일이 있습니다. 다른 이메일로 시도해주세요.", icon: "error"
                        }).then(() => {

                        })
                    }
                }).catch((error) => {
                    console.log(error);
                })
            }
        }

        if (isUpdateOn) {
            //true
            //userEmailComp, userGenderComp, userBirthComp 변경
            setUserEmailComp(<Form.Group>
                <label>이메일</label>
                <Form.Control
                    style={inputStyle}
                    required
                    placeholder="Email"
                    type="text"
                    onChange={(e) => {
                        setUserEmail(e.target.value);
                    }}
                />
            </Form.Group>)

            setUserGenderComp(<FormControl>
                <RadioGroup row onChange={(e) => {
                    setUserGender(e.target.value);
                }}>
                    <FormControlLabel value={1} control={<Radio size="small"/>}
                                      label="남성"/>
                    <FormControlLabel value={2} control={<Radio size="small"/>}
                                      label="여성"/>
                </RadioGroup>
            </FormControl>)

            setUserBirthComp(<Form.Control
                style={inputStyle}
                defaultValue={userBirthText}
                placeholder="BirthDay"
                type="date"
                onChange={(e) => {
                    setUserBirth(e.target.value);
                }}
            ></Form.Control>)

            setUpdateButton(<>
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
            </>)
        } else {
            //false
            //userEmailComp, userGenderComp, userBirthComp 복귀
            setNickName(user.nickName);
            setUserEmailComp(<Form.Group>
                <label>이메일</label>
                <Form.Control
                    style={inputStyle}
                    defaultValue={user.userEmail}
                    placeholder="Email"
                    type="email"
                    disabled
                ></Form.Control>
            </Form.Group>);

            setUserGenderComp(<FormControl>
                <RadioGroup row>
                    <FormControlLabel
                        control={<Radio size="small"/>}
                        checked
                        label={userGenderText}/>
                </RadioGroup>
            </FormControl>)

            setUserBirthComp(<Form.Control
                style={inputStyle}
                value={userBirthText + ""}
                placeholder="BirthDay"
                type="text"
                disabled
            ></Form.Control>)

            setUpdateButton(<Button
                className="btn-fill pull-right"
                onClick={() => {
                    setIsUpdateOn(!isUpdateOn);
                }}
            >
                프로필 변경
            </Button>);
        }
    }, [isUpdateOn, nickName, userBirth, userEmail, userEmailPlat, userGender, userIntroduce, user, profileImageOriName, profileImage])

    return (<>
        <Container fluid>
            <Row>
                <Col className="pl-1" md="12">
                    <Card className="myTodayCard">
                        <Row>
                            <Col className="pl-1" md="8">
                                <div className="three">
                                    <h1>마이 페이지</h1>
                                </div>
                                <Card.Body>
                                    <Form>
                                        <Row>
                                            <Col className="pl-1" md="5">
                                                <Form.Group>
                                                    <label>이름</label>
                                                    <Form.Control
                                                        style={inputStyle}
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
                                                        style={inputStyle}
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
                                                <Form.Group>
                                                    <label>이메일</label>
                                                    <Form.Control
                                                        style={inputStyle}
                                                        disabled={!isUpdateOn}
                                                        required
                                                        value={user.userEmail}
                                                        placeholder="Email"
                                                        type="text"
                                                        onChange={(e) => {
                                                            setUserEmail(e.target.value);
                                                        }}
                                                    />
                                                </Form.Group>
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
                                            <Col className="pl-1" md="6">
                                                <Form.Group>
                                                    <label>생년월일</label>
                                                    {userBirthComp}
                                                </Form.Group>
                                            </Col>
                                            <Col className="pl-1" md="2">
                                                <label>남은 코인</label>
                                                <Form.Control
                                                    style={inputStyle}
                                                    value={user.coinCount}
                                                    disabled={false}
                                                    type="text"
                                                ></Form.Control>
                                            </Col>
                                        </Row>
                                        {updateButton}
                                    </Form>
                                </Card.Body>
                            </Col>
                            <Col className="pl-1" md="4">
                                <Card className="card-user myProfileCard">
                                    <div className="card-image">
                                    </div>
                                    <div className="author">
                                        <input type={"file"} id={"profileImageInput"} hidden={true}
                                               onChange={(e) => {
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
                                        <div className="myProfileText">
                                            이름 : <h5 className="title">{user.userName}</h5>
                                            닉네임 : <p className="description myNick">{user.nickName}</p>
                                            소개글 : <p className="description">{user.userIntroduce}</p>
                                        </div>
                                    </div>
                                    <textarea hidden={!isUpdateOn} onChange={(e) => {
                                        setUserIntroduce(e.target.value)
                                    }}>
                                </textarea>
                                </Card>
                            </Col>
                        </Row>
                        <hr role="tournament1"/>
                        <Row>
                            <Col md="12">
                                <div className="three">
                                    <h1>노래 히스토리</h1>
                                </div>
                                <DataGrid
                                    autoHeight
                                    rows={recordList}
                                    columns={columns}
                                    sx={{
                                        '.MuiDataGrid-footerContainer': {
                                            display: 'none !important'
                                        },
                                        '& .super-app-theme--header': {
                                            backgroundColor: 'rgba(132, 91, 43, 0.7)'
                                        }
                                    }}
                                />
                                <Modal isOpen={isModalOpen.isOpen} ariaHideApp={false}
                                       onRequestClose={() => setIsModalOpen(false)}
                                       style={{
                                           overlay: {position: 'fixed', background: 'rgba(0, 0, 0, 0.5)'},
                                           content: {margin: 'auto', width: '500px', height: '150px'},
                                       }}>
                                    <AudioPlayer
                                        src={isModalOpen.selectedRecordUrl}
                                        autoPlay={false}
                                    />
                                </Modal>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>);
}

export default MyPage;
