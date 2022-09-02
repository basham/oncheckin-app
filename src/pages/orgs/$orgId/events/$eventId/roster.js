import { format, isBefore, sub } from 'date-fns'
import { getEvent, getOrg } from '@src/api.js'

export async function get ({ keys }) {
  const { orgId, eventId } = keys
  const org = await getOrg(orgId)
  const event = await getEvent(orgId, eventId)
  const h1 = event.name
  const returnersCutoff = ''
  const participants = []
  const template = { h1, org, event, returnersCutoff, participants }
  return { template }
}
