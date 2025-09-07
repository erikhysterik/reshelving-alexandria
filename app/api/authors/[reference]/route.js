import { getAuthorByReference, getAuthorBooks } from '../../../../lib/queries'

export async function GET(request, { params }) {
  try {
    const { reference } = params

    const [author, books] = await Promise.all([
      getAuthorByReference(reference),
      getAuthorBooks(reference)
    ])

    if (!author) {
      return Response.json({ error: 'Author not found' }, { status: 404 })
    }

    return Response.json({
      author,
      books
    })
  } catch (error) {
    console.error('Error fetching author:', error)
    return Response.json({ error: 'Failed to fetch author' }, { status: 500 })
  }
}