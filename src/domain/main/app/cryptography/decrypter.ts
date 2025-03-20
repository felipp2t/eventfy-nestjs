export abstract class Descrypter {
  abstract decrypt<T extends object>(ciphertext: string): Promise<T>
}
