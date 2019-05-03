const archive = require('ls-archive')
const signale = require('signale')
const yaml = require('js-yaml')
const fs = require('fs')

class PluginUpdater {
  constructor () {

  }

  update () {
    signale.success('started plugin updater')
    signale.info('searching for outdated plugins')
    const plugin_dir = `${process.cwd()}/plugins`
    const plugins = fs.readdirSync(plugin_dir).filter(p => p.endsWith('.jar'))

    Promise.all(plugins.map(p => {
      return new Promise(resolve => {
        archive.readFile(`${plugin_dir}/${p}`, 'plugin.yml', (err, yml) => {
          if (err) {
            signale.error(`cannot read plugin.yml of plugin ${p}`)
            return resolve()
          }

          const data = yaml.safeLoad(yml, { json: true })
          signale.debug(data.name, data.version)
        })
      })
    }))
  }
}

module.exports = PluginUpdater
