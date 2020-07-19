import React, {useState} from 'react'
import "./CheckoutForm.css"
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js"
import axios from 'axios'

function CheckoutForm(props) {

    const [isProcessing, setIsProcessing] = useState(false)

    const stripe = useStripe()
    const element = useElements()

    const handlePayment = async (e) => {

        e.preventDefault()

        setIsProcessing(true)

        const cardElement = element.getElement('card')

        const billingInfo = {
            name: e.target.name.value,
            phone: e.target.phone.value,
            email: e.target.email.value,
            address: {
                line1: e.target.address.value
            }
        }

        try {
            // Got our client secret
            const paymentIntent = await axios.post("http://localhost:5000/payment", {
                amount: props.product.price * 100
            })

            // Create PaymentMethod Object
            const paymentMethodObj = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: billingInfo
            })

            
            // Confirm Payment Method
            const confirmPayment = await stripe.confirmCardPayment(paymentIntent.data, {
                payment_method: paymentMethodObj.paymentMethod.id
            })
            
        } catch (error) {
            console.log("error", error)
        }

    }

    return (
        <div className="CheckoutForm">
            <h3 className="purchase-msg">
                You are purchasing an <span>{props.product.name}</span> for ${props.product.price}
            </h3>
            <form className="form" onSubmit={handlePayment}>
                <input 
                    type="text" 
                    placeholder="Full name"
                    name="name"
                    required
                />
                <input
                    type="text"
                    placeholder="Phone number"
                    name="phone"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    required
                />
                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: {
                                fontSize: '20px'
                            }
                        }
                    }} 
                />
                <button type="submit" disabled={isProcessing}>
                    {!isProcessing ? "Pay" : "Processing..."}
                </button>
            </form>
        </div>
    )
}


export default CheckoutForm
