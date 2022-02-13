const path = require('path');
const _ = require('lodash');
const slugify = require('@sindresorhus/slugify');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/sign|reset|coming/)) {
    page.context.layout = "bare";
    createPage(page);
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const tagTemplate = path.resolve(`src/templates/tag.js`)
  // Query tags
  return graphql(`
  query MyTagQuery {
    allMysqlTag {
      edges {
        node {
          tag
        }
      }
    }
  }
  `, ).then(result => {
    if (result.errors) {
      throw result.errors
    }

  //const argh = result.data.allMysqlTag.edges.map(entry => slugify(entry.node.tag, {lower: true}));
  
  //const argh2 = argh.filter((a, i) => argh.indexOf(a) !== i)
  //argh2.forEach(a => console.log(a))


  // Create tag pages.
    result.data.allMysqlTag.edges.forEach(edge => {
      //console.log(_.escapeRegExp("/(" + edge.node.tag + ")\s*(?:,|$)/gm"))

        createPage({
          // Path for this page — required
          path: `/legacy-library/tag/${slugify(edge.node.tag, {lower: true})}`,
          component: tagTemplate,
          context: {
            tag: edge.node.tag,
            regextag: "/(" + _.escapeRegExp(edge.node.tag) + ")\\s*(?:,|$)/gm"
            // Add optional context data to be inserted
            // as props into the page component.
            //
            // The context data can also be used as
            // arguments to the page GraphQL query.
            //
            // The page "path" is always available as a GraphQL
            // argument.
          },
        })
    })
    }
    )
    
  
}