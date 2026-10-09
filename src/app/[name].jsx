import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ImageScreen(){
    const{name}= useLocalSearchParams()
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text >Camara</Text>
            <Text>{name}</Text>
            <Link href="/">Inicio</Link>
        </View>
    )
}