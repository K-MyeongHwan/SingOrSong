import React, {useState, useCallback, useEffect, useRef} from "react";
import AudioPlayer from "react-h5-audio-player";
import Modal from "react-modal";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Cover = () => {
    const uploadFileImage = "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/upload.png";
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const [isPlay, setIsPlay] = useState(false);
    const [isRecording, setIsRecording] = useState(true);
    const [isRecorded, setIsRecorded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [songNum, setSongNum] = useState(useParams().songNum);
    const [song, setSong] = useState({});
    const [user, setUser] = useState({});
    const [songSoundDuration, setSongSoundDuration] = useState(0);
    const [singerName, setSingerName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [buttonImageUrl, setButtonImageUrl] = useState("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");

    const [stream, setStream] = useState();
    const [media, setMedia] = useState();
    const [onRec, setOnRec] = useState(true);
    const [source, setSource] = useState();
    const [analyser, setAnalyser] = useState();
    const [audioUrl, setAudioUrl] = useState();
    const [audioPlayer, setAudioPlayer] = useState(<></>);
    const [myAudioPlayer, setMyAudioPlayer] = useState(<></>);
    const [soundFile, setSoundFile] = useState();

    const onRecAudio = () => {
        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
        const analyser = audioCtx.createScriptProcessor(0, 1, 1);
        setAnalyser(analyser);

        function makeSound(stream) {
            // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
            const source = audioCtx.createMediaStreamSource(stream);
            setSource(source);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
        }

        // 마이크 사용 권한 획득
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            makeSound(stream);

            analyser.onaudioprocess = function (e) {
                // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
                if (e.playbackTime > 30 ) {
                    console.log(songSoundDuration);
                    stream.getAudioTracks().forEach(function (track) {
                        track.stop();
                    });
                    mediaRecorder.stop();
                    // 메서드가 호출 된 노드 연결 해제
                    analyser.disconnect();
                    audioCtx.createMediaStreamSource(stream).disconnect();

                    mediaRecorder.ondataavailable = function (e) {
                        setAudioUrl(e.data);
                        setOnRec(true);
                    };

                    setIsRecorded(false);
                    setAudioPlayer(
                        <></>
                    );
                    setIsRecording(true);
                    setButtonImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");

                } else {
                    setOnRec(false);
                }
            };
        });
    };

    // 사용자가 음성 녹음을 중지했을 때
    const offRecAudio = () => {
        // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
        media.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
        };

        // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
        stream.getAudioTracks().forEach(function (track) {
            track.stop();
        });

        // 미디어 캡처 중지
        media.stop();
        // 메서드가 호출 된 노드 연결 해제
        analyser.disconnect();
        source.disconnect();
    };

    const uploadRecord = () => {
        axios.put(`/api/record/insert/${songNum}`).then((response)=>{
            console.log(response.data);
            const formData = new FormData();
            formData.append("recordSound", renameFile(soundFile, song.songName + "-" + response.data + ".mp3"));
            console.log(formData.get("recordSound"));

            axios.post(`/api/record/update/sound/${response.data}`, formData, {

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
                    title: "커버 곡 업로드",
                    text: "커버 곡이 성공적으로 업로드 되었습니다.",
                    icon: "success"
                }).then(() => {
                    navigate("/myPage");
                })
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    function renameFile(originalFile, newName) {
        return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
        });
    }

    const onSubmitAudioFile = useCallback((nickName, songName) => {
        if (audioUrl) {
            setIsRecorded(false);
            console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
        }
        // File 생성자를 사용해 파일로 변환
        const sound = new File([audioUrl], "soundBlob" ,{lastModified: new Date().getTime(), type: "audio"});
        setSoundFile(sound);
        console.log(sound); // File 정보 출력

        setMyAudioPlayer(
            <AudioPlayer
                src={URL.createObjectURL(audioUrl)}
                autoPlay={false}
            />
        )
    }, [audioUrl]);

    useEffect(() => {
        const url = `/api/song/${songNum}`;
        axios.get(url).then((response) => {
            console.log(response.data);

            setSong(response.data);
            setSingerName(response.data.singer.singerName);
            setCategoryName(response.data.category.categoryName);

            imageRef.current.style.setProperty('background-image', `url(${response.data.songImageUrl})`);

            const songSound = new Audio(response.data.songSoundUrl);
            songSound.onloadedmetadata = () => {
                setSongSoundDuration(songSound.duration);
            }

        }).catch((error) => {
            console.log(error);
        });

        axios.post("/api/user/loginUser").then((response) => {
            console.log(response.data);

            setUser(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (isPlay && onRec) {
            Swal.fire({
                title: "녹음하기",
                text: "3초 뒤 녹음을 시작합니다",
                icon: "warning",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onRecAudio();
                setAudioPlayer(
                    <AudioPlayer
                        src={song.songSoundUrl}
                        autoPlay={true}
                        volume={0}
                        style={{
                            display: "none"
                        }}
                    />
                );

                /*
                                        onEnded={() => {
                            console.log("songEnd");
                            setIsRecorded(false);
                            setAudioPlayer(
                                <></>
                            );
                            setIsRecording(true);
                            setButtonImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");
                        }}
                 */
            });
            setIsRecording(false);
            setButtonImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/stopButton.png");
        } else {
            if (!onRec) {
                Swal.fire({
                    title: "녹음하기",
                    text: "녹음을 중단하시겠습니까?",
                    icon: "warning",
                    showCancelButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        offRecAudio();
                        setAudioPlayer(
                            <></>
                        );
                        setIsRecording(true);
                        setButtonImageUrl("https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/playButton.png");
                    } else {

                    }
                });
            }

        }
    }, [isPlay]);

    return (
        <>
            <div ref={imageRef} className="myCoverContainer">
                <div className="myBackDropFilter">
                    <Modal isOpen={isModalOpen} ariaHideApp={false} onRequestClose={() => setIsModalOpen(false)}
                           style={{
                               overlay: {position: 'fixed', background: 'rgba(0, 0, 0, 0.5)'},
                               content: {margin: 'auto', width: '500px', height: '500px'},
                           }}>
                        <div className="myModalContainer">
                            <h3>커버 곡 저장</h3>
                            <h4>닉네임 : {user.nickName}</h4>
                            <h4>커버 곡 : {song.songName}</h4>
                            <hr/>
                            <h4>미리 듣기</h4>
                            {myAudioPlayer}
                            <hr/>
                            <Button
                                className="myCancelButton"
                                onClick={() => {
                                    setIsModalOpen(false);
                                }}
                            >
                                취소
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                className="mySaveButton"
                                onClick={()=>{
                                    uploadRecord()
                                }}
                            >
                                저장
                            </Button>
                        </div>
                    </Modal>
                    <div hidden={isRecording} className="myRecording">
                        <h3>녹음중</h3>
                        <div></div>
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
                        <h4 className="mySingerName">{singerName} · {categoryName}</h4>
                    </div>
                    <div className="myPlayContainer">
                        <img
                            className="myPlayButton"
                            src={buttonImageUrl}
                            onClick={() => {
                                setIsPlay(!isPlay);
                            }}
                        />
                        <img
                            hidden={isRecorded}
                            onClick={() => {
                                //onSubmitAudioFile();
                                setIsModalOpen(true);
                                onSubmitAudioFile();
                            }}
                            className="myPlayButton"
                            src={uploadFileImage}
                        />
                        {audioPlayer}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cover;