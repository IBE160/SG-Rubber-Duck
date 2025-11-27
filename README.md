# AI-Driven Project Management Simulation (SG-Rubber-Duck)

This repository contains the source code for an AI-Driven Project Management Simulation tool, developed for the IBE160 Programming with AI course.

The application simulates project management scenarios, allowing users to set up projects, run simulations, and analyze outcomes based on various risk factors.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Material-UI (MUI)
    *   Redux Toolkit
    *   DHTMLX-Gantt
*   **Backend:**
    *   FastAPI
    *   Python
    *   SQLAlchemy
    *   PostgreSQL

## Project Structure

```
/
├── backend/      # FastAPI application
├── frontend/     # React application
└── docs/         # Project documentation
```

## Setup and Installation

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd SG-Rubber-Duck/backend
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    # Create the virtual environment
    python3 -m venv venv

    # Activate it (on macOS/Linux)
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Create a `.env` file by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Update the `DATABASE_URL` in the `.env` file with your PostgreSQL connection string.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd SG-Rubber-Duck/frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure environment variables:**
    The frontend expects the backend to be running on port 8001. If you have changed the backend port, create a `.env` file and update the `VITE_API_BASE_URL` variable.
    ```sh
    cp .env.example .env
    ```


## Running the Application

### Backend

To run the backend server with auto-reloading for development:

1.  Navigate to the `SG-Rubber-Duck/backend` directory.
2.  Make sure your virtual environment is activated.
3.  Run the following command:
    ```sh
    uvicorn main:app --reload --port 8001
    ```
    The API will be available at `http://localhost:8001`.

### Frontend

To run the frontend development server:

1.  Navigate to the `SG-Rubber-Duck/frontend` directory.
2.  Run the following command:
    ```sh
    npm run dev
    ```
    The application will be available at the URL provided by Vite (usually `http://localhost:5173`).
