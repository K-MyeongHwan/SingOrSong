import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import 'react-h5-audio-player/lib/styles.css';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";

function Singer() {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [isUpdateOn, setIsUpdateOn] = useState(false);
    const [singerImageUrl, setSingerImageUrl] = useState("");
    const [singerImageOriName, setSingerImageOriName] = useState("");
    const [singerImage, setSingerImage] = useState({
        image_file: null,
        preview_Url: null
    });
    const [updateButton, setUpdateButton] = useState(

    );

    const [singerName, setSingerName] = useState(useParams().singerName);
    const [singerDebutDate, setSingerDebutDate] = useState("");
    const [singer, setSinger] = useState({});
    const [songList, setSongList] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [fanCount, setFanCount] = useState(0);
    let columns = [
        {
            field: "songNum",
            headerName: "곡 번호",
            headerClassName: 'super-app-theme--header',
            width: 100
        },
        {
            field: "songAlbum",
            headerName: "노래 앨범",
            headerClassName: 'super-app-theme--header',
            width: 80,
            renderCell: (params) => {
                return (
                    <div>
                        <img
                            className="songListAlbum border-gray"
                            src={params.row.songImageUrl}
                        />
                    </div>
                )
            }
        },
        {
            field: "songName",
            headerName: "곡 이름",
            headerClassName: 'super-app-theme--header',
            width: 200,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        navigate(`/song/${params.id}`);
                    }}>
                        {params.row.songName}
                    </div>
                )
            }
        },
        {
            field: "singerName",
            headerName: "가수",
            headerClassName: 'super-app-theme--header',
            width: 200
        },
        {
            field: "replayCount",
            headerName: "재생 횟수",
            headerClassName: 'super-app-theme--header',
            flex : 1,
            width: 100
        }
    ]


    const imgChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setSingerImageOriName(selectedFile.name);
        }

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setSingerImage({
                    image_file: selectedFile,
                    preview_Url: e.target.result
                });
            }
            reader.readAsDataURL(selectedFile);
        }
    }

    const [likeCount, setLikeCount] = useState(0);
    const [likeIconClassName, setLikeIconClassName] = useState("icon heart");
    const [likeActive, setLikeActive] = useState(true);
    const [likeImage, setLikeImage] = useState("https://cdn-icons-png.flaticon.com/512/812/812327.png");

    const likeHandler = () => {
        console.log(likeActive);

        if (!sessionStorage.getItem("loginUserRole")) {
            Swal.fire({
                title: "노래 좋아요",
                text: "좋아요를 표시하려면, 로그인을 해주세요.",
                icon: "error"
            }).then(() => {
                navigate("/login")
            })
        } else {
            if (likeActive) {
                //눌러져있음
                setLikeIconClassName("icon heart active");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/803/803087.png");

                axios.post(`/api/singer/fan/insert/${singer.singerNum}`).then((response) => {
                    setFanCount(fanCount + 1);
                    Swal.fire({
                        title: "가수 열혈팬",
                        text: singer.singerName + "님의 열혈팬이 되었습니다!",
                        icon: "success"
                    })
                }).catch((error) => {
                    console.log(error);
                })
            } else {
                //안눌러져있음
                setLikeIconClassName("icon heart");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/812/812327.png");

                axios.post(`/api/singer/fan/delete/${singer.singerNum}`).then((response) => {
                    setFanCount(fanCount - 1);
                    Swal.fire({
                        title: "가수 열혈팬",
                        text: singer.singerName + "님의 열혈팬을 취소했습니다.",
                        icon: "warning"
                    })
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }


    useEffect(() => {
        if (sessionStorage.getItem("loginUserRole") === "[ROLE_ADMIN]") {
            console.log("isAdmin");
            setIsAdmin(true);
        }

        axios.post(`/api/singer/${singerName}`).then((response) => {
            console.log(response.data);
            setSinger(response.data);
            setSingerDebutDate((response.data.debutDate + "").split('T')[0]);
            setCategoryName(response.data.category.categoryName);
            setSingerImageOriName(response.data.singerImageOriName);

            if (response.data.singerImageUrl) {
                setSingerImageUrl(response.data.singerImageUrl);
                setSingerImage({
                    preview_Url: response.data.singerImageUrl
                });
            } else {
                setSingerImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/singerImage/default.jpg");
                setSingerImage({
                    preview_Url: "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/singerImage/default.jpg"
                })
            }

            axios.post(`/api/singer/songList/${response.data.singerNum}`).then((response) => {
                console.log(response.data);
                response.data.map((song) => {
                    song.id = song.songNum;
                    song.singerName = song.singer.singerName
                });

                setSongList(response.data);
            }).catch((error) => {
                console.log(error);
            })

            axios.get(`/api/singer/fan/${response.data.singerNum}`).then((response) => {
                setFanCount(response.data);
            }).catch((error) => {
                console.log(error);
            })

            axios.post(`/api/singer/fan/${response.data.singerNum}`).then((response) => {
                console.log(response.data);
                if (response.data) {
                    setLikeIconClassName("icon heart active");
                    setLikeImage("https://cdn-icons-png.flaticon.com/512/803/803087.png");
                }
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }, []);


    useEffect(() => {
        if (isAdmin) {
            setUpdateButton(
                <Button
                    className="btn-fill pull-right"
                    hidden={!isAdmin}
                    onClick={(e) => {
                        setIsUpdateOn(!isUpdateOn);
                    }}
                >
                    노래 사진 변경
                </Button>
            )
        } else {

        }
    }, [isAdmin])

    useEffect(() => {
        const fileUploadHandler = (e) => {
            e.preventDefault();
            console.log("file : " + singerImageOriName != singer.singerImageOriName);
            if (singerImageOriName != singer.singerImageOriName) {
                const formData = new FormData();

                if (singerImage.image_file) {
                    formData.append("singerImage", singerImage.image_file);
                    console.log(formData.get("singerImage"));

                    axios.post(`/api/singer/update/singerImg/${singer.singerNum}`, formData, {
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
                        setSingerImage({
                            image_file: null,
                            preview_Url: response.data
                        });
                        Swal.fire({
                            title: "가수 사진 업로드",
                            text: "가수 사진이 성공적으로 업로드 되었습니다.",
                            icon: "success"
                        }).then(() => {
                            window.location.reload();
                        })
                    }).catch((error) => {
                        console.log(error);
                    });

                }
            } else {
                Swal.fire({
                    title: "가수 사진 업로드",
                    text: "가수 사진이 선택되지 않았습니다. 사진을 선택해주세요.",
                    icon: "error"
                }).then(() => {

                })
            }
        }

        if (isUpdateOn) {
            setUpdateButton(
                <>
                    <Button
                        className="myCancelButton"
                        onClick={() => {
                            setIsUpdateOn(false);
                            setSingerImage({
                                image_file: null,
                                preview_Url: singerImageUrl
                            })
                        }}
                    >
                        취소
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                        className="mySaveButton"
                        onClick={(e) => {
                            fileUploadHandler(e);
                        }}
                    >
                        저장
                    </Button>
                </>
            )
        } else {
            setUpdateButton(
                <Button
                    className="btn-fill pull-right"
                    hidden={!isAdmin}
                    onClick={(e) => {
                        setIsUpdateOn(!isUpdateOn);
                    }}
                >
                    노래 사진 변경
                </Button>
            )
        }
    }, [isUpdateOn, singer, singerImageUrl, singerImageOriName, singerImage]);


    return (
        <>
            <Container fluid>
                <Row>
                    <Card className="myTodayCard">
                        <div className="three">
                            <h1>가수 소개</h1>
                        </div>
                        <div className="mySingerLikeContainer">
                            <div className="myLikeContainer">
                                <div className="right_area">
                                    <a className={likeIconClassName} onClick={(e) => {
                                        setLikeActive(!likeActive);
                                        likeHandler(e);
                                    }
                                    }>
                                        <img src={likeImage}/>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mySingerImage">
                            <input type={"file"} id={"profileImageInput"} hidden={true} onChange={(e) => {
                                imgChangeHandler(e)
                            }}/>
                            <img
                                hidden={isUpdateOn}
                                alt="..."
                                src={singerImage.preview_Url}
                            ></img>
                            <label htmlFor={"profileImageInput"} hidden={!isUpdateOn}>
                                <img
                                    alt="..."
                                    src={singerImage.preview_Url}
                                ></img>
                            </label>
                        </div>
                        <Form>
                            <Row className="mySingerProfile">
                                <Col className="pl-1" md="3">
                                    <Form.Group>
                                        <small>가수 이름</small>
                                        <h3>{singer.singerName}</h3>
                                    </Form.Group>
                                </Col>
                                <Col className="pl-1" md="3">
                                    <Form.Group>
                                        <small>장르</small>
                                        <h3>{categoryName}</h3>
                                    </Form.Group>
                                </Col>
                                <Col className="pl-1" md="3">
                                    <Form.Group>
                                        <small>데뷔 일자</small>
                                        <h3>{singerDebutDate}</h3>
                                    </Form.Group>
                                </Col>
                                <Col className="pl-1" md="3">
                                    <Form.Group>
                                        <small>열혈팬</small>
                                        <h3>{fanCount}</h3>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <hr role="tournament1"/>
                        <div className="three">
                            <h1>대표 곡</h1>
                        </div>
                        <Card.Body>
                            <DataGrid
                                rows={songList}
                                columns={columns}
                                sx={{
                                    '.MuiDataGrid-footerContainer': {
                                        display: 'none !important'
                                    },
                                    '& .super-app-theme--header': {
                                        backgroundColor: 'rgba(132, 91, 43, 0.7)'
                                    }
                                }}
                                onCellDoubleClick={(params, event) => {
                                    navigate(`/song/${params.id}`);
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </>
    );
}

export default Singer;
