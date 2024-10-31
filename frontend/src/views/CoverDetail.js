import React, {useState, useCallback, useEffect, useRef} from "react";
import AudioPlayer from "react-h5-audio-player";
import Modal from "react-modal";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {useCookies} from "react-cookie";

const CoverDetail = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(<></>);
    const imageRef = useRef(null);
    const [buttonImageUrl, setButtonImageUrl] = useState("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");
    const [isPlay, setIsPlay] = useState(false);
    const [recordId, setRecordId] = useState(useParams().recordId);


    const [record, setRecord] = useState({});
    const [viewCount, setViewCount] = useState(0);
    const [songName, setSongName] = useState('');
    const [nickName, setNickName] = useState('');
    const [singerName, setSingerName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [songImageUrl, setSongImageUrl] = useState('');
    const [recordSoundUrl, setRecordSoundUrl] = useState('');

    const [likeCount, setLikeCount] = useState(0);
    const [likeIconClassName, setLikeIconClassName] = useState("icon heart");
    const [likeActive, setLikeActive] = useState(true);
    const [likeImage, setLikeImage] = useState("https://cdn-icons-png.flaticon.com/512/812/812327.png");

    const [cookie, setCookie] = useCookies(["cover_" + recordId]);

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

                axios.post(`/api/record/like/insert/${recordId}`).then((response) => {
                    setLikeCount(likeCount + 1);
                    Swal.fire({
                        title: "커버 곡 좋아요",
                        text: "좋아요를 눌렀습니다!",
                        icon: "success"
                    })
                }).catch((error) => {
                    console.log(error);
                })

            } else {
                //안눌러져있음
                setLikeIconClassName("icon heart");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/812/812327.png");

                axios.post(`/api/record/like/delete/${recordId}`).then((response) => {
                    setLikeCount(likeCount - 1);
                    Swal.fire({
                        title: "커버 곡 좋아요",
                        text: "좋아요를 취소했습니다.",
                        icon: "warning"
                    })
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }

    useEffect(() => {
        axios.post(`/api/record/${recordId}`).then((response) => {
            console.log(response.data);
            setSongName(response.data.song.songName);
            setSingerName(response.data.song.singer.singerName);
            setNickName(response.data.user.nickName);
            setSongImageUrl(response.data.song.songImageUrl);
            setCategoryName(response.data.song.category.categoryName);
            setRecordSoundUrl(response.data.recordSoundUrl);

            if (!response.data.viewCount) {
                response.data.viewCount = 0;
            }

            if (!response.data.likeRecordCount) {
                response.data.likeRecordCount = 0;
            }

            imageRef.current.style.setProperty('background-image', `url(${response.data.song.songImageUrl})`);

            setViewCount(response.data.viewCount);
            setLikeCount(response.data.likeRecordCount);
            setRecord(response.data);
        }).catch((error) => {
            console.log(error);
        })

        axios.post(`/api/record/like/${recordId}`).then((response) => {
            console.log(response.data);
            if (response.data) {
                setLikeActive(false);
                setLikeIconClassName("icon heart active");
                setLikeImage("https://cdn-icons-png.flaticon.com/512/803/803087.png");
            }
        }).catch((error) => {
            console.log(error);
        })

        let cookie_name = "cover_" + recordId;
        console.log(cookie[cookie_name]);

        if (cookie[cookie_name]) {

        } else {
            axios.post(`/api/record/view/${recordId}`).then((response) => {
                setCookie(cookie_name, true, {path: "/", expires: new Date(Date.now() + 86400 * 1000)});
            }).catch((error) => {
                console.log(error);
            })
        }
    }, []);

    useEffect(() => {
        if (isPlay) {
            setAudioPlayer(<AudioPlayer
                src={recordSoundUrl}
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
    }, [isPlay, recordSoundUrl]);

    return (
        <>
            <div ref={imageRef} className="myCoverContainer">
                <div className="myBackDropFilter">
                    <Modal isOpen={isModalOpen} ariaHideApp={false} onRequestClose={() => setIsModalOpen(false)}
                           style={{
                               overlay: {position: 'fixed', background: 'rgba(0, 0, 0, 0.5)'},
                               content: {margin: 'auto', width: '500px', height: '500px'},
                           }}>
                        <div className="seven">
                            <h1>커버 곡 정보</h1>
                        </div>

                        <div className="myModalContainer">
                            <Row className="songInfo">
                                <Col className="pl-1" md="6">
                                    <h4><span className="songInfoTitle">커버 곡 번호 : </span> {recordId}</h4>
                                </Col>
                                <Col className="pl-1" md="6">
                                    <h4><span className="songInfoTitle">커버 유저 이름 :</span> {nickName}</h4>
                                </Col>
                            </Row>
                            <Row className="songInfo">
                                <Col className="pl-1" md="12">
                                    <div>
                                        <h4><span className="songInfoTitle">곡 이름 : </span> {songName}</h4>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="songInfo">
                                <Col className="pl-1" md="7">
                                    <div>
                                        <h4><span
                                            className="songInfoTitle">업로드 날짜 : </span>{new Date(record.recordDate).toLocaleDateString()}
                                        </h4>
                                    </div>
                                </Col>
                                <Col className="pl-1" md="5">
                                    <div>
                                        <div>
                                            <h4><span className="songInfoTitle">장르 :</span> {categoryName}</h4>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="songInfo">
                                <Col className="pl-1" md="6">
                                    <div>
                                        <h4><span className="songInfoTitle">조회수 : </span>{viewCount}</h4>
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
                            src={songImageUrl}
                        ></img>
                    </div>
                    <div className="myCoverText">
                        <h2>{songName}</h2>
                        <h4 className="mySingerName"><span>{nickName}</span> ( {singerName} ) · {categoryName}</h4>
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
        </>
    );
};

export default CoverDetail;