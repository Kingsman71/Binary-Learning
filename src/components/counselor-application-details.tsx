"use client";

import { useState, useEffect } from 'react';
import type { Application, Program, ApplicationStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

interface CounselorApplicationDetailsProps {
    application: Application;
    program: Program;
    otherPrograms: Program[];
}

export function CounselorApplicationDetails({ application, program, otherPrograms }: CounselorApplicationDetailsProps) {
    const { toast } = useToast();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<ApplicationStatus>(application.status);
    const [denialReason, setDenialReason] = useState('');
    const [recommendedProgram, setRecommendedProgram] = useState('');

    const sendEmailViaApi = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
      try {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html }),
        });
        return await res.json();
      } catch (error) {
        const err = error as Error;
        return { success: false, error: err?.message || 'Failed to send email' };
      }
    };

    const handleApprove = async () => {
      setStatus('Approved');
      // Update status in Firestore
      try {
        await updateDoc(doc(db, 'applications', application.id), { status: 'Approved' });
      } catch (err) {
        console.error('Failed to update status in Firestore:', err);
      }
      await sendEmailViaApi({
        to: application.applicant.email,
        subject: '🎉 Application Approved – Binary Bakery Academy',
        html: `
          <p>Hi ${application.applicant.fullName},</p>
          <p>Great news! Your application for <strong>${application.programTitle}</strong> has been <strong>approved</strong>.</p>
          <p>You can now log in to your student dashboard and proceed with your tuition payment.</p>
          <br/>
          <p>– Binary Bakery Admissions Team</p>
        `,
      });
      toast({
        title: "Application Approved",
        description: `An approval email has been sent to ${application.applicant.email}.`,
      });
    };

    const handleDeny = async () => {
      if (denialReason.trim().length < 10) {
        toast({
          variant: 'destructive',
          title: "Reason Required",
          description: 'Please provide a reason for denial (at least 10 characters).',
        });
        return;
      }
      setStatus('Denied');
      // Update status in Firestore
      try {
        await updateDoc(doc(db, 'applications', application.id), { status: 'Denied' });
      } catch (err) {
        console.error('Failed to update status in Firestore:', err);
      }
      const recommended = otherPrograms.find(p => p.id === recommendedProgram);
      await sendEmailViaApi({
        to: application.applicant.email,
        subject: '⚠️ Application Decision – Binary Bakery Academy',
        html: `
          <p>Hi ${application.applicant.fullName},</p>
          <p>We regret to inform you that your application for <strong>${application.programTitle}</strong> has been <strong>denied</strong>.</p>
          <p><strong>Reason:</strong> ${denialReason}</p>
          ${recommended ? `<p>However, we recommend exploring this program: <strong>${recommended.title}</strong>.</p>` : ''}
          <br/>
          <p>Thank you for your interest.</p>
          <p>– Binary Bakery Admissions Team</p>
        `,
      });
      toast({
        title: "Application Denied",
        description: `A denial email with the reason has been sent to ${application.applicant.email}.`,
      });
    };

    const getStatusBadgeVariant = (status: ApplicationStatus) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Denied': return 'destructive';
            case 'Pending Review': return 'secondary';
            default: return 'secondary';
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{application.applicant.fullName}</h1>
                    <p className="mt-1 text-muted-foreground">Application for {application.programTitle}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(status)} className="text-lg px-4 py-1">{status}</Badge>
            </div>
            <Separator className="my-6" />
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Email:</strong> {application.applicant.email}</p>
                            <p><strong>Phone:</strong> {application.applicant.phone}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Educational Background</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Highest Qualification:</strong> {application.education.highestQualification}</p>
                            <p><strong>Field of Study:</strong> {application.education.fieldOfStudy}</p>
                            <p><strong>Institution:</strong> {application.education.institution}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Statement of Purpose</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{application.statementOfPurpose}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Counselor Actions</CardTitle>
                            <CardDescription>Review and process this application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {status === 'Pending Review' ? (
                                <>
                                    <Button className="w-full" size="lg" onClick={handleApprove}>
                                        <Check className="mr-2 h-5 w-5" /> Approve Application
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="w-full" size="lg" variant="destructive">
                                                <X className="mr-2 h-5 w-5" /> Deny Application
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Denial</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Please provide a reason for denying this application. This will be sent to the applicant.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className='space-y-2'>
                                                    <Label htmlFor="denial-reason">Reason for Denial</Label>
                                                    <Textarea 
                                                        id="denial-reason"
                                                        placeholder="e.g., Application does not meet the minimum requirements..." 
                                                        value={denialReason}
                                                        onChange={(e) => setDenialReason(e.target.value)}
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor="recommend-program">Recommend another program (Optional)</Label>
                                                    <Select onValueChange={setRecommendedProgram} value={recommendedProgram}>
                                                        <SelectTrigger id="recommend-program">
                                                            <SelectValue placeholder="Select a program" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {otherPrograms.map(p => (
                                                                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeny}>Confirm Denial & Send Email</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            ) : (
                                <p className="text-sm text-center text-muted-foreground p-4 bg-muted rounded-md">
                                    This application has already been reviewed.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
