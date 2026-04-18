'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { AuthNav } from '@/components/auth-nav';
import { cn } from '@/lib/utils';

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
        },
    },
};

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden" role="main">
                <div
                    aria-hidden="true"
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
                >
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section aria-labelledby="hero-heading">
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3000&auto=format&fit=crop"
                                alt="Cryptocurrency trading dashboard with charts and market data"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block object-cover"
                                width={3276}
                                height={4095}
                                priority
                            />
                        </AnimatedGroup>
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
                        />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <h1
                                        id="hero-heading"
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold"
                                    >
                                        Trading on{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
                                            Autopilot.
                                        </span>
                                    </h1>
                                    <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                        Automate your crypto strategies. Monitor
                                        performance in real-time. Stop staring
                                        at charts.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-xl px-8 py-6 text-base"
                                    >
                                        <Link href="/dashboard">
                                            <span className="text-nowrap">
                                                Launch App
                                            </span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                        >
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden="true"
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=3000&auto=format&fit=crop"
                                        alt="PuckFinance trading dashboard showing cryptocurrency charts, portfolio balances, and trading interface"
                                        width={2700}
                                        height={1440}
                                        priority
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=3000&auto=format&fit=crop"
                                        alt="PuckFinance trading dashboard showing cryptocurrency charts, portfolio balances, and trading interface in light mode"
                                        width={2700}
                                        height={1440}
                                        priority
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    );
}

interface NavItem {
    label: string;
    href: string;
    requiresAuth: boolean;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
    { label: 'AI Analysis', href: '/dashboard/analysis', requiresAuth: true },
    {
        label: 'Analysis History',
        href: '/dashboard/analysis-history',
        requiresAuth: true,
    },
    { label: 'Trade Accounts', href: '/trade-accounts', requiresAuth: true },
];

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAuthenticated = !!session;

    // Filter nav items based on authentication status
    const visibleNavItems = navItems.filter(
        (item) => !item.requiresAuth || isAuthenticated,
    );

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        document.body.style.overflow = menuState ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuState]);
    return (
        <header role="banner">
            <nav
                aria-label="Main navigation"
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group"
            >
                <div
                    className={cn(
                        'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
                        isScrolled &&
                            'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5',
                    )}
                >
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="PuckFinance homepage"
                                className="flex items-center space-x-2"
                            >
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-expanded={menuState}
                                aria-controls="mobile-menu"
                                aria-label={
                                    menuState == true
                                        ? 'Close navigation menu'
                                        : 'Open navigation menu'
                                }
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                            >
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        {visibleNavItems.length > 0 && (
                            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                                <ul
                                    className="flex gap-8 text-sm"
                                    role="menubar"
                                >
                                    {visibleNavItems.map(
                                        (item: NavItem, index: number) => {
                                            const isActive =
                                                pathname === item.href ||
                                                pathname?.startsWith(
                                                    `${item.href}/`,
                                                );

                                            return (
                                                <li key={index} role="none">
                                                    <Link
                                                        href={item.href}
                                                        role="menuitem"
                                                        className={`text-sm transition-colors hover:text-primary ${
                                                            isActive
                                                                ? 'text-foreground'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        },
                                    )}
                                </ul>
                            </div>
                        )}

                        <div
                            id="mobile-menu"
                            className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
                        >
                            {visibleNavItems.length > 0 && (
                                <div className="lg:hidden">
                                    <ul
                                        className="space-y-6 text-base"
                                        role="menu"
                                    >
                                        {visibleNavItems.map(
                                            (item: NavItem, index: number) => {
                                                const isActive =
                                                    pathname === item.href ||
                                                    pathname?.startsWith(
                                                        `${item.href}/`,
                                                    );

                                                return (
                                                    <li key={index} role="none">
                                                        <Link
                                                            href={item.href}
                                                            role="menuitem"
                                                            className={`text-sm font-medium transition-colors hover:text-primary block ${
                                                                isActive
                                                                    ? 'bg-accent text-foreground'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                            onClick={() =>
                                                                setMenuState(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ul>
                                </div>
                            )}
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <AuthNav />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

const Logo = ({ className }: { className?: string }) => {
    return (
        <span
            aria-label="PuckFinance"
            className={cn(
                'font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent',
                className,
            )}
        >
            PuckFinance
        </span>
    );
};
