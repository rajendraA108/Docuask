const { BlobServiceClient } = require('@azure/storage-blob');
const { randomUUID: uuidv4 } = require('crypto');

// Azure Blob Storage client — initialised once, reused across requests
const getBlobClient = () => {
  return BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );
};

/**
 * Uploads a file buffer to Azure Blob Storage
 * Returns the public URL of the uploaded blob
 */
exports.uploadToBlob = async (fileBuffer, originalName, mimeType) => {
  const blobServiceClient = getBlobClient();
  const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER
  );

  // Create container if it doesn't exist yet
  await containerClient.createIfNotExists({ access: 'container' });

  // Generate unique filename to avoid overwrites
  const uniqueFileName = `${Date.now()}-${uuidv4().slice(0, 8)}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

  // Upload the file
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType }
  });

  return blockBlobClient.url;
};

/**
 * Deletes a blob by its URL
 */
exports.deleteBlob = async (blobUrl) => {
  try {
    const blobServiceClient = getBlobClient();
    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER
    );
    // Extract blob name from URL
    const blobName = blobUrl.split('/').pop();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  } catch (err) {
    console.error('Blob delete error:', err.message);
    // Non-critical — don't crash the app if delete fails
  }
};
