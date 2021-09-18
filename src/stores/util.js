import cuid from 'cuid'
import earthstar, {
  OnePubOneWorkspaceSyncer,
  StorageLocalStorage,
  ValidatorEs4,
  checkAuthorKeypairIsValid,
  generateAuthorKeypair,
  isErr
} from 'earthstar/dist/earthstar.min.js'
const { localStorage } = window

const APP = 'oncheckin'
const USER_KEYPAIR = `${APP}-keypair`
const workspace = '+bfh3.hhh1997'
const pub = 'http://192.168.7.99:3333'

export const storage = new StorageLocalStorage([ValidatorEs4], workspace)
const syncer = new OnePubOneWorkspaceSyncer(storage, pub)
syncer.syncOnceAndContinueLive()

console.log('ES', earthstar)

const extDecodeMap = {
  json: (content) => JSON.parse(content),
  txt: (content) => content
}

const extEncodeMap = {
  json: (path, content) => JSON.stringify({
    ...(get(path) || {}),
    ...content
  }),
  txt: (path, content) => content
}

export function createId () {
  return cuid()
}

export function createRandomString (length) {
  return Math.random().toString(36).substr(2, length)
}

export function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function get (path) {
  const ext = parseExtension(path)
  const decode = extDecodeMap[ext]
  const content = storage.getContent(resolvePath(path))
  return content ? decode(content) : undefined
}

export function getKeypair () {
  const storedKeypair = JSON.parse(localStorage.getItem(USER_KEYPAIR))
  const check = checkAuthorKeypairIsValid(storedKeypair)
  if (!isErr(check)) {
    return storedKeypair
  }

  const shortname = createRandomString(4)
  const keypair = generateAuthorKeypair(shortname)
  localStorage.setItem(USER_KEYPAIR, JSON.stringify(keypair))
  return keypair
}

function parseExtension (path, defaultExtension = 'txt') {
  const extGroup = path.match(/\.(.+)$/)
  return extGroup ? extGroup[1] : defaultExtension
}

export function resolvePath (path = '') {
  const prefix = `/${APP}/`
  return path.startsWith(prefix) ? path : `${prefix}${path}`
}

export async function set (path, content) {
  const keypair = getKeypair()
  const ext = parseExtension(path)
  const encode = extEncodeMap[ext]
  const write = storage.set(keypair, {
    format: 'es.4',
    path: resolvePath(path),
    content: encode(path, content)
  })
  await delay(100)
  return write
}

export function sort (key, multiplier) {
  return (a, b) => {
    const [keyA, keyB] = [a, b]
      .map((item) => item[key])
    return keyA < keyB ? -1 * multiplier : keyA > keyB ? 1 * multiplier : 0
  }
}

export function sortAsc (key) {
  return sort(key, 1)
}

export function sortDesc (key) {
  return sort(key, -1)
}