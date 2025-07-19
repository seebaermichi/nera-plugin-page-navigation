#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import { publishTemplates } from '@nera-static/plugin-utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginName = 'plugin-page-navigation'
const sourceDir = path.resolve(__dirname, '../views/')

const result = publishTemplates({
    pluginName,
    sourceDir,
    templateFiles: 'page-navigation.pug',
    expectedPackageName: 'dummy', // for test-only override
})

process.exit(result ? 0 : 1)
