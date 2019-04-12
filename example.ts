async function* generate() {
  yield 1
  yield 2
  yield 3
}

// AsyncIterableIterator<1 | 2 | 3>
type Out = ReturnType<typeof generate>

async function consume() {
  const iterator = generate()
  const yield1 = await iterator.next()
  const yield2 = await iterator.next()
  const yield3 = await iterator.next()
  const yield4 = await iterator.next()

  // IteratorResult<1 | 2 | 3>
  type ExpectedYield4Type = typeof yield4
  //  1 | 2 | 3
  type ExpectedYield4ValueType = typeof yield4.value

  console.log('yield4', yield4) // { value: undefined, done: true }
  console.log('yiled4.value', yield4.value) // undefined
  if (yield4.value === undefined) {
    throw new Error('yield4.value type is 1 | 2 | 3, so value cannot be undefined')
  }
}

consume()
