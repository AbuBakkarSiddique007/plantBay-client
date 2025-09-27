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


export const saveUser = async (user) =>{
    await axios.post(`${import.meta.env.VITE_API_URL}/users/${user.email}`,
        {
            name: user.displayName,
            image: user.photoURL,
            email: user.email,
        }
    )
}
