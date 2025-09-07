import { getAuthorByReference, getAuthorBooks } from '../../../../lib/queries'

export async function GET(request, { params }) {
  try {
    const { reference } = params

    const author = await getAuthorByReference(reference)

    if (!author) {
      return Response.json({ error: 'Author not found' }, { status: 404 })
    }

    const books = await getAuthorBooks(author.cs_rid)

    return Response.json({
      author,
      books
    })
  } catch (error) {
    console.error('Error fetching author:', error)
    return Response.json({ error: 'Failed to fetch author' }, { status: 500 })
  }
}