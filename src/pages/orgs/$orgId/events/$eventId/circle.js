import { getEvent } from '@src/server/event.js'
import { getOrg } from '@src/server/org.js'

export async function get ({ keys }) {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const h2 = 'Circle'
  const checkIns = []
  const template = { h1, h2, org, event, checkIns }
  return { template }
}
