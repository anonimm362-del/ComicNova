/* Tiny dependency-free ZIP reader for ComicNova uploads.
 * Supports standard ZIP entries using Store (0) or Deflate (8).
 * Encrypted/unsupported ZIP entries are skipped.
 */
(function () {
  const te = new TextDecoder();
  const sigEOCD = 0x06054b50;
  const sigCD = 0x02014b50;
  const sigLocal = 0x04034b50;

  function u16(v, o) { return v.getUint16(o, true); }
  function u32(v, o) { return v.getUint32(o, true); }

  function findEOCD(bytes) {
    const view = new DataView(bytes);
    const start = Math.max(0, bytes.byteLength - 22 - 0xFFFF);
    for (let i = bytes.byteLength - 22; i >= start; i--) {
      if (view.getUint32(i, true) === sigEOCD) return i;
    }
    throw new Error('ZIP End of Central Directory tidak ditemukan.');
  }

  async function inflate(raw) {
    if (!('DecompressionStream' in window)) {
      throw new Error('Browser ini belum mendukung ekstraksi ZIP Deflate. Gunakan Chrome/Edge/Firefox versi terbaru.');
    }
    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  function isImage(name) {
    return /\.(jpe?g|png|webp|gif)$/i.test(name);
  }

  async function readZip(file) {
    const bytes = await file.arrayBuffer();
    const view = new DataView(bytes);
    const eocd = findEOCD(bytes);
    const count = u16(view, eocd + 10);
    const cdSize = u32(view, eocd + 12);
    const cdOffset = u32(view, eocd + 16);
    if (count === 0) throw new Error('ZIP kosong.');
    if (cdOffset + cdSize > bytes.byteLength) throw new Error('ZIP rusak atau tidak lengkap.');

    const entries = [];
    let p = cdOffset;
    for (let i = 0; i < count; i++) {
      if (view.getUint32(p, true) !== sigCD) throw new Error('Central Directory ZIP tidak valid.');
      const flags = u16(view, p + 8);
      const method = u16(view, p + 10);
      const compressedSize = u32(view, p + 20);
      const uncompressedSize = u32(view, p + 24);
      const nameLen = u16(view, p + 28);
      const extraLen = u16(view, p + 30);
      const commentLen = u16(view, p + 32);
      const localOffset = u32(view, p + 42);
      const nameBytes = new Uint8Array(bytes, p + 46, nameLen);
      const name = te.decode(nameBytes);
      p += 46 + nameLen + extraLen + commentLen;

      if (!name || name.endsWith('/') || !isImage(name)) continue;
      if (flags & 1) continue; // encrypted
      entries.push({ name, method, compressedSize, uncompressedSize, localOffset });
    }

    entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    if (!entries.length) throw new Error('ZIP tidak berisi gambar JPG, PNG, WEBP, atau GIF.');

    const result = [];
    for (const entry of entries) {
      const lp = entry.localOffset;
      if (view.getUint32(lp, true) !== sigLocal) continue;
      const nameLen = u16(view, lp + 26);
      const extraLen = u16(view, lp + 28);
      const start = lp + 30 + nameLen + extraLen;
      const end = start + entry.compressedSize;
      const compressed = new Uint8Array(bytes.slice(start, end));
      let data;
      if (entry.method === 0) data = compressed;
      else if (entry.method === 8) data = await inflate(compressed);
      else continue;
      if (entry.uncompressedSize && data.byteLength !== entry.uncompressedSize) {
        throw new Error(`Ukuran halaman ${entry.name} tidak sesuai. ZIP mungkin rusak.`);
      }
      const mime = entry.name.toLowerCase().endsWith('.png') ? 'image/png'
        : entry.name.toLowerCase().endsWith('.webp') ? 'image/webp'
        : entry.name.toLowerCase().endsWith('.gif') ? 'image/gif' : 'image/jpeg';
      result.push(new File([data], entry.name.split('/').pop(), { type: mime }));
    }
    return result;
  }

  window.ComicNovaZip = { readZip };
})();
