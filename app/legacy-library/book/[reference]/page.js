import { notFound } from 'next/navigation'
import { getBookByReference, getAllBookReferences } from '@/lib/queries'
import BookDetails from '@/components/BookDetails'
import PageWrapper from '@/components/PageWrapper'

// Generate static paths for all books
export async function generateStaticParams() {
  try {
    const references = await getAllBookReferences()
    return references.map((reference) => ({
      reference: reference,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate static props for each book
export async function generateMetadata({ params }) {
  try {
    const book = await getBookByReference(params.reference)

    if (!book) {
      return {
        title: 'Book Not Found',
      }
    }

    return {
      title: book.title || 'Book Details',
      description: book.description?.substring(0, 160) || 'Book information',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Book Details',
    }
  }
}

export default async function BookPage({ params }) {
  try {
    const book = await getBookByReference(params.reference)

    if (!book) {
      notFound()
    }

    // Transform the data to match the expected structure
    const mysqlBook = {
      ...book,
      id: book.cs_rid,
      // Add any other transformations needed
    }

    return <BookDetails data={{ mysqlBook }} />
  } catch (error) {
    console.error('Error loading book:', error)
    notFound()
  }
}