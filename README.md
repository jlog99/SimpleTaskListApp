# Simple Task List Web Application

A full-stack task management web application built with ASP.NET Core Web API (C#) backend and React (TypeScript) frontend. This application allows users to manage their tasks with features like creating, editing, deleting tasks, tracking task status, and uploading a profile image.

## Features

- **Task Management**
  - Create a task list
  - Delete a task list 
  - Rename a task list 
  - Create new tasks in a list with a title, description, and status
  - Edit existing tasks
  - Delete tasks
  - Mark tasks as done/in progress/not done
  - View task status (Pending, In Progress, Completed)

- **Task Statistics**
  - Real-time counters for pending, in progress, and completed tasks
  - Visual indicators with color-coded badges

- **Profile Management**
  - Upload profile image (JPEG, PNG, GIF)
  - Display profile image on dashboard
  - Delete profile image

- **User Experience**
  - Responsive design for mobile, tablet, and desktop
  - Cross-browser compatible
  - Simple, clean UI with navigation
  - Loading states and error handling

## Technology Stack

### Backend
- ASP.NET Core 10.0 (C#)
- Entity Framework Core 10.0
- SQLite Database
- RESTful Web API

### Frontend
- React 18+
- TypeScript 5+
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (responsive design)

## Project Structure

```
SimpleTaskListApp/
├── SimpleTaskListApp.Server/    # ASP.NET Core Web API
│   ├── Controllers/              # API Controllers
│   ├── Models/                   # Data Models and DTOs
│   ├── Services/                 # Business Logic Services
│   ├── Data/                     # Database Context and Initialization
│   └── wwwroot/                  # Static files (profile images)
├── simpletasklistapp.client/     # React Frontend
│   ├── src/
│   │   ├── components/          # React Components
│   │   ├── services/             # API Service Layer
│   │   └── types/                # TypeScript Type Definitions
└── README.md
```

## Prerequisites

- .NET 10.0 SDK
- Node.js 18+ and npm
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Started

### Quick Start

For the fastest setup open solution in Visual Studio, select 'Http' profile and run.

Command shell will build db and then a separate shell will open to run front end with url.

> **Note:** This solution was built using the .NET & React template and can also be run directly from Visual Studio/VS Code via the run/debug button, which will start both the backend and frontend together.

### Backend Setup

1. Navigate to the API project directory:
   ```bash
   cd SimpleTaskListApp.Server
   ```

2. Restore dependencies and build:
   ```bash
   dotnet restore
   dotnet build
   ```

3. Run the API:

This solution was built using the .NET & React template so can be run from Visual Studio/Code via the run/debug button

   ```bash
   dotnet run
   ```

	The backend will be available at: `http://localhost:5021`
  

### Frontend Setup

1. Navigate to the frontend project directory:
   ```bash
   cd simpletasklistapp.client
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

The frontend is configured to connect to the API at `http://localhost:5021` by default. If your API runs on a different port, you can:

1. Create a `.env` file in the `simpletasklistapp.client` directory:
   ```
   VITE_API_BASE_URL=http://localhost:YOUR_PORT
   ```

2. Or update the default URL in `simpletasklistapp.client/src/services/api.ts`

## API Endpoints

### TaskLists
- `GET /api/tasklists` - Get all tasklists
- `GET /api/tasklist/{id}` - Get tasklist by ID
- `POST /api/tasklist` - Create a new tasklist
- `PUT /api/tasklist/{id}` - Update a tasklist
- `DELETE /api/tasklist/{id}` - Delete a tasklist

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

The application uses SQLite for data storage. The database file (`taskList.db`) will be created automatically in the API project directory on first run.

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
- Tested on Chrome
- Responsive design using CSS Grid and Flexbox

## Building for Production

### Backend
```bash
cd SimpleTaskListApp.Server
dotnet publish -c Release
```

### Frontend
```bash
cd simpletasklistapp.client
npm run build
```

The production build will be in the `dist` directory.

## Limitations

This is intended for development purposes only and as such has some limitations:
- Front end could benefit from a global error service to display errors from SideBar and TaskList in the same place
- For production readiness separation of backend and frontend into their own solutions may offer more flexibility 
- Some light unit tests for CRUD operations would be beneficial
- Have consistent naming between backend and frontend regarding 'Task' as this interfers with build in Language mechanisms
- Split data, services etc into own assembly for better organisation and flexibility for CI/CD purposes
- Improve UI, align colours with a more neutral and modern design and reduce number of click points