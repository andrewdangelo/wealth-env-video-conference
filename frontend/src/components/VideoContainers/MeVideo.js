import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import Video from "./Video";
import styles from "./meVideo.module.css";

export const MeVideo = (props) => {
  //Get state from redux store
  const producers = useSelector((state) => state.producers);
  const me = useSelector((state) => state.me);
  const connected = useSelector((state) => state.room.connected);

  //Process data
  const producersArray = Object.values(producers);
  const audioProducer = producersArray.find(
    (producer) => producer.track.kind === "audio"
  );
  const videoProducer = producersArray.find(
    (producer) => producer.track.kind === "video"
  );

  
  return (
    <div className={styles.container}>
{/*       <VideoContainer
        isMe
        peer={me}
        audioProducerId={audioProducer ? audioProducer.id : null}
        videoProducerId={videoProducer ? videoProducer.id : null}
        audioRtpParameters={audioProducer ? audioProducer.rtpParameters : null}
        videoRtpParameters={videoProducer ? videoProducer.rtpParameters : null}
        audioTrack={audioProducer ? audioProducer.track : null}
        videoTrack={videoProducer ? videoProducer.track : null}
        audioCodec={audioProducer ? audioProducer.codec : null}
        videoCodec={videoProducer ? videoProducer.codec : null}
        audioScore={audioProducer ? audioProducer.score : null}
        videoScore={videoProducer ? videoProducer.score : null}
      /> */}
      <Video
        videoTrack={videoProducer ? videoProducer.track : null}
        audioTrack={audioProducer ? audioProducer.track : null}
        id={me.id}
        isMe
      />
      {connected && <p>connected</p>}
    </div>
  );
};

export default MeVideo;
