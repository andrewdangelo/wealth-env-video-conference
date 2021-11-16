import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import RoomContext, { withRoomContext } from "../../RoomContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import randomString from "random-string";
import PropTypes from "prop-types";
import { setMediaPerms } from "../../redux/stateActions";

//reactstrap
import {
  Card,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";

//styles
import styles from "./join.module.css";

function Join({ room, mediaPerms, setMediaPerms }) {
  const location = useLocation();

  const history = useHistory();

  const sfu = useContext(RoomContext);
  const [roomId, setRoomId] = useState(
    decodeURIComponent(location.pathname.slice(1)) ||
      randomString({ length: 8 }).toLowerCase()
  );

  useEffect(() => {
    window.history.replaceState({}, null, encodeURIComponent(roomId) || "/");
  }, [roomId]);

  useEffect(() => {
    location.pathname === "/" && history.push(encodeURIComponent(roomId));
  });

  async function _getMediaPermissions() {
    if (mediaPerms.video || mediaPerms.audio) {
      navigator.mediaDevices.getUserMedia(mediaPerms);
    } 
    
  }

  const handleSetMediaPerms = (event, newMediaPerms) => {
    if (newMediaPerms !== null) {
      setMediaPerms(JSON.parse(newMediaPerms));
    }
  };

  function handleRoomIdChange(e) {
    const roomName = e.target.value;

    setRoomId(roomName);
  }

  function handleNameChange(e) {
    const name = e.target.value;
    console.log(name);
    sfu.changeDisplayName(name);
  }

  async function handleJoin() {
    await _getMediaPermissions();

    const encodedRoomId = encodeURIComponent(roomId);

    sfu.join({
      roomId: encodedRoomId,
      videoPerms: mediaPerms.video,
      audioPerms: mediaPerms.audio,
    });
  }

  return (
    <div className={styles.container}>
      <div className="card text-left">
        <div className="card-body">
          <h4 className="card-title">Join</h4>
          <p className="card-text">Enter info below:</p>
          <div className="form-group">
            <label htmlFor=""></label>
            <small id="Username" className="form-text text-muted">
              Username
            </small>
            <input
              type="text"
              className="form-control"
              name=""
              id=""
              aria-describedby="helpId"
              placeholder=""
              onChange={handleNameChange}
            />
            <small id="Room Id" className="form-text text-muted">
              Room ID
            </small>
            <input
              type="text"
              className="form-control"
              name=""
              id=""
              aria-describedby="helpId"
              placeholder=""
              onChange={handleRoomIdChange}
            />
          </div>
          <div className="row justify-content-center">
            <div className="col-xs-1-12">
              <Link
                type="button"
                name=""
                id=""
                to={`/${roomId}`}
                className="btn btn-primary"
                btn-lg="true"
                btn-block="true"
                onClick={handleJoin}
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Join.propTypes = {
  mediaPerms: PropTypes.object.isRequired,
  setMediaPerms: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    room: state.room,
    mediaPerms: state.me.mediaPerms,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMediaPerms: (mediaPerms) => {
      dispatch(setMediaPerms(mediaPerms));
    },
  };
};

export default withRoomContext(
  connect(mapStateToProps, mapDispatchToProps, null)(Join)
);
