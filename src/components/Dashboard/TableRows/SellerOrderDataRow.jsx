import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
const SellerOrderDataRow = ({ orderData, refetch }) => {
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const axiosSecure = useAxiosSecure()

  const {
    _id,
    address,
    name,
    plantId,
    seller,
    status,
    totalPrice,
    plantInfo: {
      name: plantName,
      plantId: plantInfoId,
      price,
      totalQuantity
    },
    userInfo: {
      email: userEmail,
      image: userImage,
      name: userName
    }
  } = orderData || {}


  const handleDelete = async () => {
    try {
      const { data } = await axiosSecure.delete(`/orders/${_id}`)
      await axiosSecure.patch(`/plants/quantity/${plantId}`, {
        quantityToUpdate: totalQuantity,
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

  const handleStatusChange = async (e) => {
    const updatedStatus = e.target.value;
    if (status === updatedStatus) {
      return;
    }

    try {
      const { data } = await axiosSecure.patch(`/orders/status/${_id}`, { status: updatedStatus });
      console.log(data);

      if (data.modifiedCount > 0) {
        toast.success('Status updated successfully');
        refetch();
      } else {
        toast.error('No changes made to the status');
      }

    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);

    }

    console.log(updatedStatus);
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{userEmail}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${totalPrice}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{totalQuantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{address}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center gap-2'>
          <select
            required
            defaultValue={status}
            onChange={handleStatusChange}
            disabled={status === 'Delivered'}


            className='p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white'
            name='category'
          >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>Start Processing</option>
            <option value='Delivered'>Deliver</option>
          </select>

          <button
            onClick={() => setIsOpen(true)}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Cancel</span>
          </button>
        </div>
        <DeleteModal
          handleDelete={handleDelete}
          isOpen={isOpen}
          closeModal={closeModal} />
      </td>
    </tr>
  )
}

SellerOrderDataRow.propTypes = {
  orderData: PropTypes.object,
  refetch: PropTypes.func,

}

export default SellerOrderDataRow
