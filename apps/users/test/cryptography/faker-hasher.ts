import { HashComparer } from '@/domain/users/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/users/application/cryptography/hash-generator'

export class FakerHasher implements HashComparer, HashGenerator {
  async generate(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
