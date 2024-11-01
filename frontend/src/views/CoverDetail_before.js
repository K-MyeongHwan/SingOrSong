import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import Swal from "sweetalert2";
import {useCookies} from "react-cookie";

function CoverDetail_before() {
    const navigate = useNavigate();
    const [recordId, setRecordId] = useState(useParams().recordId);
    const [record, setRecord] = useState({});
    const [cookie, setCookie] = useCookies(["cover_" + recordId]);
    const [viewCount, setViewCount] = useState(0);
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
            response.data.songName = response.data.song.songName;
            response.data.nickName = response.data.user.nickName;
            response.data.songImageUrl = response.data.song.songImageUrl;

            if(!response.data.viewCount) {
                response.data.viewCount = 0;
            }

            if(!response.data.likeRecordCount) {
                response.data.likeRecordCount = 0;
            }

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
                setCookie(cookie_name, true, { path : "/", expires : new Date(Date.now() + 86400 * 1000)});
            }).catch((error) => {
                console.log(error);
            })
        }

    }, [])

    return (
        <>

        </>
    )
        ;
}

export default CoverDetail_before;
