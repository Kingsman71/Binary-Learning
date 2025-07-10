import { Users, Target, Building } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          About Binary Bakery Navigator
        </h1>
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
            className="rounded-lg"
            data-ai-hint="team collaboration"
          />
        </div>
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <Building className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-2xl font-bold">Our Story</h2>
                    <p className="mt-2 text-muted-foreground">
                        Founded in 2023, Binary Bakery Navigator was born from a passion for technology and education. We saw a gap between aspiring tech professionals and the complex world of specialized training programs. Our mission is to simplify this journey.
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                    <p className="mt-2 text-muted-foreground">
                        To be the most trusted compass for navigating the landscape of tech education. We connect students with world-class programs that equip them with the skills to innovate and lead in the digital economy.
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-2xl font-bold">Our Team</h2>
                    <p className="mt-2 text-muted-foreground">
                        Our team is composed of industry veterans, educational experts, and passionate counselors dedicated to student success. We believe in personalized guidance and lifelong learning.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
