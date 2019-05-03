const pkg = require('../package.json')
const program = require('commander')
const signale = require('signale')

const ServerUpdater = require('./updater/server')
const PluginUpdater = require('./updater/plugin')

program.version(pkg.version)
        .option('-c, --core [core]', 'server core to be updated')
        .option('-v, --mc [version]', 'minecraft version')
        .option('--core-list', 'output server core list')

program.parse(process.argv)

if (program.coreList) {
  ServerUpdater.getCoreList(list => {
    signale.info(list.join(', '))
  })
}

const su = new ServerUpdater(program.core, program.mc)
const pu = new PluginUpdater()

su.update()
// pu.update()
