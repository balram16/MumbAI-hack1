"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sparkles, ArrowRight, Play, Users, Shield, Zap, Globe, Star, TrendingUp, Heart, Rocket, Brain } from "lucide-react";

// Simple hover button component with CSS animations
const AnimatedButton = ({ children, className = "", ...props }: any) => {
  return (
    <div
      className={`transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Simple floating dots with CSS animations
const FloatingDots = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 bg-gradient-to-r from-violet-400/30 to-cyan-400/30 rounded-full animate-float`}
          style={{
            left: `${20 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  );
};

// Simple animated counter with Intersection Observer
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 1500;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.round(start));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-purple-500/10" />
        <FloatingDots />
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-white/20 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center font-black text-white shadow-xl shadow-violet-500/30 transition-all duration-300 hover:scale-110 hover:rotate-12">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
            </div>
            <div className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                SwapSeva
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <ModeToggle />
            <AnimatedButton>
              <Button variant="ghost" className="text-lg font-semibold hover:bg-gradient-to-r hover:from-violet-50 hover:to-cyan-50 dark:hover:from-violet-900/30 dark:hover:to-cyan-900/30 transition-all duration-300 rounded-xl">
              <Link href="/login">Login</Link>
            </Button>
            </AnimatedButton>
            <AnimatedButton>
              <Button className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 hover:from-violet-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold px-8 py-3 rounded-2xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 text-lg group">
                <Link href="/signup" className="flex items-center gap-2 relative z-10">
                  Sign Up <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            </AnimatedButton>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
          <div className="relative mx-auto max-w-7xl px-6 flex flex-col items-center text-center gap-12">
            
            {/* Animated Badge */}
            <div className={`fade-up ${isVisible ? 'animate-in' : ''} inline-flex items-center gap-3 rounded-full border-2 border-violet-300/50 bg-white/80 dark:bg-black/50 px-8 py-4 backdrop-blur-2xl text-lg font-bold shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 group`}>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 animate-pulse group-hover:animate-ping" />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                AI • Blockchain • Trust • Innovation
              </span>
            </div>

            {/* Hero Title */}
            <div className={`fade-up ${isVisible ? 'animate-in' : ''} space-y-4`} style={{ animationDelay: '0.2s' }}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
                <div className="relative inline-block">
                  <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                    Exchange
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-lg blur opacity-20 animate-pulse" />
                </div>
                <div className="relative inline-block mt-2">
                  <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                    Everything
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-lg blur opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </h1>
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-600 dark:text-gray-300 mt-6">
                <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">Skills</span>
                <span className="mx-4 text-violet-500">•</span>
                <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">Services</span>
                <span className="mx-4 text-cyan-500">•</span>
                <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">Stories</span>
              </div>
            </div>

            {/* Description */}
            <div className={`fade-up ${isVisible ? 'animate-in' : ''} max-w-4xl`} style={{ animationDelay: '0.4s' }}>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                SwapSeva uses <span className="font-black text-violet-600 hover:text-violet-700 transition-colors">AI-powered matching</span> to connect you with people who have what you need—and need what you have.
              </p>
              <p className="text-lg md:text-xl mt-4 text-gray-500 dark:text-gray-400">
                <span className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors">Secure</span>, 
                <span className="font-bold text-purple-600 hover:text-purple-700 transition-colors"> reputation-driven</span>, and 
                <span className="font-bold text-pink-600 hover:text-pink-700 transition-colors"> delightfully fast</span>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`fade-up ${isVisible ? 'animate-in' : ''} flex flex-col sm:flex-row gap-6 mt-8`} style={{ animationDelay: '0.6s' }}>
              <AnimatedButton>
                <Button size="lg" className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-black px-12 py-6 rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 text-xl group">
                  <Link href="/signup" className="flex items-center gap-3 relative z-10">
                    <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                    Start Your Journey
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </AnimatedButton>
              
              <AnimatedButton>
                <Button variant="outline" size="lg" className="border-2 border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20 font-bold px-12 py-6 rounded-2xl text-xl backdrop-blur-xl hover:border-cyan-400 transition-all duration-300 group">
                  <Link href="/dashboard" className="flex items-center gap-3 text-cyan-700 dark:text-cyan-300">
                    <Globe className="w-6 h-6 group-hover:animate-spin" />
                    Explore Platform
                  </Link>
                </Button>
              </AnimatedButton>
            </div>

            {/* Modern Stats Grid */}
            <div className={`fade-up ${isVisible ? 'animate-in' : ''} grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 w-full max-w-6xl`} style={{ animationDelay: '0.8s' }}>
              {[
                { icon: Users, value: 5000, suffix: "+", label: "Active Users", color: "from-violet-500 to-purple-600" },
                { icon: Globe, value: 1200, suffix: "+", label: "Cities", color: "from-cyan-500 to-blue-600" },
                { icon: Shield, value: 97, suffix: "%", label: "Trust Score", color: "from-emerald-500 to-green-600" },
                { icon: Heart, value: 24, suffix: "/7", label: "Community Support", color: "from-pink-500 to-rose-600" }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="group relative"
                  style={{ animationDelay: `${1 + i * 0.1}s` }}
                >
                  <div className="relative glass rounded-3xl p-8 text-center hover:scale-105 transition-all duration-500 hover:shadow-2xl group">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }} />
                    
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <stat.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className="text-4xl font-black mb-2">
                      <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </span>
                    </div>
                    
                    <p className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 font-bold group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elegant Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gradient-to-b from-violet-400 to-cyan-400 rounded-full flex justify-center glass">
              <div className="w-1 h-3 bg-gradient-to-b from-violet-400 to-cyan-400 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Revolutionary Features Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-cyan-50/30 dark:from-black dark:via-violet-950/20 dark:to-cyan-950/20" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            {/* Section Header */}
            <div className="fade-up text-center mb-20">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                  Revolutionary
                </span>
                <span className="block text-gray-900 dark:text-gray-100 mt-2">Features</span>
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto font-medium leading-relaxed">
                Experience the future of <span className="font-black text-violet-600">skill exchange</span> with cutting-edge technology
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: "AI Smart Matching", 
                  desc: "Revolutionary AI algorithms analyze your skills, preferences, and goals to find perfect matches instantly.", 
                  icon: Brain,
                  color: "from-violet-500 to-purple-600"
                },
                { 
                  title: "Real-Time Chat", 
                  desc: "Lightning-fast messaging with typing indicators, media sharing, and instant notifications.", 
                  icon: Zap,
                  color: "from-cyan-500 to-blue-600"
                },
                { 
                  title: "Trust & Security", 
                  desc: "Blockchain-powered reputation system with transparent history and weighted trust signals.", 
                  icon: Shield,
                  color: "from-emerald-500 to-green-600"
                },
                { 
                  title: "Video Calls", 
                  desc: "Built-in HD video calling with screen sharing to align expectations before swapping.", 
                  icon: Play,
                  color: "from-orange-500 to-red-600"
                },
                { 
                  title: "Global Discovery", 
                  desc: "Find partners worldwide or in your neighborhood with precision location-based filters.", 
                  icon: Globe,
                  color: "from-pink-500 to-rose-600"
                },
                { 
                  title: "Token Rewards", 
                  desc: "Earn SwapSeva tokens for successful exchanges and build your reputation on the blockchain.", 
                  icon: Star,
                  color: "from-amber-500 to-yellow-600"
                },
              ].map((feature, i) => (
                <div key={feature.title} className="fade-up group relative" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="relative h-full p-8 rounded-3xl border-2 border-white/20 dark:border-white/10 glass backdrop-blur-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-black tracking-tight mb-4 text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="fade-up text-center mb-20">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
                <span className="text-gray-900 dark:text-gray-100">How It</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">Works</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Create Profile",
                  desc: "Set up your profile with skills you offer and services you need",
                  icon: Users
                },
                {
                  step: "02", 
                  title: "AI Matching",
                  desc: "Our AI finds perfect matches based on compatibility and location",
                  icon: Brain
                },
                {
                  step: "03",
                  title: "Start Swapping",
                  desc: "Connect, chat, video call, and exchange skills safely",
                  icon: Rocket
                }
              ].map((step, i) => (
                <div key={i} className="fade-up text-center relative" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-500 group">
                    <step.icon className="w-12 h-12 group-hover:animate-pulse" />
                  </div>
                  <div className="text-6xl font-black text-violet-200 dark:text-violet-900 mb-4 animate-pulse">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </div>
            ))}
            </div>
          </div>
        </section>

        {/* Stunning CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 animate-gradient-xy" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <div className="fade-up">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-2xl flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-8 leading-none">
                Ready to Start
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent animate-gradient-x">
                  Swapping?
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto mb-12 font-medium leading-relaxed">
                Join thousands of users who are already exchanging skills, building relationships, and growing together on SwapSeva.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <AnimatedButton>
                  <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100 font-black px-12 py-6 rounded-2xl shadow-2xl text-xl group">
                    <Link href="/signup" className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                      Create Account
                      <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
                </AnimatedButton>
                
                <AnimatedButton>
                  <Button variant="outline" size="lg" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold px-12 py-6 rounded-2xl text-xl backdrop-blur-xl group">
                    <Link href="/login" className="flex items-center gap-3">
                      <Play className="w-6 h-6 group-hover:animate-pulse" />
                      Sign In
                    </Link>
                </Button>
                </AnimatedButton>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${4 + i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="relative border-t border-white/10 glass backdrop-blur-2xl py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo */}
            <div className="md:col-span-2 fade-up">
              <div className="flex items-center gap-4 mb-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                  SwapSeva
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md">
                The future of skill exchange. Connect, learn, and grow with people worldwide through our AI-powered platform.
              </p>
            </div>

            {/* Links */}
            <div className="fade-up" style={{ animationDelay: '0.1s' }}>
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Platform</h4>
              <div className="space-y-3">
                {["How it Works", "Features", "Pricing", "Security"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 hover:translate-x-2"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="fade-up" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Company</h4>
              <div className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-2"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 fade-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} SwapSeva. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
