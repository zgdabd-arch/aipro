import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, Bot, BarChart, UserPlus, Mail, Shield } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const feature1Image = PlaceHolderImages.find(p => p.id === 'feature1');
  const feature2Image = PlaceHolderImages.find(p => p.id === 'feature2');
  const feature3Image = PlaceHolderImages.find(p => p.id === 'feature3');

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: 'Personalized Study Plan',
      description: 'AI-generated learning plans tailored to your curriculum and goals.',
      image: feature1Image,
      hint: 'student studying'
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: 'AI Professor',
      description: 'Get instant, personalized guidance from a professor that knows your study plan.',
      image: feature2Image,
      hint: 'robot tutor'
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Progress Tracking',
      description: 'Visualize your learning journey with intuitive progress reports.',
      image: feature3Image,
      hint: 'data chart'
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl font-headline">
                Unlock Your Potential with AI-Powered Learning
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                ProAi creates personalized study plans and provides instant tutoring to help you master any subject. Your journey to academic excellence starts here.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="overflow-hidden rounded-lg shadow-2xl"
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </div>
        </section>

        <section id="features" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Features</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Discover how ProAi's intelligent features create a learning experience just for you.
              </p>
            </div>
            <div className="mx-auto mt-12 grid justify-center gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col overflow-hidden">
                  {feature.image && 
                    <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      width={400}
                      height={250}
                      className="w-full"
                      data-ai-hint={feature.hint}
                    />
                  }
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <CardTitle className="text-2xl font-headline">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="cta" className="container py-12 text-center md:py-24">
           <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
             Ready to Elevate Your Learning?
           </h2>
           <p className="mx-auto my-4 max-w-2xl text-lg text-muted-foreground">
             Join ProAi today and take the first step towards a smarter, more personalized education.
           </p>
           <Button asChild size="lg">
             <Link href="/signup">Sign Up Now</Link>
           </Button>
         </section>

      </main>

      <footer className="border-t py-6 md:px-8 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ProAi. &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/privacy-choices" className="hover:text-primary">Your Privacy Choices</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/accessibility" className="hover:text-primary">Accessibility</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/corporate-policies" className="hover:text-primary">Corporate Policies</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/product-security" className="hover:text-primary">Product Security</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
