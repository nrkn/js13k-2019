import { readPathBufferMap } from '@mojule/files'
import { pack } from 'goonpack'
import { promises, createWriteStream } from 'fs'
import * as uglify from 'uglify-es'
import * as yazl from 'yazl'

const { writeFile, stat } = promises

const readFolder = async ( path: string ) => {
  const bufferMap = await readPathBufferMap( path )

  const map = {}

  Object.keys( bufferMap ).forEach( path => {
    if ( !path.endsWith( '.js' ) ) return

    map[ path ] = bufferMap[ path ].toString( 'utf8' )
  } )

  return map
}

const start = async () => {
  const map = await readFolder( './app/dist' )
  const source = `(()=>{${ pack( map ) }})()`
  const packed = uglify.minify( source )

  if ( packed.error ) {
    console.error( packed.error )
    return
  }

  await writeFile( './public/app.js', packed.code, 'utf8' )

  const bufferMap = await readPathBufferMap( './public' )

  const zip = new yazl.ZipFile()

  Object.keys( bufferMap ).forEach( bufferPath => {
    zip.addBuffer( bufferMap[ bufferPath ], bufferPath )
  } )

  zip.outputStream
    .pipe( createWriteStream( './zip/app.zip' ) )
    .on( 'close', async () => {
      const stats = await stat( './zip/app.zip' )

      console.log( `Size: ${ stats.size }` )
      console.log( `Remaining: ${ 13e3 - stats.size }` )
    } )

  zip.end()
}

start()
