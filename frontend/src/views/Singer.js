import React, {useEffect, useState} from "react";
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import 'react-h5-audio-player/lib/styles.css';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";

function Singer() {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

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
            width : 100
        },
        {
            field: "songAlbum",
            headerName: "노래 앨범",
            width : 80,
            renderCell : (params) => {
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
            width: 200
        },
        {
            field: "singerName",
            headerName: "가수",
            width: 200
        },
        {
            field: "replayCount",
            headerName: "재생 횟수",
            width: 100
        }
    ]

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
                        title : "가수 열혈팬",
                        text : singer.singerName + "님의 열혈팬이 되었습니다!",
                        icon : "success"
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
                        title : "가수 열혈팬",
                        text : singer.singerName + "님의 열혈팬을 취소했습니다.",
                        icon : "warning"
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

            axios.post(`/api/singer/songList/${response.data.singerNum}`).then((response)=>{
                console.log(response.data);
                response.data.map((song) => {
                    song.id = song.songNum;
                    song.singerName = song.singer.singerName
                });

                setSongList(response.data);
            }).catch((error)=>{
                console.log(error);
            })

            axios.get(`/api/singer/fan/${response.data.singerNum}`).then((response)=>{
                setFanCount(response.data);
            }).catch((error)=>{
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

    return (
        <>
            <Container fluid>
                <Row>
                    <Card>
                        <Card.Header>
                            <Card.Title className="myTitle">가수 정보</Card.Title>
                            <div className="mySingerImage">
                                <img
                                    src={"https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/singerImage/eill.png"}
                                    alt={"mySingerImage"}
                                />
                            </div>
                            <Form>
                                <Row className="mySingerProfile">
                                    <div className="myLikeContainer">
                                        {singer.singerName} 님의 열혈팬 : {fanCount}
                                    </div>
                                    <div className="myLikeContainer">
                                        <div className="right_area">
                                            <a className={likeIconClassName} onClick={(e) => {
                                                setLikeActive(!likeActive);
                                                likeHandler(e);
                                            }
                                            }>
                                                <img src={likeImage}
                                                     alt="찜하기"/>
                                            </a>
                                        </div>
                                    </div>
                                    <Col className="pl-1" md="4">
                                        <Form.Group>
                                            <small>가수 이름</small>
                                            <h3>{singer.singerName}</h3>
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1" md="4">
                                        <Form.Group>
                                            <small>장르</small>
                                            <h3>{categoryName}</h3>
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1" md="4">
                                        <Form.Group>
                                            <small>데뷔 일자</small>
                                            <h3>{singerDebutDate}</h3>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            <hr/>
                            <h3>대표곡</h3>
                        </Card.Header>
                        <Card.Body>
                            <DataGrid
                                rows={songList}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {page: 0, pageSize: 10},
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
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
