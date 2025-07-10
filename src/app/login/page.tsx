"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [role, setRole] = useState<'student' | 'counselor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      login(); // Set authentication state in context

      toast({
        title: 'Login Successful',
        description: 'Welcome! You are now logged in.',
      });

      // Check for stored redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else if (email.includes('counselor') || email.includes('admin')) {
        router.push('/counselor/dashboard');
      } else {
        router.push('/programs'); // Always redirect to programs after login
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
      });
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to access your dashboard or continue your application.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                 <div className="space-y-3">
                    <Label>I am a...</Label>
                    <RadioGroup value={role} onValueChange={(value) => setRole(value as 'student' | 'counselor')} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="r1" />
                            <Label htmlFor="r1">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="counselor" id="r2" />
                            <Label htmlFor="r2">Counselor</Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
            </CardFooter>
        </form>
      </Card>
      <div className="w-full max-w-md mt-4 flex justify-center">
        <Link
          href="/student/register"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Register as a New Student
        </Link>
      </div>
    </div>
  );
}
