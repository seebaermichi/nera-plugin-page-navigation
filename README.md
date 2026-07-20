# @nera-static/plugin-page-navigation

A plugin for the [Nera](https://github.com/seebaermichi/nera) static site generator that creates navigation between sibling pages or allows custom definitions via frontmatter. Lightweight, flexible, and easy to integrate in any layout.

## ✨ Features

- Automatically adds navigation based on sibling pages
- Supports custom navigation overrides via frontmatter
- Optional sorting using `position` field
- Configurable `active` class for highlighting current page
- Includes a ready-to-use Pug template with multiple layout options
- Full compatibility with Nera v4.1.0+

## 🚀 Installation

Install the plugin in your Nera project:

```bash
npm install @nera-static/plugin-page-navigation
```

Nera will automatically detect the plugin and apply the navigation metadata during the build process.

## ⚙️ Configuration

Create an optional configuration file to override the active class name:

```yaml
# config/page-navigation.yaml
active_page_nav_class: 'page-nav__link--active'
```

This class is applied to the current page's link in the generated navigation,
alongside `page-nav__link`.

The value shown is the **default**, used when no config file is present — so
the file is genuinely optional. Set it only to use a different class name.

## 🧩 Usage

### Automatic sibling navigation

By default, pages in the same directory are grouped as siblings. You can optionally define `position` to control the sort order:

```yaml
---
title: Page A
position: 1
---
```

### Custom navigation via frontmatter

You can override the default navigation for a page by defining `page_navigation`:

```yaml
---
title: Page with custom nav
page_navigation:
  - href: /index.html
    name: Home
  - href: /contact.html
    name: Contact
---
```

### Navigation metadata

Each page receives the following structure in `meta.pageNav`:

```javascript
meta.pageNav = {
  activeClass: 'active',
  elements: [
    {
      name: 'Page Title',
      href: '/path/to/page.html',
      current: true,
      position: 1
    },
  ]
}
```

## 🛠️ Template Publishing

Use the default template provided by the plugin:

```bash
npx nera-page-navigation
```

This copies the template and the mixins it depends on:

```
views/vendor/plugin-page-navigation/
├── page-navigation.pug
└── helper/
    ├── mixins.pug
    └── setup.pug
```

Publishing skips when the directory already exists, so re-running never
discards your edits. To overwrite with the packaged versions:

```bash
npx nera-page-navigation --force
```

Then include it in your layout:

```pug
include ../vendor/plugin-page-navigation/page-navigation
```

The path is relative to the **including file**, so from a layout in
`views/layouts/` this resolves to `views/vendor/…`. A bare
`views/vendor/…` would resolve to `views/layouts/views/vendor/…` and fail.

### Available navigation styles

- `+simpleNav` – Basic horizontal navigation
- `+pipeSeparated` – Pipe-separated links
- `+linkList` – List-based navigation

Uncomment the layout option that suits your needs inside the template file.

## 🎨 Styling

The plugin uses BEM CSS methodology:

```css
.page-nav { }
.page-nav__item { }
.page-nav__link { }
.page-nav__link--active { }
.page-nav--list { }
.page-nav--pipe-separated { }
```

Customize or override these classes in your CSS.

## 📊 Generated Output

The plugin injects navigation metadata into each page’s `meta` object. The rendered output depends on the included template or custom markup.

## 🧪 Development

```bash
npm install
npm test
npm run lint
```

Tests use [Vitest](https://vitest.dev) and cover:

- Sibling detection and ordering
- Custom override behavior
- Template rendering
- Active class logic

## 🧑‍💻 Author

Michael Becker
[https://github.com/seebaermichi](https://github.com/seebaermichi)

## 🔗 Links

- [Plugin Repository](https://github.com/seebaermichi/nera-plugin-page-navigation)
- [NPM Package](https://www.npmjs.com/package/@nera-static/plugin-page-navigation)
- [Nera Static Site Generator](https://github.com/seebaermichi/nera)

## 🧩 Compatibility

- **Nera**: v4.1.0+
- **Node.js**: >= 18
- **Plugin API**: Uses `getMetaData()` for injecting navigation metadata

## 📦 License

MIT
