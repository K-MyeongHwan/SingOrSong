import React, {useState, useCallback, useEffect, useRef} from "react";
import AudioPlayer from "react-h5-audio-player";
import Modal from "react-modal";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Song = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const imageRef = useRef(null);
    const [songNum, setSongNum] = useState(useParams().songNum);
    const [buttonImageUrl, setButtonImageUrl] = useState("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");
    const [isPlay, setIsPlay] = useState(false);

    const [song, setSong] = useState({});
    const [replayCount, setReplayCount] = useState(0);
    const [singerName, setSingerName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [songSoundUrl, setSongSoundUrl] = useState('');

    const [likeCount, setLikeCount] = useState(0);
    const [likeIconClassName, setLikeIconClassName] = useState("icon heart");
    const [likeActive, setLikeActive] = useState(true);
    const [likeImage, setLikeImage] = useState("https://cdn-icons-png.flaticon.com/512/812/812327.png");

    const [audioPlayer, setAudioPlayer] = useState(<></>);
    const [songImageUrl, setSongImageUrl] = useState('');
    const [songImageOriName, setSongImageOriName] = useState('');
    const [songImage, setSongImage] = useState({
        image_file: null, preview_Url: null
    });


    const likeHandler = () => {
        console.log(likeActive);

        if (!sessionStorage.getItem("loginUserRole")) {
            Swal.fire({
                title: "노래 좋아요", text: "좋아요를 표시하려면, 로그인을 해주세요.", icon: "error"
            }).then(() => {
                navigate("/login")
            })
        } else {
            if (likeActive) {
                //눌러져있음
                setLikeIconClassName("icon heart active");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/803/803087.png");

                axios.post(`/api/song/like/insert/${songNum}`).then((response) => {
                    setLikeCount(likeCount + 1);
                    Swal.fire({
                        title: "노래 좋아요", text: "좋아요를 눌렀습니다!", icon: "success"
                    })
                }).catch((error) => {
                    console.log(error);
                })
            } else {
                //안눌러져있음
                setLikeIconClassName("icon heart");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/812/812327.png");

                axios.post(`/api/song/like/delete/${songNum}`).then((response) => {
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
        if (sessionStorage.getItem("loginUserRole") === "[ROLE_ADMIN]") {
            console.log("isAdmin");
            setIsAdmin(true);
        }

        const url = `/api/song/${songNum}`;
        axios.get(url).then((response) => {
            response.data.singerName = response.data.singer.singerName;
            setSong(response.data);
            setReplayCount(response.data.replayCount);
            setSingerName(response.data.singer.singerName);
            setSongImageOriName(response.data.songImageOriName);
            setCategoryName(response.data.category.categoryName);
            setSongSoundUrl(response.data.songSoundUrl);

            imageRef.current.style.setProperty('background-image', `url(${response.data.songImageUrl})`);

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
        }).catch((error) => {
            console.log(error);
        });

        axios.post(`/api/song/like/${songNum}`).then((response) => {
            console.log(response.data);
            if (response.data) {
                setLikeActive(false);
                setLikeIconClassName("icon heart active");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/803/803087.png");
            }
        }).catch((error) => {
            console.log(error);
        });

        axios.get(`/api/song/like/${songNum}`).then((response) => {
            console.log(response.data);
            setLikeCount(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    useEffect(() => {
        if (isPlay) {
            setAudioPlayer(<AudioPlayer
                src={songSoundUrl}
                autoPlay={true}
                volume={0.5}
                style={{
                    display: "none"
                }}
            />);
            setButtonImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/stopButton.png");
        } else {
            setAudioPlayer(<></>);
            setButtonImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");
        }
    }, [isPlay, songSoundUrl]);

    return (<>
        <div ref={imageRef} className="myCoverContainer">
            <Modal isOpen={isModalOpen} ariaHideApp={false} onRequestClose={() => setIsModalOpen(false)}
                   style={{
                       overlay: {position: 'fixed', background: 'rgba(0, 0, 0, 0.5)'},
                       content: {margin: 'auto', width: '500px', height: '500px', padding: '30px'},
                   }}>
                <div className="seven">
                    <h1>노래 정보</h1>
                </div>

                <div className="myModalContainer">
                    <Row className="songInfo">
                        <Col className="pl-1" md="6">
                            <h4><span className="songInfoTitle">곡 번호 : </span> {songNum}</h4>
                        </Col>
                        <Col className="pl-1" md="6">
                            <h4><span className="songInfoTitle">가수 이름 :</span> {singerName}</h4>
                        </Col>
                    </Row>
                    <Row className="songInfo">
                        <Col className="pl-1" md="12">
                            <div>
                                <h4><span className="songInfoTitle">곡 이름 : </span> {song.songName}</h4>
                            </div>
                        </Col>
                    </Row>
                    <Row className="songInfo">
                        <Col className="pl-1" md="6">
                            <div>
                                <h4><span
                                    className="songInfoTitle">발매일 : </span>{new Date(song.songDate).toLocaleDateString()}
                                </h4>
                            </div>
                        </Col>
                        <Col className="pl-1" md="6">
                            <div>
                                <h4><span className="songInfoTitle">장르 :</span> {categoryName}</h4>
                            </div>
                        </Col>
                    </Row>
                    <Row className="songInfo">
                        <Col className="pl-1" md="6">
                            <div>
                                <h4><span className="songInfoTitle">재생 횟수 : </span>{replayCount}</h4>
                            </div>
                        </Col>
                        <Col className="pl-1" md="6">
                            <div>
                                <h4><span className="songInfoTitle">좋아요 수 : </span>{likeCount}</h4>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
            <div className="myBackDropFilter">
                <div className="mySongLikeContainer">
                    <div className="myLikeContainer">
                        <div className="right_area">
                            <a className={likeIconClassName} onClick={(e) => {
                                setLikeActive(!likeActive);
                                likeHandler(e);
                            }}>
                                <img src={likeImage}
                                     alt="찜하기"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="myRecording">
                    <i className="nc-icon nc-single-copy-04" onClick={() => {
                        setIsModalOpen(true);
                    }}></i>
                </div>
                <div className="myCoverImage">
                    <img
                        className="myCoverImageSrc"
                        alt="..."
                        src={song.songImageUrl}
                    ></img>
                </div>
                <div className="myCoverText">
                    <h2>{song.songName}</h2>
                    <h4 className="mySingerName"><span>{singerName}</span> · {categoryName}</h4>
                </div>
                <div className="myPlayContainer">
                    <img
                        className="myPlayButton"
                        src={buttonImageUrl}
                        onClick={() => {
                            setIsPlay(!isPlay);
                        }}
                    />
                    {audioPlayer}
                </div>
            </div>
        </div>
    </>);
};

export default Song;