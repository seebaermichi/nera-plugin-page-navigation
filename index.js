import path from 'path'
import { getConfig } from '@nera-static/plugin-utils'

// Matches the `active_page_nav_class` in the shipped config/page-navigation.yaml.
// Without a JS fallback, a site with no config file got `activeClass: undefined`
// and the active state silently disappeared.
const DEFAULT_ACTIVE_CLASS = 'page-nav__link--active'

/**
 * Build a sibling navigation for the current page.
 *
 * Pages that declare an explicit `position` come first, ordered by it; pages
 * without one follow, ordered by href. Previously the fallback position was
 * the page's index in the *unsorted* filtered array, so an explicit
 * `position: 1` tied with the second unpositioned page and the winner depended
 * on fs.readdir order.
 *
 * href is used as the final tiebreak rather than document order because
 * document order *is* fs.readdir order, which is not guaranteed stable when
 * files are added. Since href derives from the filename, on a filesystem that
 * already returns entries alphabetically this produces the same result — it
 * just no longer depends on that being true.
 *
 * @param {Array} pagesData - Array of page data objects
 * @param {string} currentHref - Current page href
 * @returns {Array} Array of navigation items
 */
function getPageNavigation(pagesData, currentHref) {
    const currentDir = path.dirname(currentHref)

    const siblings = pagesData
        .filter(({ meta }) => {
            const pageDir = meta.dirname
            return currentDir !== '/' && pageDir === currentDir
        })
        .map(({ meta }) => ({
            current: meta.href === currentHref,
            name: meta.title,
            // `?? null` rather than a truthiness test: `position: 0` is a
            // legitimate value and must not be treated as absent.
            explicitPosition: meta.position ?? null,
            href: meta.href,
        }))

    return siblings
        .sort((a, b) => {
            const aHas = a.explicitPosition !== null
            const bHas = b.explicitPosition !== null

            if (aHas !== bHas) {
                return aHas ? -1 : 1
            }
            if (aHas && bHas && a.explicitPosition !== b.explicitPosition) {
                return a.explicitPosition - b.explicitPosition
            }

            return String(a.href ?? '').localeCompare(String(b.href ?? ''))
        })
        .map(({ current, name, href }, index) => ({
            current,
            name,
            position: index,
            href,
        }))
}

/**
 * A navigation entry must be a plain object, because the template reads
 * `item.current`, `item.href` and `item.name` off it.
 *
 * `null` is the case that mattered: an empty list item under
 * `page_navigation:` is parsed by js-yaml as null, survived every check here,
 * and then threw `Cannot read properties of null` inside the template. Nothing
 * in the generator catches a render error, so one page's YAML typo killed the
 * whole build.
 *
 * @param {*} item - Candidate navigation entry
 * @param {string} href - Current page href, for the warning
 * @returns {boolean} True when the entry can be rendered
 */
function isUsableEntry(item, href) {
    const usable =
        typeof item === 'object' && item !== null && !Array.isArray(item)

    if (!usable) {
        console.warn(
            `⚠️  plugin-page-navigation: skipping an invalid page_navigation entry on ${href} — each entry must be a mapping with href and name.`
        )
    }

    return usable
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

    // Read config here rather than at module load, so edits are picked up
    // without a restart and tests can point at a temporary cwd.
    const config = getConfig(
        path.resolve(process.cwd(), 'config/page-navigation.yaml')
    )
    const activeClass = config.active_page_nav_class || DEFAULT_ACTIVE_CLASS

    return data.pagesData.map(({ content, meta }) => {
        const custom = meta.page_navigation
        const isCustom = Boolean(custom)
        const pageNav = custom || getPageNavigation(data.pagesData, meta.href)

        // Must be an array. A string `page_navigation` passed the old
        // `length > 1` check and was handed to the template as a string, which
        // pug then iterated one character at a time.
        const entries = Array.isArray(pageNav)
            ? pageNav.filter((item) => isUsableEntry(item, meta.href))
            : []

        // An explicit `page_navigation` needs only one entry: the user asked
        // for it. A *derived* sibling nav needs two, because a lone page
        // linking to nothing but itself is noise.
        const elements = entries.length >= (isCustom ? 1 : 2) ? entries : []

        return {
            content,
            meta: {
                ...meta,
                pageNav: {
                    activeClass,
                    elements,
                },
            },
        }
    })
}
