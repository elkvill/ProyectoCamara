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
} from "expo-camera";
import { useEffect, useState, useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from 'expo-file-system';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("back");
    const camera = useRef<CameraView>(null);
    const [picture, setPicture] = useState<CameraCapturedPicture>();


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

    const takePicture = async () => {
        console.log("Tomando foto...");
        const res = await camera.current?.takePictureAsync();

        setPicture(res);
        // console.log(res)
    };

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

    if (picture) {
        return (
        <View style={{ flex: 1 }}>
            {picture && (
            <Image
                source={{ uri: picture.uri }}
                style={{ width: "100%", flex: 1 }}
            />
            )}
            <View style={{ paddingTop: 10, paddingHorizontal: 10, paddingBottom: 30 }}>
                <Button title="Guardar" onPress={() => saveFile(picture.uri)} />
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
        <CameraView ref={camera} style={styles.camera} facing={facing} />
        <View style={styles.footer}>
            <Pressable style={styles.recordButton} onPress={takePicture} />
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
    paddingBottom: 30,
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