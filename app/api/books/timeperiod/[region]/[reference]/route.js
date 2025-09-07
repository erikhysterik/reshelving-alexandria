import { query } from '../../../../../../lib/db'

export async function GET(request, { params }) {
  try {
    const { region, reference } = params

    const sql = `
      SELECT book.cs_rid, book.title, book.description, book.reference, book.sort_title, book.secondary_name,
      book.url, book.cc_behavior, book.cc_discrimination, book.cc_health, book.cc_language, book.pages,
      book.cc_magic, book.cc_religion, book.cc_science, book.cc_sexuality, book.cc_violence_weapons, online_link, book.tags,
      book.publisher, book.publication_date, right(book.publication_date, 4) as noncirca_pub_date, book.disclaimers, book.secondary_tags, book.illustration_tags,
      book.subject, book.lead_name, book.lead_gender, book.lead_race_ethnicity_nationality, book.lead_age, book.lead_religion,
      book.lead_character, book.lead_physical, book.lead_vocation, book.location, book.tale_name,
      series.name as series_name, series.reference as series_reference, cc.cc_behavior as new_cc_behavior, cc.cc_discrimination as new_cc_discrimination,
      cc.cc_health as new_cc_health, cc.cc_language as new_cc_language, cc.cc_magic as new_cc_magic,
      cc.cc_religion as new_cc_religion, cc.cc_science as new_cc_science, cc.cc_sexuality as new_cc_sexuality,
      cc.cc_themes as new_cc_themes, cc.cc_violence_weapons as new_cc_violence_weapons, cc.cc_witchcraft as new_cc_witchcraft,
      publisher.name as publisher_name,
      ar.first as author_first, ar.last as author_last, ar.reference as author_reference,
      timeperiod.name as timeperiod_name, timeperiod.reference as timeperiod_reference, timeperiod.type as timeperiod_type, timeperiod.region as timeperiod_region
      FROM book
      left join cc on book.cs_rid = cc.book_id
      left join series on series.cs_rid = book.series
      left join publisher on publisher.cs_rid = book.publisher
      left join book_timeperiod_l on book_timeperiod_l.book_id = book.cs_rid
      left join timeperiod on timeperiod.cs_rid = book_timeperiod_l.timeperiod_id
      left join (SELECT abl.book_id, abl.author_id
          FROM author_book_l abl
          JOIN (
              SELECT book_id, min(cs_rid) AS min_id
              FROM author_book_l
              WHERE cs_type = 'basic'
              GROUP BY book_id
          ) min_abl ON abl.cs_rid = min_abl.min_id) a
      on a.book_id = book.cs_rid
      left join author ar on a.author_id = ar.cs_rid
      WHERE book.status <> 'draft' and book.status_notes not like '%hold%'
      AND timeperiod.reference = ? AND timeperiod.type = 'minor'
      AND (timeperiod.region = ? OR instr(timeperiod.region, char(0)) = 0 OR substring_index(timeperiod.region, char(0), 1) = ?)
      ORDER BY sort_title ASC;
    `

    const books = await query(sql, [reference, region, region])
    return Response.json(books)
  } catch (error) {
    console.error('Error fetching books by minor time period:', error)
    return Response.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}