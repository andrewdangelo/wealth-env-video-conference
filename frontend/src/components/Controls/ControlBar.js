import React, { useState, useContext } from 'react';
import RoomContext, { withRoomContext } from '../../RoomContext';

import styles from "./controlBar.module.css";



function ControlBar() {
    const [webcamOff, setWebcamOff] = useState(false);

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
    return (
        <div className={ styles.container}>
            <div>
                {webcamOff ? (<button onClick={handleWebcam}>Turn webcam on</button>) : <button onClick={handleWebcam}>Turn webcam Off</button>}
            </div>
        </div>
    )
}

export default withRoomContext(ControlBar);
