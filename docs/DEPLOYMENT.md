# Deployment

## Backend

### Prerequisites

-   Python 3.10+
-   PostgreSQL (or other a production-ready database)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository/backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory and add the following variables:
    ```
    DATABASE_URL=postgresql://user:password@host:port/database_name
    SECRET_KEY=your_secret_key
    ```

5.  **Run database migrations:**
    ```bash
    alembic upgrade head
    ```

### Running the application

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Frontend

### Prerequisites

-   Node.js 16+
-   npm

### Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env.production` file in the `frontend` directory and add the following variables:
    ```
    VITE_API_BASE_URL=http://your-backend-api-url
    VITE_WS_BASE_URL=ws://your-backend-ws-url
    ```

### Building the application

```bash
npm run build
```

### Running the application

The `build` command will create a `dist` directory with the static files. You can serve these files with any static file server, such as Nginx or Vercel.