async function* generate() {
  yield 1
  yield 2
  yield 3
}

type Out = ReturnType<typeof generate>
