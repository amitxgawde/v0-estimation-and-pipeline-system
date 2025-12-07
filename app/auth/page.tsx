"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from "next/navigation"

export default function AuthPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      })
      if (!res.ok) {
        throw new Error("Invalid credentials")
      }
      const redirectTo = params.get("from") || "/"
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Enter Passcode</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Password</Label>
              <Input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

