import test from 'ava'
import Operation from 'src'

const s = 'abcdefg'

test('individual operations', (t) => {
  const op1 = new Operation([{ move: 1 }, { insert: 'FOO' }])
  const op2 = new Operation([{ move: 3 }, { insert: 'BAR' }])
  const op3 = new Operation([{ move: 3 }, { delete: 2 }])

  t.is(op1.apply(s), 'aFOObcdefg')
  t.is(op2.apply(s), 'abcBARdefg')
  t.is(op3.apply(s), 'abcfg')
})

test('combined operations', (t) => {
  const op1 = new Operation([{ move: 1 }, { insert: 'FOO' }])
  const op2 = new Operation([{ move: 2 }, { insert: 'BAR' }])

  const combined1 = Operation.combine(op1, op2)
  const combined2 = Operation.combine(op2, op1)

  t.is(combined2.apply(s), combined1.apply(s))
})
