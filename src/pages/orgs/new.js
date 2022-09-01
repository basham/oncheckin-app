import { addOrg } from '@src/server/device.js'
import { createOrg } from '@src/server/org.js'

export async function get ({ route }) {
  const h1 = 'New organization'
  const template = { route, h1 }
  return { template }
}

export async function post ({ request }) {
  const data = await request.formData()
  const name = data.get('name')
  const { id, url } = await createOrg({ name })
  await addOrg(id)
  return Response.redirect(url)
}