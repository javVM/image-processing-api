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
npm start # (or npm run dev if in development mode)
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
npm run populate # (or npm run populate-dev if in development mode)
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

## 📐 Architecture
This project follows a Hexagonal Architecture pattern to ensure maintainability, testability, and scalability:

#### 📁 Project Structure Overview
**scripts/deploy:** Contains Docker Compose configurations for running the application and services in different environments.
**src/image-processing-api/:** Main application root. It has the following structure:
* **data/:** Contains the files with the data to populate
* **dist/:** Compiled JS output after running npm run build.
* **docs/:** Contains documentation files such as Postman collection.
* **input/:** Source directory where input images are uploaded.
* **output/:** Stores generated images at different resolutions.
* **populate/:** Contains CLI scripts used to populate the database.
* **src/:** Actual source code implementing the hexagonal architecture.
* **test/:** High-level or end-to-end tests (outside of unit test directories)
```bash
project-root/
├── scripts/
│   └── deploy/
│       ├── docker/
│       ├── docker-compose.yaml
│       ├── local/
│       └── docker-compose.yaml
└── src/
    └── image-processing-api/
        ├── data/
        ├── dist/
        ├── docs/      
        ├── input/
        ├── output/
        ├── populate/
        ├── src/
        └── test/
```
#### 📂 Domain Layer
The domain logic is organized as follows in order to ensure that it remains independent of infrastructure concerns:
* **entities:** Contains core domain objects and their business logic
* **errors:** Contains custom domain-specific error classes
* **repositories**  Contains repository interfaces for data persistence
```bash
domain/
├── entities/
│   ├── __tests__/                 # Unit tests for domain entities
│   ├── Image.ts                  # Represents an image and its attributes
│   ├── ImageGenerator.ts         # Logic for generating image variants
│   ├── ImagePath.ts              # Value object for image paths
│   ├── Price.ts                  # Value object for pricing rules
│   ├── Status.ts                 # Enum or constants for task statuses
│   └── Task.ts                   # Core task entity repesenting image processing task
├── errors/
│   ├── __tests__/                # Unit tests for domain errors
│   ├── DomainError.ts            # Base domain error class
│   ├── InvalidFileExtensionError.ts  # Error for invalid image extensions
│   ├── InvalidPriceError.ts           # Error for invalid pricing
│   ├── NoFileSelectedError.ts          # Error when no image path is provided
│   └── TaskNotFoundError.ts              # Error thrown when a task is not found
└── repositories/
    ├── ImageRepository.ts         # Port interface for image persistence
    └── TaskRepository.ts          # Port interface for task persistence
```
#### 📂 Application Layer
The application layer contains use cases that orchestrate domain logic and serve as a bridge between domain and infrastructure.
Each folder represents a single use case that coordinates interactions between domain entities, repositories, and possibly and external services.
```bash
application/
├── createTask/
│   ├── __tests__/                # Unit tests for create task use case
│   └── CreateTask.ts             # Use case handling task creation logic
├── generateTaskImages/
│   ├── __tests__/                # Unit tests for image generation use case
│   └── GenerateTaskImages.ts     # Use case managing image generation workflows
├── getTask/
│   ├── __tests__/                # Unit tests for fetching a task
│   └── GetTask.ts                # Use case to retrieve a task by ID
└── updateTaskStatus/
    ├── __tests__/                # Unit tests for status update use case
    └── UpdateTaskStatus.ts       # Use case to update the status of a task
```
#### 📂 Infrastructure Layer
The infrastructure layer provides technology-specific implementations for the repositories defined in the domain layer and application orchestration. The structure is as follows:
* **Controllers & Router:** Expose routes through HTTP
* **Repositories:** Specific implementations of domain repositories using MongoDB
* **Image Generator:** Adapter that integrates with the sharp library to resize images
* **Middlewares:** Handle centralized error handling
* **Config:** Swagger documentation
* **Database:** Define how Task and Image are stored in MongoDB using Mongoose schemas as well as handling connections to the database
* **Services:** DI to wire use cases, services, and repositories

This structure keeps the domain and application layers free from external dependencies while enabling smooth integration with tools like Express, MongoDB, and Sharp.
```bash
infrastructure/
├── config/
│   └── swagger.ts                  # Swagger setup for API documentation
├── controllers/
│   ├── taskController.test.ts      # Tests for controller logic
│   └── taskController.ts           # Express controller for task-related routes
├── database/
│   └── mongo/
│       ├── ImageModels.ts          # Mongoose schema/model for images
│       ├── mongoConnection.ts      # MongoDB connection logic
│       └── TaskModels.ts           # Mongoose schema/model for tasks
├── errors/
│   ├── __tests__/                  # Infrastructure-level error tests
│   ├── ImageGenerationError.ts     # Error during image processing
│   ├── ImageSaveError.ts           # Error when saving image
│   ├── TaskRetrievalError.ts       # Error retrieving task from DB
│   ├── TaskSaveError.ts            # Error saving task to DB
│   └── TaskStatusUpdateError.ts    # Error updating task status
├── imageGenerator/
│   ├── __tests__/                  # Tests for image generator
│   └── SharpImageGenerator.ts      # Sharp-based adapter for image resizing
├── middlewares/
│   └── errorHandler.ts             # Global error-handling middleware for Express
├── repositories/
│   ├── __tests__/                  # Tests for Mongo repository implementations
│   ├── MongoImageRepository.ts     # MongoDB adapter for ImageRepository
│   └── MongoTaskRepository.ts      # MongoDB adapter for TaskRepository
├── router/
│   └── taskRouter.ts               # Express router for task endpoints
└── services/
    └── serviceContainer.ts         # Simple DI container to wire use cases, services, and repositories
```
#### 🗃️ Data Persistence (MongoDB)
The application uses Mongoose to define and interact with MongoDB collections. The main entities stored are Task and Image, which reflect the domain structure with some additional metadata.

**Task schema**
```ts
{
  status: { type: String, enum: Object.values(Status), required: true },
  price: { type: Number, required: true },
  originalPath: { type: String, required: true },
  images: { type: [{ type: Schema.Types.ObjectId, ref: "Image" }], default: [] }
}
```
Fields:
* **taskId:** Unique identifier used by the domain logic (not the default Mongo _id)
* **price:** A numeric value constrained between 5 and 50
* **originalPath:** Path of the original image
* **status:** The current task state (pending, completed, or failed)
* **images:** Array of ObjectIds that reference Image collection documents

**Image schema**
```ts
{
  path: { type: String, required: true },
  resolution: { type: String, required: true },
  md5: { type: String, required: true }
}
```
Fields:
* **resolution:** Indicates the resolution (e.g., "800", "1024")
* **md5:** Hash that identifies the newly created image
* **path:** File path of the generated image containing the generated hash
* **taskId:** Link back to the parent task

## ⚙️ Technical Decisions
#### 🧱 Hexagonal Architecture
This project is built using the Hexagonal Architecture to enforce a strong separation of concerns and improve testability, scalability, and maintainability. This architecture allows the business logic to remain decoupled from implementation details like Express, MongoDB, or Docker.
#### 🗂️ Project Modularity
Each domain entity (e.g. Task, Image, ImagePath, Status) and application use case has its own folder and files, making the system modular and easier to navigate. Repositories follow interfaces defined in the domain and are implemented in the infrastructure.
#### 🧪 Testing Strategy
The project uses layered testing to ensure robustness:
* Unit tests are located alongside domain, application and infrastructure layers (Each layer can be tested independently)
* Integration tests are used to test infrastructure-level concerns and system behavior
#### ⚙️ Indexing Strategy
Only the default index on _id has been created in the MongoDB collections. This decision is based on the nature of the operations performed by the application (Most queries are direct lookups by _id).

Additional indexing on other fields such as status or price was considered unnecessary because the read/write patterns do not involve filtering or sorting on those fields.

Introducing more indexes would increase the overhead during writes and updates, as each index must be maintained (negatively impacting performance in a write-heavy or batch-processing environment like this one).
#### 🐳 Docker & Environment Separation
The application supports multiple environments using Docker Compose:
* **Local development:** API runs on the host machine; MongoDB runs in a container
* **Full Docker deployment:** Both API and MongoDB run in isolated containers for consistent behavior across systems
This ensures the app can run reliably in different pipelines or OS environments.
#### 📄 API Documentation (Swagger/OpenAPI)
The API is fully documented using Swagger, auto-generated from JSDoc-style annotations. This provides:
* Clear, interactive API reference
* Schema validation and response structure transparency
#### 📬 Postman Collection
A Postman collection is available to help you explore and test the API endpoints.
You can find the collection in the [`docs/postman`](docs/postman) folder.
Import the JSON file into Postman or any compatible tool to get started quickly.
#### 🖼️ Image Generation with Sharp
Image processing is handled using Sharp. Sharp was chosen for:
* Native support for multiple image formats
* Performance and memory efficiency
* Fast image resizing
Image files are stored in an organized output directory with path metadata saved in MongoDB for retrieval.

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
  ```
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
Retrieves details of an existing task
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