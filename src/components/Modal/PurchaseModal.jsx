/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import useAuth from '../../hooks/useAuth';
import Button from '../Shared/Button/Button';

import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const { category, name, price, quantity, seller, _id } = plant;

  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchaseInfo = async (e) => {
    e.preventDefault();
    if (!address || !selectedQuantity || selectedQuantity < 1) {
      toast.error('Please enter a valid address and quantity.');
      return;
    }
    setLoading(true);

    const purchaseInfo = {
      userInfo: {
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL
      },
      plantInfo: {
        plantId: plant?._id,
        name: plant?.name,
        price: plant?.price,
        totalQuantity: selectedQuantity
      },
      seller: seller?.email,
      address,
      totalPrice,
      status: 'pending'
    };

    console.table(purchaseInfo);


    try {
      await axiosSecure.post('/orders', purchaseInfo);
      await axiosSecure.patch(`/plants/quantity/${_id}`, { quantityToUpdate: selectedQuantity });

      toast.success('Purchase successful!');
      refetch()
      console.log('Purchase Info:', purchaseInfo);

      // Reset form and close modal
      setSelectedQuantity('');
      setAddress('');
      setTotalPrice(0);
      closeModal();

    } catch (error) {
      toast.error('Purchase failed!');
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);
    if (e.target.value === '') {
      setSelectedQuantity('');
      setTotalPrice(0);
      return;
    }
    if (value < 1) {
      toast.error('Minimum quantity is 1');
      value = 1;
    }
    if (value > quantity) {
      toast.error(`Maximum quantity is ${quantity}`);
      value = quantity;
    }
    setSelectedQuantity(value);
    setTotalPrice(value * price);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Category: {category}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Price: ${price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
                </div>

                <div className='space-x-2 mt-2 text-sm'>
                  <label htmlFor='address' className=' text-gray-600'>
                    Address:
                  </label>
                  <input
                    className='w-1/2 p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='address'
                    id='address'
                    type='text'
                    placeholder='Enter your shipping address'

                    value={address}
                    onChange={(e) => setAddress(e.target.value)}

                    required
                  />
                </div>
                <div className='space-x-2 mt-2 text-sm'>
                  <label htmlFor='quantity' className=' text-gray-600'>
                    Quantity:
                  </label>
                  <input
                    className='p-2 w-1/2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    min={1}
                    max={quantity}

                    name='quantity'
                    id='quantity'
                    type='number'

                    value={selectedQuantity}
                    onChange={handleQuantityChange}

                    placeholder='Enter your quantity'
                    required
                  />
                </div>

                <div className='mt-4'>
                  <Button
                    onClick={handlePurchaseInfo}
                    label={`Pay $${totalPrice}`} classes="mt-4 w-full" />
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal
