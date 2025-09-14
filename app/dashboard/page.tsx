
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Handshake, TrendingUp, Clock, Shield, Sparkles, Star, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen py-10 px-2 md:px-0">
      {/* Animated background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-[hsl(var(--gradient-from)/0.22)] to-[hsl(var(--gradient-to)/0.18)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-[hsl(var(--gradient-to)/0.18)] to-[hsl(var(--gradient-from)/0.13)] blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Welcome header */}
        <div className="flex flex-col gap-2 items-start md:items-center text-left md:text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold font-brutal bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent drop-shadow-brutal">Welcome back</h1>
            <Badge variant="outline" className="ml-2 gap-1 px-3 py-1 text-base font-semibold border-2 border-primary/60 bg-white/60 dark:bg-background/60 backdrop-blur">
              <Shield className="h-4 w-4 mr-1 text-primary" />
              Verified
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">Your personalized barter dashboard</p>
        </div>

        {/* Animated widgets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Trust Score",
              value: "85/100",
              icon: <Award className="h-5 w-5 text-yellow-400" />, 
              desc: "+10 points this month",
              bar: 85,
              color: "bg-gradient-to-r from-yellow-400 to-yellow-500"
            },
            {
              title: "Active Trades",
              value: "4",
              icon: <Handshake className="h-5 w-5 text-sky-400" />, 
              desc: "2 pending confirmation",
              bar: 40,
              color: "bg-gradient-to-r from-sky-400 to-sky-500"
            },
            {
              title: "Completed Trades",
              value: "15",
              icon: <TrendingUp className="h-5 w-5 text-green-400" />, 
              desc: "+3 this month",
              bar: 100,
              color: "bg-gradient-to-r from-green-400 to-green-500"
            },
            {
              title: "Unread Messages",
              value: "7",
              icon: <MessageSquare className="h-5 w-5 text-pink-400" />, 
              desc: "From 3 different users",
              bar: 70,
              color: "bg-gradient-to-r from-pink-400 to-pink-500"
            }
          ].map((w, i) => (
            <div key={w.title} className="rounded-2xl shadow-xl hover:scale-[1.04] transition-all duration-300 bg-white/80 dark:bg-background/80 backdrop-blur-lg border border-white/30 p-6 flex flex-col gap-2 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-primary drop-shadow-brutal flex items-center gap-2">{w.icon}{w.title}</span>
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              </div>
              <div className="text-3xl font-extrabold font-brutal text-outline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{w.value}</div>
              <p className="text-xs text-muted-foreground mb-2">{w.desc}</p>
              <div className="h-2 w-full rounded-full bg-muted/60">
                <div className={`h-2 rounded-full ${w.color}`} style={{ width: `${w.bar}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Skill Listing Entry Point */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-gradient-to-r from-[hsl(var(--gradient-from)/0.13)] to-[hsl(var(--gradient-to)/0.13)] rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '500ms' }}>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-brutal mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Showcase Your Skills</h2>
            <p className="text-muted-foreground max-w-lg text-lg">Add your skills to be discovered by others and start exchanging value instantly.</p>
          </div>
          <Button asChild size="lg" className="px-10 py-4 text-lg font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow rounded-xl bg-gradient-to-r from-primary to-accent text-white">
            <Link href="/dashboard/trading/skills?add=1">List a Skill</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

