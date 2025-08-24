import { type NextRequest, NextResponse } from "next/server"

interface AdminLoginRequest {
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AdminLoginRequest = await request.json()
    const { password } = body

    console.log("[v0] Admin login attempt")
    console.log("[v0] Password provided:", password ? "***provided***" : "empty")

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASS
    console.log("[v0] Admin password configured:", adminPassword ? "***configured***" : "NOT CONFIGURED")

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password not configured" }, { status: 500 })
    }

    console.log("[v0] Password match:", password === adminPassword)

    if (password === adminPassword) {
      console.log("[v0] Login successful, setting cookie")
      const response = NextResponse.json({ success: true })

      // Set secure httpOnly cookie
      response.cookies.set("admin", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    } else {
      console.log("[v0] Login failed - invalid password")
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
