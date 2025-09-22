import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const CustomerOrderDataRow = ({ orderData, refetch }) => {
  const { category, image, name, quantity, status, totalPrice, _id, plantId } = orderData

  console.log("check: OrderData: ", orderData);
  console.log("2. plantId from CustomerOrderDataRow:", plantId);

  const axiosSecure = useAxiosSecure()

  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)

  const handleDelete = async () => {
    try {
      const { data } = await axiosSecure.delete(`/orders/${_id}`)
      await axiosSecure.patch(`/plants/quantity/${plantId}`, {
        quantityToUpdate: quantity,
        status: 'increase'
      });

      console.log(data)
      refetch()
      toast.success('Order cancelled successfully')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Failed to cancel the order')
    }
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={image}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
        </div>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{category}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${totalPrice}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <button
          onClick={() => setIsOpen(true)}
          className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-lime-900 leading-tight'
        >
          <span className='absolute cursor-pointer inset-0 bg-red-200 opacity-50 rounded-full'></span>
          <span className='relative cursor-pointer'>Cancel</span>
        </button>

        <DeleteModal
          handleDelete={handleDelete}
          isOpen={isOpen}
          closeModal={closeModal} />
      </td>
    </tr>
  )
}

CustomerOrderDataRow.propTypes = {
  orderData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    address: PropTypes.string,
    plantId: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func
}

export default CustomerOrderDataRow
