import UploadImage from "./image";

type Props = {
    file: File
}
export default function UploadRenderer({file}:Props) {

    switch(file.type) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/webp':
            return <UploadImage />
    }

  return null
}
