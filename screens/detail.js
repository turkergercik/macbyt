import { View, Text,ScrollView, Image, TouchableOpacity, Alert,StatusBar, Dimensions, FlatList ,BackHandler} from 'react-native'
import React,{useEffect,useState,useRef} from 'react'
import Musics from '../componenets/musics';
import TrackPlayer, { State,Capability, AppKilledPlaybackBehavior,usePlaybackState } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome6';
//import Slider from '@react-native-community/slider';
import { Slider } from 'react-native-elements';
import { useProgress } from 'react-native-track-player';
import { useAuthorization } from '../context/context';
import Animated,{FadeIn, FadeInLeft, FadeOut, SlideInRight, SlideOutLeft, SlideOutRight, SlideOutUp, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import { SharedElement } from 'react-navigation-shared-element';
import { SharedTransition } from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { FlashList } from '@shopify/flash-list';
import Carousel from 'react-native-reanimated-carousel';
const {width,height}=Dimensions.get("screen")
const transition = SharedTransition.custom((values) => {
  'worklet';
  return {
    width:values.targetWidth,
    height:values.targetHeight,
    originY:values.targetOriginY,
    originX:values.targetOriginX,
  };
});
const Detail = ({route,cindex,navigation}) => {
    const tx =useSharedValue(0)
    const ty =useSharedValue(0)
    const manual=useRef(false)
    const {csong,nkvt,fl}=useAuthorization()
    const { position, buffered, duration } = useProgress()
    const index = route.params?.index
    const [songdetails,setsongdetails]= useState(nkvt[index])
    const [exit,setexit]= useState(false)
    const [ghe,getghe]= useState(null)
    const [go,setgo]= useState(true)
    const ss =useRef([])
    const currentOffset =useRef(0)
    
        async function set(){
        nkvt.map((item)=>{
          ss.current.push(item.artwork)
        })
        
       setsongdetails(nkvt[csong]) 
       if(csong!==index && manual.current===false){
        if(csong)
        console.log(index,csong)
         tx.value=withTiming(-width)
         tx.value=width
         tx.value=withTiming(0)

       }
    }
    useEffect(() => {
      const backAction = () => {
        setexit(true)
        navigation.goBack()
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
  
      return () => backHandler.remove();
    }, []);
   useEffect(()=>{

    
    set()
    return ()=>{
      setexit(false)
    }
   },[csong])
   const playerState = usePlaybackState();
 const sty = useAnimatedStyle(()=>{
  return {
    transform:[{translateX:tx.value}]
  }
 })
 async function prev(){
  manual.current=true
  await TrackPlayer.skipToPrevious()
  manual.current=false
  /* tx.value=withTiming(width)
  tx.value=-width
  tx.value=withTiming(0)
  setTimeout(() => {
    manual.current=false
    
  }, 0); */
 } 
async function next(){
  setgo(false)
  manual.current=true
  await TrackPlayer.skipToNext().then(()=>{
    setgo(true)
    
  })
  manual.current=false
  /* tx.value=withTiming(-width)
         tx.value=width
         tx.value=withTiming(0)
         setTimeout(() => {
           manual.current=false
          
         }, 0); */
}
   async function sk(ine){
    await TrackPlayer.pause()
    await TrackPlayer.skip(ine)
    await TrackPlayer.play()
   }
useEffect(()=>{
  if(ghe!==null && ghe !==csong && manual.current===false){
     sk(ghe)
     
  }
 

},[ghe])
  

   
  return (
    <View style={{flex:1,backgroundColor:"black"}}> 
     
      <View  style={{flex:2,backgroundColor:"black",alignItems:"center",justifyContent:"center"}}>
     
          <SharedElement id={"1"} style={{flex:1,width:"100%",position:"absolute"}}>
        <Image style={{width:"100%",objectFit:"contain",aspectRatio:1}} source={{uri:nkvt[csong]?.artwork}}>

        </Image>
        </SharedElement>
        {/* <Animated.Image  sharedTransitionTag="tag" style={[{aspectRatio:1,objectFit:"contain",width:"100%"}]} source={{uri:songdetails.artwork}}>

</Animated.Image> */}
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        
        <FlashList
        showsHorizontalScrollIndicator={false}
        ref={fl}
        scrollEventThrottle={6}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 75
        }}
        onScroll={(event)=>{
          const totalWidth = event.nativeEvent.layoutMeasurement.width
          const xPosition = event.nativeEvent.contentOffset.x
     
          const newIndex = Math.round((xPosition) / totalWidth)
          if (newIndex !== csong) {
           
              
              getghe(newIndex)
        

          }
       
        }}
        /* onViewableItemsChanged={(e)=>{
          if(e.viewableItems[0]!==undefined && manual.current===false){
            if(manual.current===true){
                 manual.current=false
            }
            setTimeout(() => {
              getghe(e.viewableItems[0]?.item.id)
              
            }, 100);
          }
          
        }} */
        overrideItemLayout={(a)=>{a.size=width}}
        pagingEnabled
        initialScrollIndex={csong}
        horizontal
        data={nkvt}
        renderItem={( item, index1 ) => {
          console.log(item.index,"78")
          return(
            <View style={{flex:1,width:width,justifyContent:"center"}}>
            <Animated.Image entering={FadeIn.delay(200)} exiting={FadeOut} style={[{aspectRatio:1,objectFit:"cover",width:"100%"}]} source={{uri:item.item.artwork}}>

             </Animated.Image>
             
             
             </View>
             
          )

        } }
        keyExtractor={(item, index1) => index1}
        estimatedItemSize={50}
        >

        </FlashList>
        {/* <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={false}
                data={nkvt}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({item}) =>{
                  

                return ( <View style={{flex:1,width:width,justifyContent:"center"}}>
                  <Animated.Image  sharedTransitionTag={item.id.toString()} style={[{aspectRatio:1,objectFit:"cover",width:"100%"},sty]} source={{uri:item.artwork}}>
      
                   </Animated.Image>
                   <Text style={{backgroundColor:"red",width:width,height:50}}>{item.id}</Text>
                   </View>)
      
                }}
            /> */}
        </View>
        
      </View>
      <View style={{flex:1,flexDirection:"column",justifyContent:"space-evenly",alignItems:"center"}}>
     
      <Slider
    value={position}  
  style={{width: "90%", height:50}}
  minimumValue={0}
  maximumValue={nkvt[csong]?.duration}
  onValueChange={(e)=>console.log(e)}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#303030"
  thumbTintColor='blue'
  thumbStyle={{height:20,width:20,backgroundColor:"#570987"}}
  onSlidingComplete={async(e)=>{
    setTimeout(async() => {
      await TrackPlayer.seekTo(e)
    }, 10);
  }}
/>
<View style={{flex:1,width:"100%",backgroundColor:"black",flexDirection:"row",justifyContent:"space-evenly",alignItems:"center"}}>


          <TouchableOpacity style={{width:width/7,aspectRatio:1,borderRadius:width/14,justifyContent:"center",alignItems:"center"}} onPress={prev}>
          <Icon name="backward-step" size={width/10} color="#570987"></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft:15,backgroundColor:"white",aspectRatio:1,width:width/5,borderRadius:width/10,justifyContent:"center",alignItems:"center"}} onPress={async()=>{
            const c = await TrackPlayer.getActiveTrackIndex()

            if(await TrackPlayer.getActiveTrack()){

            }
            if(playerState.state===State.Playing){
                await TrackPlayer.pause()
            }else{
                await TrackPlayer.play()
            }

          }}>
            {playerState.state==State.Playing ? <Icon name="pause" size={width/10} color="#570987" ></Icon>
            : <View style={{paddingLeft:5}}><Icon name="play" size={width/10} color="#570987" ></Icon></View>

}
         
          </TouchableOpacity >
          <TouchableOpacity style={{width:width/7,aspectRatio:1,borderRadius:width/14,justifyContent:"center",alignItems:"center"}} onPress={next}>
          <Icon name="forward-step" size={width/10} color="#570987" ></Icon>
          </TouchableOpacity>
          </View>
      </View>
    </View>
  )


}

/* Detail.sharedElements = (route) => {
  const { index } = route.params;
  
  return [index]
} */
export default Detail