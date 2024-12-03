# Form Schema Builder

![Node.js](https://img.shields.io/badge/node-18%2B-brightgreen)

## Getting Started

To get started with the Form Schema Builder app, follow these steps:

1. **Install dependencies**: Run the following command to install the necessary dependencies:

   ```sh
   yarn install
   ```

2. **Start the app**: Use the following command to start the development server:

   ```sh
   yarn dev
   ```

3. **Build the app**: To create a production build, run:
   ```sh
   yarn build
   ```

## Testing

To run tests for the Form Schema Builder app, use the following commands:

1. **Run tests**: Execute the tests using:

   ```sh
   yarn test
   ```

2. **View test coverage**: To view the test coverage report, run:
   ```sh
   yarn test:coverage
   ```

## Architecture

The Form Schema Builder app is designed with a modular architecture, consisting of the following key components:

1. **FormBuilder**: The main component responsible for building and managing the form schema. It allows users to add, edit, and remove form elements

2. **FormPreview**: A component that renders a preview of the form based on the current schema. It allows users to see how the form will look and behave

3. **SchemaPreview**: A component that displays the JSON representation of the form schema. It helps users understand the structure of the form

4. **ImportExport**: A component that provides functionality to import and export form schemas as JSON files. It allows users to save and load form configurations

5. **Validation**: The app uses Zod for schema validation. The validation logic ensures that the form schema is correctly structured and that all required fields are present
