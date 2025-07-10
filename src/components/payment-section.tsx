"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Program } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, CreditCard, Calendar, Shield } from 'lucide-react';


interface PaymentSectionProps {
  program: Program;
  applicantEmail: string;
  applicantName: string;
}

type PaymentView = 'options' | 'fullPayment' | 'plan' | 'confirmed';

export function PaymentSection({ program, applicantEmail, applicantName }: PaymentSectionProps) {
    const [view, setView] = useState<PaymentView>('options');
    const { toast } = useToast();

    const handleSubmitPayment = async (e: React.FormEvent) => {
  e.preventDefault();
  await sendConfirmationEmail('full');
  setView('confirmed');
  toast({
    title: "Payment Successful!",
    description: "Your enrollment is confirmed. Welcome aboard!",
  });
};

const handleSetupPlan = async () => {
  await sendConfirmationEmail('plan');
  setView('confirmed');
  toast({
    title: "Payment Plan Initiated!",
    description: "We've sent details to your email to complete the setup.",
  });
};

    const sendConfirmationEmail = async (type: 'full' | 'plan') => {
  const subject = type === 'full'
    ? 'Payment Confirmation - Binary Bakery Academy'
    : 'Payment Plan Setup - Binary Bakery Academy';

  const html = type === 'full'
    ? `<p>Hello ${applicantName},</p><p>Your payment for the <strong>${program.title}</strong> program has been received. Welcome aboard!</p>`
    : `<p>Hello ${applicantName},</p><p>Your payment plan for the <strong>${program.title}</strong> program has been initiated. We'll reach out soon to finalize it.</p>`;

  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: applicantEmail,
        subject,
        html,
      }),
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Tuition Payment</CardTitle>
                <CardDescription>Complete your enrollment for the {program.title} program.</CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {view === 'options' && (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Button size="lg" className="h-auto py-4 flex flex-col gap-2" onClick={() => setView('fullPayment')}>
                                    <CreditCard />
                                    <span>Make Full Payment</span>
                                </Button>
                                <Button size="lg" className="h-auto py-4 flex flex-col gap-2" variant="secondary" onClick={() => setView('plan')}>
                                    <Calendar />
                                    <span>Set Up Payment Plan</span>
                                </Button>
                            </div>
                        )}

                        {view === 'fullPayment' && (
                            <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardName">Cardholder Name</Label>
                                    <Input id="cardName" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiration Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" placeholder="•••" required />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" onClick={() => setView('options')}>Back</Button>
                                    <Button type="submit">Submit Payment</Button>
                                </div>
                            </form>
                        )}

                        {view === 'plan' && (
                           <div className="text-center space-y-4 p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold">Flexible Payment Plans</h3>
                                <p className="text-muted-foreground text-sm">We offer 3-month, 6-month, and 9-month installment plans to fit your budget. Our team will reach out to you to finalize the details.</p>
                                <div className="flex justify-center gap-2 pt-4">
                                    <Button variant="ghost" onClick={() => setView('options')}>Back</Button>
                                    <Button onClick={handleSetupPlan}>Proceed to Payment Plan Setup</Button>
                                </div>
                           </div>
                        )}

                        {view === 'confirmed' && (
                            <div className="text-center py-10">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold">Thank You!</h2>
                                <p className="text-muted-foreground mt-2">Your enrollment is complete. An email confirmation has been sent.</p>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </CardContent>
            {view !== 'options' && view !== 'confirmed' && <CardFooter />}
        </Card>
    );
}
