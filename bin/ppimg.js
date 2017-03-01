#!/usr/bin/env node

const ImagePostProcessor = require("../lib/ppimg.js").default;
const p = ImagePostProcessor()
p.process().finally(() => {
  console.log('Done')
})
