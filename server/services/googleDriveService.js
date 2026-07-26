const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const driveAuth = require("../config/drive");
const { google } = require("googleapis");
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

class GoogleDriveService {
  async optimizeImage(inputPath) {
    const outputPath = path.join(
      path.dirname(inputPath),
      "compressed-" +
        path.basename(inputPath, path.extname(inputPath)) +
        ".webp",
    );

    await sharp(inputPath)
      .rotate()
      .resize({
        width: 1200,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 6,
      })
      .toFile(outputPath);

    return outputPath;
  }

  async uploadFile(localPath, fileName) {
    const optimizedPath = await this.optimizeImage(localPath);

    const auth = await driveAuth;

    this.drive = google.drive({
      version: "v3",
      auth,
    });

    const response = await this.drive.files.create({
      requestBody: {
        name: fileName + ".webp",
        parents: [FOLDER_ID],
      },

      media: {
        mimeType: "image/webp",
        body: fs.createReadStream(optimizedPath),
      },

      fields: "id",
    });

    const fileId = response.data.id;

    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    fs.unlinkSync(localPath);
    fs.unlinkSync(optimizedPath);

    return {
      fileId,
      url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    };
  }

  async deleteFile(fileId) {
    if (!fileId) return;

    try {
      await drive.files.delete({ fileId });
    } catch (err) {
      console.error(err.message);
    }
  }

  async replaceFile(oldFileId, localPath, fileName) {
    await this.deleteFile(oldFileId);

    return this.uploadFile(localPath, fileName);
  }
}

module.exports = new GoogleDriveService();
