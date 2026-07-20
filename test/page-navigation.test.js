import fs from 'fs'
import os from 'os'
import path from 'path'
import pug from 'pug'
import { load } from 'cheerio'
import { fileURLToPath } from 'url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getMetaData } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, '..')
const VIEWS = path.join(PKG_ROOT, 'views')

let cwd
let originalCwd

// This suite used to rely on test/setup.js symlinking
// node_modules/@nera-static/plugin-page-navigation back to the repo root,
// which was the *only* reason the template's `../node_modules/...` include
// resolved. No real project has that symlink. Both the hack and the include
// are gone; nothing here depends on scaffolding.
//
// A temp cwd also keeps the plugin's config lookup off the repo's own
// config/page-navigation.yaml, which no consumer has.
beforeEach(() => {
    originalCwd = process.cwd()
    cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-page-navigation-'))
    process.chdir(cwd)
})

afterEach(() => {
    process.chdir(originalCwd)
    fs.rmSync(cwd, { recursive: true, force: true })
})

const writeConfig = (yaml) => {
    fs.mkdirSync(path.join(cwd, 'config'), { recursive: true })
    fs.writeFileSync(path.join(cwd, 'config/page-navigation.yaml'), yaml, 'utf-8')
}

const page = (title, href, dirname, extra = {}) => ({
    content: `<h1>${title}</h1>`,
    meta: { title, href, dirname, ...extra },
})

describe('Page Navigation Plugin', () => {
    const pagesData = [
        page('Page A', '/docs/page-a.html', '/docs', { position: 2 }),
        page('Page B', '/docs/page-b.html', '/docs', { position: 1 }),
        page('Page C', '/guide/page-c.html', '/guide'),
    ]

    it('generates sibling-based navigation if no custom page_navigation is provided', () => {
        const result = getMetaData({ pagesData })

        const pageANav = result.find((p) => p.meta.href === '/docs/page-a.html')
            ?.meta.pageNav
        const pageBNav = result.find((p) => p.meta.href === '/docs/page-b.html')
            ?.meta.pageNav
        const pageCNav = result.find(
            (p) => p.meta.href === '/guide/page-c.html'
        )?.meta.pageNav

        expect(pageANav.elements).toHaveLength(2)
        expect(pageBNav.elements[0]).toMatchObject({
            name: 'Page B',
            href: '/docs/page-b.html',
        })
        expect(pageBNav.elements[1]).toMatchObject({
            name: 'Page A',
            href: '/docs/page-a.html',
        })

        expect(pageBNav.elements[0].current).toBe(true)
        expect(pageBNav.elements[1].current).toBe(false)

        expect(pageCNav.elements).toHaveLength(0)
    })

    it('uses custom page_navigation if provided', () => {
        const result = getMetaData({
            pagesData: [
                page('Custom Page', '/custom.html', '/', {
                    page_navigation: [
                        { href: '/index.html', name: 'Home' },
                        { href: '/contact.html', name: 'Contact' },
                    ],
                }),
            ],
        })

        const nav = result[0].meta.pageNav

        expect(nav.elements).toHaveLength(2)
        expect(nav.elements[0]).toMatchObject({
            name: 'Home',
            href: '/index.html',
        })
    })

    describe('active class', () => {
        // Regression: there was no JS fallback, so a site with no config file
        // got activeClass: undefined and the active state silently vanished.
        it('defaults to the shipped class when no config file exists', () => {
            const result = getMetaData({ pagesData })

            expect(result[0].meta.pageNav.activeClass).toBe(
                'page-nav__link--active'
            )
        })

        it('honours a configured active_page_nav_class', () => {
            writeConfig('active_page_nav_class: is-current\n')

            const result = getMetaData({ pagesData })

            expect(result[0].meta.pageNav.activeClass).toBe('is-current')
        })
    })

    describe('ordering', () => {
        // Regression: the fallback position was the index in the *unsorted*
        // filtered array, so an explicit `position: 1` tied with the second
        // unpositioned page and the winner depended on fs.readdir order.
        const mixed = [
            page('W', '/docs/w.html', '/docs'),
            page('X', '/docs/x.html', '/docs', { position: 1 }),
            page('Y', '/docs/y.html', '/docs'),
            page('Z', '/docs/z.html', '/docs'),
        ]

        const names = (pages) =>
            getMetaData({ pagesData: pages })[0].meta.pageNav.elements.map(
                (e) => e.name
            )

        it('places explicitly positioned pages before unpositioned ones', () => {
            expect(names(mixed)).toEqual(['X', 'W', 'Y', 'Z'])
        })

        it('produces the same order regardless of input order', () => {
            expect(names([...mixed].reverse())).toEqual(names(mixed))
        })

        it('treats position: 0 as a real value, not as absent', () => {
            const pages = [
                page('one', '/docs/one.html', '/docs', { position: 1 }),
                page('zero', '/docs/zero.html', '/docs', { position: 0 }),
            ]

            expect(names(pages)).toEqual(['zero', 'one'])
        })

        it('assigns sequential positions after sorting', () => {
            const elements = getMetaData({ pagesData: mixed })[0].meta.pageNav
                .elements

            expect(elements.map((e) => e.position)).toEqual([0, 1, 2, 3])
        })
    })

    describe('invalid page_navigation', () => {
        // Regression: a string passed the `length > 1` check and was handed to
        // the template as a string, which pug iterated character by character.
        it('ignores a string instead of iterating its characters', () => {
            const result = getMetaData({
                pagesData: [
                    page('S', '/s.html', '/', { page_navigation: 'hello' }),
                ],
            })

            expect(result[0].meta.pageNav.elements).toEqual([])
        })

        it('ignores a non-array object', () => {
            const result = getMetaData({
                pagesData: [
                    page('O', '/o.html', '/', { page_navigation: { a: 1 } }),
                ],
            })

            expect(result[0].meta.pageNav.elements).toEqual([])
        })
    })

    describe('template rendering', () => {
        const render = (meta) =>
            pug.compileFile(path.join(VIEWS, 'page-navigation.pug'))({ meta })

        it('renders simple navigation with correct classes and links', () => {
            const html = render({
                pageNav: {
                    activeClass: 'page-nav__link--active',
                    elements: [
                        { name: 'Home', href: '/index.html', current: false },
                        { name: 'About', href: '/about.html', current: true },
                        {
                            name: 'Contact',
                            href: '/contact.html',
                            current: false,
                        },
                    ],
                },
            })

            const $ = load(html)
            const links = $('nav a')

            expect(links).toHaveLength(3)

            expect(links.eq(0).attr('href')).toBe('/index.html')
            expect(links.eq(0).attr('class')).toBe('page-nav__link')
            expect(links.eq(0).text()).toBe('Home')

            expect(links.eq(1).attr('href')).toBe('/about.html')
            expect(links.eq(1).attr('class')).toBe(
                'page-nav__link page-nav__link--active'
            )
            expect(links.eq(1).text()).toBe('About')

            expect(links.eq(2).attr('href')).toBe('/contact.html')
            expect(links.eq(2).attr('class')).toBe('page-nav__link')
            expect(links.eq(2).text()).toBe('Contact')
        })

        // The include is relative, so compiling needs no basedir and no
        // symlink — which is the whole point of the fix.
        it('compiles without a basedir option', () => {
            expect(() =>
                pug.compileFile(path.join(VIEWS, 'page-navigation.pug'))
            ).not.toThrow()
        })

        it('renders nothing when pageNav is missing entirely', () => {
            expect(render({})).toBe('')
        })

        it('renders nothing when there are no elements', () => {
            expect(
                render({ pageNav: { activeClass: 'x', elements: [] } })
            ).toBe('')
        })
    })
})
