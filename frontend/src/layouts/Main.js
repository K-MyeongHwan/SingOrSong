import React, {createContext, useState} from "react";
import {useLocation, Route, Routes} from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes.js";
import sidebarImage from "../assets/img/sidebarImage.png";
import Song from "../views/Song";
import Register from "../views/Register";
import Singer from "../views/Singer";
import Cover from "../views/Cover";
import CoverDetail from "../views/CoverDetail";
import SearchBar from "../components/SearchBar/SearchBar";
import {isSearchOn} from "../components/Context/isSearchOn";

export const MainContext = createContext();

function Main() {
    const [isSearch, setIsSearch] = useState(true);
    const [image, setImage] = React.useState(sidebarImage);
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
            if(prop.name === "Search") {
                return ;
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
        <isSearchOn.Provider value={{ isSearch, setIsSearch }}>
            <div className="wrapper">
                <Sidebar color={color} image={hasImage ? image : ""} routes={routes}/>
                <div className="main-panel" ref={mainPanel}>
                    <SearchBar/>
                    <div className="content">
                        <Routes>
                            {getRoutes(routes)}
                            <Route path="song/:songNum" element={<Song/>}/>
                            <Route path="coverDetail/:recordId" element={<CoverDetail/>}/>
                            <Route path="singer/:singerName" element={<Singer/>}/>
                            <Route path="register" element={<Register/>}/>
                            <Route path="cover/:songNum" element={<Cover/>}/>
                        </Routes>
                    </div>
                    <div className="myFooter">
                        <Footer/>
                    </div>
                </div>
            </div>
        </isSearchOn.Provider>
    );
}

export default Main;
