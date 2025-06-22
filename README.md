# Item Management System

A full-stack web application for managing items with the ability to add new items and view existing ones in a user-friendly interface. Built with **React.js** on the frontend and **Node.js + Express.js** with **MySQL** on the backend.

---
## Live Link : 
[https://your-demo-link.com](https://your-demo-link.com)
## Features

### Core Features

- **Add Items**: Form-based interface to add new items with detailed information.
- **View Items**: Display all items in a grid/list layout with cover images.
- **Item Details**: Modal/lightbox view showing complete item information.
- **Image Carousel**: Browse through multiple images for each item.
- **Enquire Button**: Contact functionality for item inquiries.

---

## Pages

### 1. Add Item Page

A structured form that allows users to input item data including:

- **Item Name** – Text input
- **Item Type** – Dropdown (Shirt, Pant, Shoes, Sports Gear, etc.)
- **Item Description** – Textarea
- **Cover Image** – File upload for main image
- **Additional Images** – Multiple file uploads

After submission, a success message is shown:  
**"Item successfully added"**

---

### 2. View Items Page

Displays a list/grid of all items, including:

- Predefined static items
- Items added by users (retrieved from MySQL)

Each item includes:

- Item name
- Cover image
- Click to open detail modal or page

---

### 3. Item Detail Modal/Lightbox

Includes:

- Full item description
- Image carousel of all item images
- "Enquire" button to trigger email  

---

## Technical Stack

### Frontend

- React.js  
- CSS3 
- Image carousel 
- Modal/lightbox component

### Backend

- Node.js
- Express.js
- MySQL 
- Multer for image uploads
- RESTful API design

### Email 

- Nodemailer for sending emails upon "Enquire"
- Static or environment-configured recipient





