import { Link } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect } from "react";
import * as FileSystem from 'expo-file-system';

export default function HomeScreen(){
    //para visualizar las imagenes 
    useEffect(()=> {
        loadFiles()
    }, []);

    const loadFiles = async()=> {
        if (!FileSystem.documentDirectory) return
        // para obtener las imagenes
        const res = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)

        console.log("Imagenes:", res)
    }
    // Que es un layout?}
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text >Bienvenido</Text>
            <Link href="/image-1">Imagen 1</Link>
            <Link href="/image-2">Imagen 2</Link>
            <Link href="/image-3">Imagen 3</Link>
            <Link href="/profile">Perfil</Link>
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
    floatingButton:{
        backgroundColor:"royalblue",
        padding:15,
        borderRadius:50,
        position:"absolute",
        right:10,
        bottom: 50
    }
})