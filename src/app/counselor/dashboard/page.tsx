"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { Application } from '@/lib/types';

export default function CounselorDashboardPage() {
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    const fetchApplications = async () => {
      const querySnapshot = await getDocs(collection(db, 'applications'));
      const apps = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          applicationDate: data.applicationDate?.toDate ? data.applicationDate.toDate() : new Date(),
        } as Application;
      });
      // Only show applications that are still 'Pending Review'
      setPendingApplications(apps.filter(app => (app.status || '').trim().toLowerCase() === 'pending review'));
    };

    fetchApplications();
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Counselor Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Review and manage student applications.</p>
        </div>
        <Button variant="outline" onClick={async () => { await signOut(auth); window.location.href = '/login'; }}>Logout</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            {pendingApplications.length > 0
              ? `You have ${pendingApplications.length} application(s) awaiting your review.`
              : 'There are no pending applications at this time.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead className="hidden md:table-cell">Application Date</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApplications.length > 0 ? (
                pendingApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.applicant.fullName}</TableCell>
                    <TableCell>{app.programTitle}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {app.applicationDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={app.status === 'Pending Review' ? 'secondary' : 'default'}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/counselor/applications/${app.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No pending applications.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
