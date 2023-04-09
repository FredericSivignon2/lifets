export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const isNil = (a: any): boolean => a === null || a === undefined