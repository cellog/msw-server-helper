import { MswServerHelperError } from './MswServerHelperError'
import { SqliteClient } from './SqliteClient'

export async function resetMockOverrides() {
  const client = new SqliteClient()

  try {
    await client.reset()
    return true
  } catch (e) {
    throw new MswServerHelperError(
      `Unable to reset mock overrides: ${(e as Error).message}`,
      e as Error
    )
  }
}
