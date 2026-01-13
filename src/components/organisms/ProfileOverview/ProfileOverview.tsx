"use client"

import { Card } from "@/components/atoms"
import LocalizedLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { HttpTypes } from "@medusajs/types"
import { User, Mail, Phone, Package, Heart, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProfileOverviewProps {
  customer: HttpTypes.StoreCustomer
  recentOrders?: any[]
}

export const ProfileOverview = ({ customer, recentOrders = [] }: ProfileOverviewProps) => {
  const [imageError, setImageError] = useState(false)
  
  const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
  const joinDate = new Date(customer.created_at || new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Get profile picture from customer data (check multiple possible sources)
  const getProfilePicture = () => {
    // Check if there's an avatar in metadata
    if (customer.metadata && typeof customer.metadata === 'object') {
      const metadata = customer.metadata as any
      if (metadata.avatar || metadata.profile_picture || metadata.image) {
        return metadata.avatar || metadata.profile_picture || metadata.image
      }
    }
    
    // Check if there's a direct avatar field (if your backend supports it)
    if ((customer as any).avatar) {
      return (customer as any).avatar
    }
    
    return null
  }

  const profilePicture = getProfilePicture()

  // Get initials for profile picture fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const quickActions = [
    {
      title: "Orders",
      description: "View your order history",
      href: "/coming-soon-orders",
      icon: Package,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Wishlist",
      description: "Manage saved items",
      href: "/coming-soon-wishlist", 
      icon: Heart,
      color: "bg-red-50 text-red-600"
    }
  ]

  const formatOrderStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        {/* Centered Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
            {profilePicture && !imageError ? (
              <Image 
                src={profilePicture} 
                alt={fullName || 'Profile'} 
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : fullName ? (
              <span className="text-2xl font-bold text-white">
                {getInitials(fullName)}
              </span>
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 text-center">
            {fullName || 'Welcome!'}
          </h1>
          <p className="text-gray-600 mt-1 text-center">Customer since {joinDate}</p>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center space-y-2">
          {customer.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {customer.email}
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {customer.phone}
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          return (
            <LocalizedLink key={action.title} href={action.href}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            </LocalizedLink>
          )
        })}
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <LocalizedLink href="/coming-soon-orders">
              <button className="text-blue-600 text-sm hover:underline">
                View all
              </button>
            </LocalizedLink>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order #{order.display_id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {formatOrderStatus(order.status)}
                    </span>
                    <p className="text-sm font-medium mt-1">
                      ${(order.total / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No orders yet</p>
                <LocalizedLink href="/">
                  <button className="text-blue-600 text-sm hover:underline mt-1">
                    Start shopping
                  </button>
                </LocalizedLink>
              </div>
            )}
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <p className="text-gray-900">{fullName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <p className="text-gray-900">{customer.phone}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}