import { HashComparer } from '@/domain/user/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/user/application/cryptography/hash-generator'

export class FakerHasher implements HashComparer, HashGenerator {
  async generate(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
