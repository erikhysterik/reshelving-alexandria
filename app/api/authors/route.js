import { query } from '../../../lib/db'

export async function GET() {
  try {
    const sql = `
      SELECT cs_rid, first, last, reference, type, dates, bio, nationality
      FROM author
      WHERE type IS NOT NULL AND type != ''
      ORDER BY last ASC, first ASC
    `

    const authors = await query(sql)
    return Response.json(authors)
  } catch (error) {
    console.error('Error fetching authors:', error)
    return Response.json({ error: 'Failed to fetch authors' }, { status: 500 })
  }
}