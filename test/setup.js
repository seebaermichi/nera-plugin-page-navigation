import fs from 'fs'
import path from 'path'

const target = path.resolve('.')
const link = path.resolve('node_modules/@nera-static/plugin-page-navigation')

try {
    fs.mkdirSync(path.dirname(link), { recursive: true })

    if (!fs.existsSync(link)) {
        fs.symlinkSync(target, link, 'dir')
        console.log(`✅ Symlink created: ${link} → ${target}`)
    }
} catch (error) {
    console.error(`❌ Failed to create symlink: ${error.message}`)
}
