import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Select from "react-select";
import "react-dropdown/style.css";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

function Home() {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [songList, setSongList] = useState([]);
    const [songNum, setSongNum] = useState(0);
    const [songName, setSongName] = useState('');
    const [searchType, setSearchType] = useState("category");
    const [searchTypeComponent, setSearchTypeComponent] = useState(<></>)

    let navigate = useNavigate();
    let columns = [
        {
            field: "songNum",
            headerName: "곡 번호"
        },
        {
            field: "songName",
            headerName: "곡 이름",
            width: 300
        },
        {
            field: "singerName",
            headerName: "가수",
            width: 200
        },
        {
            field: "replayCount",
            headerName: "재생 횟수",
            width: 50
        }
    ]

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
                title: "검색 오류",
                text: "카테고리에 해당된 노래가 검색되지 않았습니다."
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
                response.data.map((song)=>{
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
                setSearchTypeComponent(
                    <Select options={categoryList}
                            onChange={(e) => {
                                setSelectedCategory(e.value);
                            }}
                    />);
                break;
            }

            case "songNum" : {
                setSearchTypeComponent(
                    <Form.Control
                        placeholder="곡 번호"
                        type="number"
                        onChange={(e) => {
                            setSongNum(e.target.value);
                            changedSongNum(e.target.value);
                        }}
                    />
                );
                break;
            }

            case "songName" : {
                setSearchTypeComponent(
                    <Form.Control
                        placeholder="곡 이름"
                        type="text"
                        onChange={(e) => {
                            setSongName(e.target.value);
                            changedSongName(e.target.value);
                        }}
                    />
                );
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
                        title: "검색 오류",
                        text: "카테고리를 선택해주세요."
                    });
                    return;
                }
                getSongListByCategoryNum(selectedCategory);
                break;
            }

            case "songNum" : {
                changedSongNum(songNum);
                if(songList.length === 0) {
                    Swal.fire({
                        title : "검색 오류",
                        text : "해당 곡 번호에 선택되는 곡이 없습니다."
                    })
                }
                break;
            }

            case "songName" : {
                changedSongName(songName);
                if(songList.length === 0) {
                    Swal.fire({
                        title : "검색 오류",
                        text : "해당 문자가 들어간 곡이 없습니다."
                    })
                }
                break;
            }

            default : {

            }
        }
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
            setSearchTypeComponent(
                <Select options={options}
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
            setSongList(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);


    return (
        <Container fluid>
            <Card>
                <Card.Header>
                    <Card.Title className="myTitle">인기차트</Card.Title>
                    <Card className="mySearch">
                        <FormControl>
                            <FormLabel as="h5">검색 종류</FormLabel>
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
                        <h2>곡 검색</h2>
                        <hr/>
                        <Row>
                           <Col className="pl-1" md="6">
                                <Form.Group>
                                    {searchTypeComponent}
                                </Form.Group>
                            </Col>
                            <Col className="pl-1" md="3">
                                <Button
                                    className="btn-fill pull-right"
                                    variant="info"
                                    onClick={() => {
                                        handlerBySearchType(searchType);
                                    }}
                                >
                                    곡 검색
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Card.Header>
                <Card.Body className="mySearch">
                    <DataGrid
                        rows={songList}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 10},
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        onCellDoubleClick={(params, event) => {
                            navigate(`/song/${params.id}`);
                        }}
                    />
                </Card.Body>
            </Card>
        </Container>

    );
}

export default Home;
