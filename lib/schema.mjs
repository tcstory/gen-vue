import { readFileSync } from 'node:fs'

export function read (filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}
