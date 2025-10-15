#!/usr/bin/env bun

import { parseArgs } from 'util'

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
      short: 'p',
      default: '8000',
    },
    origin: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
})
