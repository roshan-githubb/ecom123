"use client"

import { useState, useEffect } from "react"
import { X, Menu, Home, ShoppingBag, Heart, User, Settings, MapPin, MessageSquare, RotateCcw } from "lucide-react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

export const DesktopSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("desktop-sidebar")
      const hamburger = document.getElementById("sidebar-hamburger")
      
      if (sidebar && hamburger && !sidebar.contains(e.target as Node) && !hamburger.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Products", href: "/products", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Wishlist", href: "/sidebar-wishlist", icon: <Heart className="w-5 h-5" /> },
    { label: "My Orders", href: "/sidebar-orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "My Addresses", href: "/sidebar-addresses", icon: <MapPin className="w-5 h-5" /> },
    { label: "Messages", href: "/sidebar-messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Returns", href: "/sidebar-returns", icon: <RotateCcw className="w-5 h-5" /> },
  ]

  const accountItems: NavItem[] = [
    { label: "My Profile", href: "/sidebar-profile", icon: <User className="w-5 h-5" /> },
    { label: "Settings", href: "/sidebar-settings", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Hamburger Button - Desktop Only, Right Side */}
      <button
        id="sidebar-hamburger"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "hidden lg:flex fixed right-8 top-28 z-40 flex-col gap-1.5 w-10 h-10 items-center justify-center",
          "bg-myBlue hover:bg-blue-900 text-white rounded-lg shadow-lg transition-all duration-300",
          "hover:shadow-xl active:scale-95"
        )}
        aria-label="Toggle sidebar"
      >
        <div className={cn("hamburger-line w-6 h-0.5 bg-white rounded-full", isOpen && "active")}></div>
        <div className={cn("hamburger-line w-6 h-0.5 bg-white rounded-full", isOpen && "active")}></div>
        <div className={cn("hamburger-line w-6 h-0.5 bg-white rounded-full", isOpen && "active")}></div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 hidden lg:block animate-overlay-in"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        id="desktop-sidebar"
        className={cn(
          "fixed right-0 top-20 h-[calc(100vh-80px)] w-72 bg-white shadow-2xl z-40 hidden lg:flex flex-col",
          "pt-8 pb-8 overflow-y-auto transition-all duration-300 transform",
          isOpen ? "animate-sidebar-in" : "-translate-x-full opacity-0 pointer-events-none"
        )}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Navigation Sections */}
        <div className="flex-1 px-6 space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Browse
            </h3>
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={item.href} style={{ animationDelay: `${index * 50}ms` }} className="stagger-item">
                  <LocalizedClientLink
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-blue-50 hover:text-myBlue active:bg-blue-100",
                      pathname === item.href
                        ? "bg-myBlue text-white"
                        : "text-gray-700 hover:text-myBlue"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200"></div>

          {/* Account Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Account
            </h3>
            <ul className="space-y-1">
              {accountItems.map((item, index) => (
                <li key={item.href} style={{ animationDelay: `${(navItems.length + index) * 50}ms` }} className="stagger-item">
                  <LocalizedClientLink
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-blue-50 hover:text-myBlue active:bg-blue-100",
                      pathname === item.href
                        ? "bg-myBlue text-white"
                        : "text-gray-700 hover:text-myBlue"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center py-3">
            © 2026 WeeTok Marketplace
          </p>
        </div>
      </nav>
    </>
  )
}
