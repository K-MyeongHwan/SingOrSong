import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import 'react-h5-audio-player/lib/styles.css';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";

function User() {
    const [nickName, setNickName] = useState(useParams().nickName);
    const navigate = useNavigate();

    const [coverCount, setCoverCount] = useState(0);
    const [allLikeCount, setAllLikeCount] = useState(0);
    const [coverList, setCoverList] = useState([]);
    const [user, setUser] = useState({});
    let columns = [
        {
            field: "recordId",
            headerClassName: 'super-app-theme--header',
            headerName: "커버 번호",
            width: 150
        },
        {
            field: "songAlbum",
            headerClassName: 'super-app-theme--header',
            headerName: "노래 앨범",
            width: 80,
            renderCell: (params) => {
                return (
                    <div>
                        <img
                            className="songListAlbum border-gray"
                            src={params.row.song.songImageUrl}
                        />
                    </div>
                )
            }
        },
        {
            field: "songName",
            headerClassName: 'super-app-theme--header',
            headerName: "곡 이름",
            width: 250,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        navigate(`/song/${params.row.song.songNum}`);
                    }}>
                        {params.row.song.songName}
                    </div>
                )
            }
        },
        {
            field: "user",
            headerClassName: 'super-app-theme--header',
            headerName: "이름",
            width: 250,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.user.nickName}
                    </div>
                )
            }
        },
        {
            field: "viewCount",
            headerClassName: 'super-app-theme--header',
            headerName: "조회수",
            width: 100
        },
        {
            field: "likeRecordCount",
            headerClassName: 'super-app-theme--header',
            headerName: "좋아요 수",
            flex : 1,
            width: 100
        }
    ]

    useEffect(() => {
        axios.post(`/api/user/${nickName}`).then((response) => {
            console.log(response.data);
            if (!response.data.profileImageUrl) {
                response.data.profileImageUrl = "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/profileImage/default_1728486344829.png";
            }
            setUser(response.data);

            axios.post(`/api/record/user/${response.data.userId}`).then((response) => {
                console.log(response.data);
                let likeCount = 0;
                response.data.map((record) => {
                    record.id = record.recordId;
                    likeCount = likeCount + record.likeRecordCount;
                })

                setCoverList(response.data);
                setCoverCount(response.data.length);
                setAllLikeCount(likeCount);
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
                    <Card className="myTodayCard">
                        <div className="three">
                            <h1>유저 소개</h1>
                        </div>
                        <div className="mySingerImage">
                            <img
                                alt="..."
                                src={user.profileImageUrl}
                            ></img>
                        </div>
                        <Form>
                            <Row className="mySingerProfile">
                                <Col className="pl-1" md="4">
                                    <Form.Group>
                                        <small>유저 닉네임</small>
                                        <h3>{user.nickName}</h3>
                                    </Form.Group>
                                </Col>
                                <Col className="pl-1" md="4">
                                    <Form.Group>
                                        <small>커버 곡 수</small>
                                        <h3>{coverCount}</h3>
                                    </Form.Group>
                                </Col>
                                <Col className="pl-1" md="4">
                                    <Form.Group>
                                        <small>총 좋아요 수</small>
                                        <h3>{allLikeCount}</h3>
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
                                rows={coverList}
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

export default User;
