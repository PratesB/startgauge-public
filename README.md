# StartGauge 🚀

StartGauge is an Agent-powered platform designed to help professionals, teams, and creators across any discipline rapidly generate, validate, and structure any type of idea. By leveraging Google's Gemini, StartGauge automatically transforms a simple spark of an idea into a comprehensive Business Model Canvas and provides in-depth feedback analysis.

> ⚠️ **Note:** This repository hosts the public demo version of StartGauge. For an in-depth look at the architecture, design decisions, and the full story behind this project, please visit the official [StartGauge Project Page](https://pratesdev.com/startgauge).

## ✨ Features

*   **Idea Generation:** Generate detailed business concepts using advanced agents.
*   **Business Model Canvas:** Automatically generate a structured 9-block Business Canvas based on your ideas.
*   **Feedback Analysis:** Receive comprehensive, constructive feedback on your ideas to help you pivot and improve.
*   **Specialized Agents:** Powered by fine-tuned, task-specific agents that act as expert business consultants.
*   **Live Web Search:** Integrated with DuckDuckGo to enrich agent responses with real-time market data and trends.
*   **Background Processing:** Heavy agent tasks run asynchronously in the background so the UI remains lightning fast.
*   **Full-Stack Architecture:** Built with a robust Python backend and a beautiful, responsive Next.js frontend.
*   **Fully Dockerized:** Spin up the entire environment (Frontend, Backend, Database, Cache, and Workers) with a single command.

## ⚙️ How It Works

StartGauge uses an asynchronous, agent-driven workflow to deliver deep insights without freezing the user experience:

1. **The Spark:** The user submits a simple, raw idea (a single sentence or a few keywords).
2. **Agent Processing:** Our specialized AI agents pick up the idea. They perform real-time market research via DuckDuckGo and analyze the concept from multiple business angles.
3. **Canvas Generation:** The agents structure their findings into a complete, 9-block Business Model Canvas, detailing Value Propositions, Customer Segments, Revenue Streams, and more.
4. **Feedback & Pivots:** Alongside the canvas, the agents provide a critical Feedback Analysis—pointing out potential risks, hidden opportunities, and strategic pivots to make the idea bulletproof.

## 🛠️ Tech Stack

### Frontend
*   **Framework:** [Next.js](https://nextjs.org/) (React)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Notifications:** `react-hot-toast`

### Backend
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Async Python)
*   **Database:** PostgreSQL (with SQLAlchemy & Alembic)
*   **Task Queue:** Celery
*   **Broker / Cache:** Redis
*   **Agent Integration:** Google Gemini & DuckDuckGo Search
*   **Authentication:** JWT (JSON Web Tokens)

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following installed on your machine:
*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PratesB/startgauge-public.git
   cd startgauge-public
   ```

2. **Configure Environment Variables**
   The project requires an environment file to run. We have provided an example file.
   ```bash
   # Copy the example file to create your local .env
   cp backend/.env.example backend/.env
   ```
   *Note: Open `backend/.env` and insert your actual `GEMINI_API_KEY` and change the `SECRET_KEY`.*

3. **Start the Application**
   Use Docker Compose to build and start all services in the background.
   ```bash
   docker compose up --build -d
   ```

4. **Initialize the Database (First Run Only)**
   Once the containers are running, you need to apply the database migrations to create the tables.
   ```bash
   # Generate the initial migration based on the models
   docker compose exec api alembic revision --autogenerate -m "Initial Postgres"
   
   # Apply the migration to the PostgreSQL database
   docker compose exec api alembic upgrade head
   ```

---

## 📡 Architecture & Services

Once running via Docker Compose, the following services will be available:

| Service | Address | Description |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:3000` | The Next.js web application. |
| **Backend API** | `http://localhost:8000` | The FastAPI server. |
| **API Docs (Swagger)**| `http://localhost:8000/docs` | Interactive API documentation. |
| **PostgreSQL** | `localhost:5432` | The database. |
| **Redis** | `localhost:6379` | In-memory store used by Celery. |
| **Celery Worker** | *Background* | Processes agent requests asynchronously. |

## 📦 Deployment (Production)

The current `docker-compose.yml` and `frontend/Dockerfile` are optimized for **Development** (hot-reloading enabled). 

To prepare the Frontend for production:
1. Open `frontend/Dockerfile`.
2. Comment out the `CMD ["npm", "run", "dev"]` line.
3. Uncomment the `RUN npm run build` and `CMD ["npm", "start"]` lines.
4. Rebuild the image: `docker compose up --build -d`

---

## 👨‍💻 About the Developer

This demo was built by **Bruno Prates**. 

If you liked this project and want to explore more of my work and applications, feel free to visit my portfolio at **[pratesdev.com](https://pratesdev.com)**!
