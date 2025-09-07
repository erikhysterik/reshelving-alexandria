import { getAllAuthorReferences } from '../../../lib/queries'

export async function GET() {
  try {
    const authors = await getAllAuthorReferences()
    return Response.json(authors)
  } catch (error) {
    console.error('Error fetching authors:', error)
    return Response.json({ error: 'Failed to fetch authors' }, { status: 500 })
  }
}