import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import hark from "hark";
import Logger from "../../Logger";
import * as appPropTypes from "../appPropTypes";

//styles
import styles from "./videoContainer.module.css";

const logger = new Logger("VideoContainer");

export default class VideoContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioVolume: 0, // Integer from 0 to 10.,
      showInfo: window.SHOW_INFO || false,
      videoResolutionWidth: null,
      videoResolutionHeight: null,
      videoCanPlay: false,
      videoElemPaused: false,
      maxSpatialLayer: null,
    };

    this._audioTrack = null;

    this._videoTrack = null;

    // Hark instance.
    // @type {Object}
    this._hark = null;

    // Periodic timer for reading video resolution.
    this._videoResolutionPeriodicTimer = null;

    this.videoElem = React.createRef();
    this.audioElem = React.createRef();
  }

  componentDidMount() {
    const { audioTrack, videoTrack } = this.props;

    console.log(this.videoElem);

    this._setTracks(audioTrack, videoTrack);
  }

  componentWillUnmount() {
    if (this._hark) this._hark.stop();

    clearInterval(this._videoResolutionPeriodicTimer);

    if (this.videoElem) {
      this.videoElem.current.oncanplay = null;
      this.videoElem.current.onplay = null;
      this.videoElem.current.onpause = null;
    }
  }

  componentWillUpdate() {
    const { isMe, audioTrack, videoTrack, videoRtpParameters } = this.props;

    const { maxSpatialLayer } = this.state;

    if (isMe && videoRtpParameters && maxSpatialLayer === null) {
      this.setState({
        maxSpatialLayer: videoRtpParameters.encodings.length - 1,
      });
    } else if (isMe && !videoRtpParameters && maxSpatialLayer !== null) {
      this.setState({ maxSpatialLayer: null });
    }

    this._setTracks(audioTrack, videoTrack);
  }

  _setTracks(audioTrack, videoTrack) {
    if (this._audioTrack === audioTrack && this._videoTrack === videoTrack)
      return;

    this._audioTrack = audioTrack;
    this._videoTrack = videoTrack;

    if (this._hark) this._hark.stop();

    this._stopVideoResolution();

    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      this.audioElem.srcObject = stream;

      this.audioElem
        .play()
        .catch((error) => logger.warn("audioElem.play() failed:%o", error));

      this._runHark(stream);
    } else {
      this.audioElem.srcObject = null;
    }

    if (videoTrack) {
      const stream = new MediaStream();

      stream.addTrack(videoTrack);
      this.videoElem.current.srcObject = stream;

      this.videoElem.current.oncanplay = () => this.setState({ videoCanPlay: true });

      this.videoElem.current.onplay = () => {
        this.setState({ videoElemPaused: false });

        this.audioElem
          .play()
          .catch((error) => logger.warn("audioElem.play() failed:%o", error));
      };

      this.videoElem.current.onpause = () => this.setState({ videoElemPaused: true });

      this.videoElem
        .play()
        .catch((error) => logger.warn("videoElem.play() failed:%o", error));

      this._startVideoResolution();
    } else {
      this.videoElem.current.srcObject = null;
    }
  }

  _runHark(stream) {
    if (!stream.getAudioTracks()[0])
      throw new Error("_runHark() | given stream has no audio track");

    this._hark = hark(stream, { play: false });

    // eslint-disable-next-line no-unused-vars
    this._hark.on("volume_change", (dBs, threshold) => {
      // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
      //   Math.pow(10, dBs / 20)
      // However it does not produce a visually useful output, so let exagerate
      // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
      // minimize component renderings.
      let audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

      if (audioVolume === 1) audioVolume = 0;

      if (audioVolume !== this.state.audioVolume)
        this.setState({ audioVolume });
    });
  }

  _startVideoResolution() {
    this._videoResolutionPeriodicTimer = setInterval(() => {
      const { videoResolutionWidth, videoResolutionHeight } = this.state;
      const { videoElem } = this.refs;

      if (
        videoElem.videoWidth !== videoResolutionWidth ||
        videoElem.videoHeight !== videoResolutionHeight
      ) {
        this.setState({
          videoResolutionWidth: videoElem.videoWidth,
          videoResolutionHeight: videoElem.videoHeight,
        });
      }
    }, 500);
  }

  _stopVideoResolution() {
    clearInterval(this._videoResolutionPeriodicTimer);

    this.setState({
      videoResolutionWidth: null,
      videoResolutionHeight: null,
    });
  }

  _printProducerScore(id, score) {
    const scores = Array.isArray(score) ? score : [score];

    return (
      <React.Fragment key={id}>
        <p>streams:</p>

        {scores
          .sort((a, b) => {
            if (a.rid) return a.rid > b.rid ? 1 : -1;
            else return a.ssrc > b.ssrc ? 1 : -1;
          })
          .map(
            (
              { ssrc, rid, score },
              idx // eslint-disable-line no-shadow
            ) => (
              <p key={idx} className="indent">
                {rid !== undefined
                  ? `rid:${rid}, ssrc:${ssrc}, score:${score}`
                  : `ssrc:${ssrc}, score:${score}`}
              </p>
            )
          )}
      </React.Fragment>
    );
  }

  _printConsumerScore(id, score) {
    return (
      <p key={id}>
        {`score:${score.score}, producerScore:${score.producerScore}, producerScores:[${score.producerScores}]`}
      </p>
    );
  }

  render() {
    const {
      isMe,
      peer,
      audioProducerId,
      videoProducerId,
      audioConsumerId,
      videoConsumerId,
      videoRtpParameters,
      consumerSpatialLayers,
      consumerTemporalLayers,
      consumerCurrentSpatialLayer,
      consumerCurrentTemporalLayer,
      consumerPreferredSpatialLayer,
      consumerPreferredTemporalLayer,
      consumerPriority,
      audioMuted,
      videoVisible,
      videoMultiLayer,
      audioCodec,
      videoCodec,
      audioScore,
      videoScore,
    } = this.props;

    const {
      audioVolume,
      showInfo,
      videoResolutionWidth,
      videoResolutionHeight,
      videoCanPlay,
      videoElemPaused,
      maxSpatialLayer,
    } = this.state;

    return (
      <div>
        <div></div>
        <video
          ref={this.videoElem}
          className={classnames(styles.video, {
            "is-me": isMe,
            hidden: !videoVisible || !videoCanPlay,
            "network-error":
              videoVisible &&
              videoMultiLayer &&
              consumerCurrentSpatialLayer === null,
          })}
          autoPlay
          playsInline
          muted
          controls={false}
        />
        <audio
          ref={this.audioElem}
          autoPlay
          playsInline
          muted={isMe || audioMuted}
          controls={false}
        />
        <div className={styles.volumeContainer}>
          <div className={classnames(styles.bar, `level${audioVolume}`)} />
        </div>
        {videoElemPaused && <div className={styles.videoElemPaused} />}
      </div>
    );
  }
}

VideoContainer.propTypes = {
  isMe: PropTypes.bool,
  peer: PropTypes.oneOfType([appPropTypes.Me, appPropTypes.Peer]).isRequired,
  audioProducerId: PropTypes.string,
  videoProducerId: PropTypes.string,
  audioConsumerId: PropTypes.string,
  videoConsumerId: PropTypes.string,
  audioRtpParameters: PropTypes.object,
  videoRtpParameters: PropTypes.object,
  consumerSpatialLayers: PropTypes.number,
  consumerTemporalLayers: PropTypes.number,
  consumerCurrentSpatialLayer: PropTypes.number,
  consumerCurrentTemporalLayer: PropTypes.number,
  consumerPreferredSpatialLayer: PropTypes.number,
  consumerPreferredTemporalLayer: PropTypes.number,
  consumerPriority: PropTypes.number,
  audioTrack: PropTypes.any,
  videoTrack: PropTypes.any,
  audioMuted: PropTypes.bool,
  videoVisible: PropTypes.bool.isRequired,
  videoMultiLayer: PropTypes.bool,
  audioCodec: PropTypes.string,
  videoCodec: PropTypes.string,
  audioScore: PropTypes.any,
  videoScore: PropTypes.any,
};
