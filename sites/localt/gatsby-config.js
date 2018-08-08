
  module.exports = {
    siteMetadata: {
      title: 'localt',
    },
    plugins: [
    'gatsby-plugin-react-helmet',
      {
        resolve: 'gatsby-plugin-react-helmet',
        options:{
          seo: {
            title: '',
            keyword: '',
            discription: ''
          }
      }
    }
    ]
  }
  