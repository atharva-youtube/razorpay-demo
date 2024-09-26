"use client";

import Image from "next/image";
import Script from "next/script";
import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState<number>(0);

  const createOrder = async () => {
    const res = await fetch("/api/createOrder", {
      method: "POST",
      body: JSON.stringify({ amount: amount * 100 }),
    });
    const data = await res.json();

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.id,

      handler: async function (response: any) {
        // verify payment
        const res = await fetch("/api/verifyOrder", {
          method: "POST",
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.isOk) {
          // do whatever page transition you want here as payment was successful
          alert("Payment successful");
        } else {
          alert("Payment failed");
        }
      },
    };

    const payment = new (window as any).Razorpay(paymentData);
    payment.open();
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center flex-col gap-4">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <input
        type="number"
        placeholder="Enter amount"
        className="px-4 py-2 rounded-md text-black"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        onClick={createOrder}
      >
        Create Order
      </button>
    </div>
  );
}
