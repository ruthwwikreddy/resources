<div align="center">
# ResourceHub
**An open-source, curated knowledge repository for developers and learners.**
A streamlined platform for organizing, discovering, and sharing high-value technical resources, tutorials, and documentation.
[Source](https://github.com/ruthwwikreddy/resources) · Built by [Ruthwik Reddy](https://www.ruthwikreddy.live/)
MIT licensed · React + TypeScript · Firebase Backend
</div>

---

## Table of contents
1. [What ResourceHub does](#1-what-resourcehub-does)
2. [Core Architecture](#2-core-architecture)
3. [Key Features](#3-key-features)
4. [Quick start](#4-quick-start)
5. [Project Structure](#5-project-structure)
6. [Tech Stack](#6-tech-stack)
7. [Contributing](#7-contributing)
8. [License](#8-license)

---

## 1. What ResourceHub does

| Capability | Detail |
|---|---|
| **Resource Curation** | Organizes vast amounts of learning material into structured categories for easy discovery. |
| **Dynamic Filtering** | Users can filter resources by tags and categories to find exactly what they need. |
| **Detailed Insights** | Dedicated resource pages providing deep-dives, links, and descriptions of each entry. |
| **Administrative Control** | Integrated Admin panel for real-time addition, editing, and deletion of resources. |
| **Cloud Synchronization** | Powered by Firebase to ensure that the resource library is always up-to-date globally. |

## 2. Core Architecture

```
User Browser             ResourceHub (React/TS)              Firebase Cloud
─────────────────         ────────────────────────            ────────────────────────
Browse Resources    ─────▶  Categories/Home Page     ──────▶    Firestore (Resource Data)
Filter by Tag       ─────▶  Resource Filtering       ──────▶    Firestore (Tags/Meta)
View Detail        ─────▶  ResourceDetail Page     ──────▶    Firestore (Entry Details)
                                                                      │
                                                                      ▼
Admin User          ─────▶  Admin Management Page    ──────▶    Secure Admin Auth
Add New Resource    ─────▶  Admin Form/Validator     ──────▶    Firestore (Write Update)
Manage Entries      ─────▶  CRUD Operations         ──────▶    Firestore (Sync)
```

## 3. Key Features

- **Category-Based Navigation**: Quick access to different domains of knowledge via `CategoryCard`.
- **Code-Friendly Display**: Built-in `CodeBlock` component for sharing snippets alongside resources.
- **Adaptive Theming**: A comprehensive `ThemeProvider` to ensure a comfortable reading experience.
- **Responsive Layout**: Fully optimized for seamless browsing on mobile and desktop devices.

## 4. Quick start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ruthwwikreddy/resources.git
   cd resources
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Set up your Firebase project and add the config to `src/firebase.ts`.

4. **Run locally**:
   ```bash
   npm run dev
   ```

## 5. Project Structure

- `src/pages`: Core views including `Home`, `Resources`, `Categories`, and the `Admin` portal.
- `src/components`: Reusable UI elements like `ResourceCard`, `TagBadge`, and `Navbar`.
- `src/lib`: Utility functions and Firebase helper logic.
- `src/types`: TypeScript definitions for resources and user roles.

## 6. Tech Stack

- **Framework**: React 18, TypeScript, Vite.
- **Backend**: Firebase Firestore (NoSQL), Firebase Auth.
- **Styling**: Tailwind CSS / Modern CSS.
- **Deployment**: Vercel / Firebase Hosting.

## 7. Contributing
Contributions to the resource list or the platform's functionality are welcome. Please ensure new resources follow the project's metadata schema.

## 8. License
Released under the **MIT License** — feel free to fork this to create your own niche resource hub.
