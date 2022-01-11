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
  const [audioVolumeState, setAudioVolumeState] = useState(0);

  /*   function addTracks() {
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
  } */

  function _runHark(stream)
  {
    if (!stream.getAudioTracks()[0])
      throw new Error("_runHark() | given stream has no audio track");

    const _hark = hark(stream, { play: false });

    // eslint-disable-next-line no-unused-vars
    _hark.on("volume_change", (dBs, threshold) => {
      // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
      //   Math.pow(10, dBs / 20)
      // However it does not produce a visually useful output, so let exagerate
      // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
      // minimize component renderings.
      let audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

      if (audioVolume === 1) audioVolume = 0;

      if (audioVolume !== audioVolumeState)
        setAudioVolumeState(audioVolume);
    });
  }

  function _setTracks() {
    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audio.current.srcObject = stream;

      audio.current
        .play()
        .catch((error) => console.warn("audioElem.play() failed:%o", error));

      _runHark(stream);
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
    return () => {
      if (video) {
        video.current.oncanplay = null;
        video.current.onplay = null;
        video.current.onpause = null;
      }
    };
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
