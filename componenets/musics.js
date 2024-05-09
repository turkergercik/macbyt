import { View, Text ,Image,TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import TrackPlayer, { State,Capability, AppKilledPlaybackBehavior,usePlaybackState } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../screens/home';
import { BlurView } from "@react-native-community/blur";
const Musics = ({item,cindex,index,setcsong}) => {
    const navigation = useNavigation();
    const playerState = usePlaybackState();
  return (
     <View style={{width:"100%",height:80,backgroundColor:"black",flex:1,marginVertical:0,paddingVertical:0}} >
    <View  style={{flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:5}}>
        <TouchableOpacity onPress={async()=>{

  
if(cindex.current===index){
   setcsong(index)
   storage.set("song",index)
   if(playerState.state=== State.Playing){
    await TrackPlayer.skip(index)
   
    // await TrackPlayer.pause()
   }else{
     await TrackPlayer.play()
   }
}else{
   //const song = await TrackPlayer.getTrack(index)
   setcsong(index)
   storage.set("song",index)
   cindex.current=index
   await TrackPlayer.skip(index)
   if(playerState.state=== State.Playing){
       
   }else{
       await TrackPlayer.play()

   }
}
/* if(playerState.state=== State.Playing){
   if(cindex.current===index){

   }else{

   }
   await TrackPlayer.pause()
}else{
   if(cindex.current===index){
       await TrackPlayer.play()
   }else{
       cindex.current=index
       await TrackPlayer.skip(index)
       await TrackPlayer.play()
   }
    //await TrackPlayer.skip(index)

} */
}} style={{flexDirection:"row",borderRadius:15,flex:1,height:"100%",width:"100%",alignItems:"center"}}>
  
   <Image style={{height:"100%",objectFit:"contain",aspectRatio:1,borderRadius:7,marginLeft:2,}} source={{uri:item.artwork}}>

</Image>
<Text numberOfLines={1} style={{textAlign:"center",flexShrink:1,paddingLeft:10,color:"white",fontSize:17}}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={{height:"100%",aspectRatio:1/2,borderRadius:100,alignItems:"center",justifyContent:"center"}}>
          <Icon3  size={20} style={{color:"grey"}} name='dots-three-vertical'>
          </Icon3>

        </TouchableOpacity>


      
    </View>
    
  </View>
  )
}

export default Musics