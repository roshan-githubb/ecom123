import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

export function Footer() {
  return (
    <footer className="bg-primary container mt-16 lg:mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
        {/* Customer Services Column */}
        <div className="p-6 lg:p-0 border lg:border-0 rounded-sm lg:rounded-none">
          <h2 className="heading-sm text-primary mb-4 uppercase font-semibold">
            Customer services
          </h2>
          <nav className="space-y-3" aria-label="Customer services navigation">
            {footerLinks.customerServices.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        {/* About Column */}
        <div className="p-6 lg:p-0 border lg:border-0 rounded-sm lg:rounded-none">
          <h2 className="heading-sm text-primary mb-4 uppercase font-semibold">About</h2>
          <nav className="space-y-3" aria-label="About navigation">
            {footerLinks.about.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        {/* Additional columns for desktop */}
        <div className="hidden lg:block p-0">
          <h2 className="heading-sm text-primary mb-4 uppercase font-semibold">
            Support
          </h2>
          <nav className="space-y-3">
            <a href="#" className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200">
              Help Center
            </a>
            <a href="#" className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200">
              Contact Us
            </a>
            <a href="#" className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200">
              Shipping Info
            </a>
          </nav>
        </div>

        <div className="hidden lg:block p-0">
          <h2 className="heading-sm text-primary mb-4 uppercase font-semibold">
            Connect
          </h2>
          <nav className="space-y-3">
            <a href="#" className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200">
              Facebook
            </a>
            <a href="#" className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200">
              Twitter
            </a>
            <a href="#" className="block label-md text-gray-600 hover:text-myBlue transition-colors duration-200">
              Instagram
            </a>
          </nav>
        </div>
      </div>

      <div className="py-6 border-t border-gray-200">
        <p className="text-md text-gray-600 text-center">© 2026 Saransa. All rights reserved.</p>
      </div>
    </footer>
  )
}
