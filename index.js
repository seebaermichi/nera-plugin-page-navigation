const path = require('path')

const { getConfig } = require('../plugin-helper')

module.exports = (() => {
  const config = getConfig(`${__dirname}/config/page-navigation.yaml`)

  const getPageNavigation = (pagesData, currentHref) => {
    const pageNav = pagesData.filter(({ meta }) => path.dirname(currentHref) !== '/'
      && path.dirname(meta.htmlPathName) === path.dirname(currentHref)
    )
    .map(({ meta }, index) => ({
        current: meta.htmlPathName === currentHref,
        name: meta.title,
        position: meta.position || index,
        href: meta.htmlPathName
      }))
      .sort((a, b) => a.position - b.position)

      return pageNav.length > 1 ? pageNav : []
  }

  const getMetaData = data => {
    if (data.pagesData !== null && typeof data.pagesData === 'object') {
      return data.pagesData.map(({ content, meta }) => ({
        content,
        meta: Object.assign({}, meta, {
          pageNav: {
            activeClass: config.active_page_nav_class,
            elements: meta.page_navigation || getPageNavigation(data.pagesData, meta.htmlPathName),
          }
        })
      }))
    }

    return data.pagesData
  }

  return {
    getMetaData
  }
})()
