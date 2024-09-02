import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

function Oauth() {
  const type = useParams();
  console.log(type);

  useEffect(()=>{
    switch (type) {
      case "kakao" : {
        break;
      }

      case "google" : {
        break;
      }

      case "naver" : {
        break;
      }

      default : {

      }
    }
  });

  return (
    <>

    </>
  );
}

export default Oauth;
