# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2026-07-21

### Changed

-   raised minimum Node from 18 to 20; Node 18 reached end-of-life on
    2025-04-30 and the dev toolchain requires Node 20+


## [2.2.0] - 2026-07-20

### Added

-   `helper/mixins.pug` and `helper/setup.pug` are now published alongside
    `page-navigation.pug`. Only the entry template was copied before, so the
    documented `+simpleNav`, `+pipeSeparated` and `+linkList` mixins had no
    source to come from
-   `--force` flag on `nera-page-navigation`, to re-publish over an existing
    `views/vendor/plugin-page-navigation/`. Without it, publishing skips as
    before

### Fixed

-   **the published template can now actually compile.** It began with
    `include ../node_modules/@nera-static/plugin-page-navigation/views/helper/mixins`,
    which resolves to `views/vendor/node_modules/…` once published — a path
    that never exists. Rendering a site failed with
    `ENOENT: ... views/vendor/node_modules/@nera-static/plugin-page-navigation/views/helper/mixins.pug`.
    The include is now relative to the template itself
-   **the active-link class no longer disappears without a config file.**
    `activeClass` came straight from config with no JS fallback, so a site
    with no `config/page-navigation.yaml` got `undefined` and the current page
    was styled like every other link. It now defaults to
    `page-nav__link--active`, matching the shipped config
-   **page ordering is deterministic when only some pages set `position`.**
    The fallback was the page's index in the *unsorted* filtered list, so an
    explicit `position: 1` tied with the second unpositioned page and the
    winner depended on `fs.readdir` order. Pages with an explicit `position`
    now come first, ordered by it; the rest follow, ordered by `href`
-   `position: 0` is treated as a real value rather than as absent
-   a non-array `page_navigation` is ignored instead of being passed to the
    template. A string of two or more characters passed the old `length > 1`
    check and pug then iterated it one character at a time, rendering a link
    per letter

### Changed

-   configuration is read inside `getMetaData` rather than at module load, so
    edits take effect without a restart
-   `@nera-static/plugin-utils` range raised to `^1.2.0`, where `force` lands

### Documentation

-   the include example uses the layout-relative form; the documented
    `views/vendor/…` resolved to `views/layouts/views/vendor/…` and could
    never work
-   the configuration example now shows the real default,
    `page-nav__link--active`, instead of `active`, which nothing used
-   fixed an invalid `npx` invocation; the command is `npx nera-page-navigation`

## [2.1.0] - 2024-12-27

### Added

-   Professional CHANGELOG.md for release tracking
-   Enhanced README.md with comprehensive documentation and examples
-   Support for Nera v4.1.0 static site generator
-   BEM (Block Element Modifier) CSS methodology for all templates
-   Enhanced template publishing system via `bin/publish-template.js`
-   Comprehensive test suite with 5 tests covering all functionality

### Changed

-   Updated @nera-static/plugin-utils to v1.1.0 for improved compatibility
-   Improved package.json metadata and repository references
-   Enhanced code documentation and examples
-   Modernized CSS classes using BEM methodology:
    -   `.page-nav` (main navigation block)
    -   `.page-nav__item` (navigation list items)
    -   `.page-nav__link` (navigation links)
    -   `.page-nav__link--active` (active navigation link)
    -   `.page-nav--list` (list-style navigation modifier)
    -   `.page-nav--pipe-separated` (pipe-separated navigation modifier)

### Technical Details

-   Maintains stable API with `getMetaData()` function
-   Full compatibility with Nera v4.1.0 plugin system
-   Zero breaking changes from previous version
-   All tests passing (5/5)
-   Template publishing to `views/vendor/plugin-page-navigation/`
-   Sibling page navigation within directory structures

## [2.0.0] - 2024-07-19

### Added

-   Initial stable release for Nera static site generator
-   Sibling page navigation generation within directories
-   Support for custom position ordering via frontmatter
-   Built-in Pug templates with multiple navigation styles
-   Automatic active page highlighting
-   Template publishing system
-   Comprehensive test coverage

### Features

-   Simple navigation, pipe-separated, and list-style formats
-   Directory-based sibling page detection
-   Configurable active page CSS classes
-   Template inheritance and mixins
-   Integration with @nera-static/plugin-utils

### Dependencies

-   Node.js >=18 support
-   ES modules architecture
-   Modern development tooling (Vitest, ESLint, Husky)
