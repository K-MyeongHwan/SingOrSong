import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Oauth() {
    const navigate = useNavigate();
    const type = useParams().type;
    const urlParams = new URLSearchParams(window.location.search);
    const [code, setCode] = useState(urlParams.get("code"));

    const findUserByEmail = (userInfo, platName) => {
        const User = {
            userName: userInfo.nickname,
            userEmail: userInfo.email,
            nickName: userInfo.id,
        }
        console.log(User);

        const url = `/api/user/register/checkEmail/${userInfo.email}`;
        axios.get(url).then((response) => {
            console.log(response.data);

            if (response.data) {
                console.log(User);
                Swal.fire({
                    title: "회원가입",
                    text: "첫 로그인이므로 회원가입을 진행합니다.",
                    icon: "info"
                }).then(() => {
                    insertUserRequest(User, platName);
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    title: "로그인 성공",
                    text: "로그인에 성공했습니다.",
                    icon: "success"
                }).then(() => {
                    navigate("/home");
                });
                navigate("/home");
            }
        }).catch((e) => {
            console.log(e);
        });
    }


    const insertUserRequest = (User, platName) => {
        if(User.userName===null || User.userEmail===null || User.nickName===null) {
            Swal.fire({
                title: "로그인 오류",
                text: "로그인에 실패했습니다. 잠시 뒤에 다시 한번 시도해주세요.",
                icon: "error"
            }).then(() => {
                navigate("/login");
            });
        }

        axios.post(`/api/user/register/new/${platName}`, User).then((response) => {
            console.log(response.data);
            Swal.fire({
                title: "로그인 성공",
                text: "로그인에 성공했습니다.",
                icon: "success"
            }).then(() => {
                navigate("/home");
            });
        }).catch((e) => {
            Swal.fire({
                title: "로그인 오류",
                text: "로그인에 실패했습니다. 잠시 뒤에 다시 한번 시도해주세요.",
                icon: "error"
            }).then(() => {
                navigate("/login");
            });
        });
    }

    useEffect(() => {
        switch (type) {
            case "kakao" : {
                axios.post(`/api/oauth/kakao/${code}`).then((response) => {
                    console.log(response.data);

                    findUserByEmail(response.data, "Kakao");
                }).catch((e) => {
                    console.log(e);
                });

                break;
            }

            case "google" : {
                const params = {
                    code : code
                }
                axios.post(`/api/oauth/google/code`, null, { params : { code : code }}).then((response)=>{
                    console.log(response.data);

                    findUserByEmail(response.data, "Google");
                }).catch((e)=>{
                    console.log(e);
                });

                break;
            }

            case "naver" : {
                axios.post(`/api/oauth/naver/${code}`).then((response)=>{
                    console.log(response.data);

                    findUserByEmail(response.data, "Naver");
                }).catch((e)=>{
                    console.log(e);
                });

                break;
            }

            default : {

            }
        }
    },[]);

    return (
        <>

        </>
    );
}

export default Oauth;
