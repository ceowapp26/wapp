import {
    PayPalScriptProvider,
    PayPalCardFieldsProvider,
    PayPalNameField,
    PayPalNumberField,
    PayPalExpiryField,
    PayPalCVVField,
    usePayPalCardFields,
} from "@paypal/react-paypal-js";

const SubmitPayment = () => {
    const { cardFields, fields } = usePayPalCardFields();

    function submitHandler() {
        if (typeof cardFields.submit !== "function") return; // validate that `submit()` exists before using it

        cardFields
            .submit()
            .then(() => {
                // submit successful
            })
            .catch(() => {
                // submission error
            });
    }
    return <button onClick={submitHandler}>Pay</button>;
};

// Example using individual card fields
export default function App() {
    function createOrder() {
        // merchant code
    }
    function onApprove() {
        // merchant code
    }
    function onError() {
        // merchant code
    }
    return (
        <PayPalScriptProvider
            options={{
                clientId: "your-client-id",
                components: "card-fields",
            }}
        >
            <PayPalCardFieldsProvider
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
            >
                <PayPalNameField />
                <PayPalNumberField />
                <PayPalExpiryField />
                <PayPalCVVField />

                <SubmitPayment />
            </PayPalCardFieldsProvider>
        </PayPalScriptProvider>
    );
}