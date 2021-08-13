export const filterMethods = (methods) => Object.keys(methods)
  .filter(m => !m.startsWith('0x'))
  .reduce((a, m) => ({ ...a, [m]: methods[m] }), {})
