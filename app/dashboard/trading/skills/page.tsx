"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Filter, Search, MessageSquare } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// User skill offer type
interface SkillOffer {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userLocation: string
  userTrustScore: number
  skillName: string
  skillCategory: string
  experience: string
  description: string
  completedTrades: number
}

export default function SkillsBarterPage() {
  const [skills, setSkills] = useState<SkillOffer[]>([])
  const [filteredSkills, setFilteredSkills] = useState<SkillOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  // Trade request state
  const [selectedSkill, setSelectedSkill] = useState<SkillOffer | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  // Add Skill dialog state
  const [addSkillOpen, setAddSkillOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({
    skillName: "",
    skillCategory: "",
    experience: "",
    description: ""
  })
  
  // Fetch skills data from backend database
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true)
        
        // Get user data from local storage
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("authToken")
        
        if (!storedUser || !token) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the skills marketplace",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }
        
        // Get all users with skill offerings from their profile
        const response = await fetch("http://localhost:3001/api/users?hasSkillOfferings=true", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch skills data")
        }
        
        const data = await response.json()
        
        // Transform user offerings data into expected SkillOffer format
        const skillOffers: SkillOffer[] = []
        
        data.users.forEach(user => {
          const skillOfferings = user.offerings.filter(offering => offering.type === 'skill')
          
          skillOfferings.forEach(offering => {
            skillOffers.push({
              id: offering._id || `skill-${Math.random().toString(36).substr(2, 9)}`,
              userId: user._id,
              userName: user.name,
              userAvatar: user.avatar || "/placeholder-user.jpg",
              userLocation: user.location?.address || "Location not specified",
              userTrustScore: user.trustScore || 80,
              skillName: offering.title,
              skillCategory: offering.category || "Other",
              experience: offering.experience || "Not specified",
              description: offering.description || "No description provided",
              completedTrades: user.completedTrades || 0
            })
          })
        })
        
        setSkills(skillOffers)
        setFilteredSkills(skillOffers)
      } catch (error) {
        console.error("Error fetching skills:", error)
        toast({
          title: "Error loading skills",
          description: "We couldn't load the skills marketplace. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSkills()
  }, [])
  
  // Filter skills based on search query and category
  useEffect(() => {
    let result = skills
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        skill => 
          skill.skillName.toLowerCase().includes(query) ||
          skill.userName.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.userLocation.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(skill => skill.skillCategory === selectedCategory)
    }
    
    setFilteredSkills(result)
  }, [searchQuery, selectedCategory, skills])
  
  // Function to handle connecting with a skill provider
  const handleConnect = (skill: SkillOffer) => {
    setSelectedSkill(skill)
    setDialogOpen(true)
  }
  
  // Function to send a trade request
  const sendTradeRequest = async () => {
    console.log("sendTradeRequest called", selectedSkill)
    if (!selectedSkill) {
      console.log("No skill selected")
      return
    }
    
    try {
      const token = localStorage.getItem("authToken")
      console.log("Token:", token ? "Found" : "Not found")
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to send connection requests",
          variant: "destructive"
        })
        return
      }
      
      console.log("Sending request to:", `http://localhost:3001/api/users/connect`)
      console.log("Request data:", {
        recipientId: selectedSkill.userId,
        skillId: selectedSkill.id
      })
      
      // Send connection request with all user skills
      const response = await fetch("http://localhost:3001/api/users/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedSkill.userId,
          skillId: selectedSkill.id
        })
      })
      
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        const data = await response.json()
        console.error("Error response:", data)
        throw new Error(data.message || "Failed to send request")
      }
      
      const data = await response.json()
      console.log("Success response:", data)
      
      toast({
        title: "Trade Request Sent!",
        description: `Your request was sent to ${selectedSkill.userName} for ${selectedSkill.skillName}. You'll be notified when they respond.`,
      })
      
      // Close the dialog
      setDialogOpen(false)
      setSelectedSkill(null)
    } catch (error) {
      console.error("Send connection request error:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to send the request. Please try again later.",
        variant: "destructive",
      })
    }
  }
  
  // Get unique categories for filter
  const categories = ["all", ...new Set(skills.map(skill => skill.skillCategory))]
  
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent drop-shadow">Skills Barter</h1>
            <p className="text-muted-foreground">Find and connect with skilled individuals for your needs, or list your own skills below.</p>
          </div>
          <Button onClick={() => setAddSkillOpen(true)} size="lg" className="shadow-md shadow-violet-500/20 hover:shadow-violet-500/40 transition-shadow">
            + Add Skill
          </Button>
        </div>
        {/* Add Skill Dialog */}
        <Dialog open={addSkillOpen} onOpenChange={setAddSkillOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Skill</DialogTitle>
              <DialogDescription>Share your skill with the community. More details = more matches!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Skill Name (e.g. Graphic Design)"
                value={newSkill.skillName}
                onChange={e => setNewSkill(s => ({ ...s, skillName: e.target.value }))}
              />
              <Input
                placeholder="Category (e.g. Design, Tech, Music)"
                value={newSkill.skillCategory}
                onChange={e => setNewSkill(s => ({ ...s, skillCategory: e.target.value }))}
              />
              <Input
                placeholder="Experience (e.g. 3 years, Beginner, Expert)"
                value={newSkill.experience}
                onChange={e => setNewSkill(s => ({ ...s, experience: e.target.value }))}
              />
              <Textarea
                placeholder="Description (what can you offer, what makes you great?)"
                value={newSkill.description}
                onChange={e => setNewSkill(s => ({ ...s, description: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddSkillOpen(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  const token = localStorage.getItem("authToken");
                  if (!token) {
                    toast({
                      title: "Authentication required",
                      description: "Please log in to add a skill.",
                      variant: "destructive"
                    });
                    return;
                  }
                  try {
                    const response = await fetch("http://localhost:3001/api/users/offerings", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        title: newSkill.skillName,
                        category: newSkill.skillCategory,
                        experience: newSkill.experience,
                        description: newSkill.description,
                        type: "skill"
                      })
                    });
                    if (!response.ok) {
                      const data = await response.json();
                      throw new Error(data.message || "Failed to add skill");
                    }
                    // Refresh skills from backend
                    setAddSkillOpen(false);
                    setNewSkill({ skillName: "", skillCategory: "", experience: "", description: "" });
                    toast({ title: "Skill Added!", description: "Your skill is now visible to others." });
                    // Optionally, re-fetch skills list here:
                    if (typeof window !== "undefined") {
                      window.location.reload();
                    }
                  } catch (error) {
                    toast({
                      title: "Error adding skill",
                      description: error instanceof Error ? error.message : "Failed to add skill.",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={!newSkill.skillName || !newSkill.skillCategory}
              >
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Search and filter */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills, names, or locations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Skills grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-2xl shadow-xl bg-white/80 dark:bg-background/80 backdrop-blur-lg border border-white/30 animate-pulse">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-1/2 rounded" />
                      <Skeleton className="h-4 w-1/3 rounded" />
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-2/3 rounded" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-10 w-full rounded" />
                        <Skeleton className="h-10 w-full rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Star className="h-10 w-10 text-accent mb-4 animate-bounce" />
            <p className="text-2xl font-bold text-muted-foreground mb-2">No skills found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters, or be the first to add a skill!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill, i) => (
              <Card key={skill.id} className="rounded-2xl shadow-xl bg-white/80 dark:bg-background/80 backdrop-blur-lg border border-white/30 hover:scale-[1.03] transition-transform group overflow-hidden relative">
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="outline" className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-bold px-3 py-1 text-xs shadow">{skill.skillCategory}</Badge>
                </div>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={skill.userAvatar}
                      alt={skill.userName}
                      width={80}
                      height={80}
                      className="rounded-xl border-2 border-primary/30 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-lg text-primary drop-shadow-brutal">{skill.userName}</span>
                        <Badge variant="outline" className="gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{skill.userTrustScore}/100</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{skill.userLocation}</span>
                      </div>
                      <p className="text-primary font-semibold text-base mb-1">{skill.skillName} <span className="text-muted-foreground font-normal">({skill.experience})</span></p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{skill.description}</p>
                      <p className="text-xs text-muted-foreground mt-1"><span className="font-medium">Completed Trades:</span> {skill.completedTrades}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="w-full gap-1 font-bold bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-colors" onClick={() => handleConnect(skill)}>
                      <MessageSquare className="h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Trade Request Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Trade Request</DialogTitle>
              <DialogDescription>
                Connect with {selectedSkill?.userName} for {selectedSkill?.skillName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedSkill && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Image
                    src={selectedSkill.userAvatar}
                    alt={selectedSkill.userName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{selectedSkill.userName}</p>
                    <p className="text-sm text-muted-foreground">{selectedSkill.skillName}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Hi! I'm interested in your skill. Let's discuss how we can help each other..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>This will send a notification to {selectedSkill.userName} and create a chat where you can discuss the trade details.</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendTradeRequest} className="bg-gradient-to-r from-primary to-accent">
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 