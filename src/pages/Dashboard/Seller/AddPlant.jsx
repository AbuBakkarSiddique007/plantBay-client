import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { getImageUrl } from '../../../API/utils'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AddPlant = () => {
  const { user } = useAuth()

  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const handleImageChange = (event) => {
    event.preventDefault()

    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
    const createImagePreview = URL.createObjectURL(file)
    setImagePreview(createImagePreview)
  }

  console.log(selectedImage);
  console.log(imagePreview);

  const [loading, setLoading] = useState(false)

  const axiosSecure = useAxiosSecure()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const form = event.target
    const name = form.name.value
    const category = form.category.value
    const description = form.description.value
    const price = parseFloat(form.price.value)
    const quantity = parseInt(form.quantity.value)

    const image = form.image.files[0]
    const imageUrl = await getImageUrl(image)

    // Seller Info:
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email
    }

    // Create Plant data object
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageUrl,
      seller
    }

    console.table(plantData);

    try {
      await axiosSecure.post('/plants', plantData)
      toast.success("Data added Successfully.")
      navigate('/dashboard/my-inventory')

      form.reset()
      setSelectedImage(null)
      setImagePreview(null)

    } catch (error) {
      console.log(error);
      toast.error("Failed to add plant data.")
    }
    finally {
      setLoading(false)
    }


  }

  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        selectedImage={selectedImage}
        imagePreview={imagePreview}
        loading={loading}
      />
    </div>
  )
}

export default AddPlant
