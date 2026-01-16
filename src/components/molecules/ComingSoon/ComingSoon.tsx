import LocalizedLink from "@/components/molecules/LocalizedLink/LocalizedLink"

interface ComingSoonProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export const ComingSoon = ({ 
  title, 
  description = "This feature is coming soon. We're working hard to bring it to you!",
  icon
}: ComingSoonProps) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center p-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6">
          {icon || (
            <svg 
              className="h-10 w-10 text-myBlue" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
          {title} Coming Soon!
        </h1>
        
        <p className="text-base text-gray-500 mb-6">
          {description}
        </p>

        <LocalizedLink href="/">
          <button className="w-full flex justify-center items-center px-4 py-2 bg-myBlue text-white rounded-lg hover:opacity-90 transition-colors">
            Return Home
          </button>
        </LocalizedLink>
      </div>
    </div>
  )
}