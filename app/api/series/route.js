import { query } from '../../../lib/db'

export async function GET() {
  try {
    const sql = `
      SELECT cs_rid, name, reference, description, status, publisher, pages, size, reading_level, series_type, incomplete, alternate_name, workflow, publisher_name
      FROM series
      LEFT JOIN publisher ON series.publisher = publisher.cs_rid
      ORDER BY name ASC
    `

    const series = await query(sql)
    return Response.json(series)
  } catch (error) {
    console.error('Error fetching series:', error)
    return Response.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}