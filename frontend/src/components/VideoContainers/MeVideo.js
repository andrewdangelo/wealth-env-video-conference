import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import * as cookiesManager from "../../cookiesManager";
import { withRoomContext } from "../../RoomContext";
import * as stateActions from "../../redux/stateActions";
import VideoContainer from "./VideoContainer";
import * as appPropTypes from "../appPropTypes";

export class MeVideo extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    const {
      sfu,
      connected,
      me,
      audioProducer,
      videoProducer,
      onSetStatsPeerId,
    } = this.props;

    console.log(videoProducer);

    const videoVisible = Boolean(videoProducer) && !videoProducer.paused;
    return (
      <div>
        <VideoContainer
          isMe
          peer={me}
          audioProducerId={audioProducer ? audioProducer.id : null}
          videoProducerId={videoProducer ? videoProducer.id : null}
          audioRtpParameters={
            audioProducer ? audioProducer.rtpParameters : null
          }
          videoRtpParameters={
            videoProducer ? videoProducer.rtpParameters : null
          }
          audioTrack={audioProducer ? audioProducer.track : null}
          videoTrack={videoProducer ? videoProducer.track : null}
          videoVisible={videoVisible}
          audioCodec={audioProducer ? audioProducer.codec : null}
          videoCodec={videoProducer ? videoProducer.codec : null}
          audioScore={audioProducer ? audioProducer.score : null}
          videoScore={videoProducer ? videoProducer.score : null}
        />
        {connected && <p>connected</p>}
      </div>
    );
  }
}

MeVideo.propTypes = {
  sfu: PropTypes.any,
  connected: PropTypes.bool,
  me: appPropTypes.Me.isRequired,
  audioProducer: appPropTypes.Producer,
  videoProducer: appPropTypes.Producer,
  onSetStatsPeerId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const producersArray = Object.values(state.producers);
  const audioProducer = producersArray.find(
    (producer) => producer.track.kind === "audio"
  );
  const videoProducer = producersArray.find(
    (producer) => producer.track.kind === "video"
  );


  return {
    connected: state.room.state === "connected",
    me: state.me,
    audioProducer: audioProducer,
    videoProducer: videoProducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetStatsPeerId: (peerId) =>
      dispatch(stateActions.setRoomStatsPeerId(peerId)),
  };
};

export default withRoomContext(
  connect(mapStateToProps, mapDispatchToProps)(MeVideo)
);
