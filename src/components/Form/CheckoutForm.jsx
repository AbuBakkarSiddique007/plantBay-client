import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './CheckoutForm.css';
import Button from '../Shared/Button/Button';
import PropTypes from 'prop-types';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ closeModal, purchaseInfo, refetch, selectedQuantity }) => {
    const stripe = useStripe();
    const elements = useElements();

    const axiosSecure = useAxiosSecure()
    const [clientSecret, setClientSecret] = useState('')
    const [processing, setProcessing] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        getPaymentIntent()
    }, [purchaseInfo])

    console.log(clientSecret);

    const getPaymentIntent = async () => {
        try {

            const { data } = await axiosSecure.post("/create-payment-intent", {
                quantity: purchaseInfo?.plantInfo?.totalQuantity
            })
            console.log(data);
            setClientSecret(data.clientSecret)

        } catch (error) {
            console.log(error.message);

        }
    }

    // Safely destructure purchaseInfo with defaults to avoid runtime errors
    const { totalPrice = 0 } = purchaseInfo || {};

    const handleSubmit = async (event) => {
        setProcessing(true)


        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            setProcessing(false)
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setProcessing(false)
            toast.error(error.message)
            return console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }

        // Confirm Payment 
        const { paymentIntent } = stripe
            .confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: purchaseInfo?.userInfo?.name,
                        email: purchaseInfo?.userInfo?.email
                    },
                },
            })

        if (paymentIntent.status === "succeeded") {
            try {
                await axiosSecure.post('/orders', {
                    ...purchaseInfo, transactionId: paymentIntent.id
                });

                await axiosSecure.patch(`/plants/quantity/${purchaseInfo?.plantId}`, {
                    quantityToUpdate: selectedQuantity,
                    status: 'decrease'
                });

                console.log("1. ID from PurchaseModal:", purchaseInfo?.plantId);

                toast.success('Purchase successful!');
                refetch();
                navigate('/dashboard/my-orders');

                console.log('Purchase Info:', purchaseInfo);

                // Reset form and close modal
                // setSelectedQuantity('');
                // setAddress('');
                // setTotalPrice(0);
                // closeModal();

            } catch (error) {
                toast.error('Purchase failed!');
                console.log(error.message);
            }
        }




    };




    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />

            <div className='flex justify-center items-center flex-col md:flex-row gap-6'>
                <Button
                    type="submit"
                    disabled={!stripe || !clientSecret || processing || totalPrice <= 0}
                    label={`Pay $${totalPrice}`}
                    classes="mt-4 w-full"
                ></Button>

                <Button
                    onClick={closeModal}
                    label="Cancel"
                    outline={true}

                    className=' mt-2 w-full text-red-500 font-semibold border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition px-4 py-3 ml-2'
                >Cancel</Button>
            </div>

            {/* <button type="submit" disabled={!stripe}>
                Pay
            </button> */}
        </form>
    );
};

export default CheckoutForm;

CheckoutForm.propTypes = {
    closeModal: PropTypes.func,
    refetch: PropTypes.func,
    purchaseInfo: PropTypes.shape({
        userInfo: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            image: PropTypes.string,
        }),
        plantInfo: PropTypes.shape({
            plantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            totalQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
        seller: PropTypes.string,
        address: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        status: PropTypes.string,
    }),
};

CheckoutForm.defaultProps = {
    closeModal: () => { },
    refetch: () => { },
    purchaseInfo: {},
};