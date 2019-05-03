const signale = require('signale')
const semver = require('semver')
const axios = require('axios')
const fs = require('fs')

class ServerUpdater {
  constructor (core = 'paper', mc = '0.0.0') {
    this.core = core
    this.mc = mc
  }

  update (fn) {
    signale.success('started server updater')
    const files_url = `https://yivesmirror.com/api/list/${this.core}`

    signale.info(`requesting file list for ${this.core}`)
    axios.get(files_url).then(response => {
      let file = null
      let mc = this.mc
      let build = 0

      if (this.mc === '0.0.0') {
        response.data.map(e => {
          const ver = e.split('-')[1]

          if (semver.valid(ver) && semver.gt(ver, mc)) {
            mc = ver
          }
        })
      }

      file = response.data.find(e => ~e.indexOf(mc))

      if (!file) {
        signale.error(`cannot find file for version ${mc}`)
        return
      }

      if (file.includes('SNAPSHOT')) {
        build = file.split('SNAPSHOT-')[1].split('.jar')[0]
      } else {
        build = +file.split('-b')[1].split('.jar')[0]
      }

      let config = {}
      const config_file = `${process.cwd()}/sup.json`
      if (!fs.existsSync(config_file)) {
        fs.writeFileSync(config_file, '{}')
      } else {
        config = require(config_file)
      }

      if (config[this.core] && config[this.core][mc] && config[this.core][mc].build === build) {
        signale.success(`core ${this.core} is up to date`)
        return
      }

      config[this.core] = {
        [mc]: { build }
      }

      signale.info(`updating config file`)
      fs.writeFileSync(config_file, JSON.stringify(config))

      signale.info(`updating core`)
      const download_url = `https://yivesmirror.com/files/${this.core}/${file}`
      axios({
        method: 'get',
        url: download_url,
        responseType: 'stream',
      }).then(response => {
        const core_dir = `${process.cwd()}/cores`
        if (!fs.existsSync(core_dir)) {
          fs.mkdirSync(core_dir)
        }

        const wr = fs.createWriteStream(`${core_dir}/${this.core}-${mc}.jar`)
        response.data.pipe(wr)
        response.data.on('end', _ => {
          signale.success(`core ${this.core} updated to build ${build}`)
        })
      })
    })
  }
}

ServerUpdater.getCoreList = function (fn) {
  const url = "https://yivesmirror.com/api/list/all"
  axios.get(url).then(response => {
    fn(response.data)
  })
}

module.exports = ServerUpdater
