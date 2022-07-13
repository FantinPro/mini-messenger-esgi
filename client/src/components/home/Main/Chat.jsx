import React from 'react';
import { useParams } from 'react-router-dom';

export default function Chat () {
    let params = useParams();
    return (
        <div>
            <h1>Chat conv n° : {params.friendId}</h1>
        </div>
    );
}