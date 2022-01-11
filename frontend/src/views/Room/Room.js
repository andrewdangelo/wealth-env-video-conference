import React from 'react';
import { MeVideo } from '../../components/VideoContainers/MeVideo';
import Peers from '../../components/VideoContainers/Peers';

export default function Room() {
    return (
        <div>
            <MeVideo />
            <Peers />
        </div>
    )
}
