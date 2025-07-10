"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { programs } from '@/lib/data';
import { PaymentSection } from '@/components/payment-section';
import { db } from '@/lib/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ApplicationForm } from '@/components/application-form';
import type { Application } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentDashboard() {
    
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [showApply, setShowApply] = useState(false);
    const [recommendedProgramId, setRecommendedProgramId] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (typeof window === 'undefined') {
            return;
        }
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user || !user.email) {
            router.replace('/login');
            return;
        }
        setStudentName(user.displayName || '');
        setStudentEmail(user.email || '');
        // Fetch all applications for the student
        async function fetchApplications() {
            setLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            // Query by studentId (UID)
            const q = query(collection(db, 'applications'), where('studentId', '==', user.uid));
            const snapshot = await getDocs(q);
            let found = false;
            let approved: any = null, pending: any = null, denied: any = null;
            let deniedRecommended: string | null = null;
            if (!snapshot.empty) {
                // Always use the most recent application (by applicationDate)
                const sortedDocs = snapshot.docs
                  .map(docSnap => {
                    const data = docSnap.data() as any;
                    return {
                      id: docSnap.id,
                      applicationDate: data.applicationDate,
                      status: data.status,
                      programId: data.programId,
                      programTitle: data.programTitle,
                      applicant: data.applicant,
                      education: data.education,
                      statementOfPurpose: data.statementOfPurpose,
                      recommendedProgramId: data.recommendedProgramId || null,
                    };
                  })
                  .sort((a, b) => {
                    const aDate = a.applicationDate?.seconds ? new Date(a.applicationDate.seconds * 1000) : new Date(a.applicationDate);
                    const bDate = b.applicationDate?.seconds ? new Date(b.applicationDate.seconds * 1000) : new Date(b.applicationDate);
                    return bDate.getTime() - aDate.getTime();
                  });
                for (const app of sortedDocs) {
                  if (app.status === 'Approved') {
                    approved = app;
                    break;
                  }
                  if (app.status === 'Pending Review' && !pending) pending = app;
                  if (app.status === 'Denied' && !denied) {
                    denied = app;
                    deniedRecommended = app.recommendedProgramId;
                  }
                }
                if (approved) {
                    setApplication(approved);
                    setShowApply(false);
                    setRecommendedProgramId(null);
                    found = true;
                } else if (pending) {
                    setApplication(pending);
                    setShowApply(false);
                    setRecommendedProgramId(null);
                    found = true;
                } else if (denied) {
                    setApplication(denied);
                    setShowApply(false);
                    setRecommendedProgramId(deniedRecommended);
                    found = true;
                }
            }
            if (!found) {
                setApplication(null);
                setShowApply(true);
                setRecommendedProgramId(null);
            }
            setLoading(false);
        }
        fetchApplications();
    }, [isAuthenticated, router, authLoading]);

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                <p className="mb-4 text-muted-foreground">Checking authentication status.</p>
            </div>
        );
    }

    if (!isAuthenticated || loading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Student Login Required</h1>
                <p className="mb-4 text-muted-foreground">Please log in to access your dashboard.</p>
                <Link href="/student/register">
                    <Button variant="outline">Register as a New Student</Button>
                </Link>
            </div>
        );
    }

    // No application: show all programs and let student apply
    if (showApply) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold mb-6">Explore Programs & Apply</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map(program => (
                        <Card key={program.id}>
                            <CardHeader>
                                <CardTitle>{program.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 text-muted-foreground">{program.description}</p>
                                <Button onClick={() => router.push(`/apply/${program.id}`)}>Apply</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Pending review
    if (application && application.status === 'Pending Review') {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-2xl font-bold">Application Status: Pending Review</h1>
                <p className="text-muted-foreground mt-2">Your application for <b>{application.programTitle}</b> is under review. We will notify you once a decision is made.</p>
            </div>
        );
    }

    // Approved: show payment section
    if (application && application.status === 'Approved') {
        const program = programs.find(p => p.id === application.programId);
        if (!program) {
            return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Program not found.</div>;
        }
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome, {studentName}!</h1>
                <p className="mt-2 text-muted-foreground mb-8">Congratulations! Your application for <b>{program.title}</b> has been approved. Please complete your payment to enroll.</p>
                <PaymentSection
                    program={program}
                    applicantName={studentName}
                    applicantEmail={studentEmail}
                />
            </div>
        );
    }

    // Denied: show only recommended program
    if (application && application.status === 'Denied') {
        const recommended = recommendedProgramId ? programs.find(p => p.id === recommendedProgramId) : null;
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Application Denied</h1>
                <p className="text-muted-foreground mb-8">Unfortunately, your application for <b>{application.programTitle}</b> was not accepted.</p>
                {recommended ? (
                    <div className="max-w-lg mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recommended Program</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h2 className="font-bold text-lg mb-2">{recommended.title}</h2>
                                <p className="mb-4 text-muted-foreground">{recommended.description}</p>
                                <Button onClick={() => router.push(`/apply/${recommended.id}`)}>Apply for {recommended.title}</Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <p className="text-muted-foreground">No alternative program was recommended. Please contact support for more options.</p>
                )}
            </div>
        );
    }

    // Fallback
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">No application data found.</div>;
}
