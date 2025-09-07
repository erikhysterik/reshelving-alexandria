import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/assets/fonts/fontawesome-5/css/all.css'
import '../src/assets/fonts/icon-font/css/icons.css'
import '../src/assets/fonts/typography-font/typo.css'
import './globals.css'
import ThemeWrapper from './ThemeWrapper'

export const metadata = {
  title: 'Omega Next.js',
  description: 'Omega migrated from Gatsby to Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
}