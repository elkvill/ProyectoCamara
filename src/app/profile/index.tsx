import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function CamaraScreen(){
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text >Perfil</Text>
            <Link href="/">Inicio</Link>
        </View>
    )
}