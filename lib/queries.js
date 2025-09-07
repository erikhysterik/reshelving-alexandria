import { query } from './db.js'

// Get all books with related data
export async function getAllBooks() {
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
    ar.first as author_first, ar.last as author_last, ar.reference as author_reference
    FROM book
    left join cc on book.cs_rid = cc.book_id
    left join series on series.cs_rid = book.series
    left join publisher on publisher.cs_rid = book.publisher
    left join (SELECT abl.book_id, abl.author_id
        FROM author_book_l abl
        JOIN (
            SELECT book_id, min(cs_rid) AS min_id
            FROM author_book_l
            WHERE cs_type = 'basic'
            GROUP BY book_id
        ) min_abl ON abl.cs_rid = min_abl.min_id) a
    on a.book_id = book.cs_rid
    left join author ar
    on a.author_id = ar.cs_rid
    WHERE book.status <> 'draft' and book.status_notes not like '%hold%' ORDER BY sort_title ASC;
  `
  return await query(sql)
}

// Get book authors
export async function getBookAuthors(bookId) {
  const sql = `
    SELECT author_book_l.cs_rid, author_book_l.book_id, author_book_l.author_id, a.first, a.last, a.reference
    FROM author_book_l
    inner join author a on author_book_l.author_id = a.cs_rid
    where author_book_l.cs_type = 'basic' and author_book_l.book_id = ?
  `
  return await query(sql, [bookId])
}

// Get book illustrators
export async function getBookIllustrators(bookId) {
  const sql = `
    SELECT author_book_l.cs_rid, author_book_l.book_id, author_book_l.author_id, a.first, a.last, a.reference
    FROM author_book_l
    inner join author a on author_book_l.author_id = a.cs_rid
    where author_book_l.cs_type = 'illustrator' and author_book_l.book_id = ?
  `
  return await query(sql, [bookId])
}

// Get book time periods
export async function getBookTimePeriods(bookId) {
  const sql = `
    SELECT book_timeperiod_l.cs_rid, book_id, timeperiod_id, timeperiod.name, timeperiod.type, timeperiod.reference, timeperiod.region
    FROM book_timeperiod_l
    inner join timeperiod on timeperiod_id = timeperiod.cs_rid
    where timeperiod.type = 'major' and book_id = ?
    union SELECT book_timeperiod_l.cs_rid, book_id, timeperiod_id, timeperiod.name, timeperiod.type, timeperiod.reference, substring_index(timeperiod.region, char(0), 1) as region
    FROM book_timeperiod_l
    inner join timeperiod on timeperiod_id = timeperiod.cs_rid
    where timeperiod.type = 'minor' and instr(region, char(0)) <> 0 and book_id = ?
  `
  return await query(sql, [bookId, bookId])
}

// Get book centuries
export async function getBookCenturies(bookId) {
  const sql = `
    select book_century_l.cs_rid, book_id, century_id, century.name, century.reference
    from book_century_l
    inner join century on century_id = century.cs_rid
    where book_id = ?
  `
  return await query(sql, [bookId])
}

// Get book decades
export async function getBookDecades(bookId) {
  const sql = `
    select book_decade_l.cs_rid, book_id, decade_id, decade.decade, decade.reference
    from book_decade_l
    inner join decade on decade_id = decade.cs_rid
    where book_id = ?
  `
  return await query(sql, [bookId])
}

// Get single book with all related data
export async function getBookByReference(reference) {
  const books = await getAllBooks()
  const book = books.find(b => b.reference === reference)

  if (!book) return null

  // Get related data
  const [authors, illustrators, timeperiods, centuries, decades] = await Promise.all([
    getBookAuthors(book.cs_rid),
    getBookIllustrators(book.cs_rid),
    getBookTimePeriods(book.cs_rid),
    getBookCenturies(book.cs_rid),
    getBookDecades(book.cs_rid)
  ])

  return {
    ...book,
    bookauthors: authors,
    bookillustrators: illustrators,
    bookmajortimeperiods: timeperiods.filter(tp => tp.type === 'major'),
    bookminortimeperiods: timeperiods.filter(tp => tp.type === 'minor'),
    bookcenturies: centuries,
    bookdecades: decades
  }
}

// Get all book references for static generation
export async function getAllBookReferences() {
  const books = await getAllBooks()
  return books.map(book => book.reference)
}

// Get author by reference
export async function getAuthorByReference(reference) {
  const sql = `
    SELECT cs_rid, first, last, type, dates, bio, reference, quote, nationality, featured, notes, additional, gender, diversity, pronunciation, source_notes, top_author, living_author, complete, additional_information, website, relationship, additional_illustrated, alternate_name, hidden_alternate, CAST(birthdate as char) as fixedbirthdate
    FROM author
    WHERE reference = ?
  `
  const authors = await query(sql, [reference])
  return authors[0] || null
}

// Get all author references for static generation
export async function getAllAuthorReferences() {
  const sql = `SELECT reference FROM author ORDER BY last ASC`
  const authors = await query(sql)
  return authors.map(author => author.reference)
}

// Get author's books
export async function getAuthorBooks(authorId) {
  const sql = `
    SELECT book.cs_rid, book.title, book.publication_date, book.reference
    FROM book
    INNER JOIN author_book_l ON book.cs_rid = author_book_l.book_id
    WHERE author_book_l.author_id = ? AND author_book_l.cs_type = 'basic'
    AND book.status <> 'draft' AND book.status_notes NOT LIKE '%hold%'
    ORDER BY book.publication_date DESC
  `
  return await query(sql, [authorId])
}