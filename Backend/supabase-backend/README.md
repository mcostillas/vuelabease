# Supabase Backend Project

This project is a backend application that utilizes Supabase as a backend-as-a-service solution. It provides a simple interface to interact with the Supabase API for data management.

## Project Structure

```
supabase-backend
├── src
│   ├── index.js          # Entry point of the application
│   ├── services
│   │   └── supabaseService.js  # Service for interacting with Supabase
│   └── utils
│       └── helpers.js    # Utility functions for data formatting and validation
├── .env                   # Environment variables for configuration
├── package.json           # NPM configuration file
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd supabase-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your Supabase URL and API key:
   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-api-key>
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage Examples

- To fetch data from Supabase, use the `fetchData` method from the `SupabaseService` class.
- To insert data into Supabase, use the `insertData` method from the same class.

## License

This project is licensed under the MIT License.