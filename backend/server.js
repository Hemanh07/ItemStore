const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const { mailSender } = require("./mailer.js");
const app = express();
const PORT = 5000;
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

app.use("/uploads", express.static(uploadsDir));

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
};

const pool = mysql.createPool(dbConfig);

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        description TEXT,
        coverImage VARCHAR(500), -- Store file path instead of base64
        itemImages JSON, -- Store array of file paths
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    console.log("MySQL connected and table created");
  } catch (err) {
    console.error("MySQL connection error:", err);
  }
}

initializeDatabase();

async function saveBase64Image(base64String, fileName) {
  try {
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const optimizedBuffer = await sharp(buffer)
      .jpeg({ quality: 80, progressive: true })
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, optimizedBuffer);

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}

function generateFileName(prefix = "img") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}.jpg`;
}

function parseItemImages(itemImages) {
  if (!itemImages) return [];

  if (Array.isArray(itemImages)) return itemImages;

  if (typeof itemImages === "string") {
    try {
      const parsed = JSON.parse(itemImages);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing itemImages:", error);
      return [];
    }
  }

  return [];
}

app.get("/api/items", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM items ORDER BY created_at DESC"
    );
    connection.release();

    const items = rows.map((item) => ({
      ...item,
      coverImage: item.coverImage
        ? `http://localhost:${PORT}${item.coverImage}`
        : null,
      itemImages: parseItemImages(item.itemImages).map(
        (path) => `http://localhost:${PORT}${path}`
      ),
    }));

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const { name, type, description, coverImage, itemImages } = req.body;

    let coverImagePath = null;
    if (coverImage) {
      const coverFileName = generateFileName("cover");
      coverImagePath = await saveBase64Image(coverImage, coverFileName);
    }

    let itemImagePaths = [];
    if (itemImages && itemImages.length > 0) {
      const imagePromises = itemImages.map(async (base64, index) => {
        const fileName = generateFileName(`item${index}`);
        return await saveBase64Image(base64, fileName);
      });

      const paths = await Promise.all(imagePromises);
      itemImagePaths = paths.filter((path) => path !== null);
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO items (name, type, description, coverImage, itemImages) VALUES (?, ?, ?, ?, ?)",
      [name, type, description, coverImagePath, JSON.stringify(itemImagePaths)]
    );

    const [newItem] = await connection.execute(
      "SELECT * FROM items WHERE id = ?",
      [result.insertId]
    );

    connection.release();

    const item = {
      ...newItem[0],
      coverImage: newItem[0].coverImage
        ? `http://localhost:${PORT}${newItem[0].coverImage}`
        : null,
      itemImages: parseItemImages(newItem[0].itemImages).map(
        (path) => `http://localhost:${PORT}${path}`
      ),
    };

    res.json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM items WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const item = {
      ...rows[0],
      coverImage: rows[0].coverImage
        ? `http://localhost:${PORT}${rows[0].coverImage}`
        : null,
      itemImages: parseItemImages(rows[0].itemImages).map(
        (path) => `http://localhost:${PORT}${path}`
      ),
    };

    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/enquiry", async (req, res) => {
  try {
    const { email, message, itemId, itemName, itemType } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailTitle = `New Enquiry for Item: ${itemName}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Item Enquiry
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Item Details:</h3>
          <p><strong>Item Name:</strong> ${itemName}</p>
          <p><strong>Item Type:</strong> ${itemType}</p>
          <p><strong>Item ID:</strong> ${itemId}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #495057;">Customer Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #495057;">Message:</h3>
          <p style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; margin: 0;">
            ${message || `Customer is interested in the item: ${itemName}`}
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
          <p>This enquiry was submitted on ${new Date().toLocaleString()}</p>
          <p>Please respond to the customer at: ${email}</p>
        </div>
      </div>
    `;

    const adminEmail = "crazydeveloperr007@gmail.com";
    await mailSender(adminEmail, emailTitle, emailBody);

    // Optional: Send confirmation email to customer
    const customerEmailTitle = `Thank you for your enquiry - ${itemName}`;
    const customerEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
          Thank You for Your Enquiry!
        </h2>
        
        <p>Dear Customer,</p>
        
        <p>Thank you for your interest in <strong>${itemName}</strong>. We have received your enquiry and will get back to you shortly.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Your Enquiry Details:</h3>
          <p><strong>Item:</strong> ${itemName}</p>
          <p><strong>Type:</strong> ${itemType}</p>
          <p><strong>Your Message:</strong></p>
          <p style="background-color: #fff; padding: 15px; border-left: 4px solid #28a745; margin: 10px 0;">
            ${message || `I am interested in the item: ${itemName}`}
          </p>
        </div>

        <p>We typically respond to enquiries within 24 hours. If you have any urgent questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>Your Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await mailSender(email, customerEmailTitle, customerEmailBody);

    res.json({
      success: true,
      message: "Enquiry sent successfully",
    });
  } catch (error) {
    console.error("Error sending enquiry:", error);
    res.status(500).json({
      error: "Failed to send enquiry. Please try again later.",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
