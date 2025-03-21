## Overview

This project consists of multiple services that work together to provide a quiz application. The services are containerized using Docker and managed with Docker Compose. Below is an explanation of each container and its role in the application.

## Containers

### 1. MongoDB

- **Image**: `mongo:latest`
- **Container Name**: `my_mongo_db`
- **Ports**: `4002:27017`
- **Volumes**:
  - `mongodb_data:/data/db`
  - `./database/init_mongo.js:/docker-entrypoint-initdb.d/init_mongo.js:ro`
- **Environment Variables**:
  - `MONGO_INITDB_DATABASE: quiz_db`
  - `MONGO_INITDB_ROOT_USERNAME: admin`
  - `MONGO_INITDB_ROOT_PASSWORD: password`
- **Network**: `app-network`

**Description**: This container runs a MongoDB instance that serves as the database for the application. It initializes the database with predefined questions using the init_mongo.js script.

### 2. Question Service

- **Build Context**: question_service
- **Container Name**: question_service
- **Ports**: `4000:3000`
- **Network**: `app-network`
- **Depends On**: `mongodb`

**Description**: This container runs the Question Service, which is responsible for serving quiz questions and categories. It exposes a REST API for fetching categories and questions. The service is built using Node.js and Express, and it connects to the MongoDB instance to retrieve data.

### 3. Submit Service

- **Build Context**: submit_service
- **Container Name**: submit_service
- **Ports**: `4200:3200`
- **Network**: `app-network`
- **Depends On**: `mongodb`

**Description**: This container runs the Submit Service, which allows users to submit new quiz questions. It exposes a REST API for submitting questions and retrieving categories. The service is built using Node.js and Express, and it connects to the MongoDB instance to store data.

## Running the Application

To run the application, use the following command:

```sh
docker-compose up
```

This command will start all the containers defined in the docker-compose.yaml file.

## Accessing the Services

- **Question Service**: [http://localhost:4000](http://localhost:4000)
  - Swagger Documentation: [http://localhost:4000/docs](http://localhost:4000/docs)
- **Submit Service**: [http://localhost:4200](http://localhost:4200)
  - Swagger Documentation: [http://localhost:4200/docs](http://localhost:4200/docs)

## Directory Structure

- database: Contains the MongoDB initialization script.
- question_service: Contains the Question Service code and Dockerfile.
- submit_service: Contains the Submit Service code and Dockerfile.
- docker-compose.yaml: Docker Compose configuration file.
- .gitignore: Git ignore file.
- package.json: Root package.json file.

## Dependencies

The project uses the following dependencies:

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `swagger-ui-express`: Middleware to serve Swagger UI.
- `swagger-jsdoc`: Generates Swagger documentation from JSDoc comments.

## To Deploy on a VM using the '3rd Class' Main Branch

Copy the `/database` folder and the `docker-compose.yaml` file to the VM. Run the `docker-compose.yaml` with `docker compose up`
