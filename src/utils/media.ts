 export const getMediaType = (file: string)=>{
    const imagesExtension = ["jpg", "jpeg","gif"]
    const videoExtensions =["mp4", "mov"]
    const extname = file.split(".").pop()?.toLowerCase();
            
    if(extname && imagesExtension.includes(extname)){
        return "image";

    }else if(extname && videoExtensions.includes(extname)){
        return "video";
    }else{
        return "otro";
    }

            
}
