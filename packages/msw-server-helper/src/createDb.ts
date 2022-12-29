import sqlite from 'sqlite3'
import path from 'path'
import fs from 'fs'
import { defaultPath } from './constants'

export async function createDb(location = defaultPath) {
  const sqlite3 = sqlite.verbose()

  return new Promise<void>((resolve, reject) => {
    console.log(`creating database at ${location}...`)
    const db = new sqlite3.Database(location, (error) => {
      if (error) {
        console.log('...failed')
        reject(error)
        return
      }
      console.log('...succeeded')
      console.log('creating tables...')
      db.exec(
        fs.readFileSync(path.resolve(__dirname, 'overrides.sql'), 'utf8'),
        (error) => {
          if (error) {
            console.log('...failed')
            reject(error)
            return
          }
          console.log('...succeeded')
          resolve()
        }
      )
    })
  })
}

createDb()
