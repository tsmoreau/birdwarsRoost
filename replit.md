# Bird Wars Roost - Playdate Game Server

## Overview
This project is the backend server for "Bird Wars," an async multiplayer turn-based tactics game designed for the Playdate console. The server facilitates core gameplay mechanics by managing device registration, authenticating users, handling battle session lifecycles, and validating turn submissions. It aims to provide a robust and secure foundation for an Advance Wars-style gaming experience on the Playdate platform, enabling players to engage in strategic battles with others. The long-term vision includes fostering a community around competitive Playdate gaming.

## User Preferences
I prefer clear and direct communication. When implementing features, prioritize modularity and maintainability. I value iterative development, so focus on getting core functionalities working before adding extensive enhancements. For any major architectural changes or decisions, please ask for confirmation before proceeding. Ensure all security best practices are followed, especially concerning user data and authentication.

## System Architecture

### UI/UX Decisions
The dashboard and administrative interfaces adhere to a "Bird Wars 1-bit Aesthetic," utilizing a monochrome palette of black, white, and grays, inspired by the Playdate's display. Typography features bold, uppercase headings with tight tracking for a tactical feel. UI components like cards use 1px black borders and rounded corners. A CSS-based dither pattern is applied to header areas, and a shared navigation component features the "Bird Wars Roost" branding with the `birb001.png` icon. Color accents are intentionally omitted to maintain the monochrome theme, with badges using black/white variations for status indicators.

### Technical Implementations
The server is built with **Next.js 16** using the App Router, providing a robust framework for API routes and server-side rendering. **MongoDB** is used as the database, managed via Mongoose schemas for devices, battles, turns, pings, and audit logs. All backend logic is written in **TypeScript** for type safety and maintainability. Styling is handled with **Tailwind CSS**.

The server acts as a **lightweight state tracker**, focusing on validating essential actions rather than full game simulation. Complex game logic, such as pathfinding and damage calculation, is offloaded to the Playdate client. The `Battle` document stores a `currentState` field, comprising `blockedTiles` (static from map data) and `units` (dynamic, updated per turn). Validation rules enforce correct player turns, battle status, turn sequencing, and device participation. Planned validations include tile collision, movement range, unit ownership, and unit existence.

Authentication employs a **deterministic token system** where `secretToken` is generated using `HMAC-SHA256(serialNumber, SESSION_SECRET)`. This allows for automatic account recovery and ensures a consistent token for a given device serial number. Tokens are hashed again before storage (`tokenHash = HMAC-SHA256(secretToken, SESSION_SECRET)`) to enhance security.

### Feature Specifications
- **Device Registration**: A dual-purpose endpoint for new device registration, existing account recovery (via `deviceId` or `serialNumber`), and profile updates (displayName, avatar).
- **Battle Management**: Endpoints for creating, listing (public and player-specific with pagination and status filters), joining, getting details, and canceling battles. Auto-forfeit logic is implemented for inactive opponents.
- **Turn Submission**: Allows authenticated players to submit turn actions and their client-side `gameState.units` for server-side validation and state updates.
- **Device Ping**: Records device pings, capturing device info, IP, user agent, and optional messages, with an endpoint to list recorded pings.
- **Player Statistics**: Provides endpoints to retrieve player battle statistics, including win/loss records and total turns submitted.

### System Design Choices
The project emphasizes a clear separation of concerns between the server and the Playdate client. The server handles persistent state, security, and critical validation, while the client manages the computationally intensive game logic and rendering. The API is designed to be RESTful, with clear endpoints for various functionalities and robust error handling. Pagination is implemented using cursor-based methods for efficient data retrieval.

## External Dependencies
- **Next.js**: Web framework for the server application.
- **MongoDB**: NoSQL database for storing game and user data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **Tailwind CSS**: Utility-first CSS framework for styling the administrative UI.
- **Playdate (Lua)**: The client-side game platform, which interacts with this server.