const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { google } = require("googleapis");
const driveAuth = require("../config/drive");

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

class GoogleDriveService {
  async getDrive() {
    const auth = await driveAuth;

    return google.drive({
      version: "v3",
      auth,
    });
  }

  async optimizeImage(inputPath) {
    const outputPath = path.join(
      path.dirname(inputPath),
      `compressed-${path.basename(inputPath, path.extname(inputPath))}.webp`,
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
    const drive = await this.getDrive();

    try {
      const response = await drive.files.create({
        requestBody: {
          name: `${fileName}.webp`,
          parents: [FOLDER_ID],
        },
        media: {
          mimeType: "image/webp",
          body: fs.createReadStream(optimizedPath),
        },
        fields: "id",
      });

      const fileId = response.data.id;

      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      return {
        fileId,
        url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
      };
    } finally {
      try {
        if (fs.existsSync(localPath)) {
          await fs.promises.unlink(localPath);
        }
      } catch (e) {
        console.error("failed to delete original:", e.message);
      }

      try {
        if (fs.existsSync(optimizedPath)) {
          await fs.promises.unlink(optimizedPath);
        }
      } catch (e) {
        console.error("failed to delete optimized:", e.message);
      }
    }
  }

  async deleteFile(fileId) {
    if (!fileId) return;

    try {
      const drive = await this.getDrive();
      await drive.files.delete({ fileId });
    } catch (err) {
      console.error("google Drive delete error:", err.message);
    }
  }

  async replaceFile(oldFileId, localPath, fileName) {
    if (oldFileId) {
      await this.deleteFile(oldFileId);
    }

    return this.uploadFile(localPath, fileName);
  }
}

module.exports = new GoogleDriveService();
