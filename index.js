/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from './service';
import { Auth } from './context/context';

function Service(){
    return(
        <Auth>
        <App></App>
    </Auth>
    )
}

TrackPlayer.registerPlaybackService(()=>PlaybackService)
AppRegistry.registerComponent(appName, () => Service);
