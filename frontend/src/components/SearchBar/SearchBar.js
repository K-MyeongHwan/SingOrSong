import React, {useContext, useEffect} from "react";
import {isSearchOn} from "../Context/isSearchOn";


function SearchBar() {
    const { isSearch, setIsSearch } = useContext(isSearchOn);


    useEffect(()=>{
        console.log(isSearch);
    },[]);

    return (
        <>
            <div className="mySearchBar" hidden={isSearch}>
                asdfasdf
                asdfasdfasdf
            </div>
        </>
    );
}

export default SearchBar;
