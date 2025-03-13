export abstract class Encrypter {
  /**
   * Encrypts the given payload and optionally sets an expiration time.
   *
   * @param payload - The data to be encrypted. It should be a key-value pair object.
   * @param expiresIn - Optional. The expiration time for the encrypted data.
   *                   Can be a string (e.g., "1h" for 1 hour) or a number (e.g., 3600 for 1 hour in seconds).
   *                   If not provided, the default expiration time is "1d" (1 day).
   * @returns A promise that resolves to the encrypted string.
   *
   * @example
   * const encrypter = new Encrypter();
   * const encrypted = await encrypter.encrypt({ userId: 123 }, "1h");
   * console.log(encrypted); // Outputs the encrypted string
   */
  abstract encrypt(
    payload: Record<string, unknown>,
    expiresIn?: string | number
  ): Promise<string>
}
