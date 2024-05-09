import TrackPlayer from "react-native-track-player";
import { Event} from 'react-native-track-player';

export const PlaybackService = async function() {
    

    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position));
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());


};