import { query } from '../../../../lib/db'

export async function GET(request, { params }) {
  try {
    const { reference } = params

    // Get series details
    const seriesSql = `
      SELECT cs_rid, name, reference, description, status, publisher, pages, size, reading_level, series_type, incomplete, alternate_name, workflow, publisher_name
      FROM series
      LEFT JOIN publisher ON series.publisher = publisher.cs_rid
      WHERE series.reference = ?
    `

    const series = await query(seriesSql, [reference])
    const seriesData = series[0]

    if (!seriesData) {
      return Response.json({ error: 'Series not found' }, { status: 404 })
    }

    // Get books in this series
    const booksSql = `
      SELECT book.cs_rid, book.title, book.description, book.reference, book.sort_title, book.secondary_name,
      book.url, book.cc_behavior, book.cc_discrimination, book.cc_health, book.cc_language, book.pages,
      book.cc_magic, book.cc_religion, book.cc_science, book.cc_sexuality, book.cc_violence_weapons, online_link, book.tags,
      book.publisher, book.publication_date, right(book.publication_date, 4) as noncirca_pub_date, book.disclaimers, book.secondary_tags, book.illustration_tags,
      book.subject, book.lead_name, book.lead_gender, book.lead_race_ethnicity_nationality, book.lead_age, book.lead_religion,
      book.lead_character, book.lead_physical, book.lead_vocation, book.location, book.tale_name,
      ar.first as author_first, ar.last as author_last, ar.reference as author_reference
      FROM book
      LEFT JOIN (SELECT abl.book_id, abl.author_id
          FROM author_book_l abl
          JOIN (
              SELECT book_id, min(cs_rid) AS min_id
              FROM author_book_l
              WHERE cs_type = 'basic'
              GROUP BY book_id
          ) min_abl ON abl.cs_rid = min_abl.min_id) a
      ON a.book_id = book.cs_rid
      LEFT JOIN author ar ON a.author_id = ar.cs_rid
      WHERE book.series = ? AND book.status <> 'draft' AND book.status_notes NOT LIKE '%hold%'
      ORDER BY book.publication_date ASC
    `

    const books = await query(booksSql, [seriesData.cs_rid])

    return Response.json({
      series: seriesData,
      books: books
    })
  } catch (error) {
    console.error('Error fetching series:', error)
    return Response.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}