import React, {useContext, useEffect, useState} from "react";
import {isSearchOn} from "../Context/isSearchOn";
import axios from "axios";
import {useNavigate} from "react-router-dom";

/*
                <div className="mySearchList">
                    <img
                        className="mySearchImage"
                        src={"https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/profileImage/Odoriko_1729482428169.webp"}
                    />
                    <div className="mySearchListText">
                        <div>asdfasfd</div>
                        <span>asdflaksl;dfkla;s</span>
                    </div>
                </div>
 */

function SearchBar() {
    const navigate = useNavigate();
    const {isSearch, setIsSearch} = useContext(isSearchOn);
    const [searchText, setSearchText] = useState('');
    const [singerList, setSingerList] = useState([]);
    const [userList, setUserList] = useState([]);

    const stringConfirm = (str, length = 20) => {
        let result = '';
        if (str.length > length) {
            result = str.substr(0, length - 2) + '...';
        } else {
            result = str;
        }
        return result;
    };

    const clearHandler = () => {
        setSearchText('');
        setUserList(<></>);
        setSingerList(<></>);
    }

    const onChangeHandler = () => {
        if (searchText) {
            axios.post(`/api/user/contain/${searchText}`).then((response) => {
                console.log(response.data);
                let userElementList = [];

                if (response.data) {
                    response.data.map((user) => {
                        userElementList.push(
                            <div className="mySearchList" key={user.userId} onClick={()=>{
                                window.location.href = '/user/' + user.nickName;
                            }}>
                                <img
                                    className="mySearchImage"
                                    src={user.profileImageUrl || "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/profileImage/default_1728486344829.png"}
                                />
                                <div className="mySearchListText">
                                    <div>{stringConfirm(user.nickName)}</div>
                                    <span>{user.userName} · User</span>
                                </div>
                            </div>
                        )
                    });

                    console.log(userElementList);
                    setUserList(userElementList);
                }
            }).catch((error) => {
                console.log(error);
            });

            axios.post(`/api/singer/contain/${searchText}`).then((response) => {
                console.log(response.data);
                let singerElementList = [];

                if (response.data) {
                    response.data.map((singer) => {
                        singerElementList.push(
                            <div className="mySearchList" key={singer.singerNum} onClick={()=>{
                                window.location.href = '/singer/' + singer.singerName;
                            }}>
                                <img
                                    className="mySearchImage"
                                    src={singer.singerImageUrl || "https://singorsong-bucket.s3.ap-northeast-2.amazonaws.com/singerImage/default.jpg"}
                                />
                                <div className="mySearchListText">
                                    <div>{stringConfirm(singer.singerName)}</div>
                                    <span>{singer.singerName} · Singer</span>
                                </div>
                            </div>
                        )
                    });

                    console.log(singerElementList);
                    setSingerList(singerElementList);
                }
            }).catch((error) => {
                console.log(error);
            });


        } else {
            setUserList(<></>);
            setSingerList(<></>);
        }
    }

    useEffect(() => {
        console.log(isSearch);
    }, []);

    useEffect(() => {
        onChangeHandler();
    }, [searchText]);

    return (
        <>
            <div className="mySearchBar" hidden={isSearch}>
                <h3>검색</h3>
                <div className="inputWrap">
                    <input type="text" value={searchText || ""} placeholder="유저, 가수 검색"
                           onChange={(e) => {
                               setSearchText(e.target.value);
                           }}/>
                    <button className="btnClear" onClick={() => {
                        clearHandler();
                    }}></button>
                </div>
                <hr role="tournament1"/>
                {singerList}
                {userList}
            </div>
        </>
    );
}

export default SearchBar;
