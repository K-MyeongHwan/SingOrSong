import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, Container} from "react-bootstrap";
import Select from "react-select";
import "react-dropdown/style.css";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import Swal from "sweetalert2";

function Home() {
    let [categoryList, setCategoryList] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState(0);
    let [songList, setSongList] = useState([]);
    let columns = [
        {
            field : "songNum",
            headerName : "곡 번호"
        },
        {
            field : "songName",
            headerName : "곡 이름",
            width : 300
        },
        {
            field: "singerName",
            headerName : "가수",
            width : 200
        }]

    const getSongListByCategoryNum = (categoryNum)=>{
        const url = `api/home/songList/${categoryNum}`;
        axios.get(url).then((response)=>{
            response.data.map((song)=>{
                song.id = song.songNum;
                song.singerName = song.singer.singerName
            });
            setSongList(response.data);
        }).catch((error)=>{
            console.log(error);
        });
    }

    useEffect(()=>{
      axios.get("api/home/categoryList").then((response)=>{
          let options = [];
          response.data.map((category)=>{
                  let option = {};
                  option.value=category.categoryNum;
                  option.label=category.categoryName;
                  options.push(option);
          });
          setCategoryList(options);
      }).catch((error)=>{
          console.log(error);
      });

    axios.get("api/home/songList").then((response)=>{
        response.data.map((song)=>{
            song.id = song.songNum;
            song.singerName = song.singer.singerName
        });
        setSongList(response.data);
    }).catch((error)=>{
        console.log(error);
    });

  },[]);
  return (
      <Container fluid>
          <Card>
              <Card.Header>
                  <Card.Title as="h1">인기차트</Card.Title>
                  <Card className="mySearch">
                      <h3>노래 검색</h3>
                      <br />
                      <Select options={categoryList}
                              onChange={(e)=> {
                                  setSelectedCategory(e.value);
                              }}/>
                      <hr />
                      <Button
                          className="btn-fill pull-right"
                          variant="info"
                          onClick={()=>{
                              if(selectedCategory === 0) {
                                  Swal.fire({
                                      title : "카테고리 검색",
                                      text : "카테고리를 선택해주세요."
                                  });
                                  return;
                              }
                              getSongListByCategoryNum(selectedCategory);
                          }}
                      >
                          카테고리 검색
                      </Button>
                  </Card>
              </Card.Header>
              <Card.Body className="mySearch">
                  <DataGrid
                      rows={songList}
                      columns={columns}
                      initialState={{
                          pagination: {
                              paginationModel: { page: 0, pageSize: 10 },
                          },
                      }}
                      pageSizeOptions={[5, 10]}
                      onCellDoubleClick={(params, event) => {
                          console.log(params);
                          console.log(event);
                      }}
                  />
              </Card.Body>
          </Card>
      </Container>

  );
}

export default Home;
