// import 'module-alias/register';
import config from './config'
import { add } from './exampleFolder/exampleFile'

const { hello } = config
const values = {
  value1: 4,
  value2: 5,
}

console.log('App says: ', hello)
console.log('Result of sum is: ', add(values))
