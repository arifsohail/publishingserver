
  module.exports = {
    siteMetadata: {
      title: 'mylatestsite',
    },
    plugins: [
    'gatsby-plugin-react-helmet',
      {
        resolve: 'gatsby-plugin-react-helmet',
        options:{
          seo: {
            title: 'seo title',
            keyword: 'seo key words',
            discription: 'my seo description'
          }
      }
    }
    ]
  }
  