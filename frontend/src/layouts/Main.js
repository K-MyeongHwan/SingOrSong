import React, {createContext, useState} from "react";
import {useLocation, Route, Routes} from "react-router-dom";

import BackdropFilter from "react-backdrop-filter";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes.js";
import mainBackgroundImage from "../assets/img/mainBackgroundImage.jpg";
import Song from "../views/Song";
import Register from "../views/Register";
import Singer from "../views/Singer";
import Cover from "../views/Cover";
import CoverDetail from "../views/CoverDetail";
import SearchBar from "../components/SearchBar/SearchBar";
import {isSearchOn} from "../components/Context/isSearchOn";
import User from "../views/User";
import Cover2 from "../views/Cover2";

export const MainContext = createContext();

function Main() {
    const [isSearch, setIsSearch] = useState(true);
    const [image, setImage] = React.useState(mainBackgroundImage);
    const [color, setColor] = React.useState("black");
    const [hasImage, setHasImage] = React.useState(true);
    const location = useLocation();
    const mainPanel = React.useRef(null);
    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainPanel.current.scrollTop = 0;
        if (
            window.innerWidth < 993 &&
            document.documentElement.className.indexOf("nav-open") !== -1
        ) {
            document.documentElement.classList.toggle("nav-open");
            var element = document.getElementById("bodyClick");
            element.parentNode.removeChild(element);
        }
    }, [location]);

    //React
    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.name === "Search") {
                return;
            }
            if (prop.name === "Logout") {
                return;
            }

            return (
                <Route
                    path={prop.path}
                    element={<prop.component/>}
                    key={key}
                />
            );
        });
    };

    return (
        <isSearchOn.Provider value={{isSearch, setIsSearch}}>
            <div className="wrapper myMainBackgroundImage" style={{
                backgroundImage: "url(" + image + ")",
            }}>
                <div className="mainBackDrop">

                    <Sidebar color={color} image={hasImage ? image : ""} routes={routes}/>
                    <div className="main-panel" ref={mainPanel}>
                        <SearchBar/>
                        <div className="content">
                            <Routes>
                                {getRoutes(routes)}
                                <Route path="song/:songNum" element={<Song/>}/>
                                <Route path="cover2/:songNum" element={<Cover2/>}/>
                                <Route path="coverDetail/:recordId" element={<CoverDetail/>}/>
                                <Route path="singer/:singerName" element={<Singer/>}/>
                                <Route path="user/:nickName" element={<User/>}/>
                                <Route path="cover/:songNum" element={<Cover/>}/>
                            </Routes>
                        </div>
                        <div className="myFooter">
                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        </isSearchOn.Provider>
    );
}

export default Main;
