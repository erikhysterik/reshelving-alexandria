const path = require('path');
const Seg = require('segfault-handler')
Seg.registerHandler('crash.log')

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
    allMysqlTag (limit: 1000) {
      edges {
        node {
          trim_tag_
        }
      }
    }
  }
  `, ).then(result => {
    if (result.errors) {
      throw result.errors
    }
    console.log("past gql")
    const slugify = (text) => {
      return text
        .toString()                           // Cast to string (optional)
        .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase()                  // Convert the string to lowercase letters
        .trim()                                  // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, '-')            // Replace spaces with -
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  };
        // Create blog post pages.
        console.log("past import")
    result.data.allMysqlTag.edges.forEach(edge => {
      console.log("createpage for <" + edge.node.trim_tag_ + ">")
      // should not be necessary!!!
      if (edge.node.trim_tag_) {
        createPage({
          // Path for this page — required
          path: `/tag/${slugify(edge.node.trim_tag_)}`,
          component: tagTemplate,
          context: {
            tag: edge.node.trim_tag_,
            globtag: "*" + edge.node.trim_tag_ + "*"
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
      }
      
    })
    }
    )
    
  
}