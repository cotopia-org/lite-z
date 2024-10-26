import { useParticipants } from "@livekit/components-react";
import React from "react";

export default function TestRoom() {
  const participants = useParticipants();

  return <div>{JSON.stringify(participants)}</div>;
}
