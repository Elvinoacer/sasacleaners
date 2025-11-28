import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT || 'https://sfo3.digitaloceanspaces.com',
  region: 'sfo3', // User confirmed sfo3
  forcePathStyle: false, // Use virtual-hosted style (bucket.endpoint) which is standard for DO
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY || ''
  }
})

export async function uploadFile(file: File | Blob, folder: string = 'uploads'): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const timestamp = Date.now()
  const cleanName = (file as File).name.replace(/[^a-zA-Z0-9.]/g, '-')
  const key = `${folder}/${timestamp}-${cleanName}`

  console.log('Uploading to Spaces:', {
    bucket: process.env.DO_SPACES_BUCKET,
    endpoint: process.env.DO_SPACES_ENDPOINT || 'https://sfo3.digitaloceanspaces.com',
    key
  })

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
    ContentType: file.type
  })

  try {
    await s3Client.send(command)
    // Construct the public URL
    // User provided: https://concept-builders.sfo3.digitaloceanspaces.com
    // This is the bucket URL.
    // So the file URL should be: https://concept-builders.sfo3.digitaloceanspaces.com/key
    
    // We can try to construct it dynamically or just use the known structure
    const bucket = process.env.DO_SPACES_BUCKET || 'concept-builders'
    const endpoint = 'sfo3.digitaloceanspaces.com'
    return `https://${bucket}.${endpoint}/${key}`
  } catch (error) {
    console.error('Error uploading file to Spaces:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    // Extract key from URL
    // URL format: https://bucket.endpoint/key
    const urlObj = new URL(url)
    // Pathname includes the leading slash, e.g. /key
    const key = urlObj.pathname.substring(1) // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key
    })

    await s3Client.send(command)
    console.log(`Successfully deleted file: ${key}`)
  } catch (error) {
    console.error('Error deleting file from Spaces:', error)
    // We don't throw here to avoid blocking the main operation (e.g. deleting a service)
    // just because the image deletion failed.
  }
}
