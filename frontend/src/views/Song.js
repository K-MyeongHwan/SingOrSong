import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';

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

    useEffect(() => {
        const url = `/api/song/${songNum}`;
        axios.get(url).then((response) => {
            response.data.singerName = response.data.singer.singerName;
            setSong(response.data);
            setReplayCount(response.data.replayCount);
        }).catch((error) => {
            console.log(error);
        });

        axios.post('/api/song/audio').then((response) => {
            //Controller에서 통신해 받아온 값을 base64인코딩을 해제한다.
            const data = base64ToArrayBuffer(response.data.audio);

            //base64인코딩을 해제한 바이너리data를 변수에 담는다.
            const uInt8Array = new Uint8Array(data);

            // Blob Object 를 생성한다.
            const blob = new Blob([uInt8Array], {type: 'audio/mp3'});

            //blob으로 만든 객체를 재생시키기 위해 url로 주소를 만들어 객체에 담는다.
            const url = URL.createObjectURL(blob);

            //해당 주소를 audio객체를 만들어 소스에 넣고 플레이시킨다.
            setAudioSrc(url);
        });
    }, []);

    const playAudio = () => {
        const url = `/api/song/play/${song.songNum}`;
        axios.get(url).then((response) => {
            console.log("complete");
            setReplayCount(1 + replayCount);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <Container fluid>
                <Row>
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
                                    <h3>재생</h3>
                                    <br/>
                                    <hr/>
                                    <AudioPlayer
                                        preload="none"
                                        autoPlay={false}
                                        src={audioSrc}
                                        onPlay={(e) => {
                                            playAudio()
                                        }}
                                    />
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </>
    );
}

export default Song;
