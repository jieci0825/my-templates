import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(__dirname, '../data/db.json')

export interface UserData {
    id: number
    username: string
    password: string
    nickname: string
    avatar: string
    roleId: number
    accessToken: string
    accessTokenExpiresAt: number
    refreshToken: string
    refreshTokenExpiresAt: number
    menus: any[]
    permissions: string[]
}

export interface Database {
    users: UserData[]
}

/** 读取数据库 */
export function readData(): Database {
    const raw = readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
}

/** 写入数据库 */
export function writeData(data: Database): void {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 4), 'utf-8')
}
