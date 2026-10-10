import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { getMediaType } from "../utils/media";
import * as  FileSystem from "expo-file-system"
import { MaterialIcons } from "@expo/vector-icons";

export default function ImageScreen() {
    const { name } = useLocalSearchParams();
    const fulUri = (FileSystem.documentDirectory || "") + name;
    const type = getMediaType(fulUri);

    const onDelete = async()=>{
        await FileSystem.deleteAsync(fulUri);
        router.back()
    }
    const onSave = ()=>{}

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
        </View>
    );
}