import { query } from '../../../lib/db'

export async function GET() {
  try {
    const sql = `
      SELECT series.cs_rid, series.name, series.reference, series.description, series.status, series.publisher, series.pages, series.size, series.reading_level, series.series_type, series.incomplete, series.alternate_name, series.workflow, publisher.name as publisher_name
      FROM series
      LEFT JOIN publisher ON series.publisher = publisher.cs_rid
      ORDER BY series.name ASC
    `

    const series = await query(sql)
    return Response.json(series)
  } catch (error) {
    console.error('Error fetching series:', error)
    return Response.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}