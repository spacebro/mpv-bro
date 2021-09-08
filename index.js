
const settings = require('standard-settings').getSettings()
const assignment = require('assignment')
const Mpv = require('node-mpv')
const { SpacebroClient } = require('spacebro-client')
const path = require('path')
const version = require('./package').version

const client = new SpacebroClient(settings.service.spacebro)

const player = new Mpv({
  verbose: settings.mpv.verbose,
  socket: `/tmp/node-mpv-bro-${version}.sock`,
  debug: settings.mpv.debug,
  audio_only: false
}, settings.mpvParams)

const currentFilepath = ''

player.on('stopped', function () {
  console.log('⏹ - stop', currentFilepath && path.basename(currentFilepath))
})
player.on('started', function () {
  console.log('⏯ - start', currentFilepath && path.basename(currentFilepath))
})
player.on('paused', function () {
  console.log('⏸  - pause', currentFilepath && path.basename(currentFilepath))
})

player.start()
  .then(() => {
    console.log('✅ player ready')
  })
  .catch((error) => {
    console.error(error)
  })

const mpvOptions = {
}

const mpvLoad = (filepath, options) => {
  player.stop()
    .then(() => {
      return player.load(filepath)
    })
    .then(() => {
      if (options && options.inf) {
        return player.loop('inf')
      } else {
        return player.getDuration()
      }
    })
    .then(() => {
      return player.pause()
    })
    .catch((error) => {
      console.error(error)
    })
}

const mpvLoadAndPlay = (filepath, options) => {
  player.stop()
    .then(() => {
      return player.load(filepath)
    })
    .then(() => {
      if (options && options.inf) {
        return player.loop('inf')
      } else {
        return player.play()
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const mpvStop = () => {
  player.stop()
    .catch((error) => {
      console.error(error)
    })
}

const mpvPlay = () => {
  player.play()
    .catch((error) => {
      console.error(error)
    })
}

const mpvPause = () => {
  player.pause()
    .catch((error) => {
      console.error(error)
    })
}

const mpvResume = () => {
  player.resume()
    .catch((error) => {
      console.error(error)
    })
}

client.on('connect', (data) => {
  console.log('connected to server')
})

client.on('loadAndPlay', (data) => {
  data = assignment(JSON.parse(JSON.stringify(settings.media)), data)
  console.log('loadAndplay received', data)
  if (data.path) {
    const options = data.options
    mpvLoadAndPlay(data.path, options)
  } else {
    console.log('play event received with no path. Please provide a path to play')
  }
})

client.on('loadPath', (data) => {
  if (data.path) {
    const options = data.options
    mpvLoad(data.path, options)
  } else {
    console.log('load receive but no path set')
  }
})

client.on('stop', (data) => {
  console.log('stop - received')
  mpvStop()
})

client.on('play', (data) => {
  console.log('play - received')
  mpvPlay()
})

client.on('pause', (data) => {
  console.log('pause - received')
  mpvPause()
})

client.on('resume', (data) => {
  console.log('resume - received')
  mpvResume()
})

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log(err)
  player.quit()
})
