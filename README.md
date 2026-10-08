# Community Solar Finder

A Vue.js application that helps users find and filter available community solar projects in their area. This single-page application consumes data from the EnergySage Community Solar API and presents it in an intuitive, user-friendly interface.

**▶ Live demo: [darkokovach.github.io/community-solar-finder](https://darkokovach.github.io/community-solar-finder/)**

## Features

- Browse available community solar projects
- Filter projects by ZIP code and state
- View detailed project information including name, developer, expected go-live date, and estimated savings
- Responsive design that works on desktop and mobile devices

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- NPM package manager

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/DarkoKovach/community-solar-finder.git
cd community-solar-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
or
```bash
yarn dev
```

4. Open your browser and navigate to:
```
http://localhost:3000/
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server using Vite |
| `npm run build` | Compiles and minifies the project for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint and automatically fixes linting issues |
| `npm run lint:check` | Checks for linting issues without fixing them |
| `npm run test` | Runs all tests once using Vitest |
| `npm run test:watch` | Runs tests in watch mode (tests re-run when files change) |
| `npm run test:coverage` | Runs tests and generates a coverage report |
| `npm run test:ui` | Opens the Vitest UI for interactive test debugging |

## Project Structure

```
community-solar-finder/
├── public/             # Static assets
├── src/
│   ├── assets/         # Asset files (images, fonts, etc.)
│   ├── components/     # Vue components
│   │   ├── common/     # Shared/utility components
│   │   ├── filters/    # Filter-related components
│   │   └── projects/   # Project-related components
│   ├── composables/    # Vue composable functions
│   ├── router/         # Vue Router configuration
│   ├── services/       # API services
│   ├── stores/         # Pinia stores
│   ├── views/          # View components (pages)
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── tests/
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── vitest.config.js    # Vitest configuration
└── package.json        # Project dependencies and scripts
```

## Technology Stack

- [Vue 3](https://vuejs.org/) with Composition API
- [Pinia](https://pinia.esm.dev/) for state management
- [Vue Router](https://router.vuejs.org/) for routing
- [Axios](https://axios-http.com/) for API requests
- [Bootstrap 5](https://getbootstrap.com/) for UI components
- [Vue I18n](https://vue-i18n.intlify.dev/) for internationalization
- [Vitest](https://vitest.dev/) for testing
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality

## API Integration

This application consumes data from the EnergySage Community Solar API:
- Base URL: `https://api.cdgm.energysage.com/api/v1/projects/search/`
- Filter parameters:
  - `zip_code`: Filter projects by ZIP code
  - `state`: Filter projects by state (two-letter code)

## Deployment

To deploy the application:

1. Build the production bundle:
```bash
npm run build
```

2. The compiled files will be in the `dist` directory, which can be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE).