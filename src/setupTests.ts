import { format } from 'util'
import { env } from '@usefultools/utils'

jest.spyOn(env, 'getAsStr').mockImplementation((key) => process.env[key] || '')
jest.spyOn(env, 'getAsInt').mockImplementation((key) => Number(process.env[key]))
jest.spyOn(env, 'getAsBool').mockImplementation((key) => Boolean(process.env[key]))

const error = global.console.error
const warn = global.console.warn

global.console.error = function (...args: unknown[]) {
  error(...args)
  // Fail the tests if we have a console.error
  throw new Error(format(...args))
}

global.console.warn = function (...args: unknown[]) {
  warn(...args)
  // Fail the tests if we have a console.warn
  throw new Error(format(...args))
}
