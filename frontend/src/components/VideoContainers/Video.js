import React, { useEffect, useState, useRef } from "react";
import hark from "hark";
import Logger from "../../Logger";
import * as appPropTypes from "../appPropTypes";

export default function Video({
  id,
  audioTrack,
  videoTrack,
  isMe,
  videoRtpParameters,
  audioMuted,
}) {
  const [video] = useState(React.createRef());
  const [audio] = useState(React.createRef());
  const [state, setState] = useState({});

  function addTracks() {
    const stream = new MediaStream();
    if (videoTrack) {
      stream.addTrack(videoTrack);
    }

    if (audioTrack) {
      stream.addTrack(audioTrack);
    }

    if (stream !== undefined) {
      if (video.current) {
        video.current.srcObject = stream;
      }
    }
  }

  function _setTracks() {
    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audio.current.srcObject = stream;

      audio.current
        .play()
        .catch((error) => console.warn("audioElem.play() failed:%o", error));

      /*     this._runHark(stream); */
    } else {
      audio.current.srcObject = null;
    }
    if (videoTrack) {
      const stream = new MediaStream();
      stream.addTrack(videoTrack);
      video.current.srcObject = stream;
      video.current.oncanplay = () =>
        setState({ ...state, videoCanPlay: true });
      video.current
        .play()
        .catch((error) =>
          console.warn('videoElement.play() [error:"%o]', error)
        );
    } else {
      video.current.srcObject = null;
    }
  }

  useEffect(() => {
    _setTracks();
  }, [JSON.stringify(videoTrack), JSON.stringify(audioTrack), video.current]);
  return (
    <div>
      <video
        height={"100%"}
        width={"100%"}
        key={id}
        ref={video}
        autoPlay={true}
        playsInline
        id={id}
        muted
      />
      <audio
        ref={audio}
        autoPlay
        playsInline
        controls={false}
        muted={isMe || audioMuted}
      />
    </div>
  );
}
