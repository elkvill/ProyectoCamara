import {Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout(){
    return(
        <View style={{flex:1, backgroundColor:"lightgreen"}}>
            
            <Stack screenOptions={{headerTintColor:"blue", headerTitleAlign:"center"}}>
                <Stack.Screen name="index" options={{title:"Inicio"}}/>
                <Stack.Screen name="camera" options={{headerShown:false}}/>
            </Stack>

        </View>


    )
}