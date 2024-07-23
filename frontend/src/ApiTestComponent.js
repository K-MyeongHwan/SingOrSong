import React, {useState} from 'react';
import axios from "axios";

const ApiTestComponent = () => {
    const [text, setText] = useState('');
    const onClickEnter = () => {
        axios.get('/api/test')
            .then(res => {
                if (res.data !== undefined) {
                    setText(res.data);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    };

    return (
        <div>
            <button onClick={onClickEnter}>입장</button>
            <h1>{text}</h1>
        </div>
    );
};

export default ApiTestComponent;