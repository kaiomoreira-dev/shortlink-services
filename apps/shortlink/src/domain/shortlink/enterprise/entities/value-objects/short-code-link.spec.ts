import { ShortUrl } from './short-code-link'

describe('ShortCode', () => {
  it('should be able to create a short code', () => {
    const shortCode = ShortUrl.create('http://localhost:3335/')
    expect(typeof shortCode.value).toEqual('string')
  })
})
