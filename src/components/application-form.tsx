"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { db } from '@/lib/firestore';

const personalSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
});

const educationSchema = z.object({
  highestQualification: z.string().min(2, 'Qualification is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  institution: z.string().min(2, 'Institution name is required'),
});

const statementSchema = z.object({
    statementOfPurpose: z.string().min(50, 'Statement must be at least 50 characters long.').max(1000, 'Statement must be 1000 characters or less.'),
});

const formSchema = personalSchema.merge(educationSchema).merge(statementSchema);

type FormStep = {
  title: string;
  fields: (keyof z.infer<typeof formSchema>)[];
};

const steps: FormStep[] = [
  { title: 'Personal Details', fields: ['fullName', 'email', 'phone'] },
  { title: 'Educational Background', fields: ['highestQualification', 'fieldOfStudy', 'institution'] },
  { title: 'Statement of Purpose', fields: ['statementOfPurpose'] },
];

export function ApplicationForm({ programId }: { programId: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      highestQualification: '',
      fieldOfStudy: '',
      institution: '',
      statementOfPurpose: '',
    },
    mode: 'onChange',
  });
  
  const processForm = async (data: z.infer<typeof formSchema>) => {
    try {
      const referenceNumber = `BB-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      // Store application in Firestore
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        await addDoc(collection(db, 'applications'), {
          studentId: user.uid, // Always set studentId to UID
          applicant: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
          },
          programId,
          programTitle: '',
          applicationDate: Timestamp.now(),
          status: 'Pending Review',
          education: {
            highestQualification: data.highestQualification,
            fieldOfStudy: data.fieldOfStudy,
            institution: data.institution,
          },
          statementOfPurpose: data.statementOfPurpose,
          referenceNumber,
        });
      } catch (firestoreError) {
        console.error('[DEBUG] Firestore error:', firestoreError);
        form.setError('root', {
          type: 'submitError',
          message: 'Failed to save application. Please try again or contact support.'
        });
        return;
      }
      // 🔐 Call the secure email API route
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: data.email,
            subject: 'Application Received – Binary Bakery Academy',
            html: `
              <p>Hi ${data.fullName},</p>
              <p>Thank you for applying to <strong>Binary Bakery Academy</strong>.</p>
              <p>Your application has been submitted successfully.</p>
              <p>Your reference number is:</p>
              <p><strong>${referenceNumber}</strong></p>
              <p>We'll contact you after reviewing your application.</p>
              <br/>
              <p>– Binary Bakery Admissions Team</p>
            `,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          console.error('[DEBUG] Email error:', result.error);
        } else {
          console.log('[DEBUG] Confirmation email sent successfully.');
        }
      } catch (emailError) {
        console.error('[DEBUG] Email error:', emailError);
      }
      // ✅ Redirect to confirmation
      router.push(`/confirmation/${referenceNumber}`);
    } catch (error) {
      console.error('[DEBUG] Application submission error:', error);
      form.setError('root', {
        type: 'submitError',
        message: 'Failed to submit application. Please try again or contact support.'
      });
    }
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    } else {
        await form.handleSubmit(processForm)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };
  
  const progressValue = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <Progress value={progressValue} className="mb-6" />
        <Form {...form}>
          <form className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField control={form.control} name="highestQualification" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Qualification</FormLabel>
                        <FormControl><Input placeholder="e.g., Bachelor's Degree" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="fieldOfStudy" render={({ field }) => (
                       <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="institution" render={({ field }) => (
                       <FormItem>
                        <FormLabel>Institution Name</FormLabel>
                        <FormControl><Input placeholder="University of Technology" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
                {currentStep === 2 && (
                    <FormField
                      control={form.control}
                      name="statementOfPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statement of Purpose</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your motivation and goals..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          Back
        </Button>
        <Button onClick={nextStep} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {currentStep === steps.length - 1 ? 'Submit Application' : 'Next Step'}
        </Button>
      </CardFooter>
    </Card>
  );
}
