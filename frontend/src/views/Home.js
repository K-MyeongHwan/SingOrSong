import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Select from "react-select";
import "react-dropdown/style.css";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

function Home() {
    let [categoryList, setCategoryList] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState(0);
    let [songList, setSongList] = useState([]);
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
                title : "검색 오류",
                text : "카테고리에 해당된 노래가 검색되지 않았습니다."
            })
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
                        <h2>카테고리 검색</h2>
                        <hr />
                        <Row>
                            <Col className="pl-1" md="6">
                                <Form.Group>
                                    <Select options={categoryList}
                                            onChange={(e) => {
                                                setSelectedCategory(e.value);
                                            }}/>
                                </Form.Group>
                            </Col>
                            <Col className="pl-1" md="3">
                                <Button
                                    className="btn-fill pull-right"
                                    variant="info"
                                    onClick={() => {
                                        if (selectedCategory === 0) {
                                            Swal.fire({
                                                title: "카테고리 검색",
                                                text: "카테고리를 선택해주세요."
                                            });
                                            return;
                                        }
                                        getSongListByCategoryNum(selectedCategory);
                                    }}
                                >
                                    카테고리 검색
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
