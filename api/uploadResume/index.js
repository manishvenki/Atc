const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  context.log("📥 Upload request received");

  try {
    const contentType = req.headers["content-type"] || "";
    context.log("Content-Type:", contentType);

    if (!contentType.includes("multipart/form-data")) {
      context.log.warn("Invalid content type");
      context.res = { status: 400, body: "Invalid content type" };
      return;
    }

    // Basic multipart parsing
    const buffer = req.body;
    const boundary = contentType.split("boundary=")[1];
    const parts = buffer.toString().split(`--${boundary}`);

    const filePart = parts.find(p => p.includes("filename="));
    if (!filePart) {
      context.log.warn("No file found in request");
      context.res = { status: 400, body: "No file found" };
      return;
    }

    const fileNameMatch = filePart.match(/filename="(.+?)"/);
    const fileName = `${Date.now()}-${fileNameMatch[1]}`;
    context.log("Uploading file:", fileName);

    const fileContent = filePart
      .split("\r\n\r\n")[1]
      .split("\r\n--")[0];

    const fileBuffer = Buffer.from(fileContent, "binary");

    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!conn) {
      context.log.error("Storage connection string missing");
      context.res = { status: 500, body: "Storage config missing" };
      return;
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(conn);
    const containerClient = blobServiceClient.getContainerClient("resumes");
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(fileBuffer);

    context.log("✅ Upload successful:", fileName);

    context.res = {
      status: 200,
      body: {
        message: "Resume uploaded successfully",
        score: 75,
        suggestions: [
          "Add more cloud projects",
          "Include CI/CD tools",
          "Quantify achievements",
          "Optimize keywords"
        ]
      }
    };
  } catch (err) {
    context.log.error("❌ Upload failed", err);
    context.res = { status: 500, body: "Upload failed" };
  }
};
