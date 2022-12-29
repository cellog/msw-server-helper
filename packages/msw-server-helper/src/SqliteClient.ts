import sqlite from 'sqlite3'
import { defaultPath } from './constants'
import { Methods, RestMatcher, SqliteMatcher } from './types'

export class SqliteClient {
  protected db: sqlite.Database
  constructor(location = defaultPath) {
    const sqlite3 = sqlite.verbose()
    this.db = new sqlite3.Database(location, sqlite.OPEN_READWRITE)
  }

  async reset() {
    return new Promise<void>((resolve, reject) => {
      this.db.exec('DELETE FROM rest;', (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  async getMatcher<Args = unknown>({
    endpointMatcher,
    method,
  }: {
    endpointMatcher: string
    method: Methods
  }) {
    const getMatcherStatement = this.db.prepare(
      'SELECT * FROM rest WHERE endpointMatcher = ? AND method = ?;'
    )
    return new Promise<RestMatcher<Args> | undefined>((resolve, reject) => {
      getMatcherStatement.bind(endpointMatcher, method)
      getMatcherStatement.get((err, data: SqliteMatcher) => {
        if (err) {
          reject(err)
          return
        }
        if (!data) {
          // no matcher found
          resolve(data)
          return
        }
        const matcherData: RestMatcher<Args> = {
          ...data,
          arguments: data.arguments
            ? (JSON.parse(data.arguments) as Args)
            : undefined,
        }
        resolve(matcherData)
      })
      getMatcherStatement.finalize()
    })
  }

  async setRestOverride({
    endpointMatcher,
    method,
    handlerName,
    args,
  }: {
    endpointMatcher: string
    method: Methods
    handlerName: string
    args?: any[]
  }) {
    const restOverrideStatement = this.db.prepare(
      'INSERT OR REPLACE INTO rest (endpointMatcher, method, handlerName, arguments) VALUES (?, ?, ?, ?);'
    )
    return new Promise<void>((resolve, reject) => {
      restOverrideStatement.bind(
        endpointMatcher,
        method,
        handlerName,
        args ? JSON.stringify(args) : null
      )
      restOverrideStatement.run((err) => {
        if (err) reject(err)
        resolve()
      })
      restOverrideStatement.finalize()
    })
  }
}
