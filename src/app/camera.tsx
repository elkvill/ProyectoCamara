// import { Link, Stack } from "expo-router";
// import { Text, View,StyleSheet } from "react-native";

// export default function CamaraScreen(){
//     return(
//         <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
//             <Stack.Screen options={{headerShown:false}}/>
//             <Text >Camara</Text>
//             <Link href="/">Inicio</Link>
//         </View>
//     )
// }
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Button,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraCapturedPicture,
  useMicrophonePermissions,
} from "expo-camera";
import { useEffect, useState, useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from 'expo-file-system';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("back");
    const camera = useRef<CameraView>(null);
    const [picture, setPicture] = useState<CameraCapturedPicture>();
    const [captureMode, setCaptureMode] = useState<"picture" | "video">("picture")
    const [microPhonePermission, requestMicroPhonePermission] = useMicrophonePermissions();

    const[isRecording, setIsRecording] = useState(false);
    const [video, setVideo] = useState<string>();

    const player = useVideoPlayer({uri: video}, (player)=>{
        player.loop = true,
        player.play();
    })


    //Se eejecuta cada vez que cambie los permisos
    useEffect(() => {
        if (permission && !permission.granted && permission.canAskAgain) {
            requestPermission();
        }
    }, [permission]);

    //para alternar la camara
    const toggleCamera = () => {
        setFacing(current => current === "back" ? "front" : "back");
    };

    const hanldleCapture = async () => {
        if(captureMode === "picture"){
            console.log("Tomando foto...");
            const res = await camera.current?.takePictureAsync();
    
            setPicture(res);
            // console.log(res)

        }else{
            if(isRecording){
                camera.current?.stopRecording();
            }else{
                startRecording()

            }

        }
    };

    const startRecording = async ()=>{
        if(!camera.current || isRecording) return

        const micPermission = await requestMicroPhonePermission()
        setIsRecording(true)
        if(!micPermission.granted){
            alert("Se necesita los peromisos del microfono para grabar videos.")
            return;
        }

        setIsRecording(true);
        const res = await camera.current?.recordAsync({maxDuration:10});
        console.log("Video grabado", res);

        if(res?.uri){
            setVideo(res.uri)
        }

        setIsRecording(false)

    }

    const saveFile = async(uri: string) => {
        const filename = uri.split('/').pop()

        if (!FileSystem.documentDirectory) return

        await FileSystem.copyAsync({
        from: uri,
        to: FileSystem.documentDirectory + filename
        })

        setPicture(undefined)

        router.back()
    };
    //     const saveFile = async(uri: string) => {
    //     const filename = uri.split('/').pop()

    //     if (!FileSystem.documentDirectory) return

    //     await FileSystem.copyAsync({
    //     from: uri,
    //     to: FileSystem.documentDirectory + filename
    //     })

    //     setPicture(undefined)

    //     router.replace('/') // Reemplaza a router.back()
    // };

    if (!permission?.granted) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (picture || video) {
        return (
        <View style={{ flex: 1 }}>
            
            {picture && (
            <Image
                source={{ uri: picture.uri }}
                style={{ width: "100%", flex: 1 }}
            />
            )}

            {video && (<VideoView player={player} style={{width:"100%", flex:1, marginTop:30}}/>)}


            <View style={{ paddingTop: 10, paddingHorizontal: 10, paddingBottom: 30 }}>
                <Button title="Guardar" onPress={() => {
                    const uri =  picture?.uri || video
                    if(uri){
                        saveFile(uri)
                        
                    }
                   
                }} />
            </View>
            <MaterialIcons
            name="close"
            style={styles.close}
            size={35}
            color={"white"}
            onPress={router.back}
            />
        </View>
        );
    }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CameraView ref={camera} style={styles.camera} facing={facing} mode={captureMode} />
        <View style={styles.footer}>

            <Pressable style={[styles.recordButton, {backgroundColor:isRecording ? "crimson": "white"}]} onPress={hanldleCapture} />
            <View style={{flexDirection:"row", gap:15, alignItems:"center"}}>
                <Pressable onPress={()=> setCaptureMode("picture") }>
                    <Text style={{color:captureMode === "picture" ? "yellow": "white"}}>Foto</Text>
                </Pressable>
                <Pressable onPress={()=> setCaptureMode("video") }>
                    <Text style={{color:captureMode === "video" ? "yellow": "white"}}>Video</Text>
                </Pressable>
            </View>

            <MaterialIcons
                name="flip-camera-android"
                onPress={toggleCamera}
                size={24}
                color="white"
            />
        </View>
        <MaterialIcons
            name="close"
            style={styles.close}
            size={30}
            color="white"
            onPress={router.back}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100%",
  },
  close: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  footer: {
    position: "absolute",
    backgroundColor: "#00000099",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});