import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage({ params }: { params: { ref: string } }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-lg mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="pt-4 text-2xl">Application Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for applying. We have received your application and will be in touch shortly.
            </p>
            <div>
              <p className="text-sm text-muted-foreground">Your reference number is:</p>
              <p className="font-mono text-lg font-semibold bg-muted py-2 px-4 rounded-md inline-block">
                {params.ref}
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
