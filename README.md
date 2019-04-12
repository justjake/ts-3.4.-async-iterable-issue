This will demonstrate the issue:

```
npm install
npm start
```

---

I hit some runtime errors after following Typescript's iterable types.

At runtime, a call to `await iterable.next()` will return `{ done: true, value: undefined }`
for a complete `async * function` generator. However, the return type for `async * function` generator,
`AsyncIterableIterator<T>`, does not allow for `value: undefined`.

The return type of `await iterable.next()` should include `| { done: true,
value: undefined }`.

Here's a demonstration of the issue:

https://github.com/justjake/ts-3.4.-async-iterable-issue

```typescript
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
```

Here's a playground link, although this is less helpful because playground does not have the AsyncIterableIterator type (see also https://github.com/Microsoft/TypeScript/issues/23030#issuecomment-482692170)

https://www.typescriptlang.org/play/#src=async%20function*%20generate()%20%7B%0D%0A%20%20yield%201%0D%0A%20%20yield%202%0D%0A%20%20yield%203%0D%0A%7D%0D%0A%0D%0A%2F%2F%20AsyncIterableIterator%3C1%20%7C%202%20%7C%203%3E%0D%0Atype%20Out%20%3D%20ReturnType%3Ctypeof%20generate%3E%0D%0A%0D%0Aasync%20function%20consume()%20%7B%0D%0A%20%20const%20iterator%20%3D%20generate()%0D%0A%20%20const%20yield1%20%3D%20await%20iterator.next()%0D%0A%20%20const%20yield2%20%3D%20await%20iterator.next()%0D%0A%20%20const%20yield3%20%3D%20await%20iterator.next()%0D%0A%20%20const%20yield4%20%3D%20await%20iterator.next()%0D%0A%0D%0A%20%20%2F%2F%20IteratorResult%3C1%20%7C%202%20%7C%203%3E%0D%0A%20%20type%20ExpectedYield4Type%20%3D%20typeof%20yield4%0D%0A%20%20%2F%2F%20%201%20%7C%202%20%7C%203%0D%0A%20%20type%20ExpectedYield4ValueType%20%3D%20typeof%20yield4.value%0D%0A%0D%0A%20%20console.log('yield4'%2C%20yield4)%20%2F%2F%20%7B%20value%3A%20undefined%2C%20done%3A%20true%20%7D%0D%0A%20%20console.log('yiled4.value'%2C%20yield4.value)%20%2F%2F%20undefined%0D%0A%20%20if%20(yield4.value%20%3D%3D%3D%20undefined)%20%7B%0D%0A%20%20%20%20throw%20new%20Error('yield4.value%20type%20is%201%20%7C%202%20%7C%203%2C%20so%20value%20cannot%20be%20undefined')%0D%0A%20%20%7D%0D%0A%7D%0D%0A%0D%0Aconsume()
