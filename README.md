# CRRU Website

[![Test](https://github.com/CRRU-UK/website/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/CRRU-UK/website/actions/workflows/main.yaml)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=CRRU-UK_website&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=CRRU-UK_website)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=CRRU-UK_website&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=CRRU-UK_website)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=CRRU-UK_website&metric=bugs)](https://sonarcloud.io/summary/new_code?id=CRRU-UK_website)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=CRRU-UK_website&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=CRRU-UK_website)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=CRRU-UK_website&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=CRRU-UK_website)

1. [Introduction](#introduction)
2. [Overview](#overview)
3. [Installation](#installation)
4. [Development](#development)
5. [Deployment](#deployment)

## Introduction

Source code for the [CRRU website](https://crru.org.uk) – built in NextJS, TypeScript, React, and SCSS.

The website primarily uses Contentful as the main source of data.

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
2. Ensure you are using Node version >= 22 (`nvm install 22` / `nvm use 22`)
3. Install the dependencies by running [`npm ci`](https://docs.npmjs.com/cli/ci.html)

The following environment variables should be provided when running the server (an `.env` file in the root is supported – see [`.env.example`](.env.example) for an example):

| Variable                                    | Description                           |
| ------------------------------------------- | ------------------------------------- |
| `NODE_ENV`                                  | Environment the app is running on.    |
| `NODE_CONTENTFUL_SPACE_ID`                  | Contentful space ID.                  |
| `NODE_CONTENTFUL_ENVIRONMENT`               | Contentful environment.               |
| `NODE_CONTENTFUL_DELIVERY_API_TOKEN`        | Contentful Delivery API access token. |
| `NODE_CONTENTFUL_PREVIEW_API_TOKEN`         | Contentful Preview API access token.  |
| `NODE_CONTENTFUL_ENVIRONMENT`               | Contentful environment.               |
| `NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY` | Cloudflare Turnstile site key.        |
| `NODE_CLOUDFLARE_CHALLENGE_SECRET_KEY`      | Cloudflare Turnstile secret key.      |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`           | Google Analytics tracking ID.         |
| `NODE_SMTP_HOST`                            | SMTP host for sending emails.         |
| `NODE_SMTP_PORT`                            | SMTP port for sending emails.         |
| `NODE_SMTP_USERNAME`                        | SMTP username for sending emails.     |
| `NODE_SMTP_PASSWORD`                        | SMTP password for sending emails.     |
| `NODE_SIGHTING_EMAIL`                       | Email address to send sightings to.   |

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
