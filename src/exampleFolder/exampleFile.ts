interface AddParams {
  value1: number
  value2: number
}

export function add(values: AddParams): number {
  return values.value1 + values.value2
}
