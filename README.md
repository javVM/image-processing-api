# 🖼️ Image Processing API
A RESTful API for generating images in multiple resolutions from a single source image.

## 📦 Requirements
* Node.js v18+
* Docker & docker-compose

## 🚀 Installation
Clone the repository:
```bash
git clone https://github.com/javVM/image-processing-api.git
cd image-processing-api
```
Install dependencies:
```bash
cd src/image-processing-api
npm install
```
## 🛠️ Build the Project
#### 🔧 Local Build
```bash
cd src/image-processing-api
npm run build
```
#### 🐳 Docker Build
Build the dist package:
```bash
cd src/image-processing-api
npm run build
```
Then build the API Docker image:
```bash
docker build . -t image-processing-api
```
## ▶️ Start the Project
#### 💻 Run Locally (API on Host, DB in Docker)
Start MongoDB container:
```bash
cd scripts/deploy/local
docker-compose up -d
```
#### 🐳 Run Fully in Docker
Start MongoDB and API containers:
```bash
cd scripts/deploy/docker
docker-compose up -d
```
## 🗃️ Populate the Database
Ensure MongoDB is running, then run:
```bash
cd src/image-processing-api
npm run populate
```
## ✅ Testing
Run integration and unit tests:
```bash
cd src/image-processing-api
npm run test
```
## ✨ Features
- Generate images in multiple resolutions from one initial image (local path or url)
- RESTful API with structured endpoints
- MongoDB for storing data
- Docker support for easy deployment
- CLI to populate the database

## 📚 API Documentation
This project uses **Swagger (OpenAPI 3.0)** to provide interactive API documentation.
You can access the full documentation at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  

### 🔗 Available Endpoints

#### `POST /tasks`
Creates a new image-processing task.

- **Request body (local path)** (JSON):
  ```json
  {
    "path": "/input/image1.png"
  }
  ```
- **Request body (URL)** (JSON):
  ```json
  {
    "path": "https://exampleurl.png"
  }
  ``
- **✅ Response (200 OK)**
    ```json
    {
      "taskId": "686a6e8ccb00ef45aea7d7c8",
      "price": 50,
      "status": "pending"
    }
    ```
- **❌ Response (400 Bad request - FileNotSelectedError)**
    ```json
   { "message": "No file path provided." }
    ```
- **❌ Response (400 Bad request - InvalidFileExtensionError:)**
    ```json
   { "message": "File extension not allowed. Allowed extensions: .jpg, .jpeg, .png, .webp, .svg, .gif." }
    ```
- **❌ Response (500 Internal server error)**
    ```json
    { "message": "Failed to persist task data in database: connection timeout." }
    ```
#### GET /tasks/{taskId}
Retrieves details of an existing taskId
- **Path parameter** 
    * taskId (string): ID of the task to retrieve
- **✅ Response (200 OK)**
    ```json
    {
      "taskId": "686a6e8ccb00ef45aea7d7c8",
      "price": 50,
      "status": "completed",
      "images": [
        { "resolution": "800", "path": "/output/image1/800/7a53928fa4dd31e82c6ef826f341daec.png" },
        { "resolution": "1024", "path": "/output/image1/1024/021bbc7ee20b71134d53e20206bd6feb.png" }
      ]
    }
    ```
- **❌ Response (404 Not Found)**
    ```json
    { "message": "Task with taskId 686a6e8ccb00ef45aea7d7c8 not found." }
    ```
- **❌ Response (500 Internal server error)**
    ```json
    { "message": "Failed to retrieve task with taskId 686a6e8ccb00ef45aea7d7c8 from database: connection timeout." }
    ```
## 📄 License
This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.