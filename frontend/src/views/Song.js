import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import Swal from "sweetalert2";

//base64 인코딩을 해제하기 위한 함수
function base64ToArrayBuffer(base64) {
    //인코딩 해제해 바이너리 스트링으로 받기
    const binary_string = window.atob(base64);
    //해당 길이가 필요해 변수에 적재
    const len = binary_string.length;
    //??이부분 ~ 밑에 루프가 이해가 잘 되지 않는다.
    const bytes = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
}

function Song() {
    const [songNum, setSongNum] = useState(useParams().songNum);
    const [song, setSong] = useState({});
    const [replayCount, setReplayCount] = useState(song.replayCount);
    const [audioSrc, setAudioSrc] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUpdateOn, setIsUpdateOn] = useState(false);
    const [updateButton, setUpdateButton] = useState(

    );


    //soundUpload
    const [songSoundUrl, setSongSoundUrl] = useState("");
    const [songSoundOriName, setSongSoundOriName] = useState("");
    const [songSound, setSongSound] = useState({
        sound_file: null,
    });

    const soundChangeHandler = (e) => {
        const selectedFile = e.target.files[0];

        console.log(selectedFile);
        if (selectedFile) {
            setSongSound({
                sound_file: selectedFile
            });
        }
    }

    const soundUploadHandler = (e) => {
        e.preventDefault();
        console.log("file : " + songSound.sound_file);

        if (songSound) {
            const formData = new FormData();
            formData.append("songSound", songSound.sound_file);
            console.log(formData.get("songSound"));

            axios.post(`/api/song/update/songSound/${song.songNum}`, formData, {
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
                Swal.fire({
                    title: "음원 업로드",
                    text: "음원이 성공적으로 업로드 되었습니다.",
                    icon: "success"
                }).then(() => {
                    window.location.reload();
                })
            }).catch((error) => {
                console.log(error);
            });
        }
    }

//songImage
    const [songImageUrl, setSongImageUrl] = useState("");
    const [songImage, setSongImage] = useState({
        image_file: null,
        preview_Url: null
    });
    const [songImageOriName, setSongImageOriName] = useState("");

    const imgChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setSongImageOriName(selectedFile.name);
        }

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setSongImage({
                    image_file: selectedFile,
                    preview_Url: e.target.result
                });
            }
            reader.readAsDataURL(selectedFile);
        }
    }

    const playAudio = () => {
        const url = `/api/song/play/${song.songNum}`;
        axios.get(url).then((response) => {
            setReplayCount(1 + replayCount);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (sessionStorage.getItem("loginUserRole") === "[ROLE_ADMIN]") {
            console.log("isAdmin");
            setIsAdmin(true);
        }

        const url = `/api/song/${songNum}`;
        axios.get(url).then((response) => {

            console.log(response.data);
            response.data.singerName = response.data.singer.singerName;
            setSong(response.data);
            setReplayCount(response.data.replayCount);
            setSongImageOriName(response.data.songImageOriName);

            if (response.data.songImageUrl) {
                setSongImageUrl(response.data.songImageUrl);
                setSongImage({
                    preview_Url: response.data.songImageUrl
                });
            } else {
                setSongImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/songImage/default.png");
                setSongImage({
                    preview_Url: "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/songImage/default.png"
                })
            }

            setSongSoundUrl(response.data.songSoundUrl);

        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        const fileUploadHandler = (e) => {
            e.preventDefault();
            console.log("file : " + songImageOriName != song.songImageOriName);

            if (songImageOriName != song.songImageOriName) {
                const formData = new FormData();

                if (songImage.image_file) {
                    formData.append("songImage", songImage.image_file);
                    console.log(formData.get("songImage"));

                    axios.post(`/api/song/update/songImg/${song.songNum}`, formData, {
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
                        setSongImage({
                            image_file: null,
                            preview_Url: response.data
                        });
                        Swal.fire({
                            title: "앨범 커버 사진 업로드",
                            text: "앨범 커버 사진이 성공적으로 업로드 되었습니다.",
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
                    title: "앨범 커버 사진 업로드",
                    text: "앨범 커버 사진이 선택되지 않았습니다. 사진을 선택해주세요.",
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
                            setSongImage({
                                image_file: null,
                                preview_Url: songImageUrl
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
    }, [isUpdateOn, song, songImage, songImageOriName, songImageUrl]);

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

    return (
        <>
            <Container fluid>

                <Row>
                    <Col md="8">
                        <Card>
                            <Card.Header>
                                <Card.Title className="myTitle">노래 정보</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col className="pl-1" md="3">
                                            <Form.Group>
                                                <small>곡 번호</small>
                                                <h3>{song.songNum}</h3>
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <Form.Group>
                                                <small>곡 이름</small>
                                                <h3>{song.songName}</h3>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pl-1" md="6">
                                            <Form.Group>
                                                <small>가수 이름</small>
                                                <h3>{song.singerName}</h3>
                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <Form.Group>
                                                <small>곡 발매일</small>
                                                <h3>{new Date(song.songDate).toLocaleDateString()}</h3>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <Form.Group>

                                            </Form.Group>
                                        </Col>
                                        <Col className="pl-1" md="6">
                                            <Form.Group>
                                                <small>재생 횟수</small>
                                                <h3>{replayCount}</h3>
                                            </Form.Group>
                                        </Col>
                                        <h3>음원 재생</h3>
                                        <br/>
                                        <hr/>
                                        <AudioPlayer
                                            preload="none"
                                            autoPlay={false}
                                            src={songSoundUrl}
                                        />
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="card-user mySoundCard" hidden={!isAdmin}>
                            <div className="mySongImageText">
                                <h3>음원 업로드</h3>
                                <input type={"file"} id={"songSoundInput"} hidden={true} onChange={(e) => {
                                    soundChangeHandler(e)
                                }}/>
                                <label htmlFor={"songSoundInput"} className="mySongSound">
                                    <h3>음원 선택</h3>
                                </label>
                                <br/>
                                <Button
                                    className="btn-fill pull-right"
                                    onClick={(e) => {
                                        soundUploadHandler(e);
                                    }}
                                >
                                    음원 업로드
                                </Button>
                            </div>
                        </Card>
                        <Card className="card-user">
                            <div className="card-image mySongImageText">
                                <h3>앨범 커버</h3>
                            </div>
                            <Card.Body>
                                <div className="author">
                                    <input type={"file"} id={"profileImageInput"} hidden={true} onChange={(e) => {
                                        imgChangeHandler(e)
                                    }}/>
                                    <img
                                        hidden={isUpdateOn}
                                        alt="..."
                                        className="mySongImage border-gray"
                                        src={songImage.preview_Url}
                                    ></img>
                                    <label htmlFor={"profileImageInput"} hidden={!isUpdateOn}>
                                        <img
                                            alt="..."
                                            className="mySongImage border-gray"
                                            src={songImage.preview_Url}
                                        ></img>
                                    </label>
                                    <h5 className="title"></h5>
                                    <p className="description"></p>
                                    <p className="description text-center">
                                    </p>
                                </div>
                                {updateButton}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Song;
