"use client";

import React, { useState } from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadRazorpay } from "@/lib/razorpay";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";

interface RazorpayButtonProps {
    amount: number;
    orderId: string;
    farmerName: string;
    onSuccess: () => void;
}

export const RazorpayPaymentButton = ({ amount, orderId, farmerName, onSuccess }: RazorpayButtonProps) => {
    const [isPaying, setIsPaying] = useState(false);

    const handlePayment = async () => {
        setIsPaying(true);
        try {
            const isLoaded = await loadRazorpay();
            if(!isLoaded) {
                toast.error("Razorpay SDK could not be loaded. Please check your internet connection.");
                return;
            }

            // Create Order on Backend
            const data = await paymentService.createOrder({ 
                amount, 
                orderId, 
                farmerId: 'farmer-id' // Should be dynamic from order context
            });

            if(!data.success) throw new Error(data.message);

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy_id",
                amount: data.order.amount,
                currency: data.order.currency,
                name: "ODOP Connect",
                description: `Procurement Payment for ${farmerName}`,
                order_id: data.order.id,
                handler: async (response: any) => {
                    const verification = await paymentService.verifyPayment(response);
                    if(verification.success) {
                        toast.success("Payment Received! Funds held in Escrow.");
                        onSuccess();
                    } else {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: "Premium Buyer",
                    email: "buyer@odopconnect.com"
                },
                theme: {
                    color: "#0a84ff"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <Button 
            variant="gradient" 
            className="h-12 px-8 rounded-2xl font-black text-sm shadow-lg shadow-brand-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            onClick={handlePayment}
            disabled={isPaying}
        >
            <CreditCard size={18} />
            {isPaying ? "PROCESSING..." : "PAY FOR PROCUREMENT"}
        </Button>
    );
};
