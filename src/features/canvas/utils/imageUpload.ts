/**
 * Image Upload & Processing Utility (Phase 5.6).
 *
 * Handles file validation, reading, dimension detection, and safe client-side
 * optimization for images uploaded to the canvas.
 *
 * Supported formats: PNG, JPEG/JPG, WebP.
 * Excluded in this milestone: SVG.
 */

export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
] as const

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB
export const MAX_IMAGE_DIMENSION = 2560 // 2560 px max bound

export interface ProcessedImageResult {
  assetId: string
  dataUrl: string
  naturalWidth: number
  naturalHeight: number
  mimeType: string
  filename: string
}

function generateAssetId(): string {
  return `asset_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Validates the uploaded file against allowed mime types and size.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // SVG exclusion check (both mime and file extension)
  if (
    file.type === 'image/svg+xml' ||
    file.name.toLowerCase().endsWith('.svg')
  ) {
    return {
      valid: false,
      error: 'SVG images are not supported in this version. Please use PNG, JPG, or WebP.',
    }
  }

  // Mime type validation
  const isSupported = SUPPORTED_IMAGE_MIME_TYPES.some((type) => file.type === type)
  const isSupportedExt = /\.(png|jpe?g|webp)$/i.test(file.name)

  if (!isSupported && !isSupportedExt) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload PNG, JPG, or WebP images.',
    }
  }

  // Size limit validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image file size exceeds the 25 MB limit.',
    }
  }

  return { valid: true }
}

/**
 * Loads a File into an HTMLImageElement to determine intrinsic dimensions
 * and downscales only if dimensions exceed MAX_IMAGE_DIMENSION (2560px).
 */
export async function processUploadedImageFile(file: File): Promise<ProcessedImageResult> {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Read raw file as Data URL
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })

  // Load image to get intrinsic dimensions
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to decode image data.'))
    image.src = rawDataUrl
  })

  const naturalWidth = img.naturalWidth || img.width
  const naturalHeight = img.naturalHeight || img.height

  if (!naturalWidth || !naturalHeight) {
    throw new Error('Could not determine image dimensions.')
  }

  const assetId = generateAssetId()

  // If dimensions are within the allowed ceiling, preserve the original data URL verbatim
  if (naturalWidth <= MAX_IMAGE_DIMENSION && naturalHeight <= MAX_IMAGE_DIMENSION) {
    return {
      assetId,
      dataUrl: rawDataUrl,
      naturalWidth,
      naturalHeight,
      mimeType: file.type || 'image/png',
      filename: file.name,
    }
  }

  // If dimensions exceed MAX_IMAGE_DIMENSION, downscale preserving exact aspect ratio
  const ratio = Math.min(MAX_IMAGE_DIMENSION / naturalWidth, MAX_IMAGE_DIMENSION / naturalHeight)
  const targetWidth = Math.round(naturalWidth * ratio)
  const targetHeight = Math.round(naturalHeight * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    // Fallback if 2D context unavailable
    return {
      assetId,
      dataUrl: rawDataUrl,
      naturalWidth,
      naturalHeight,
      mimeType: file.type || 'image/png',
      filename: file.name,
    }
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

  const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
  const outputMime = isPng ? 'image/png' : 'image/jpeg'
  const optimizedDataUrl = canvas.toDataURL(outputMime, 0.92)

  return {
    assetId,
    dataUrl: optimizedDataUrl,
    naturalWidth: targetWidth,
    naturalHeight: targetHeight,
    mimeType: outputMime,
    filename: file.name,
  }
}
