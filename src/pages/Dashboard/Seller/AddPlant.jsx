import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { getImageUrl } from '../../../API/utils'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const AddPlant = () => {
  const { user } = useAuth()
  const [uploadBtnText, setUploadBtnText] = useState({ name: 'Upload Image' })
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

    } catch (error) {
      console.log(error);

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
        uploadBtnText={uploadBtnText}
        setUploadBtnText={setUploadBtnText}
        loading={loading}
      />
    </div>
  )
}

export default AddPlant
