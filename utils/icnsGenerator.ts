
export async function generateIcns(imageUrl: string): Promise<Blob> {
  const resize = async (img: HTMLImageElement, size: number): Promise<Uint8Array> => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas context');
    
    // Use high quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(img, 0, 0, size, size);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const buffer = await blob.arrayBuffer();
          resolve(new Uint8Array(buffer));
        } else {
          reject(new Error('Canvas to Blob failed'));
        }
      }, 'image/png');
    });
  };

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;
  await new Promise((resolve, reject) => { 
    img.onload = resolve; 
    img.onerror = reject;
  });

  // macOS ICNS supported types
  // https://en.wikipedia.org/wiki/Apple_Icon_Image_format
  const targets = [
    { type: 'ic10', size: 1024 }, // 1024x1024 (512x512@2x)
    { type: 'ic09', size: 512 },  // 512x512
    { type: 'ic08', size: 256 },  // 256x256
    { type: 'ic07', size: 128 },  // 128x128
    { type: 'icp6', size: 64 },   // 64x64
    { type: 'icp5', size: 32 },   // 32x32
    { type: 'icp4', size: 16 },   // 16x16
  ];

  const chunks: { type: string, data: Uint8Array }[] = [];

  for (const target of targets) {
    // Only generate if the source image is larger or equal to the target, 
    // or always generate to have a complete set (downscaling is fine)
    // We attempt to generate all sizes to ensure a valid and useful ICNS
    try {
      const data = await resize(img, target.size);
      chunks.push({ type: target.type, data });
    } catch (e) {
      console.warn(`Failed to generate icon size ${target.size}`, e);
    }
  }

  // Calculate total size
  // Header (8 bytes) + for each chunk: Header (8 bytes) + Data length
  const totalSize = 8 + chunks.reduce((acc, chunk) => acc + 8 + chunk.data.length, 0);

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // File Header
  // Magic literal 'icns'
  bytes.set([0x69, 0x63, 0x6e, 0x73], 0);
  // File length (Big Endian)
  view.setUint32(4, totalSize, false);

  let offset = 8;
  for (const chunk of chunks) {
    // Icon Type (4 bytes)
    for (let i = 0; i < 4; i++) {
      bytes[offset + i] = chunk.type.charCodeAt(i);
    }
    
    // Chunk Length (4 bytes, Big Endian) - includes type and length fields
    const chunkLength = 8 + chunk.data.length;
    view.setUint32(offset + 4, chunkLength, false);
    
    // Icon Data
    bytes.set(chunk.data, offset + 8);
    
    offset += chunkLength;
  }

  return new Blob([buffer], { type: 'image/x-icns' });
}
