import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { SignOutButton } from "@/components/sign-out-button";

export default function DashboardPage() {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-8 text-center bg-card rounded-lg shadow-lg">
        <h1 className="text-3xl font-headline font-bold text-foreground">Welcome to the Dashboard</h1>
        <p className="mt-2 text-muted-foreground">You have successfully logged in.</p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
