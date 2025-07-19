# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
