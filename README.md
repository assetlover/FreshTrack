# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 🥝 FreshTrack – Intelligent Fruit Shelf-Life Estimator

FreshTrack is an intelligent system that estimates the shelf life of fruits using image-based analysis — without relying on temperature or humidity data. It leverages machine learning and computer vision to help reduce food waste by providing accurate freshness predictions based on visual features of fruits.

**Note:** Although the system can be extended to other fruits by modifying the dataset, this version is specifically focused on **bananas**.

---

## 🚀 Features

- 🍌 **Banana-focused image dataset** of fruits at various ripening stages
- 🤖 **Trained ML model** with high accuracy (91.5% mAP@50) on bananas
- 🧠 **Integrated ML inference** through Node.js backend
- 💻 **Interactive frontend** built using React
- 📦 **RESTful APIs** for communication between frontend and backend
- 🧪 **Precision:** 85.9% | **Recall:** 87.7%

---

## 🧰 Tech Stack

| Layer       | Tech Used                        |
|-------------|----------------------------------|
| Frontend    | React.js                         |
| Backend     | Node.js, Express.js              |
| ML Model    | Roboflow (YOLOv5 based)          |
| Dataset     | Manually labeled banana images   |
| Deployment  | (To be added if hosted)          |

---

## 🧠 How It Works

1. **Image Collection & Labeling**: 
   - Gathered banana images at different ripening stages.
   - Labeled dataset using Roboflow with bounding boxes and freshness categories.

2. **Model Training**: 
   - Trained on Roboflow using object detection (YOLO-based).
   - Evaluated with mAP, precision, and recall metrics.

3. **Frontend Integration**:
   - React app to upload and preview fruit images.
   - Display predicted freshness category and estimated shelf life for bananas.

4. **Backend API**:
   - Node.js server receives image, forwards it to ML model, and returns predictions.

---

## 📸 Screenshots ![Screenshot 2025-04-14 at 11 53 38](https://github.com/user-attachments/assets/548c9cd1-7048-47a6-a12d-3ee1bd6274f3)
![WhatsApp Image 2025-04-08 at 18 03 56](https://github.com/user-attachments/assets/7953a9b8-0784-4c43-93d5-946544984474)

<img width="1438" alt="Screenshot 2025-04-10 at 17 02 36" src="https://github.com/user-attachments/assets/0cfca260-4139-492d-bdce-db72842fe3a3" />



---
