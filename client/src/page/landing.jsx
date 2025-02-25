import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Brain,
    Sparkles,
    Clock,
    GraduationCap,
    Menu,
    X,
    Github,
    Twitter,
    Linkedin,
} from "lucide-react";
import { setLoading } from "../redux/loading";
import { useDispatch } from "react-redux";

export default function LandingPage() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, []);

    const scrollToSection = (sectionId) => {
        setIsMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Height of sticky header plus some padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Brain className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Genify</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => scrollToSection("features")}
                            className="text-sm font-medium hover:text-primary"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection("testimonials")}
                            className="text-sm font-medium hover:text-primary"
                        >
                            Testimonials
                        </button>
                        <button
                            onClick={() => scrollToSection("pricing")}
                            className="text-sm font-medium hover:text-primary"
                        >
                            Pricing
                        </button>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={(() => navigate("/login"))} >
                                Log in
                            </Button>
                            <Button size="sm" onClick={() => navigate("/login")}>
                                Start Free Trial
                            </Button>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-b border-border">
                        <nav className="container py-4 flex flex-col space-y-2">
                            <button
                                onClick={() => scrollToSection("features")}
                                className="text-sm font-medium hover:text-primary text-left px-2 py-1.5 rounded-md hover:bg-accent"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection("testimonials")}
                                className="text-sm font-medium hover:text-primary text-left px-2 py-1.5 rounded-md hover:bg-accent"
                            >
                                Testimonials
                            </button>
                            <button
                                onClick={() => scrollToSection("pricing")}
                                className="text-sm font-medium hover:text-primary text-left px-2 py-1.5 rounded-md hover:bg-accent"
                            >
                                Pricing
                            </button>
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={() => navigate("/login")}
                            >
                                Start Free Trial
                            </Button>
                        </nav>
                    </div>
                )}
            </div>

            <div>
                {/* Hero Section */}
                <div className="container px-4 py-16 md:py-24 lg:py-32">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="space-y-4 max-w-[800px]">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                Make Your AI Writing Sound{" "}
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Human Again
                                </span>
                            </h1>
                            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg sm:text-xl">
                                Bypass Turnitin AI detection with a 100% success rate. <br />
                                Trusted by university students across the UK.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" onClick={() => navigate("/login")}>
                                Start 7-Day Free Trial
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => scrollToSection("features")}>
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="container px-4 py-16 md:py-24">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Why UK Students Love Genify
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Powerful features to help you write better academic content
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-lg border border-border bg-card">
                            <Sparkles className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-bold">The first in the world</h3>
                            <p className="text-muted-foreground">
                                Our AI is the only tool that bypasses Turnitin AI detection. Perfect for university students.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-lg border border-border bg-card">
                            <Clock className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-bold">Advanced AI Humanization</h3>
                            <p className="text-muted-foreground">
                                Our AI analyzes and transforms your text to match natural human writing patterns and styles.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-lg border border-border bg-card">
                            <GraduationCap className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-bold">Academic Focus</h3>
                            <p className="text-muted-foreground">
                                Specifically designed for academic writing, maintaining scholarly tone and structure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div id="testimonials" className="container px-4 py-16 md:py-24 bg-muted">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Students Say</h2>
                        <p className="text-muted-foreground text-lg">Join thousands of satisfied students using Genify</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-6 rounded-lg bg-card">
                            <p className="text-muted-foreground mb-4">
                                "Genify has been a game-changer for my essays. The humanized text flows naturally and my professors
                                never suspect it's AI-assisted."
                            </p>
                            <div className="font-semibold">Sarah K.</div>
                            <div className="text-sm text-muted-foreground">History Student</div>
                        </div>
                        <div className="p-6 rounded-lg bg-card">
                            <p className="text-muted-foreground mb-4">
                                "78% on my 2000 word essay with 25 minutes spent, while others spend 8+ hours and to get the same grade."
                            </p>
                            <div className="font-semibold">Michael R.</div>
                            <div className="text-sm text-muted-foreground">Business Studies Student</div>
                        </div>
                        <div className="p-6 rounded-lg bg-card">
                            <p className="text-muted-foreground mb-4">
                                "The free trial convinced me immediately. Now I use Genify for all my assignments."
                            </p>
                            <div className="font-semibold">Emma T.</div>
                            <div className="text-sm text-muted-foreground">Psychology Student</div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div id="pricing" className="container px-4 py-16 md:py-24">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Simple, Student-Friendly Pricing
                        </h2>
                        <p className="text-muted-foreground text-lg">Start with a 7-day free trial, no card required</p>
                    </div>
                    <div className="max-w-sm mx-auto">
                        <div className="rounded-lg border border-border bg-card p-8 text-center">
                            <h3 className="text-2xl font-bold">Student Plan</h3>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-4xl font-bold">£19</span>
                                <span className="text-muted-foreground ml-1">/month</span>
                            </div>
                            <ul className="mt-8 space-y-4 text-left">
                                <li className="flex items-center">
                                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                                    Works for all UK universities
                                </li>
                                <li className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-primary" />
                                    Bypass Turnitin with 100% success rate
                                </li>
                                <li className="flex items-center">
                                    <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                                    Unlimited essays
                                </li>
                            </ul>
                            <Button className="w-full mt-8" size="lg" onClick={() => navigate("/login")}>
                                Start 7-Day Free Trial
                            </Button>
                            <p className="mt-4 text-sm text-muted-foreground">No credit card required</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="container px-4 py-16 md:py-24 bg-muted">
                    <div className="max-w-2xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Transform Your Writing?</h2>
                        <p className="text-muted-foreground text-lg">
                            Join thousands of students who are already using Genify to improve their academic writing.
                        </p>
                        <Button size="lg" onClick={() => navigate("/login")}>
                            Join 7,000+ Students Today
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border">
                <div className="container px-4 py-8 md:py-12">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-4">
                            <Link to="/" className="flex items-center space-x-2">
                                <Brain className="h-6 w-6 text-primary" />
                                <span className="text-xl font-bold">Genify</span>
                            </Link>
                            <p className="text-sm text-muted-foreground">Making AI writing sound human again.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="#features" className="text-sm text-muted-foreground hover:text-primary">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#pricing" className="text-sm text-muted-foreground hover:text-primary">
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                                        Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Genify. All rights reserved.</p>
                        <div className="flex space-x-4">
                            <Link to="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link to="#" className="text-muted-foreground hover:text-primary">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link to="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}