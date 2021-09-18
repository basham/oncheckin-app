import { createId, get, resolvePath, set, sortAsc, storage } from './util.js'

const fileName = 'participant.json'

export async function createParticipant (values) {
  return await setParticipant(createId(), values)
}

export function getParticipant (id) {
  const data = get(`${id}/${fileName}`)
  if (!data) {
    return undefined
  }
  const fullName = `${data.firstName} ${data.lastName}`.trim()
  const url = `?p=participant&id=${id}`
  return {
    ...data,
    id,
    fullName,
    url
  }
}

export function getParticipants () {
  const ids = storage
    .paths({
      pathStartsWith: resolvePath(),
      pathEndsWith: fileName
    })
    .map((path) => path.split('/')[2])
  const uniqueIds = Array.from(new Set(ids))
  return uniqueIds
    .map(getParticipant)
    .filter((item) => item)
    .sort(sortAsc('fullName'))
}

export async function setParticipant (id, values) {
  await set(`${id}/${fileName}`, values)
  return getParticipant(id)
}

const participant = {
  create: createParticipant,
  get: getParticipant,
  getAll: getParticipants,
  set: setParticipant
}

export default participant
