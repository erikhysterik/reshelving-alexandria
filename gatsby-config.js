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
        author
        cc_behavior
        cc_discrimination
        cc_health
        cc_language
        cc_magic
        cc_religion
        cc_science
        cc_sexuality
        cc_violence_weapons
        illustrator
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
            // need post processing for dupes due to multi author books!!!
            statement: `SELECT tempy.*, author.first as author_first, author.last as author_last, author.reference as author_reference FROM
            (SELECT book.*, series.name as series_name, cc.cc_behavior as new_cc_behavior, 
                        cc.cc_discrimination as new_cc_discrimination, 
                        cc.cc_health as new_cc_health,
                        cc.cc_language as new_cc_language,
                        cc.cc_magic as new_cc_magic,
                        cc.cc_religion as new_cc_religion,
                        cc.cc_science as new_cc_science,
                        cc.cc_sexuality as new_cc_sexuality,
                        cc.cc_themes as new_cc_themes,
                        cc.cc_violence_weapons as new_cc_violence_weapons,
                        cc.cc_witchcraft as new_cc_witchcraft,
                        author_book_l.book_id as author_book_id,
                        author_book_l.author_id as author_author_id
                        FROM reshelve_cs.book 
                        left join reshelve_cs.cc on	book.cs_rid = cc.book_id
                        left join reshelve_cs.author_book_l on author_book_l.book_id = book.cs_rid
                        left join reshelve_cs.series on series.cs_rid = book.series
                        WHERE book.status <> 'draft' and book.status <> 'hold' and cs_type = 'basic' ORDER BY sort_title ASC) as tempy
            left join reshelve_cs.author 
            on tempy.author_author_id = author.cs_rid;`,
            idFieldName: 'cs_rid',
            name: 'book'
          },
          /*{
            statement: `SELECT book.*, cc.cc_behavior as new_cc_behavior, 
            cc.cc_discrimination as new_cc_discrimination, 
            cc.cc_health as new_cc_health,
            cc.cc_language as new_cc_language,
            cc.cc_magic as new_cc_magic,
            cc.cc_religion as new_cc_religion,
            cc.cc_science as new_cc_science,
            cc.cc_sexuality as new_cc_sexuality,
            cc.cc_themes as new_cc_themes,
            cc.cc_violence_weapons as new_cc_violence_weapons,
            cc.cc_witchcraft as new_cc_witchcraft
            FROM reshelve_cs.book 
            left join reshelve_cs.cc on	book.cs_rid = cc.book_id
            WHERE status <> 'draft' and status <> 'hold' ORDER BY sort_title ASC;`,
            idFieldName: 'cs_rid',
            name: 'booktoo'

          },*/
          {
            statement: "SELECT * FROM alltags group by tag;",
            idFieldName: 'id',
            name: 'tag'
          },
          {
            // need post processing for dupes due to multi relationship authors!!!
            /*statement: `SELECT tempy.*, author.reference as author_relationship_reference from
            (SELECT author.*, author_author_l.author2_id as rel_author2_id, author_author_l.relationship as author_relationship 
            FROM reshelve_cs.author
            left join author_author_l on author_author_l.author_id = author.cs_rid) as tempy
            left join author on tempy.rel_author2_id = author.cs_rid;`,*/
            // need to cast birthdate to char type, date type gets mangled??
            statement: `select cs_rid, first, last, type, dates, bio, reference, quote, nationality, featured, notes, additional, gender, diversity, pronunciation, source_notes, top_author, living_author, complete, additional_information, website, relationship, additional_illustrated, alternate_name, hidden_alternate, CAST(birthdate as char) as fixedbirthdate from author order by last ASC;`,
            idFieldName: 'cs_rid',
            name: 'author'
          },
          {
            //statement: `select cs_rid, author_id, author2_id, cs_type, relationship from author_author_l;`,
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
          }
          /// need query for canonical rels for an author as well, i don't think they'll mix right with relationships
          /// for instance this entry authorid 1847, author2id 115; authorid 1847 author2id 386
          /// 1847 is douglas coe who's a pseudonym for both the author2's.... so canonical means authorid is pseudonym used by authord2id
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
