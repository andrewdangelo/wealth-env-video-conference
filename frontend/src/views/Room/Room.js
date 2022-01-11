import React from 'react';
import classNames from 'classnames';

import { MeVideo } from '../../components/VideoContainers/MeVideo';
import Peers from '../../components/VideoContainers/Peers';

import styles from "./room.module.css";
import ControlBar from '../../components/Controls/ControlBar';

export default function Room() {
    return (
        <div className={styles.container}>
            <MeVideo />
            <Peers />
            <ControlBar />
        </div>
    )
}
