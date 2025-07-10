"use client";

import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { programs } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function ProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const program = programs.find(p => p.id === params.id);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (!program) {
    notFound();
  }

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      // Store the program ID in sessionStorage before redirecting to login
      sessionStorage.setItem('redirectAfterLogin', `/apply/${program.id}`);
      router.push('/login');
    } else {
      router.push(`/apply/${program.id}`);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <p className="text-primary font-semibold mb-2">{program.category}</p>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{program.title}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{program.description}</p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {program.curriculum.map(item => (
                    <AccordionItem value={`item-${item.module}`} key={item.module}>
                      <AccordionTrigger>Module {item.module}: {item.title}</AccordionTrigger>
                      <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={program.title}
                    width={600}
                    height={400}
                    className="rounded-t-lg w-full"
                    data-ai-hint="education learning"
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Starts {program.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="h-5 w-5" /> Instructor</h3>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={program.instructor.avatarUrl} alt={program.instructor.name} data-ai-hint="professional portrait" />
                        <AvatarFallback>{program.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{program.instructor.name}</p>
                        <p className="text-sm text-muted-foreground">{program.instructor.bio}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleApplyClick} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
