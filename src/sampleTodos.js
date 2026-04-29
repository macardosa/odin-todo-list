import { TodoItem } from "./TodoItem.js";

export const sampleTodos = [
    new TodoItem(
        "Finish UI layout",
        "2026-04-30",
        "HIGH",
        "Complete the main dashboard layout and ensure responsiveness."
    ),

    new TodoItem(
        "Fix login bug",
        "2026-04-29",
        "HIGH",
        "Users occasionally get logged out immediately after login."
    ),

    new TodoItem(
        "Write API documentation",
        "2026-05-02",
        "MEDIUM",
        "Document all REST endpoints for the backend service."
    ),

    new TodoItem(
        "Refactor TodoItem class",
        "2026-05-05",
        "MEDIUM",
        "Consider adding validation and separating concerns."
    ),

    new TodoItem(
        "Add dark mode support",
        "2026-05-10",
        "LOW",
        "Implement theme toggle and persist user preference."
    ),

    new TodoItem(
        "Clean up CSS",
        "2026-05-01",
        "LOW",
        "Remove unused styles and simplify layout rules."
    ),

    new TodoItem(
        "Improve loading performance",
        "2026-05-03",
        "HIGH",
        "Lazy load heavy components and optimize bundle size."
    ),

    new TodoItem(
        "Set up tests",
        "2026-05-07",
        "MEDIUM",
        "Add unit tests for core business logic."
    ),

    new TodoItem(
        "Set up tests",
        "2026-05-07",
        "MEDIUM",
        `Add unit tests for core business logic. 
    Make sure to cover edge cases such as invalid inputs, 
    unexpected null values, and performance-critical paths. 
    Include integration tests for async functions and API calls. 
    Document each test scenario clearly in the test suite.`
    )
];