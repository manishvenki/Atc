const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  try {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      context.res = { status: 400, body: "Invalid content type" };
      return;
    }

    // Simple multipart parsing (basic)
    const buffer = req.body;
    const boundary = contentType.split("boundary=")[1];
    const parts = buffer.toString().split(`--${boundary}`);

    const filePart = parts.find(p => p.includes("filename="));
    if (!filePart) {
      context.res = { status: 400, body: "No file found" };
      return;
    }

    const fileNameMatch = filePart.match(/filename="(.+?)"/);
    const fileName = `${Date.now()}-${fileNameMatch[1]}`;

    const fileContent = filePart.split("\r\n\r\n")[1].split("\r\n--")[0];
    const fileBuffer = Buffer.from(fileContent, "binary");

    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(conn);
    const containerClient = blobServiceClient.getContainerClient("resumes");
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(fileBuffer);

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
    context.res = { status: 500, body: "Upload failed" };
  }
};
