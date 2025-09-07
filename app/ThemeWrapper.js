"use client";

import { ThemeProvider } from 'styled-components'
import theme from '../src/utils/theme'

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}