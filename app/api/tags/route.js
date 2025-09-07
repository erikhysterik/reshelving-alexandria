import { query } from '../../../lib/db'

export async function GET() {
  try {
    const sql = `
      SELECT * FROM alltags
      WHERE id IN (SELECT MIN(id) as id FROM alltags GROUP BY tag)
      ORDER BY tag ASC
    `

    const tags = await query(sql)
    return Response.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return Response.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}