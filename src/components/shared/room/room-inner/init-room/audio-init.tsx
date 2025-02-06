//@ts-ignore
export default function AudioInit() {
  return null;
  // const { mediaPermissions } = useRoomHolder();

  // const participant = useLocalParticipant();

  // const localParticipant = participant.localParticipant;
  // let audioTrack = undefined;
  // if (
  //   localParticipant &&
  //   typeof localParticipant?.getTrackPublication !== 'undefined'
  // ) {
  //   //@ts-nocheck
  //   audioTrack = localParticipant?.getTrackPublication(Track.Source.Microphone);
  // }
  // const track = audioTrack?.track;

  // useEffect(() => {
  //   if (!track) {
  //     return;
  //   }
  //   if (mediaPermissions?.audio === true) {
  //     track.unmute();
  //   } else {
  //     track.mute();
  //   }
  // }, [mediaPermissions?.audio, track]);

  return null;
}
