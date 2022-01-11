import React from 'react';
import { useSelector } from 'react-redux';
import Video from './Video';

export default function Peer({id, consumerId}) {
    const peer = useSelector((state)=> state.peers[id]);
    const me = useSelector((state)=>state.me);
    const consumersArr = useSelector((state)=> state.consumers[consumerId]);
    const audioConsumer = consumersArr.find((consumer)=>consumer.track.kind == 'audio');
    const videoConsumer = consumersArr.find((consumer)=>consumer.track.kind == 'video');
    

    return (
        <React.Fragment>
            <Video 
                id={id}
                videoTrack={videoConsumer ? videoConsumer.track : null}
                audioTrack={audioConsumer ? audioConsumer.track : null}
            />
        </React.Fragment>
    )
}
