import path from 'path'
import { getConfig } from '@nera-static/plugin-utils'

const HOST_CONFIG_PATH = path.resolve(
    process.cwd(),
    'config/page-navigation.yaml'
)

const config = getConfig(HOST_CONFIG_PATH)

/**
 * Build a sibling navigation for the current page.
 * @param {Array} pagesData - Array of page data objects
 * @param {string} currentHref - Current page href
 * @returns {Array} Array of navigation items
 */
function getPageNavigation(pagesData, currentHref) {
    const currentDir = path.dirname(currentHref)

    return pagesData
        .filter(({ meta }) => {
            const pageDir = meta.dirname
            return currentDir !== '/' && pageDir === currentDir
        })
        .map(({ meta }, index) => ({
            current: meta.href === currentHref,
            name: meta.title,
            position: meta.position ?? index,
            href: meta.href,
        }))
        .sort((a, b) => a.position - b.position)
}

/**
 * Inject page navigation into each page's meta data.
 * @param {Object} data - The data object containing pagesData
 * @param {Array} data.pagesData - Array of page data objects
 * @returns {Array} Array of processed page data with navigation
 */
export function getMetaData(data) {
    if (!data || !Array.isArray(data.pagesData)) {
        return data?.pagesData || []
    }

    return data.pagesData.map(({ content, meta }) => {
        const pageNav =
            meta.page_navigation || getPageNavigation(data.pagesData, meta.href)

        return {
            content,
            meta: {
                ...meta,
                pageNav: {
                    activeClass: config.active_page_nav_class,
                    elements: pageNav.length > 1 ? pageNav : [],
                },
            },
        }
    })
}
