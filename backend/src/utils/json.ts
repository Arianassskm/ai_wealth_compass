import fs from 'fs/promises'

export async function readJSON(path: string) {
  try {
    const data = await fs.readFile(path, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { histories: [] }
    }
    throw error
  }
}

export async function writeJSON(path: string, data: any) {
  await fs.writeFile(path, JSON.stringify(data, null, 2))
} 