import React, { useState, useContext } from 'react';
import RoomContext, { withRoomContext } from '../../RoomContext';

import styles from "./controlBar.module.css";



function ControlBar() {
    const [webcamOff, setWebcamOff] = useState(false);
    const [micOff, setMicOff] = useState(false);
    const [shareOff, setShareOff] = useState(false);


    const sfu = useContext(RoomContext);


    const handleWebcam = () => {
        if (webcamOff){
            setWebcamOff(false);
            sfu.enableWebcam();

        }
        else {
          setWebcamOff(true);
          sfu.disableWebcam();
        }    
    }

    const handleMic = () => {
        if (micOff){
            setMicOff(false);
            sfu.enableMic();
        } else {
            setMicOff(true);
            sfu.disableMic();
        }
    }

    const handleShare = () => {
        if (shareOff){
            setShareOff(false);
            sfu.enableShare();
        } else {
            setShareOff(true);
            sfu.disableShare();
        }
    }
    return (
        <div className={ styles.container}>
            <div>
                {webcamOff ? (<button onClick={handleWebcam}>Turn webcam on</button>) : <button onClick={handleWebcam}>Turn webcam Off</button>}
            </div>
            <div>
                {micOff ? (<button onClick={handleMic}>Turn mic on</button>) : <button onClick={handleMic}>Turn mic Off</button>}
            </div>
            <div>
                {shareOff ? (<button onClick={handleShare}>Turn share on</button>) : <button onClick={handleShare}>Turn share Off</button>}
            </div>
        </div>
    )
}

export default withRoomContext(ControlBar);
