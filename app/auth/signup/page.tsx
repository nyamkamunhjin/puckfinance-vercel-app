"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    setIsLoading(true);

    try {
      await signUp(values.email, values.password);
      router.push("/auth/signin?registered=true");
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 -z-10 bg-blockchain-glow overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[center_top_-1px] dark:bg-grid-slate-400/[0.05] bg-data-lines" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.indigo.500/20%),transparent_40%)]" />
        
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-blockchain-gradient rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-blockchain-gradient rounded-full blur-3xl opacity-20 animate-pulse-slow" />
      </div>
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Create Account
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start your crypto trading journey with us
          </p>
        </div>
        
        <Card className="bg-background/80 backdrop-blur-sm border-primary/10 shadow-xl">
          <div className="absolute inset-0 -z-10 bg-blockchain-gradient opacity-5" />
          <div className="absolute inset-0 -z-10 bg-nodes opacity-5" />
          
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">Join PuckFinance</CardTitle>
            <CardDescription className="text-center">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-destructive/10 text-destructive border-destructive/20">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          className="relative z-10 bg-background/90" 
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          className="relative z-10 bg-background/90" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          className="relative z-10 bg-background/90" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  variant="black"
                  className="w-full relative z-30" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-border/30 pt-4 relative z-10">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline z-30 px-1 py-0.5 relative">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 