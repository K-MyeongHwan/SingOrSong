import {Card, Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {DataGrid} from "@mui/x-data-grid";

function Ranking() {
    const navigate = useNavigate();
    const [replayCountList, setReplayCountList] = useState([]);
    const [viewCountList, setViewCountList] = useState([]);
    const [recordCountList, setRecordCountList] = useState([]);
    let columns = [
        {
            field: "songNum",
            headerClassName: 'super-app-theme--header',
            headerName: "곡 번호",
            width: 100,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        setSelectedSong(newSongList[params.row.key]);
                        likeChangeHandler(params.id);
                    }}>
                        {params.id}
                    </div>
                )
            }
        },
        {
            field: "songName",
            headerClassName: 'super-app-theme--header',
            headerName: "곡 이름",
            width: 150,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        navigate("/song/" + params.id);
                    }}>
                        {params.row.songName}
                    </div>
                )
            }
        },
        {
            field: "singerName",
            headerClassName: 'super-app-theme--header',
            headerName: "가수",
            width: 150,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        navigate(`/singer/${params.row.singerName}`);
                    }}>
                        {params.row.singerName}
                    </div>
                )
            }
        },
        {
            field: "replayCount",
            headerClassName: 'super-app-theme--header',
            headerName: "재생 횟수",
            width: 100
        },
        {
            field: "recordCount",
            headerClassName: 'super-app-theme--header',
            headerName: "커버 횟수",
            width: 100
        }
    ]

    let coverColumns = [
        {
            field: "recordId",
            headerClassName: 'super-app-theme--header',
            headerName: "커버 번호",
            width: 100
        },
        {
            field: "songName",
            headerClassName: 'super-app-theme--header',
            headerName: "곡 이름",
            width: 200,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        navigate(`/coverDetail/${params.row.recordId}`);
                    }}>
                        {params.row.songName}
                    </div>
                )
            }
        },
        {
            field: "nickName",
            headerClassName: 'super-app-theme--header',
            headerName: "커버 유저 이름",
            width: 250,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.nickName}
                    </div>
                )
            }
        },
        {
            field: "viewCount",
            headerClassName: 'super-app-theme--header',
            headerName: "조회수",
            width: 100
        }
    ]

    const likeChangeHandler = (songNum) => {
        axios.post(`/api/song/like/${songNum}`).then((response) => {
            console.log(response.data);
            if (response.data) {
                setLikeActive(false);
                setLikeIconClassName("icon heart active");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/803/803087.png");
            } else {
                setLikeActive(true);
                setLikeIconClassName("icon heart");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/812/812327.png");
            }
        }).catch((error) => {
            console.log(error);
        });

        axios.get(`/api/song/like/${songNum}`).then((response) => {
            console.log(response.data);
            setSelectedLike(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const [newSongList, setNewSongList] = useState([]);
    const [selectedSong, setSelectedSong] = useState({});
    const [selectedLike, setSelectedLike] = useState(0);

    //좋아요
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

                axios.post(`/api/song/like/insert/${selectedSong.songNum}`).then((response) => {
                    setLikeCount(likeCount + 1);
                    Swal.fire({
                        title: "노래 좋아요", text: "좋아요를 눌렀습니다!", icon: "success"
                    })
                }).catch((error) => {
                    console.log(error);
                });

            } else {
                //안눌러져있음
                setLikeIconClassName("icon heart");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/812/812327.png");

                axios.post(`/api/song/like/delete/${selectedSong.songNum}`).then((response) => {
                    setLikeCount(likeCount - 1);
                    Swal.fire({
                        title: "노래 좋아요", text: "좋아요를 취소했습니다.", icon: "warning"
                    })
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }

    useEffect(() => {
        axios.get("/api/song/search/date").then((response) => {
            console.log(response.data);
            response.data.map((song, index) => {
                song.id = song.songNum;
                song.singerName = song.singer.singerName;
                song.category = song.category.categoryName;
                song.key = index
            })
            setNewSongList(response.data);
            setSelectedSong(response.data[0]);
            likeChangeHandler(response.data[0].id);
        }).catch((error) => {
            console.log(error);
        });

        axios.get("api/home/songList").then((response) => {
            console.log(response.data);
            response.data.map((song) => {
                song.id = song.songNum;
                song.singerName = song.singer.singerName;
                song.category = song.category.categoryName;
            });

            let replayCountSortList = [...response.data];
            replayCountSortList.sort((a, b) => {
                return b.replayCount - a.replayCount;
            });
            setReplayCountList(replayCountSortList);


            let recordCountSortList = [...response.data];
            recordCountSortList.sort((a, b) => {
                return b.recordCount - a.recordCount;
            });
            setRecordCountList(recordCountSortList);
        }).catch((error) => {
            console.log(error);
        });

        axios.get("api/record/").then((response) => {
            console.log(response.data);
            response.data.map((record) => {
                record.id = record.recordId;
                record.songName = record.song.songName;
                record.nickName = record.user.nickName;

                if (!record.viewCount) {
                    record.viewCount = 0;
                }

                if (!record.likeRecordCount) {
                    record.likeRecordCount = 0;
                }
            })

            let viewCountSortList = [...response.data];
            viewCountSortList.sort((a, b) => {
                return b.viewCount - a.viewCount;
            });
            setViewCountList(viewCountSortList);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <>
            <div className="myMainContainer">
                <Card className="myTodayCard">
                    <div className="three">
                        <h1>이 달의 신곡</h1>
                    </div>
                    <Row className="myNewRankingContainer">
                        <Col md="3">
                            <div className="myRankingImage">
                                <img
                                    alt="..."
                                    src={selectedSong.songImageUrl || "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/songImage/default.png"}
                                />
                            </div>
                        </Col>
                        <Col md="6">
                            <div className="myTodayInfo">
                                <h2 >{selectedSong.songName}</h2>
                                <h4>{selectedSong.singerName}</h4>
                                <h6> 카테고리: {selectedSong.category}</h6>
                                <h6>발매일 : {selectedSong.registeredDate}</h6>
                                <h6>좋아요 : {selectedLike}</h6>
                            </div>
                            <div className="myLikeContainer myRankingLike">
                                <div className="right_area">
                                    <a className={likeIconClassName} onClick={(e) => {
                                        setLikeActive(!likeActive);
                                        likeHandler(e);
                                    }
                                    }>
                                        <img alt="..." src={likeImage}/>
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="newSongListContainer">
                                <DataGrid
                                    rows={newSongList}
                                    loading={newSongList.length === 0}
                                    rowHeight={35}
                                    sx={{
                                        '.MuiDataGrid-footerContainer': {
                                            display: 'none !important'
                                        },
                                        '& .super-app-theme--header': {
                                            backgroundColor: 'rgba(132, 91, 43, 0.7)'
                                        }
                                    }}
                                    columns={columns}
                                />
                            </div>
                        </Col>
                    </Row>
                    <hr role="tournament1"/>
                    <Row>
                        <div className="three">
                            <h1>노래 랭킹 리스트</h1>
                        </div>
                        <Col md="4">
                            <div className="one">
                                <h1>노래 재생횟수 랭킹</h1>
                            </div>
                            <DataGrid
                                autoHeight
                                rows={replayCountList}
                                loading={replayCountList.length === 0}
                                rowHeight={35}
                                sx={{
                                    '.MuiDataGrid-footerContainer': {
                                        display: 'none !important'
                                    },
                                    '& .super-app-theme--header': {
                                        backgroundColor: 'rgba(132, 91, 43, 0.7)'
                                    }
                                }}
                                columns={columns}
                            />
                        </Col>
                        <Col md="4">
                            <div className="one">
                                <h1>커버 곡 랭킹</h1>
                            </div>
                            <DataGrid
                                autoHeight
                                rows={viewCountList}
                                loading={viewCountList.length === 0}
                                rowHeight={35}
                                sx={{
                                    '.MuiDataGrid-footerContainer': {
                                        display: 'none !important'
                                    }
                                    ,
                                    '& .super-app-theme--header': {
                                        backgroundColor: 'rgba(132, 91, 43, 0.7)'
                                    }
                                }}
                                columns={coverColumns}
                            />
                        </Col>
                        <Col md="4">
                            <div className="one">
                                <h1>커버 유행 곡!</h1>
                            </div>
                            <DataGrid
                                autoHeight
                                rows={recordCountList}
                                loading={recordCountList.length === 0}
                                rowHeight={35}
                                sx={{
                                    '.MuiDataGrid-footerContainer': {
                                        display: 'none !important'
                                    }
                                    ,
                                    '& .super-app-theme--header': {
                                        backgroundColor: 'rgba(132, 91, 43, 0.7)'
                                    }
                                }}
                                columns={columns}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    )
}

export default Ranking;
