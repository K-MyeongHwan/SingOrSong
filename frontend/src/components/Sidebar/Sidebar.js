import React, {useContext, useState} from "react";
import {useLocation, NavLink} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {MainContext} from "../../layouts/Main";
import {isSearchOn} from "../Context/isSearchOn";

function Sidebar({color, image, routes}) {
    const {isSearch, setIsSearch} = useContext(isSearchOn);
    const location = useLocation();
    const activeRoute = (routeName) => {
        return location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };

    return (
        <div className="sidebar" data-image={image} data-color={color}>
            <div className="sidebar-background" style={{backgroundImage: "url(" + image + ")"}}/>
            <div className="sidebar-wrapper">
                <div className="logo d-flex align-items-center justify-content-start">
                    <a className="simple-text" href="/" style={{textDecoration: "none"}}>
                        Sing_OR_Song
                    </a>
                </div>
                <Nav>
                    {routes.map((prop, key) => {
                        if (!prop.redirect)
                            if (sessionStorage.getItem("loginUser") && prop.name === "Login") {
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
