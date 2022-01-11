import React from "react";
import { useSelector } from "react-redux";
import Peer from "./Peer";

export default function Peers() {
  const peers = useSelector((state) => Object.values(state.peers));
  const activeSpeakerId = useSelector((state) => state.room.activeSpeakerId);

  return (
    <div>
      {peers.map((peer) => {
        return (
          <div key={peer.id}>
            <Peer id={peer.id} />
          </div>
        );
      })}
    </div>
  );
}
