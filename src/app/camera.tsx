import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function CamaraScreen(){
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Stack.Screen options={{headerShown:false}}/>
            <Text >Camara</Text>
            <Link href="/">Inicio</Link>
        </View>
    )
}