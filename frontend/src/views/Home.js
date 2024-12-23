import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Select from "react-select";
import "react-dropdown/style.css";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
    let settings = {
        infinite: true, speed: 400, slidesToShow: 4, slidesToScroll: 2, autoplay: true, draggable: true
    };
    const [sliderList, setSliderList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [songList, setSongList] = useState([]);
    const [songNum, setSongNum] = useState(0);
    const [songName, setSongName] = useState('');
    const [searchType, setSearchType] = useState("category");
    const [searchTypeComponent, setSearchTypeComponent] = useState(<></>);

    let navigate = useNavigate();
    let columns = [{
        field: "songNum", headerClassName: 'super-app-theme--header', headerName: "곡 번호", width: 100
    }, {
        field: "songAlbum",
        headerClassName: 'super-app-theme--header',
        headerName: "노래 앨범",
        width: 100,
        renderCell: (params) => {
            return (<div>
                <img
                    className="songListAlbum border-gray"
                    src={params.row.songImageUrl}
                />
            </div>)
        }
    }, {
        field: "songName",
        headerClassName: 'super-app-theme--header',
        headerName: "곡 이름",
        width: 300,
        renderCell: (params) => {
            return (<div onClick={(e) => {
                navigate(`/song/${params.id}`);
            }}>
                {params.row.songName}
            </div>)
        }
    }, {
        field: "singerName",
        headerClassName: 'super-app-theme--header',
        headerName: "가수",
        width: 200,
        renderCell: (params) => {
            return (<div onClick={(e) => {
                navigate(`/singer/${params.row.singerName}`);
            }}>
                {params.row.singerName}
            </div>)
        }
    }, {
        field: "replayCount", headerClassName: 'super-app-theme--header', headerName: "재생 횟수", flex: 1, width: 100
    }]

    const getSongListByCategoryNum = (categoryNum) => {
        const url = `api/home/songList/${categoryNum}`;
        axios.get(url).then((response) => {
            response.data.map((song) => {
                song.id = song.songNum;
                song.singerName = song.singer.singerName
            });
            setSongList(response.data);
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: "검색 오류", text: "카테고리에 해당된 노래가 검색되지 않았습니다."
            })
        });
    }

    const changedSongNum = (songNum) => {
        if (songNum > 0) {
            const url = `/api/song/${songNum}`;
            const song = [];
            axios.get(url).then((response) => {
                response.data.id = response.data.songNum;
                response.data.singerName = response.data.singer.singerName;

                song.push(response.data);
                setSongList(song);
            }).catch((e) => {
                setSongList([]);
            })
        }
    }

    const changedSongName = (songName) => {
        if (songName.length !== 0) {
            const url = `/api/song/search/${songName}`;
            axios.get(url).then((response) => {
                response.data.map((song) => {
                    song.id = song.songNum;
                    song.singerName = song.singer.singerName
                })
                setSongList(response.data);
            }).catch((e) => {
                console.log(e);
                setSongList([]);
            })
        } else {
            setSongList(songList);
        }
    }

    const changedSearchType = (searchType) => {
        setSearchType(searchType);
        switch (searchType) {
            case "category" : {
                setSearchTypeComponent(<Select options={categoryList}
                                               className="myInputTrans"
                                               styles={{
                                                   control: (baseStyles, state) => ({
                                                       ...baseStyles,
                                                       borderColor: "gray",
                                                       backgroundColor: "transparent",
                                                   })
                                               }}
                                               onChange={(e) => {
                                                   setSelectedCategory(e.value);
                                               }}
                />);
                break;
            }

            case "songNum" : {
                setSearchTypeComponent(<Form.Control
                    className="myInputTrans"
                    placeholder="곡 번호"
                    type="number"
                    onChange={(e) => {
                        setSongNum(e.target.value);
                        changedSongNum(e.target.value);
                    }}
                />);
                break;
            }

            case "songName" : {
                setSearchTypeComponent(<Form.Control
                    className="myInputTrans"
                    placeholder="곡 이름"
                    type="text"
                    onChange={(e) => {
                        setSongName(e.target.value);
                        changedSongName(e.target.value);
                    }}
                />);
                break;
            }

            default : {

            }
        }
    }

    const handlerBySearchType = (searchType) => {
        switch (searchType) {
            case "category" : {
                if (selectedCategory === 0) {
                    Swal.fire({
                        title: "검색 오류", text: "카테고리를 선택해주세요."
                    });
                    return;
                }
                getSongListByCategoryNum(selectedCategory);
                break;
            }

            case "songNum" : {
                changedSongNum(songNum);
                if (songList.length === 0) {
                    Swal.fire({
                        title: "검색 오류", text: "해당 곡 번호에 선택되는 곡이 없습니다."
                    })
                }
                break;
            }

            case "songName" : {
                changedSongName(songName);
                if (songList.length === 0) {
                    Swal.fire({
                        title: "검색 오류", text: "해당 문자가 들어간 곡이 없습니다."
                    })
                }
                break;
            }

            default : {

            }
        }
    }

    const getSliderList = (sliderList) => {
        return sliderList.map((song, key) => {
            return (
                <div key={key} onClick={()=>{
                    navigate('/song/' + song.songNum);
                }}>
                    <div className="sliderImage" style={{
                        backgroundImage: "url(" + song.songImageUrl + ")",
                    }}>
                        <div className="sliderFilter">
                        </div>
                        <div className="sliderText">
                            {song.songName}
                        </div>
                    </div>
                </div>
            )
        });
    }

    useEffect(() => {
        axios.get("api/home/categoryList").then((response) => {
            let options = [];
            response.data.map((category) => {
                let option = {};
                option.value = category.categoryNum;
                option.label = category.categoryName;
                options.push(option);
            });
            setCategoryList(options);
            setSearchTypeComponent(<Select options={options}
                                           styles={{
                                               control: (baseStyles, state) => ({
                                                   ...baseStyles, borderColor: "gray", backgroundColor: "transparent",
                                               })
                                           }}
                                           onChange={(e) => {
                                               setSelectedCategory(e.value);
                                           }}
            />);
        }).catch((error) => {
            console.log(error);
        });

        axios.get("api/home/songList").then((response) => {
            response.data.map((song) => {
                song.id = song.songNum;
                song.singerName = song.singer.singerName
            });

            response.data.sort((a, b) => {
                return b.replayCount - a.replayCount;
            });

            let top12List = [];
            for (let i = 0; i < 12; i++) {
                top12List.push(response.data[i]);
            }

            setSliderList(top12List);
            setSongList(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);


    return (<Container fluid>
            <Card className="myTodayCard">
                <div className="three">
                    <h1>인기차트</h1>
                </div>
                <div className="mySearchContainer">
                    <FormControl>
                        <RadioGroup
                            row
                            defaultValue="category"
                            onChange={(e) => {
                                changedSearchType(e.target.defaultValue);
                            }}>
                            <FormControlLabel value="category" control={<Radio size="small"/>} label="카테고리"/>
                            <FormControlLabel value="songNum" control={<Radio size="small"/>} label="곡 번호"/>
                            <FormControlLabel value="songName" control={<Radio size="small"/>} label="곡 이름"/>
                        </RadioGroup>
                    </FormControl>
                    <Row>
                        <Col className="pl-1" md="6">
                            <Form.Group>
                                {searchTypeComponent}
                            </Form.Group>
                        </Col>
                        <Col className="pl-1" md="3">
                            <button
                                className="custom-btn btn-1"
                                variant="info"
                                onClick={() => {
                                    handlerBySearchType(searchType);
                                }}
                            >
                                Search
                            </button>
                        </Col>
                    </Row>
                </div>
                <hr role="tournament1"/>
                <div className="mySliderContainer">
                    <Slider {...settings}>
                        {getSliderList(sliderList)}
                    </Slider>
                </div>
                <Card.Body className="mySearch">
                    <DataGrid
                        rows={songList}
                        columns={columns}
                        sx={{
                            '.MuiDataGrid-footerContainer': {
                                display: 'none !important'
                            }, '& .super-app-theme--header': {
                                backgroundColor: 'rgba(132, 91, 43, 0.7)'
                            }
                        }}
                    />
                </Card.Body>
            </Card>
        </Container>

    );
}

export default Home;
