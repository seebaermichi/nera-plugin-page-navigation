#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import { publishTemplates } from '@nera-static/plugin-utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginName = 'plugin-page-navigation'
const sourceDir = path.resolve(__dirname, '../views/')
const force = process.argv.includes('--force')

// The helpers must ship too. page-navigation.pug includes helper/mixins, and
// mixins.pug in turn includes helper/setup — publishing only the entry
// template left both includes pointing at files that were never copied.
const templateFiles = [
    'page-navigation.pug',
    'helper/mixins.pug',
    'helper/setup.pug',
]

const result = publishTemplates({
    pluginName,
    sourceDir,
    templateFiles,
    force,
})

process.exit(result ? 0 : 1)
