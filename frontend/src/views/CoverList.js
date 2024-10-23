import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Select from "react-select";
import "react-dropdown/style.css";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

function CoverList() {
    const [songNum, setSongNum] = useState(0);
    const [recordList, setRecordList] = useState([]);
    const [searchType, setSearchType] = useState("category");
    const [searchTypeComponent, setSearchTypeComponent] = useState(<></>)

    let navigate = useNavigate();
    let columns = [
        {
            field: "recordId",
            headerName: "커버 번호",
            width: 100
        },
        {
            field: "songAlbum",
            headerName: "노래 앨범",
            width: 80,
            renderCell: (params) => {
                return (
                    <div>
                        <img
                            className="songListAlbum border-gray"
                            src={params.row.songImageUrl}
                        />
                    </div>
                )
            }
        },
        {
            field: "songName",
            headerName: "곡 이름",
            width: 200,
            renderCell: (params) => {
                return (
                    <div onClick={(e) => {
                        navigate(`/coverDetail/${params.row.recordId}`);
                    }}>
                        {params.row.songName}
                    </div>
                )
            }
        },
        {
            field: "nickName",
            headerName: "커버 유저 이름",
            width: 250,
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.nickName}
                    </div>
                )
            }
        },
        {
            field: "viewCount",
            headerName: "조회수",
            width: 100
        },
        {
            field: "likeRecordCount",
            headerName: "좋아요 수",
            width: 100
        }
    ]

    const changedSearchType = (searchType) => {
        setSearchType(searchType);
        switch (searchType) {
            case "viewCount" : {
                setSearchTypeComponent(<></>);
                let sortList = [...recordList];
                sortList.sort((a, b) => {
                    return b.viewCount - a.viewCount;
                })
                setRecordList(sortList);
                break;
            }

            case "likeRecord" : {
                setSearchTypeComponent(<></>);
                let sortList = [...recordList];
                sortList.sort((a, b) => {
                    return b.likeRecordCount - a.likeRecordCount;
                })
                setRecordList(sortList);
                break;
            }

            case "songNum" : {
                setSearchTypeComponent(
                    <Row>
                        <Col className="pl-1" md="8">
                            <Form.Control
                                placeholder="곡 번호"
                                type="number"
                                onChange={(e) => {
                                    songNumChangeHandler(e.target.value);
                                }}
                            />
                        </Col>
                        <Col className="pl-1" md="3">

                            <Button
                                className="btn-fill pull-right"
                                variant="info"
                                onClick={() => {
                                    songNumChangeHandler()
                                }}
                            >
                                검색
                            </Button>
                        </Col>
                    </Row>
                );
                break;
            }

            default : {

            }
        }
    }

    const songNumChangeHandler = (songNum) => {
        let recordListCopy = [...recordList];
        let sortList = [];

        recordListCopy.forEach((record)=>{
            if(record.song.songNum == songNum) {
                sortList.push(record);
            }
        });

        setRecordList(sortList);
    }

    useEffect(() => {
        axios.get("api/record/").then((response) => {
            console.log(response.data);
            response.data.map((record) => {
                record.id = record.recordId;
                record.songImageUrl = record.song.songImageUrl;
                record.songName = record.song.songName;
                record.nickName = record.user.nickName;

                if(!record.likeRecordCount) {
                    record.likeRecordCount = 0;
                }
            })
            setRecordList(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <Container fluid>
            <Card>
                <Card.Header>

                    <Card.Title className="myTitle">커버 곡 인기차트</Card.Title>
                    <Card className="mySearch">
                        <FormControl>
                            <FormLabel as="h5">검색 종류</FormLabel>
                            <RadioGroup
                                row
                                defaultValue="category"
                                onChange={(e) => {
                                    changedSearchType(e.target.defaultValue);
                                }}>
                                <FormControlLabel value="viewCount" control={<Radio size="small"/>} label="조회수 순"/>
                                <FormControlLabel value="likeRecord" control={<Radio size="small"/>} label="좋아요 순"/>
                                <FormControlLabel value="songNum" control={<Radio size="small"/>} label="곡 번호"/>
                            </RadioGroup>
                        </FormControl>
                        <hr/>
                        <Row>
                            <Col className="pl-1" md="6">
                                <Form.Group>
                                    {searchTypeComponent}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card>
                </Card.Header>
                <Card.Body className="mySearch">
                    <DataGrid
                        rows={recordList}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 10},
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </Card.Body>
            </Card>
        </Container>

    );
}

export default CoverList;
