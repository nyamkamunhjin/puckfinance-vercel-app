'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const formSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address',
    }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
});

export default function SignIn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const showRegisteredMessage = searchParams.get('registered') === 'true';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            setError('An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements with fixed position and lower z-index */}
            <div
                className="fixed inset-0 z-0 bg-blockchain-glow overflow-hidden"
                style={{ position: 'fixed' }}
            >
                <div className="absolute inset-0 bg-grid-animate bg-grid-glow opacity-100" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.indigo.500/40%),transparent_50%)]" />

                {/* Pulse points */}
                <div
                    className="pulse-point pulse-point-1"
                    style={{ zIndex: 1 }}
                />
                <div
                    className="pulse-point pulse-point-2"
                    style={{ zIndex: 1 }}
                />
                <div
                    className="pulse-point pulse-point-3"
                    style={{ zIndex: 1 }}
                />

                <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-blockchain-gradient rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-1/4 h-1/4 bg-blockchain-gradient rounded-full blur-3xl opacity-50 animate-pulse-slow" />
            </div>

            {/* Content with higher z-index */}
            <div className="w-full max-w-md space-y-6 relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Sign In
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Access your trading portfolio and strategies
                    </p>
                </div>

                <Card className="bg-background/80 backdrop-blur-sm border-primary/10 shadow-xl relative">
                    <div className="absolute inset-0 bg-blockchain-gradient opacity-5" />

                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl font-semibold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10">
                        {error && (
                            <Alert
                                variant="destructive"
                                className="mb-4 bg-destructive/10 text-destructive border-destructive/20"
                            >
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {showRegisteredMessage && (
                            <Alert className="mb-4 bg-primary/10 text-primary border-primary/20">
                                <AlertDescription>
                                    Account created successfully! Please sign
                                    in.
                                </AlertDescription>
                            </Alert>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
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
                                                    autoComplete="current-password"
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
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-border/30 pt-4 relative z-10">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/auth/signup"
                                className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline z-30 px-1 py-0.5 relative"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
