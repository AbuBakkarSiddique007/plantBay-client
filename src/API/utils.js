import axios from "axios";

export const getImageUrl = async (selectedImage) => {

    const formData = new FormData()
    formData.append('image', selectedImage)

    // Send Image data to imgbb
    const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_API_KEY}`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return data.data.display_url
}
