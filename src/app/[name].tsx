import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { getMediaType } from "../utils/media";
import * as  FileSystem from "expo-file-system"
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
//Descomentar despues de des argar la libreria
import * as MediaLibrary from "expo-media-library";

const Video = ({uri}: {uri:string})=>{
    const player = useVideoPlayer({uri}, (player) =>{
        player.loop = true;
        player.play()
    } );

    return <VideoView player={player} contentFit="cover"  style={{width:"100%", height:"100%"}} />
}

export default function ImageScreen() {
    const { name } = useLocalSearchParams();
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const fulUri = (FileSystem.documentDirectory || "") + name;
    const type = getMediaType(fulUri);

    const onDelete = async()=>{
        await FileSystem.deleteAsync(fulUri);
        router.back()
    }
    const onSave = async()=>{
        
        if(permissionResponse?.status !== "granted"){
            await requestPermission()
        }
        await MediaLibrary.createAssetAsync(fulUri)

    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Stack.Screen
                options={{
                    title: "Multimedia",
                    headerTitleAlign: "left",
                    headerRight: () => (
                        <View style={{flexDirection:"row", gap:15}}>
                            <MaterialIcons name="delete" size={26} color="crimson" onPress={onDelete}/>
                            <MaterialIcons name="save" size={26} color="green" onPress={onSave}/>
                        </View>
                    )
                }}
            />

            {type === "image" && (
                <Image source={{ uri: fulUri }} style={{ width: "100%", height: "100%" }} />

            )}
            {type === "video" && (<Video uri={fulUri} />)}
        </View>
    );
}