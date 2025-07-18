import fs from 'fs'
import path from 'path'

const link = path.resolve('node_modules/@nera-static/plugin-page-navigation')

try {
    if (fs.existsSync(link) && fs.lstatSync(link).isSymbolicLink()) {
        fs.unlinkSync(link)
        console.log(`🧹 Symlink removed: ${link}`)
    }
} catch (error) {
    console.error(`❌ Failed to remove symlink: ${error.message}`)
}
