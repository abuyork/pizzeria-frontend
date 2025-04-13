# Pizzeria Frontend Project Overview

This is a React web application built with TypeScript, likely bootstrapped using Create React App.

**Key Features & Structure:**

*   **Routing:** Uses `react-router-dom` to manage navigation between different pages.
*   **Pages/Screens:** The application includes the following main sections:
    *   `HomePage`: The main landing page.
    *   `ProductsPage`: Displays products, likely allowing users to add items to a cart.
    *   `OrdersPage`: Shows user orders.
    *   `UserPage`: A dedicated page for user-related information or actions.
    *   `CalAiPage`: A page related to "Cal AI".
*   **Components:** Reusable UI elements are organized within the `src/app/components` directory. This includes separate navigation bars (`HomeNavbar`, `OtherNavbar`) and a `Footer`.
*   **State Management:**
    *   A global state management solution seems to be in place, indicated by `src/app/store.ts` (possibly Redux Toolkit) and a `useGlobals` hook.
    *   Local component state and custom hooks (`useBasket`, `useGlobals`) are also used.
*   **Shopping Cart:** The `useBasket` hook manages shopping cart functionality (adding, removing, deleting items).
*   **Authentication:** Handles user signup, login (via `AuthenticationModal`), and logout. A `MemberService` likely interacts with a backend API for authentication tasks.
*   **Styling:** Uses standard CSS files (`src/css`) and potentially a UI library like Material UI (indicated by `src/app/MaterialTheme`).
*   **Notifications:** Uses `sweetalert2` for user feedback messages.
*   **Services:** API interactions seem to be handled in the `src/app/services` directory (e.g., `MemberService`).
*   **Testing:** Basic test setup is included (`setupTests.ts`, `App.test.tsx`).
