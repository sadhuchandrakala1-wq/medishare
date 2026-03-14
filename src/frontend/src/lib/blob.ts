/**
 * Blob storage utility wrapper.
 * Provides ExternalBlob-compatible API for image handling.
 * Images are stored as base64 data URLs since the backend accepts imageUrl as a plain string.
 */

export class ExternalBlob {
  private bytes: Uint8Array | null = null;
  private url: string | null = null;
  private progressCallback: ((pct: number) => void) | null = null;

  private constructor() {}

  static fromBytes(bytes: Uint8Array): ExternalBlob {
    const instance = new ExternalBlob();
    instance.bytes = bytes;
    return instance;
  }

  static fromURL(url: string): ExternalBlob {
    const instance = new ExternalBlob();
    instance.url = url;
    return instance;
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.progressCallback = onProgress;
    return this;
  }

  getDirectURL(): string {
    if (this.url) return this.url;
    if (this.bytes) {
      // Convert to base64 data URL
      let binary = "";
      const len = this.bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(this.bytes[i]);
      }
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    return "";
  }

  async getBytes(): Promise<Uint8Array> {
    if (this.progressCallback) {
      this.progressCallback(50);
    }
    // Simulate async upload
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (this.progressCallback) {
      this.progressCallback(100);
    }
    if (this.bytes) return this.bytes;
    return new Uint8Array();
  }
}
