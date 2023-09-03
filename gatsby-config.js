require('dotenv').config()

const myQuery = `
  query {
    books: allMysqlBook {
      nodes {
        # try to find a unique id for each node
        # if this field is absent, it's going to
        # be inserted by Algolia automatically
        # and will be less simple to update etc.
        objectID: id
        title
        description
        reference
        secondary_name
        url
        reference
        bookauthors {
          first
          last
        }
        cc_behavior
        cc_discrimination
        cc_health
        cc_language
        cc_magic
        cc_religion
        cc_science
        cc_sexuality
        cc_violence_weapons
        bookillustrators {
          first
          last
        }
        tags
        publisher
        publication_date
        disclaimers
        secondary_tags
        illustration_tags
        subject
      }
    }
  }
`;

const queries = [
  {
    query: myQuery,
    transformer: ({ data }) => data.books.nodes, // optional
    //indexName: 'index name to target', // overrides main index name, optional
    settings: {
      // optional, any index settings
      // Note: by supplying settings, you will overwrite all existing settings on the index
    },
    //matchFields: ['slug', 'modified'], // Array<String> overrides main match fields, optional
    mergeSettings: false, // optional, defaults to false. See notes on mergeSettings below
    queryVariables: {}, // optional. Allows you to use graphql query variables in the query
  },
];

module.exports = {
  siteMetadata: {
    title: `Omega Gatsby`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-use-query-params`,
    {
      resolve: `gatsby-source-mysql`,
      options: {
        connectionDetails: {
          host: `${process.env.MYSQL_HOST}`,
          user: `${process.env.MYSQL_USER}`,
          password: `${process.env.MYSQL_PW}`,
          database: `${process.env.MYSQL_DB}`
        },
        queries: [
          {
            statement: `SELECT book.cs_rid, book.title, book.description, book.reference, book.sort_title, book.secondary_name,
            book.url, book.cc_behavior, book.cc_discrimination, book.cc_health, book.cc_language, book.pages,
            book.cc_magic, book.cc_religion, book.cc_science, book.cc_sexuality, book.cc_violence_weapons, online_link, book.tags,
            book.publisher, book.publication_date, right(book.publication_date, 4) as noncirca_pub_date, book.disclaimers, book.secondary_tags, book.illustration_tags,
            book.subject, book.lead_name, book.lead_gender, book.lead_race_ethnicity_nationality, book.lead_age, book.lead_religion,
            book.lead_character, book.lead_physical, book.lead_vocation, book.location, book.tale_name,
            series.name as series_name, series.reference as series_reference, cc.cc_behavior as new_cc_behavior, cc.cc_discrimination as new_cc_discrimination, 
            cc.cc_health as new_cc_health, cc.cc_language as new_cc_language, cc.cc_magic as new_cc_magic,
            cc.cc_religion as new_cc_religion, cc.cc_science as new_cc_science, cc.cc_sexuality as new_cc_sexuality,
            cc.cc_themes as new_cc_themes, cc.cc_violence_weapons as new_cc_violence_weapons, cc.cc_witchcraft as new_cc_witchcraft,
            publisher.name as publisher_name
            FROM reshelve_cs.book 
            left join reshelve_cs.cc on	book.cs_rid = cc.book_id
            left join reshelve_cs.series on series.cs_rid = book.series
            left join reshelve_cs.publisher on publisher.cs_rid = book.publisher
            WHERE book.status <> 'draft' and book.status_notes not like '%hold%' ORDER BY sort_title ASC;`,
            idFieldName: 'cs_rid',
            name: 'book'
          },
          {
            statement: `SELECT author_book_l.cs_rid, author_book_l.book_id, author_book_l.author_id, a.first, a.last, a.reference 
            FROM reshelve_cs.author_book_l
            inner join author a
            on author_book_l.author_id = a.cs_rid
            where author_book_l.cs_type = 'basic';`,
            idFieldName: 'cs_rid',
            name: 'bookauthors',
            parentName: 'book',
            foreignKey: 'book_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `SELECT author_book_l.cs_rid, author_book_l.book_id, author_book_l.author_id, a.first, a.last, a.reference 
            FROM reshelve_cs.author_book_l
            inner join author a
            on author_book_l.author_id = a.cs_rid
            where author_book_l.cs_type = 'illustrator';`,
            idFieldName: 'cs_rid',
            name: 'bookillustrators',
            parentName: 'book',
            foreignKey: 'book_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `SELECT author_book_l.cs_rid, author_book_l.book_id, author_book_l.author_id, b.title, b.reference, b.publication_date 
            FROM reshelve_cs.author_book_l
            inner join book b
            on author_book_l.book_id = b.cs_rid
            where author_book_l.cs_type = 'basic' and b.status <> 'draft' and b.status_notes not like '%hold%';`,
            idFieldName: 'cs_rid',
            name: 'authorbooks',
            parentName: 'author',
            foreignKey: 'author_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `SELECT author_book_l.cs_rid, author_book_l.book_id, author_book_l.author_id, b.title, b.reference, b.publication_date 
            FROM reshelve_cs.author_book_l
            inner join book b
            on author_book_l.book_id = b.cs_rid
            where author_book_l.cs_type = 'illustrator' and b.status <> 'draft' and b.status_notes not like '%hold%';`,
            idFieldName: 'cs_rid',
            name: 'illustratorbooks',
            parentName: 'author',
            foreignKey: 'author_id',
            cardinality: 'OneToMany'
          },
          {
            statement: "SELECT * FROM alltags group by tag;",
            idFieldName: 'id',
            name: 'tag'
          },
          {
            // need to cast birthdate to char type, date type gets mangled??
            statement: `select cs_rid, first, last, type, dates, bio, reference, quote, nationality, featured, notes, additional, gender, diversity, pronunciation, source_notes, top_author, living_author, complete, additional_information, website, relationship, additional_illustrated, alternate_name, hidden_alternate, CAST(birthdate as char) as fixedbirthdate from author order by last ASC;`,
            idFieldName: 'cs_rid',
            name: 'author'
          },
          {
            statement: `select a.cs_rid, a.cs_type, a.author_id, a.author2_id, a.relationship as a_relationship, 
            b.relationship as b_relationship, c.first, c.last, c.reference
            from author_author_l a
            left join author_author_l b
            on a.author2_id = b.author_id and a.author_id = b.author2_id
            left join author c
            on a.author2_id = c.cs_rid
            where a.author_id <> 0 and a.cs_type <> 'canonical';`,
            idFieldName: 'cs_rid',
            name: 'authorrelationships',
            parentName: 'author',
            foreignKey: 'author_id',
            cardinality: 'OneToMany'
          },
          /// pseudonym rels are interesting. for instance this entry authorid 1847, author2id 115; authorid 1847 author2id 386
          /// 1847 is douglas coe who's a pseudonym for both the author2's.... so canonical means authorid is pseudonym used by authord2id
          {
            statement: `select ar.cs_rid, ar.author_id, ar.author2_id, a.first, a.last, a.reference 
            from author_author_l ar
            left join author a
            on author2_id = a.cs_rid
            where cs_type = 'canonical';`,
            idFieldName: 'cs_rid',
            name: 'authorpseudonymofs',
            parentName: 'author',
            foreignKey: 'author_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select ar.cs_rid, ar.author_id, ar.author2_id, a.first, a.last, a.reference 
            from author_author_l ar
            left join author a
            on author_id = a.cs_rid
            where cs_type = 'canonical';`,
            idFieldName: 'cs_rid',
            name: 'authorpseudonyms',
            parentName: 'author',
            foreignKey: 'author2_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select series.cs_rid, series.name, series.description, series.reference, series.status, 
            series.publisher, series.pages, series.size, series.reading_level, series.series_type, 
            series.incomplete, series.alternate_name, series.workflow, publisher.name as publisher_name
            from series
            left join publisher
            on series.publisher = publisher.cs_rid;`,
            idFieldName: 'cs_rid',
            name: 'series',
          },
          {
            statement: `select t.*, ar.first, ar.last from
            (select book.cs_rid, book.title, book.publication_date, book.reference, book.series as series_id, a.author_id, row_number() over ( order by cs_rid) as rid 
            from book 
            left join (select book_id, author_id from author_book_l where cs_type='basic' group by book_id) a
            on a.book_id = book.cs_rid
            where book.series <> 0 and book.status <> 'draft' and book.status_notes not like '%hold%') t
            left join author ar
            on t.author_id = ar.cs_rid;`,
            idFieldName: 'rid',
            name: 'seriesbooks',
            parentName: 'series',
            foreignKey: 'series_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select book_decade_l.cs_rid, book_id, decade_id, decade.decade, decade.reference
            from book_decade_l
            inner join decade on decade_id = decade.cs_rid;`,
            idFieldName: 'cs_rid',
            name: 'bookdecades',
            parentName: 'book',
            foreignKey: 'book_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select t.*, ar.first, ar.last from
            (select book.cs_rid, book.title, book.publication_date, book.reference, b.decade_id, a.author_id, row_number() over ( order by cs_rid) as rid 
            from book 
            left join (select book_id, author_id from author_book_l where cs_type='basic' group by book_id) a
            on a.book_id = book.cs_rid
            inner join (select book_id, decade_id from book_decade_l) b
            on b.book_id = book.cs_rid
            where book.status <> 'draft' and book.status_notes not like '%hold%') t
            left join author ar
            on t.author_id = ar.cs_rid;`,
            idFieldName: 'rid',
            name: 'decadebooks',
            parentName: 'decade',
            foreignKey: 'decade_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select book_century_l.cs_rid, book_id, century_id, century.name, century.reference
            from book_century_l
            inner join century on century_id = century.cs_rid;`,
            idFieldName: 'cs_rid',
            name: 'bookcenturies',
            parentName: 'book',
            foreignKey: 'book_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select t.*, ar.first, ar.last from
            (select book.cs_rid, book.title, book.publication_date, book.reference, b.century_id, a.author_id, row_number() over ( order by cs_rid) as rid 
            from book 
            left join (select book_id, author_id from author_book_l where cs_type='basic' group by book_id) a
            on a.book_id = book.cs_rid
            inner join (select book_id, century_id from book_century_l) b
            on b.book_id = book.cs_rid
            where book.status <> 'draft' and book.status_notes not like '%hold%') t
            left join author ar
            on t.author_id = ar.cs_rid;`,
            idFieldName: 'rid',
            name: 'centurybooks',
            parentName: 'century',
            foreignKey: 'century_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `SELECT book_timeperiod_l.cs_rid, book_id, timeperiod_id, timeperiod.name, timeperiod.type, timeperiod.reference 
            FROM reshelve_cs.book_timeperiod_l
            inner join timeperiod on timeperiod_id = timeperiod.cs_rid
            where timeperiod.type = 'major';`,
            idFieldName: 'cs_rid',
            name: 'bookmajortimeperiods',
            parentName: 'book',
            foreignKey: 'book_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select t.*, ar.first, ar.last from
            (select book.cs_rid, book.title, book.publication_date, book.reference, b.timeperiod_id, b.cs_type, a.author_id, row_number() over ( order by cs_rid) as rid 
            from book 
            left join (select book_id, author_id from author_book_l where cs_type='basic' group by book_id) a
            on a.book_id = book.cs_rid
            inner join (select book_id, cs_type, timeperiod_id from book_timeperiod_l) b
            on b.book_id = book.cs_rid
            where book.status <> 'draft' and book.status_notes not like '%hold%' and cs_type = 'basic') t
            left join author ar
            on t.author_id = ar.cs_rid;`,
            idFieldName: 'rid',
            name: 'majortimeperiodbooks',
            parentName: 'majortimeperiod',
            foreignKey: 'timeperiod_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `SELECT book_timeperiod_l.cs_rid, book_id, timeperiod_id, timeperiod.name, timeperiod.type, timeperiod.reference, timeperiod.region
            FROM reshelve_cs.book_timeperiod_l
            inner join timeperiod on timeperiod_id = timeperiod.cs_rid
            where timeperiod.type = 'minor' and instr(timeperiod.region, char(0)) = 0
            union SELECT book_timeperiod_l.cs_rid, book_id, timeperiod_id, timeperiod.name, timeperiod.type, timeperiod.reference, substring_index(timeperiod.region, char(0), 1) as region
            FROM reshelve_cs.book_timeperiod_l
            inner join timeperiod on timeperiod_id = timeperiod.cs_rid
            where timeperiod.type = 'minor' and instr(region, char(0)) <> 0;`,
            idFieldName: 'cs_rid',
            name: 'bookminortimeperiods',
            parentName: 'book',
            foreignKey: 'book_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `select t.*, ar.first, ar.last from
            (select book.cs_rid, book.title, book.publication_date, book.reference, b.timeperiod_id, b.cs_type, a.author_id, row_number() over ( order by cs_rid) as rid 
            from book 
            left join (select book_id, author_id from author_book_l where cs_type='basic' group by book_id) a
            on a.book_id = book.cs_rid
            inner join (select book_id, cs_type, timeperiod_id from book_timeperiod_l) b
            on b.book_id = book.cs_rid
            where book.status <> 'draft' and book.status_notes not like '%hold%' and cs_type = 'minor') t
            left join author ar
            on t.author_id = ar.cs_rid;`,
            idFieldName: 'rid',
            name: 'minortimeperiodbooks',
            parentName: 'minortimeperiod',
            foreignKey: 'timeperiod_id',
            cardinality: 'OneToMany'
          },
          {
            statement: `SELECT cs_rid, name, reference, description FROM reshelve_cs.century;`,
            idFieldName: 'cs_rid',
            name: 'century'
          },
          {
            statement: `SELECT cs_rid, century, decade, reference FROM reshelve_cs.decade;`,
            idFieldName: 'cs_rid',
            name: 'decade'
          },
          {
            statement: `SELECT cs_rid, name, reference, period FROM reshelve_cs.timeperiod where type = 'major';`,
            idFieldName: 'cs_rid',
            name: 'majortimeperiod'
          },
          // need to clean up bad data that has nulls and stuff after it in some of the region entries
          {
            statement: `SELECT cs_rid, name, region, reference, period FROM reshelve_cs.timeperiod where type = 'minor' and instr(region, char(0)) = 0
            union SELECT cs_rid, name, substring_index(region, char(0), 1) as region, reference, period FROM reshelve_cs.timeperiod where type = 'minor' and instr(region, char(0)) <> 0;;`,
            idFieldName: 'cs_rid',
            name: 'minortimeperiod'
          },
          {
            statement: `select row_number() over ( order by publication_date) as rid, publication_date from
            (select distinct(right(publication_date, 4)) as publication_date from
            (select * from book where status <> 'draft' and status_notes not like '%hold%') a
            where publication_date <> '') b;`,
            idFieldName: 'publication_date',
            name: 'publicationdates'
          },
          {
            statement: `select t.*, ar.first, ar.last from
            (select book.cs_rid, book.title, book.publication_date, right(book.publication_date, 4) as noncirca_pub_date, book.reference, a.author_id, row_number() over ( order by cs_rid) as rid 
            from book 
            left join (select book_id, author_id from author_book_l where cs_type='basic' group by book_id) a
            on a.book_id = book.cs_rid
            where book.status <> 'draft' and book.status_notes not like '%hold%') t
            left join author ar
            on t.author_id = ar.cs_rid;`,
            idFieldName: 'rid',
            name: 'publicationdatebooks',
            parentName: 'publicationdates',
            foreignKey: 'noncirca_pub_date',
            cardinality: 'OneToMany'
          }
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      // This plugin must be placed last in your list of plugins to ensure that it can query all the GraphQL data
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        // Use Admin API key without GATSBY_ prefix, so that the key isn't exposed in the application
        // Tip: use Search API key with GATSBY_ prefix to access the service from within components
        apiKey: process.env.ALGOLIA_ADMIN_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME, // for all queries
        queries,
        chunkSize: 10000, // default: 1000
        settings: {
          // optional, any index settings
          // Note: by supplying settings, you will overwrite all existing settings on the index
        },
        //enablePartialUpdates: true, // default: false
        //matchFields: ['slug', 'modified'], // Array<String> default: ['modified']
        concurrentQueries: false, // default: true
        //skipIndexing: true, // default: false, useful for e.g. preview deploys or local development
        continueOnFailure: false, // default: false, don't fail the build if algolia indexing fails
        algoliasearchOptions: undefined, // default: { timeouts: { connect: 1, read: 30, write: 30 } }, pass any different options to the algoliasearch constructor
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        //color: `tomato`,
        // Enable the loading spinner.
        showSpinner: true,
      },
    },
  ],
};
