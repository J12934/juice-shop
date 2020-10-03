const rimraf = require('rimraf')
const unzipper = require('unzipper')
const request = require('request')
const semver = require('semver')

const packageJson = require('./package.json')

async function installFrontendAssets () {
  rimraf.sync('frontend/dist/')

  const version = semver.parse(packageJson.version)
  if (version.prerelease.length !== 0) {
    console.info(
      `ℹ️  You seem to be running a development version of Juice Shop (${version.version})`
    )
    console.info(
      'Juice Shop doesn\'t publish precompiled frontend assets for development version. You will have to compile them yourself.'
    )
    console.info('You can build them by running the following commands:')
    console.info('')
    console.info('$ cd frontend && npm install && npm run build')

    process.exit(0)
  }

  console.info('⬇️  Downloading compiled frontend assets for Juice Shop')

  await request
    .get(
      `https://github.com/J12934/juice-shop/releases/download/v${version.version}/dist.zip`
    )
    .on('complete', function (response) {
      if (response.statusCode < 400) {
        console.info('✅ Downloading finished, unzipping now')
      } else if (response.statusCode === 404) {
        console.error(
          `❌ Could not find Compiled assets for Juice Shop Version v${packageJson.version}. You might need to compile them yourself. See: TODO(@J12934)`
        )
        process.exit(1)
      } else if (response.statusCode >= 500) {
        console.error('❌ Got a 5XX Status Code Back from GitHub.')
        console.error('You have the following options')
        console.error(
          ' - Check GitHub Status for servers to work correctly again: https://githubstatus.com/'
        )
        console.error(' - Compile the assets yourself. See: TODO(@J12934)')
        process.exit(1)
      }
    })
    .on('error', function () {
      console.error('❌ Could not reach GitHub Download servers')
      console.error('You have the following options')
      console.error(
        ' - Check GitHub Status for servers to work correctly again: https://githubstatus.com/'
      )
      console.error(' - Compile the assets yourself. See: TODO(@J12934)')
      process.exit(1)
    })
    .pipe(unzipper.Extract({ path: 'frontend/' }))
    .promise()

  console.log('🏁 Good to go!')
}

installFrontendAssets().catch((error) => {
  console.error('Failed to download compiled frontend assets.')
  console.error(error.message)

  process.exit(1)
})
