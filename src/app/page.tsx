import Image from 'next/image';
import Link from 'next/link';
import { AuthForms } from '@/components/auth-forms';
import { Icons } from '@/components/icons';

export default function AuthenticationPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-12">
        <Image
          src="https://placehold.co/1000x800"
          alt="Abstract illustration representing a digital arena"
          width="1000"
          height="800"
          className="h-auto w-full max-w-2xl rounded-lg object-cover shadow-2xl"
          data-ai-hint="coding abstract"
        />
        <div className="mt-8 text-center max-w-2xl">
          <h2 className="font-headline text-3xl font-bold text-foreground">
            Welcome to the Arena
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sharpen your skills, compete with the best, and rise to the challenge. Your coding journey starts here.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-0">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="flex justify-center items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline tracking-tighter">
                Synapse Arena
              </span>
            </Link>
            <p className="text-balance text-muted-foreground">
              Login or create an account to enter the arena
            </p>
          </div>
          <AuthForms />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
