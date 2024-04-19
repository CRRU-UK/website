# CRRU Website

[![Test](https://github.com/CRRU-UK/website/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/CRRU-UK/website/actions/workflows/main.yaml)
[![Build image](https://github.com/CRRU-UK/website/actions/workflows/build.yaml/badge.svg?branch=main)](https://github.com/CRRU-UK/website/actions/workflows/build.yaml)

1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Installation](#installation)
4. [Development](#development)
5. [Deployment](#deployment)

## Introduction

Website for CRRU, built in NextJS, TypeScript, React, and SCSS.

## Overview

The app is made up of the following parts:

* [`src/`](src/) contains the main code
  * [`src/pages`](src/pages) contains the app routes and pages
  * [`src/layout`](src/layout) contains single-use React components (e.g. header and footer)
  * [`src/components`](src/components) contains common React components
  * [`src/scss`](src/scss) contains global SCSS styles
  * [`src/helpers`](src/helpers) contains common helpers, utility functions, and constants
    * [`src/helpers/rendering`](src/helpers/rendering) contains Contentful rich text rendering handling
  * [`src/data`](src/data) contains static JSON data
* [`public/`](public/) contains static assets (e.g. fonts and icons)
* [`redirects.json`](redirects.json) contains permanent redirects for the previous website

## Installation

1. Clone the repository
2. Ensure you are using Node version >= 20 (`nvm install 20` / `nvm use 20`)
3. Install the dependencies by running [`npm ci`](https://docs.npmjs.com/cli/ci.html)

The following environment variables should be provided when running the server (an `.env` file in the root is supported – see [`.env.example`](.env.example) for an example):

| Variable                                    | Description                           | Required |
| ------------------------------------------- | ------------------------------------- | -------- |
| `NODE_ENV`                                  | Environment the app is running on.    | False    |
| `NODE_CONTENTFUL_SPACE_ID`                  | Contentful space ID.                  | True     |
| `NODE_CONTENTFUL_ENVIRONMENT`               | Contentful environment.               | True     |
| `NODE_CONTENTFUL_DELIVERY_API_TOKEN`        | Contentful Delivery API access token. | True     |
| `NODE_CONTENTFUL_PREVIEW_API_TOKEN`         | Contentful Preview API access token.  | True     |
| `NODE_CONTENTFUL_ENVIRONMENT`               | Contentful environment.               | True     |
| `NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY` | Cloudflare Turnstile site key.        | True     |
| `NODE_CLOUDFLARE_CHALLENGE_SECRET_KEY`      | Cloudflare Turnstile secret key.      | True     |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`           | Google Analytics tracking ID.         | True     |
| `NODE_SMTP_HOST`                            | SMTP host for sending emails.         | True     |
| `NODE_SMTP_PORT`                            | SMTP port for sending emails.         | True     |
| `NODE_SMTP_USERNAME`                        | SMTP username for sending emails.     | True     |
| `NODE_SMTP_PASSWORD`                        | SMTP password for sending emails.     | True     |
| `NODE_SIGHTING_EMAIL`                       | (Temporary)                           | False    |

## Development

Below are the NPM commands that can be used for development:

| Command                 | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `start`                 | Starts the app (requires `build` to be run).                         |
| `build`                 | Builds the app for production.                                       |
| `dev`                   | Runs the app in development mode.                                    |
| `test`                  | Runs `test:eslint`, `test:typescript`, and `test:unit` sequentially. |
| `test:eslint`           | Runs ESLint tests.                                                   |
| `test:stylelint`        | Runs stylelint tests.                                                |
| `test:typescript`       | Runs TypeScript tests.                                               |
| `test:unit`             | Runs unit and integration tests and generates a coverage report.     |
| `test:unit:watch`       | Same as `test:unit` but runs it in watch mode.                       |

## Deployment

The app runs on port 3000.
