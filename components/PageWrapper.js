import React from "react"

const PageWrapper = ({ children, headerDark = false, footerDark = false }) => {
  // For Next.js, we'll handle theming through CSS classes or context if needed
  // For now, just render the children
  return <>{children}</>
}

export default PageWrapper