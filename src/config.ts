import dotenv from 'dotenv'
import { env } from '@usefultools/utils'

dotenv.config()

export interface Config {
  hello?: string
}

const config: Config = {
  hello: env.getAsStr('CONSTANT_EXAMPLE'),
}

export default config
