# Backend (Flask)

[![Coverage Status](https://img.shields.io/badge/coverage-pending-lightgrey)]()

This is the Flask backend for the AI-powered Mental Health Platform.

## Setup

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Run the app:
   ```sh
   python app.py
   ```

## Testing

Run all tests and see coverage:
```sh
pytest
```

## API
- Versioned endpoints under `/api/v1/`
- Example: `/api/v1/vaults`

## Conventions
- All endpoints return structured JSON
- Error handling and logging are enforced
- Shared types are defined in `shared/types/` 