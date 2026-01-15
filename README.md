# Simple Task List Web Application

A full-stack task management web application built with ASP.NET Core Web API (C#) backend and React (TypeScript) frontend. This application allows users to manage their tasks with features like creating, editing, deleting tasks, tracking task status, and uploading profile images.

## Features

- **Task Management**
  - Create new tasks with title, description, and status
  - Edit existing tasks
  - Delete tasks
  - Mark tasks as done/not done
  - View task status (Pending, In Progress, Completed)

- **Task Statistics**
  - Real-time counters for pending, in progress, and completed tasks
  - Visual indicators with color-coded badges

- **Profile Management**
  - Upload profile images (JPEG, PNG, GIF)
  - Display profile image on dashboard
  - Delete profile images

- **User Experience**
  - Responsive design for mobile, tablet, and desktop
  - Cross-browser compatible
  - Modern, clean UI with intuitive navigation
  - Loading states and error handling

## Technology Stack

### Backend
- ASP.NET Core 10.0 (C#)
- Entity Framework Core 8.0
- SQLite Database
- RESTful Web API
- Swagger/OpenAPI documentation

### Frontend
- React 18+
- TypeScript 5+
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (responsive design)

## Project Structure

```
TaskListApp/
├── TaskListApp.API/              # ASP.NET Core Web API
│   ├── Controllers/              # API Controllers
│   ├── Models/                   # Data Models and DTOs
│   ├── Services/                 # Business Logic Services
│   ├── Data/                     # Database Context and Initialization
│   └── wwwroot/                  # Static files (profile images)
├── tasklistapp-web/              # React Frontend
│   ├── src/
│   │   ├── components/          # React Components
│   │   ├── services/             # API Service Layer
│   │   └── types/                # TypeScript Type Definitions
└── README.md
```

## Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Started

### Backend Setup

1. Navigate to the API project directory:
   ```bash
   cd TaskListApp.API
   ```

2. Restore dependencies and build:
   ```bash
   dotnet restore
   dotnet build
   ```

3. Run the API:
   ```bash
   dotnet run
   ```

   The API will be available at:
   - HTTP: `http://localhost:5021`
   - Swagger UI: `http://localhost:5021/swagger`

### Frontend Setup

1. Navigate to the frontend project directory:
   ```bash
   cd tasklistapp-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` (or the port shown in the terminal)

### Configuration

The frontend is configured to connect to the API at `http://localhost:5143/api` by default. If your API runs on a different port, you can:

1. Create a `.env` file in the `tasklistapp-web` directory:
   ```
   VITE_API_BASE_URL=http://localhost:YOUR_PORT/api
   ```

2. Or update the default URL in `tasklistapp-web/src/services/api.ts`

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/status` - Update task status
- `GET /api/tasks/counts` - Get task counts by status

### Profile
- `POST /api/profile/image` - Upload profile image
- `GET /api/profile/image` - Get profile image URL
- `DELETE /api/profile/image` - Delete profile image

## Database

The application uses SQLite for data storage. The database file (`tasklist.db`) will be created automatically in the API project directory on first run.

A default user "Ali" is created automatically for single-user mode. The architecture is prepared for multi-user expansion in the future.

## Development Notes

### Architecture
- **Backend**: Clean layered architecture with Controllers → Services → Data Access
- **Frontend**: Component-based architecture with separation of concerns
- **Database**: Entity Framework Core with Code First approach
- **API**: RESTful design with proper HTTP methods and status codes

### Future Enhancements
The application is designed with multi-user support in mind:
- User entity already in the data model
- Foreign key relationships prepared
- Service layer abstracts user context
- Easy to add ASP.NET Identity for authentication

### Cross-Browser Compatibility
- Tested on Chrome, Firefox, Safari, and Edge
- Responsive design using CSS Grid and Flexbox
- Mobile-first approach
- Touch-friendly UI elements

## Building for Production

### Backend
```bash
cd TaskListApp.API
dotnet publish -c Release
```

### Frontend
```bash
cd tasklistapp-web
npm run build
```

The production build will be in the `dist` directory.

## License

This project is created for demonstration purposes.
