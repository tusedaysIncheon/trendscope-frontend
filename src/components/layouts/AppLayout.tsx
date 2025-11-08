import { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from "sonner"

import IndexPage from "@/pages/index/IndexPage"
import LoginPage from "@/pages/auth/LoginPage"
import SignUpPage from "@/pages/auth/SignUpPage"
import CookiePage from "@/pages/cookie/CookiePage"
import NicknamePage from "@/pages/auth/NicknamePage"
import LayoutGuidePage from "@/pages/examples/LayoutGuidePage"
import { UserHeader } from "@/components/layouts/headers/UserHeader"
import { GuestHeader } from "@/components/layouts/headers/GuestHeader"
import { NavbarGuest } from "@/components/layouts/navbars/NavBarGuest"
import { NavbarUser } from "@/components/layouts/navbars/navbaruser/NavBarUser"
import { useAuthStore } from "@/store/useAuthStore"

export default function AppLayout() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : true
  )

  useEffect(() => {
    const handleResize = () => setIsMobileViewport(window.innerWidth < 640)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const guestPaths = ["/", "/login", "/signup", "/cookie", "/nickname", "/dev/layout-guide"]
  const isGuestPage = guestPaths.includes(location.pathname)
  const HEADER_HEIGHT = 60
  const GUEST_NAV_HEIGHT = isMobileViewport ? 64 : 0
  const USER_NAV_HEIGHT = isMobileViewport ? 64 : 0
  const navOffset = isAuthenticated ? USER_NAV_HEIGHT : isGuestPage ? GUEST_NAV_HEIGHT : 0
  const contentHeight = `calc(100svh - ${HEADER_HEIGHT + navOffset}px)`

  return (
    <>
      {isAuthenticated ? <UserHeader /> : <GuestHeader />}
      {isAuthenticated ? <NavbarUser /> : isGuestPage && <NavbarGuest />}

      <main
        className="flex flex-1 flex-col bg-background text-foreground transition-all duration-300"
        style={{
          paddingTop: `${HEADER_HEIGHT}px`,
          paddingBottom: `${navOffset}px`,
          minHeight: contentHeight,
        }}
      >
        <div className="flex flex-1 flex-col min-h-0">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/cookie" element={<CookiePage />} />
            <Route path="/nickname" element={<NicknamePage />} />
            <Route path="/dev/layout-guide" element={<LayoutGuidePage />} />
          </Routes>
        </div>
      </main>

      <Toaster richColors position="top-center" />
    </>
  )
}
