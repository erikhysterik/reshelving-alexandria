import React from 'react'
import LegacyLibraryClient from './LegacyLibraryClient'

export default function LegacyLibraryPage() {
  return <LegacyLibraryClient />
}

export async function generateMetadata() {
  return {
    title: 'Legacy Library',
    description: 'Browse our collection of books',
  }
}