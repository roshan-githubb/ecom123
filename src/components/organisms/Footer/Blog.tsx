import React from "react"
import { TrendingUp, Star, Zap, ArrowRight } from "lucide-react"
import Image from "next/image"

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "5 Viral Gadgets Taking Over WeeTok This Week",
      excerpt:
        "From smart home devices to quirky kitchen tools, these are the top sellers right now.",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1600&q=80",
      category: "Trending",
      color: "bg-pink-500",
    },
    {
      id: 2,
      title: "Seller Spotlight: How Sarah Made 10k in Her First Month",
      excerpt:
        "Tips and tricks from one of our top fashion sellers on growing your audience.",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
      category: "Seller Stories",
      color: "bg-purple-500",
    },
    {
      id: 3,
      title: "The Ultimate Guide to Live Shopping",
      excerpt:
        "Learn how to host engaging streams that convert viewers into buyers.",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
      category: "Guides",
      color: "bg-blue-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-black rounded-full mb-6">
            <TrendingUp className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            WeeTok Trends
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what&apos;s hot, meet top creators, and learn how to grow
            your business.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16 relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80"
            alt="Fashion"
            className="w-full h-[500px] object-cover"
            width={2000}
            height={1333}
          />

          <div className="absolute bottom-0 left-0 p-8 md:p-16 z-20 max-w-2xl">
            <span className="inline-block px-4 py-1 bg-pink-600 text-white rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
              Must Read
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Fall Fashion Forecast: What Gen Z is Buying
            </h2>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Read Article
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full group"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute top-4 left-4 ${post.color} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}
                >
                  {post.category}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-1">{post.excerpt}</p>
                <div className="flex items-center text-pink-600 font-bold group/btn cursor-pointer">
                  Read More{" "}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
