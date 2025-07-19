import path from 'path'
import pug from 'pug'
import { load } from 'cheerio'
import { describe, it, expect } from 'vitest'
import { getMetaData } from '../index.js'

describe('Page Navigation Plugin', () => {
    const pagesData = [
        {
            content: '<h1>Page A</h1>',
            meta: {
                title: 'Page A',
                href: '/docs/page-a.html',
                dirname: '/docs',
                position: 2,
            },
        },
        {
            content: '<h1>Page B</h1>',
            meta: {
                title: 'Page B',
                href: '/docs/page-b.html',
                dirname: '/docs',
                position: 1,
            },
        },
        {
            content: '<h1>Page C</h1>',
            meta: {
                title: 'Page C',
                href: '/guide/page-c.html',
                dirname: '/guide',
            },
        },
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
        const pagesWithCustomNav = [
            {
                content: '<h1>Custom Page</h1>',
                meta: {
                    title: 'Custom Page',
                    href: '/custom.html',
                    dirname: '/',
                    page_navigation: [
                        { href: '/index.html', name: 'Home' },
                        { href: '/contact.html', name: 'Contact' },
                    ],
                },
            },
        ]

        const result = getMetaData({ pagesData: pagesWithCustomNav })
        const nav = result[0].meta.pageNav

        expect(nav.elements).toHaveLength(2)
        expect(nav.elements[0]).toMatchObject({
            name: 'Home',
            href: '/index.html',
        })
    })

    it('renders simple navigation with correct classes and links', () => {
        const templatePath = path.resolve('views/page-navigation.pug')

        const compileTemplate = pug.compileFile(templatePath, {
            basedir: path.resolve('.'),
        })

        const html = compileTemplate({
            meta: {
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
})
