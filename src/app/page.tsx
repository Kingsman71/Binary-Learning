"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn, Users, Target, Building, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-20 sm:py-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Navigate Your Future in Tech
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover cutting-edge programs at Binary Bakery. From code to creation, your journey starts here. Find the perfect course to launch your career.
          </p>
          <div className="mt-8 flex justify-center items-center flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/programs">
                Explore Programs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild size="lg" variant="outline">
                <Link href="/login">
                  Member Login <LogIn className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </section>
      </div>

      <div className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <section id="about">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                  About Binary Bakery
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                  We are dedicated to guiding the next generation of tech talent towards a successful and fulfilling career.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="Our Team"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-md"
                    data-ai-hint="team collaboration"
                  />
                </div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Building className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-bold">Our Story</h3>
                      <p className="mt-2 text-muted-foreground">
                        Founded in 2023, Binary Bakery was born from a passion for technology and education. We saw a gap between aspiring tech professionals and the complex world of specialized training programs. Our mission is to simplify this journey.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                      <p className="mt-2 text-muted-foreground">
                        To be the most trusted compass for navigating the landscape of tech education. We connect students with world-class programs that equip them with the skills to innovate and lead in the digital economy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-bold">Our Team</h3>
                      <p className="mt-2 text-muted-foreground">
                        Our team is composed of industry veterans, educational experts, and passionate counselors dedicated to student success. We believe in personalized guidance and lifelong learning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </div>
      </div>
      
      <div className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <section id="contact">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Contact Us</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                  Have questions? We'd love to hear from you.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold">Get in Touch</h3>
                    <p className="mt-2 text-muted-foreground">
                      Fill out the form and our team will get back to you within 24 hours.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span>support@binarybakery.dev</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>(123) 456-7890</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span>123 Tech Avenue, Silicon Valley, CA</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Send a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john.doe@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
        </div>
      </div>
    </>
  );
}
