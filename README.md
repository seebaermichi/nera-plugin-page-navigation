# @nera-static/plugin-page-navigation

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates a navigation between sibling pages or uses custom navigation definitions. Lightweight, flexible, and easy to integrate in any layout.

## ✨ Features

-   Automatically adds navigation based on sibling pages
-   Supports custom navigation via frontmatter
-   Optional sorting via `position` meta field
-   Configurable `active` class for the current page
-   Includes a ready-to-use Pug view

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-page-navigation
```

Nera will automatically detect the plugin and apply the page navigation metadata during the build.

## 🛠️ Usage

### Automatic sibling navigation

If you don’t define a `page_navigation` property in your markdown file, the plugin will automatically collect sibling pages from the same directory.

You can define a `position` field to control the sorting:

```yaml
---
title: Page A
type: page
position: 1
---
```

### Custom navigation

To override the navigation, define it in the frontmatter like this:

```yaml
---
title: Page with custom nav
type: page
page_navigation:
    - href: /index.html
      name: Home
    - href: /contact.html
      name: Contact
---
```

## 🛠️ Publish Default Template

Use the default template provided by the plugin:

```bash
npx @nera-static/plugin-page-navigation run publish-template
```

This copies the template to:

```
views/vendor/plugin-page-navigation/page-navigation.pug
```

> 💡 The file contains multiple layout options. Uncomment the version that fits your needs.

### Using the template in your layout

Once published, include the navigation in your Pug templates:

```pug
include views/vendor/plugin-page-navigation/page-navigation
```

The plugin provides three navigation styles:

-   `+simpleNav` - Basic horizontal navigation (default)
-   `+pipeSeparated` - Navigation with pipe separators
-   `+linkList` - Unordered list navigation

### Available metadata

The plugin adds the following data to each page's `meta` object:

```javascript
meta.pageNav = {
    activeClass: 'active', // CSS class for current page
    elements: [
        // Array of navigation items
        {
            name: 'Page Title',
            href: '/path/to/page.html',
            current: true, // true for current page
            position: 1,
        },
    ],
}
```

## ⚙️ Configuration

```yaml
# config/page-navigation.yaml
active_page_nav_class: 'active'
```

This class will be applied to the currently active page in the navigation.

## 🧪 Development

```bash
npm install
npm test
npm run lint
npm run publish-template  # Publish templates to your project
```

Tests use [Vitest](https://vitest.dev) and cover:

-   Sibling navigation detection
-   Custom overrides
-   Sorting via position
-   Active class behavior

### 🔄 Compatibility

-   **Nera v4.1.0+**: Full compatibility with latest static site generator
-   **Node.js 18+**: Modern JavaScript features and ES modules
-   **Plugin Utils v1.1.0+**: Enhanced plugin utilities integration

### 🏗️ Architecture

This plugin uses the `getMetaData()` function to process page data and inject sibling navigation information. It automatically detects pages in the same directory and provides multiple template formats.

### 🎨 BEM CSS Classes

The plugin uses BEM (Block Element Modifier) methodology:

-   `.page-nav` - Main navigation block
-   `.page-nav__item` - Navigation list items
-   `.page-nav__link` - Navigation links
-   `.page-nav__link--active` - Active page link
-   `.page-nav--list` - List-style navigation
-   `.page-nav--pipe-separated` - Pipe-separated navigation

## 🧑‍💻 Author

Michael Becker  
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

-   [Plugin Repository](https://github.com/seebaermichi/nera-plugin-page-navigation)
-   [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-page-navigation)
-   [Nera Static Site Generator](https://github.com/seebaermichi/nera)
-   [Plugin Documentation](https://github.com/seebaermichi/nera#plugins)

## 📦 License

MIT
