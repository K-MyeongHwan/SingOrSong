import React, {useContext, useState} from "react";
import {useLocation, NavLink, useNavigate} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {MainContext} from "../../layouts/Main";
import {isSearchOn} from "../Context/isSearchOn";
import axios from "axios";
import Swal from "sweetalert2";

function Sidebar({color, image, routes}) {
    const navigate = useNavigate();
    const {isSearch, setIsSearch} = useContext(isSearchOn);
    const location = useLocation();
    const activeRoute = (routeName) => {
        return location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };

    const logoutHandler = () => {
        Swal.fire({
            title : "로그아웃",
            text : "로그아웃 하시겠습니까?",
            icon : "warning",
            confirmButtonText: "Yes, delete it!"
        }).then((result)=>{
            if(result.isConfirmed) {
                axios.post("/api/user/logout").then((response) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    sessionStorage.clear();
                    Swal.fire({
                        title: "로그아웃",
                        text: "로그아웃 하셨습니다.",
                        icon: "warning"
                    }).then(() => {
                        navigate("/home");
                    })
                })
            } else {

            }
        })
    }

    return (
        <div className="sidebar" data-image={image} data-color={color}>
            <div className="sidebar-wrapper">
                <div className="logo d-flex align-items-center justify-content-start">
                    <a className="simple-text" href="/" style={{textDecoration: "none"}}>
                        <img className="myLogo"
                             alt="..."
                            src="https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/etc/SINGORSONG_LOGO.png"/>
                    </a>
                </div>
                <Nav>
                    {routes.map((prop, key) => {
                        if (!prop.redirect)
                            if (sessionStorage.getItem("loginUser") && prop.name === "Login") {
                                return;
                            } else if (!sessionStorage.getItem("loginUser") && prop.name === "Logout") {
                                return;
                            } else if (!sessionStorage.getItem("loginUser") && prop.name === "MyPage") {
                                return;
                            }

                        if (prop.name === "Search") {
                            return (
                                <li
                                    className={
                                        prop.upgrade
                                            ? "active active-pro"
                                            : activeRoute(prop.layout + prop.path)
                                    }
                                    key={key}
                                >
                                    <div
                                        className="nav-link"
                                        activeclassname="active"
                                        onClick={()=>{
                                            setIsSearch(!isSearch);
                                        }}
                                    >
                                        <i className={prop.icon}/>
                                        <p>{prop.name}</p>
                                    </div>
                                </li>
                            );
                        }

                        if(prop.name === "Logout") {
                            return (
                                <li
                                    className={
                                        prop.upgrade
                                            ? "active active-pro"
                                            : activeRoute(prop.layout + prop.path)
                                    }
                                    key={key}
                                >
                                    <div
                                        className="nav-link"
                                        activeclassname="active"
                                        onClick={()=>{
                                            logoutHandler();
                                        }}
                                    >
                                        <i className={prop.icon}/>
                                        <p>{prop.name}</p>
                                    </div>
                                </li>
                            );
                        }
                        return (
                            <li
                                className={
                                    prop.upgrade
                                        ? "active active-pro"
                                        : activeRoute(prop.layout + prop.path)
                                }
                                key={key}
                            >
                                <NavLink
                                    to={prop.path}
                                    className="nav-link"
                                    activeclassname="active"
                                >
                                    <i className={prop.icon}/>
                                    <p>{prop.name}</p>
                                </NavLink>
                            </li>
                        );
                        return null;
                    })}
                </Nav>
            </div>
        </div>
    );
}

export default Sidebar;
