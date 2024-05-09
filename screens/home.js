import { View, Text,ScrollView, Image, TouchableOpacity ,FlatList, StatusBar, Alert, Dimensions} from 'react-native'
import React,{useEffect,useState,useRef} from 'react'
import Musics from '../componenets/musics';
import TrackPlayer, { State,Capability, AppKilledPlaybackBehavior,usePlaybackState ,Event} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { MMKV } from 'react-native-mmkv'
import { FlashList } from '@shopify/flash-list';
import { useAuthorization } from '../context/context';
import Animated,{Easing, Extrapolation, FadeIn, FadeOut, ReduceMotion, SlideInDown, SlideInUp, SlideOutDown, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming} from 'react-native-reanimated';
import { SharedTransition } from 'react-native-reanimated';
import { SharedElement } from 'react-navigation-shared-element';
import BlurView from 'react-native-blur-effect';
import { Slider } from 'react-native-elements';
import { useProgress } from 'react-native-track-player';
const transition = SharedTransition.custom((values) => {
  'worklet';
  return {

  };
});
const {width,height}=Dimensions.get("screen")
export const storage = new MMKV()
const audio = require("../musics/1.mp3")
const Home = () => {
  const tx=useSharedValue(0)
  const t1x=useSharedValue({width:0,transformx:0,transformy:0,opacity:1})
  const {nkvt,setnkvt,csong,setcsong,fl}= useAuthorization()
  const navigation = useNavigation();
  const cindex=useRef()
  const songd=useRef([])
  const manual=useRef(false)
  const [entry,setentry]=useState({description:null,img:null})
  const [full,setfull]=useState(false)
  const { position, buffered, duration } = useProgress()

    const client_id = '4fec39ca811041b9827a38332a76b6f1'; 
    const client_secret = 'ddfdfe65ea5c4f1f8f92d8bcbc9ce88a';

async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body:"grant_type=client_credentials&client_id=" + client_id + "&client_secret=" + client_secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return await response.json();
}

async function getTrackInfo(access_token) {
  const response = await fetch("https://api.spotify.com/v1/tracks/7rHLpc3SZobYPDyBF06uok", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  return await response.json();
}
async function getnkvt(access_token) {
  const response = await fetch("https://api.spotify.com/v1/playlists/37i9dQZF1DXdnOj1VEuhgb", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  }).then(async(res)=>{
    const response = await res.json()
    response.tracks.items.map((item,index)=>{
      if(item.track.preview_url){
        let o = {
          id:index,
          url: item.track.preview_url,
          duration:29,
          title:item.track.name,
          artwork:item.track.album.images[1].url,
          artist:item.track.album.artists[0].name
  
        }

        setnkvt((e)=>[...e,o])
        songd.current.push(o)
      }
      
     
    })
    
    storage.set("all",JSON.stringify(songd.current))
    storage.set("entry",JSON.stringify({img:response.images[0].url,description:response.description}))

    console.log(response.description)
    Image.getSize(
      response.images[0].url, // Replace with the URL of your image
      (width, height) => {
        setentry({
          img:response.images[0].url,
          height:height,
          width:width,
          description:response.description
        })
        
      },
      error => {
        console.error('Error getting image size:', error);
      }
    );
   
  })

  

  //return await response.json();
}
  /* url: audio,
        title: 'Wrecking Ball',
        artist: 'Miley Cyrus',
        album: 'Bangerz',
        genre: 'Pop',
        date: '2013-08-25T00:00:00+00:00',
        artwork: 'https://i.ytimg.com/vi/My2FRPA3Gf8/maxresdefault.jpg',
        duration: 141 */
    async function set(){
     
    
      
      try {
        //storage.delete("entry")
        const s = storage.getString("all")
        const d = storage.getString("entry")
        if(s!==undefined && d!==undefined){
          songd.current = JSON.parse(s)
          const det = JSON.parse(d)
          setentry(det)
          setnkvt(songd.current)
        }else{
          const ed = await getToken()
          const track  = await getnkvt(ed.access_token)
        }
        await TrackPlayer.setupPlayer({
          minBuffer:2,
          playBuffer:1,
          maxBuffer:2,
          maxCacheSize:10000
          

        })
        
      const t = await TrackPlayer.getPlaybackState()
      console.log(t)
       await TrackPlayer.updateOptions({
            // Media controls capabilities
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.SeekTo
            ],
        
            // Capabilities that will show up when the notification is in the compact form on Android
            compactCapabilities: [Capability.Play, Capability.Pause],
        
            // Icons for the notification on Android (if you don't like the default ones)
            android:{appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback}
        });
        const activetrack = await TrackPlayer.getActiveTrack()
        console.log(activetrack,78)
        await TrackPlayer.add(songd.current);
      } catch (error) {
        
      }
      
        //await TrackPlayer.play()
    }
    useEffect(()=>{
       const ev = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged,async(e)=>{
        const i  = e.index
        cindex.current=i
        console.log(i,"888888")
        fl.current?.scrollToIndex( {
          animated: true,
          index: i,
        });
        setcsong(i)
        storage.set("song",i)
      })
      const ev1 = TrackPlayer.addEventListener(Event.PlaybackState,async(e)=>{
        if(e.state===State.Paused){
          storage.delete("song")
        }
      })
      
       set()
       return ()=>{
        ev.remove()
        ev1.remove()
       }
    },[])
    useEffect(()=>{
    if(nkvt.length!==0){
     const x  =  storage.getNumber("song")
     console.log(x,77)
     setcsong(x)
    }
   },[nkvt])
   useEffect(()=>{
    if(full===true){
      t1x.value={width:width,
     
        transformy:-width+55,
        transformx:0,
        opacity:0

        }
    }else{
      t1x.value={width:height/11,
    
        transformy:(height/11-height/10)/2,
        transformx:-(height/11-height/10)/2,
        opacity:1
        }
    }
   },[full])
    const playerState = usePlaybackState();
    
    useEffect(()=>{
      if(nkvt.length!==0){
       const x  =  storage.getNumber("song")
       setcsong(x)
      }
      console.log(csong,7885)
     },[nkvt,csong])
     const transition = SharedTransition.custom((values) => {
      'worklet';
      return {
        
        height: withSpring(values.targetHeight),
        width: withSpring(values.targetWidth),
      };
    });
    const st= useAnimatedStyle(()=>{
      
      const e = interpolate(tx.value*2,[
        0,300
      ],[34,-450],Extrapolation.CLAMP)
      const n = interpolate(tx.value*3,[
        0,300
      ],[1,0.2],Extrapolation.CLAMP)
      const b = interpolate(tx.value*2,[
        0,300
      ],[0,-600],Extrapolation.CLAMP)
      return{
        transform:[{scale:n},{translateY:e},{translateX:b}]
      }
    })

    const st1= useAnimatedStyle(()=>{
      const o = interpolate(tx.value,[
        0,width-30
      ],[1,0],Extrapolation.CLAMP)
      const e = interpolate(tx.value*2,[
        0,300
      ],[34,-450],Extrapolation.CLAMP)
      const n = interpolate(tx.value,[
        0,width
      ],[1,0.8],Extrapolation.CLAMP)
      const b = interpolate(tx.value*2,[
        0,300
      ],[0,-600],Extrapolation.CLAMP)
      return{
        transform:[{scale:n}],
        opacity:o
      }
    })
    const st2= useAnimatedStyle(()=>{
      const o = interpolate(tx.value,[
        0,width-30
      ],[1,0],Extrapolation.CLAMP)
      const e = interpolate(tx.value*2,[
        0,300
      ],[34,-450],Extrapolation.CLAMP)
      const n = interpolate(tx.value,[
        0,300
      ],[0,width/4],Extrapolation.CLAMP)
      const b = interpolate(tx.value,[
        0,200
      ],[0,-196],Extrapolation.CLAMP)
      return{
        transform:[{translateY:b}],
      }
    })
    const st3= useAnimatedStyle(()=>{
      const o = interpolate(tx.value,[
        0,width-30
      ],[1,0],Extrapolation.CLAMP)
      const e = interpolate(tx.value*2,[
        0,300
      ],[34,-450],Extrapolation.CLAMP)
      const n = interpolate(tx.value,[
        0,300
      ],[0,width/4],Extrapolation.CLAMP)
      const b = interpolate(tx.value*2,[
        0,300
      ],[0,8],Extrapolation.CLAMP)
      return{
        transform:[{translateX:n},{translateY:b}],
      }
    })
    const sty= useAnimatedStyle(()=>{
      

     
      const e = interpolate(tx.value*2,[
        0,300
      ],[34,-450],Extrapolation.CLAMP)
      const n = interpolate(tx.value*3,[
        0,300
      ],[1,0.2],Extrapolation.CLAMP)
      const b = interpolate(tx.value*2,[
        0,300
      ],[0,-600],Extrapolation.CLAMP)
      return{
        transform:[{translateY:withTiming(t1x.value.transformy,{duration:300})},{translateX:withTiming(t1x.value.transformx)}],
        width:withTiming(t1x.value.width,{duration:300}),
        opacity:withTiming(t1x.value.opacity,{
          duration: 500,
       
         
         
        })
      }
   
  
    })
    async function prev(){
      manual.current=true

     
      await TrackPlayer.skipToPrevious()
      /* tx.value=withTiming(width)
      tx.value=-width
      tx.value=withTiming(0)
      setTimeout(() => {
        manual.current=false
        
      }, 0); */
     } 
    async function next(){
      manual.current=true
      await TrackPlayer.skipToNext()
     /*  tx.value=withTiming(-width)
             tx.value=width
             tx.value=withTiming(0)
             setTimeout(() => {
               manual.current=false
              
             }, 0); */
    }
    if(nkvt.length!==0 && entry!==null){

  
   
  return (
    <>
    <View style={{ flex: 1, backgroundColor: "black" ,zIndex:0}}>
      
    
        <StatusBar backgroundColor={"#00000040"} translucent></StatusBar>
        <Animated.View entering={FadeIn.delay(100)} style={{position:"absolute",top:0,right:0,width:"100%",aspectRatio:1,zIndex:0,backgroundColor:"black"}} >
        {
          entry.img && <Animated.Image style={[{ objectFit: "contain",zIndex:1,width:"100%",aspectRatio:1, alignSelf: "center" },st1]} source={{ uri:entry.img }}>

          </Animated.Image>
        }
        <View style={{width:"100%",height:200,position:"absolute",top:width/2.1+100,right:0,zIndex:1}}>
        <BlurView backgroundColor="#57098780" blurRadius={3} />
        </View>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(100)} style={[{width:"100%",position:"absolute",top:width/2.1,height:100,zIndex:1},st2]} >

        <BlurView backgroundColor="#57098780" blurRadius={3} />
          <Animated.Text style={[{ position:"absolute",bottom:0,left:0,right:0,zIndex:3,color: "white",width:"100%",fontSize:70,fontWeight:"bold",alignSelf:"flex-start"},st3]} >{"NKVT"}</Animated.Text>
          </Animated.View>
        
                          


       
        <Animated.View style={[{ flex: 1,paddingBottom:full===true ? height/9.5:0  }]}>
        


          <FlashList
          
          scrollEventThrottle={6}
          onScroll={(e)=>{
              tx.value=e.nativeEvent.contentOffset.y
            
  
          }}
            showsVerticalScrollIndicator={false}
            data={nkvt}
            renderItem={({ item, index }) => {
              if (index === 0) {
                return (<View key={index} style={{zIndex:1,justifyContent:"center",alignItems:"center",flex:1}} >
                 
                  <View style={{height:width/1.4,width:"100%"}} ></View>

               
                  <Musics item={item} index={index} cindex={cindex} setcsong={setcsong}></Musics>

                </View>);
              } else {
                return (<View style={{zIndex:1}} key={index}>

                  <Musics item={item} index={index} cindex={cindex} setcsong={setcsong}></Musics>

                </View>

                );
              }


            } }
            keyExtractor={(item, index) => index}
            estimatedItemSize={50} />
        </Animated.View>

        { (csong !== undefined && nkvt[csong] !== undefined) && (<View style={{ flex: 1, backgroundColor: "#191919", zIndex:1,flexDirection: "column", position: "absolute", bottom: 5, height: height/10, width: "100%", borderRadius: 10, padding: 0,justifyContent:"center",alignItems:"center" }}>
          <View style={{flexDirection:"row",flex:1,justifyContent:"center",alignItems:"center"}}>
          <TouchableOpacity onPress={() => {
            
            navigation.navigate("Detail", { index: cindex.current })
            /* setfull(true) */
          
          }
            
            } style={{ flexDirection: "row", padding: 0, borderRadius: 15, flex: 1, height: "100%", justifyContent: "center", alignItems: "center" }}>
            
            <SharedElement
        id={"1"}
        style={{height:"100%",padding:5}}
        >
        <Image style={{height:"100%",objectFit:"contain",flex:1,borderRadius:7,aspectRatio:1}} source={{uri:nkvt[csong]?.artwork}}>
        
        </Image>
        </SharedElement>
            {/* <Animated.Image  sharedTransitionTag="tag" style={[{aspectRatio:1,bottom:0,right:0,left:0,objectFit: "cover",height:"100%", borderRadius: 7 }]} source={{ uri: nkvt[csong].artwork }}>

            </Animated.Image> */}
            <Text style={{ flex: 1, textAlign: "center" ,color:"white",fontSize:17}}>{nkvt[csong]?.title}</Text>


          </TouchableOpacity>

          <TouchableOpacity onPress={async () => {

           

            if (playerState.state === State.Playing) {
              await TrackPlayer.pause();
              
            } else {
              
           
              await TrackPlayer.play();
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
          } } style={{ height: "70%", aspectRatio: 1 / 1, padding: 0,marginHorizontal:5,borderRadius:200 }}>
            <View style={{ backgroundColor: "white", flex: 1, borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
              {playerState.state === State.Playing ? <Icon name="pause" size={30}  color="black"></Icon> : <View style={{}}><Icon name="play" size={27} style={{paddingLeft:5}} color="black"></Icon></View>}
            </View>
          </TouchableOpacity>
          </View>
          <Slider
    value={position}  
  style={{width:width-12,height:0,margin:1,padding:0,paddingBottom:3,alignContent:"center"}}
  minimumValue={0}
  trackStyle={{marginBottom:-2,height:3}}
  maximumValue={nkvt[csong]?.duration}
  onValueChange={(e)=>console.log(e)}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#404040"
  thumbTintColor='blue'
  thumbStyle={{height:0,width:0,padding:0,margin:0,backgroundColor:"#570987"}}
  onSlidingComplete={async(e)=>{
    setTimeout(async() => {
      await TrackPlayer.seekTo(e)
    }, 10);
  }}
/>




        </View>)}
         
      </View></>
  )
}
}

export default Home