const Benchmark = require('benchmark')
const LoByte = require('../dist')

const suite = new Benchmark.Suite
suite.add('Int16.truncate', () => {
  return LoByte.Int16.truncate(-1)
})
.add('(baseline)', () => {
  return LoByte.baseline(-1)
})
.on('cycle', event => {
  console.log(String(event.target));
})
.on('complete', () => {
  console.log('Fastest is ' + suite.filter('fastest').map('name'));
})
.run({ 'async': true });