import { getAllBooks } from '../../../lib/queries'

export async function GET() {
  try {
    const books = await getAllBooks()
    return Response.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return Response.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}