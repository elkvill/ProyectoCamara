import { Link, useFocusEffect } from "expo-router";
import { Text, View, StyleSheet, Pressable, FlatList, Image } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from "react";
import * as FileSystem from 'expo-file-system';
import { getMediaType } from "../utils/media";
import { useVideoPlayer, VideoView } from "expo-video";
import  MaterialCommunityIcons  from "@expo/vector-icons/MaterialCommunityIcons";

type Media = {
    name: string;
    uri:string;
    type:string;
}

const VideoThumbnail = ({uri}: {uri:string})=>{
    const player = useVideoPlayer({uri}, (player) =>{
        player.loop = true;
        player.muted = true;
        player.play()
    } )

    return <VideoView player={player} contentFit="cover" nativeControls={false} style={{aspectRatio:3/4, borderRadius:5}} />
}

export default function HomeScreen() {
    
    const [files, setFiles] = useState < Media[] > ([]);
    
    //para visualizar las imagenes 
    //como funciona?
    useFocusEffect(
        React.useCallback(()=>{
            loadFiles()
        },[])
    )

    const loadFiles = async () => {
        if (!FileSystem.documentDirectory) return
        // para obtener las imagenes
        const res = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)

        
        // console.log("Imagenes:", res)
        const filesResult = res.map((file) => {
            const uri = FileSystem.documentDirectory + file;
            const type = getMediaType(file);
            // return {name:file, uri:uri, type:type}
            return {name:file, uri, type}
        })

        setFiles(filesResult.filter((item)=> item.type === "image" || item.type === "video"));

    }
    // Que es un layout?}
    return (
        <View style={{ flex: 1}}>
            <FlatList 
                data={files} 
                numColumns={3}
                keyExtractor={(item)=> item.uri}
                columnWrapperStyle= {{gap:1}}
                contentContainerStyle={{gap:1}}
                renderItem={({item})=>{
                    return (
                        <Link href={`/${item.name}`} asChild>
                            <Pressable style={{flex:1, maxWidth:"33.33%"}}>
                                {item.type === "image" && (
                                    
                                    <Image source={{ uri: item.uri }} style={{aspectRatio: 3/4, borderRadius:5}}/>
                                )}
                                {item.type === "video" && (
                                <>
                                    <VideoThumbnail uri={item.uri}/>
                                        <MaterialCommunityIcons name="play-circle-outline" size={24} 
                                        color="white" style={{position:"absolute", top:10, left:10}}
                                    />
                                    <View 
                                        style={{
                                            position:"absolute", 
                                            zIndex:99, 
                                            left: 0,
                                            top:0,
                                            bottom:0,
                                            right:0
                                        }} 
                                    />

                                </>)}
                            </Pressable>
                        </Link>
                        
                    );
                }}
            />
            {/* // que hace asChild, Pressable */}
            <Link href="/camera" asChild>
                <Pressable style={styles.floatingButton}>
                    <MaterialIcons name="photo-camera" size={34} color="white" />
                </Pressable>
            </Link>


        </View>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
        backgroundColor: "royalblue",
        padding: 15,
        borderRadius: 50,
        position: "absolute",
        right: 10,
        bottom: 50
    }
})