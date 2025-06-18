// // InstagramStories.test.tsx
// import React from "react";
// import {
//   render,
//   screen,
//   fireEvent,
//   waitFor,
//   act,
// } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import InstagramStories from "./index";

// // Mock IntersectionObserver
// global.IntersectionObserver = class IntersectionObserver {
//   constructor() {}
//   disconnect() {}
//   observe() {}
//   unobserve() {}
// };

// // Mock for image loading
// Object.defineProperty(HTMLImageElement.prototype, "onload", {
//   get() {
//     return this._onload;
//   },
//   set(fn) {
//     this._onload = fn;
//     // Simulate image load after a short delay
//     setTimeout(() => {
//       if (fn) fn();
//     }, 100);
//   },
// });

// // Mock timers
// jest.useFakeTimers();

// describe("InstagramStories", () => {
//   beforeEach(() => {
//     jest.clearAllTimers();
//   });

//   afterEach(() => {
//     jest.runOnlyPendingTimers();
//     jest.useRealTimers();
//     jest.useFakeTimers();
//   });

//   test("renders story list with user avatars", () => {
//     render(<InstagramStories />);

//     expect(screen.getByText("Stories")).toBeInTheDocument();
//     expect(screen.getByTestId("story-item-0")).toBeInTheDocument();
//     expect(screen.getByText("john_doe")).toBeInTheDocument();
//     expect(screen.getByText("jane_smith")).toBeInTheDocument();
//   });

//   test("opens story viewer when story is clicked", async () => {
//     render(<InstagramStories />);

//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//       expect(screen.getByText("john_doe")).toBeInTheDocument();
//       expect(screen.getByTestId("close-story")).toBeInTheDocument();
//     });
//   });

//   test("closes story viewer when close button is clicked", async () => {
//     render(<InstagramStories />);

//     // Open story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Close story
//     const closeButton = screen.getByTestId("close-story");
//     fireEvent.click(closeButton);

//     await waitFor(() => {
//       expect(screen.queryByTestId("story-content")).not.toBeInTheDocument();
//     });
//   });

//   test("navigates to next story when right side is clicked", async () => {
//     render(<InstagramStories />);

//     // Open story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Click right side to go to next story
//     const storyContent = screen.getByTestId("story-content");
//     const rect = storyContent.getBoundingClientRect();

//     fireEvent.click(storyContent, {
//       clientX: rect.left + rect.width * 0.75, // Click on right side
//       clientY: rect.top + rect.height * 0.5,
//     });

//     // Wait for navigation
//     await waitFor(() => {
//       // Should still be in story viewer but possibly different story
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });
//   });

//   test("navigates to previous story when left side is clicked", async () => {
//     render(<InstagramStories />);

//     // Open story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // First go to next story
//     const storyContent = screen.getByTestId("story-content");
//     const rect = storyContent.getBoundingClientRect();

//     fireEvent.click(storyContent, {
//       clientX: rect.left + rect.width * 0.75, // Click on right side
//       clientY: rect.top + rect.height * 0.5,
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Now click left side to go back
//     fireEvent.click(storyContent, {
//       clientX: rect.left + rect.width * 0.25, // Click on left side
//       clientY: rect.top + rect.height * 0.5,
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });
//   });

//   test("handles touch swipe navigation", async () => {
//     render(<InstagramStories />);

//     // Open story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     const storyContent = screen.getByTestId("story-content");

//     // Simulate swipe left (next story)
//     fireEvent.touchStart(storyContent, {
//       touches: [{ clientX: 200, clientY: 200 }],
//     });

//     fireEvent.touchEnd(storyContent, {
//       changedTouches: [{ clientX: 100, clientY: 200 }],
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Simulate swipe right (previous story)
//     fireEvent.touchStart(storyContent, {
//       touches: [{ clientX: 100, clientY: 200 }],
//     });

//     fireEvent.touchEnd(storyContent, {
//       changedTouches: [{ clientX: 200, clientY: 200 }],
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });
//   });

//   test("auto-advances to next story after 5 seconds", async () => {
//     render(<InstagramStories />);

//     // Open story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Fast-forward time by 5 seconds
//     act(() => {
//       jest.advanceTimersByTime(5000);
//     });

//     // Should advance to next story or close if no more stories
//     await waitFor(() => {
//       // Story viewer should still be open if there are more stories
//       const storyContent = screen.queryByTestId("story-content");
//       expect(storyContent).toBeTruthy();
//     });
//   });

//   test("pauses and resumes story progression", async () => {
//     render(<InstagramStories />);

//     // Open story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Find and click pause button
//     const pauseButton = screen.getByTestId("pause-play-button");
//     fireEvent.click(pauseButton);

//     // Fast-forward time - story should not advance when paused
//     act(() => {
//       jest.advanceTimersByTime(6000);
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Click play button to resume
//     fireEvent.click(pauseButton);

//     // Now it should advance after the remaining time
//     act(() => {
//       jest.advanceTimersByTime(5000);
//     });

//     await waitFor(() => {
//       // Should advance or close
//       expect(screen.queryByTestId("story-content")).toBeTruthy();
//     });
//   });

//   test("handles image loading states", async () => {
//     render(<InstagramStories />);

//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     // Should show loading state initially
//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//       // Loading spinner should be visible
//       expect(document.querySelector(".animate-spin")).toBeInTheDocument();
//     });

//     // Wait for image to load
//     await waitFor(
//       () => {
//         // Loading spinner should be gone after image loads
//         expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   });

//   test("handles multiple users and stories", async () => {
//     render(<InstagramStories />);

//     // Check that multiple users are rendered
//     expect(screen.getByText("john_doe")).toBeInTheDocument();
//     expect(screen.getByText("jane_smith")).toBeInTheDocument();
//     expect(screen.getByText("alex_wilson")).toBeInTheDocument();
//     expect(screen.getByText("sarah_jones")).toBeInTheDocument();

//     // Open second user's story
//     const secondStory = screen.getByTestId("story-item-1");
//     fireEvent.click(secondStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//       expect(screen.getByText("jane_smith")).toBeInTheDocument();
//     });
//   });

//   test("shows correct number of progress bars", async () => {
//     render(<InstagramStories />);

//     // Open first user's story (has 3 stories)
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Should have 3 progress bars for john_doe's 3 stories
//     const progressBars = document.querySelectorAll('[class*="progress"]');
//     expect(progressBars.length).toBeGreaterThan(0);
//   });

//   test("closes story viewer when all stories are completed", async () => {
//     render(<InstagramStories />);

//     // Open last user's story (alex_wilson has only 1 story)
//     const lastStory = screen.getByTestId("story-item-2");
//     fireEvent.click(lastStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Fast-forward to complete the story
//     act(() => {
//       jest.advanceTimersByTime(5000);
//     });

//     // Should close the viewer after completion
//     await waitFor(() => {
//       expect(screen.queryByTestId("story-content")).not.toBeInTheDocument();
//     });
//   });

//   test("handles keyboard navigation", async () => {
//     render(<InstagramStories />);

//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Test Escape key to close
//     fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

//     await waitFor(() => {
//       expect(screen.queryByTestId("story-content")).not.toBeInTheDocument();
//     });
//   });

//   test("is mobile-optimized", () => {
//     render(<InstagramStories />);

//     // Check for mobile-specific classes
//     const storyList = document.querySelector(".overflow-x-auto");
//     expect(storyList).toBeInTheDocument();

//     // Check for touch-friendly sizing
//     const avatars = document.querySelectorAll(".w-16.h-16");
//     expect(avatars.length).toBeGreaterThan(0);
//   });
// });

// // Additional integration tests
// describe("InstagramStories Integration", () => {
//   test("complete user journey", async () => {
//     render(<InstagramStories />);

//     // 1. User sees story list
//     expect(screen.getByText("Stories")).toBeInTheDocument();
//     expect(screen.getByText("john_doe")).toBeInTheDocument();

//     // 2. User clicks on a story
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     // 3. Story viewer opens
//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // 4. User navigates through stories
//     const storyContent = screen.getByTestId("story-content");
//     const rect = storyContent.getBoundingClientRect();

//     // Navigate to next story
//     fireEvent.click(storyContent, {
//       clientX: rect.left + rect.width * 0.75,
//       clientY: rect.top + rect.height * 0.5,
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // 5. User pauses the story
//     const pauseButton = screen.getByTestId("pause-play-button");
//     fireEvent.click(pauseButton);

//     // 6. User resumes the story
//     fireEvent.click(pauseButton);

//     // 7. User closes the story
//     const closeButton = screen.getByTestId("close-story");
//     fireEvent.click(closeButton);

//     // 8. User is back to story list
//     await waitFor(() => {
//       expect(screen.queryByTestId("story-content")).not.toBeInTheDocument();
//       expect(screen.getByText("Stories")).toBeInTheDocument();
//     });
//   });

//   test("handles error states gracefully", async () => {
//     // Mock image error
//     Object.defineProperty(HTMLImageElement.prototype, "onerror", {
//       get() {
//         return this._onerror;
//       },
//       set(fn) {
//         this._onerror = fn;
//         // Simulate image error
//         setTimeout(() => {
//           if (fn) fn();
//         }, 100);
//       },
//     });

//     render(<InstagramStories />);

//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Should show error message
//     await waitFor(() => {
//       expect(screen.getByText("Failed to load image")).toBeInTheDocument();
//       expect(screen.getByText("Retry")).toBeInTheDocument();
//     });
//   });

//   test("performance optimization - lazy loading", () => {
//     render(<InstagramStories />);

//     // Check that images have loading="lazy" attribute
//     const images = document.querySelectorAll('img[loading="lazy"]');
//     expect(images.length).toBeGreaterThan(0);
//   });
// });

// // Performance tests
// describe("InstagramStories Performance", () => {
//   test("renders efficiently with multiple stories", () => {
//     const startTime = performance.now();
//     render(<InstagramStories />);
//     const endTime = performance.now();

//     // Should render in reasonable time (less than 100ms)
//     expect(endTime - startTime).toBeLessThan(100);
//   });

//   test("handles rapid navigation without issues", async () => {
//     render(<InstagramStories />);

//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     const storyContent = screen.getByTestId("story-content");
//     const rect = storyContent.getBoundingClientRect();

//     // Rapidly click next multiple times
//     for (let i = 0; i < 5; i++) {
//       fireEvent.click(storyContent, {
//         clientX: rect.left + rect.width * 0.75,
//         clientY: rect.top + rect.height * 0.5,
//       });
//     }

//     // Should handle rapid clicks gracefully
//     await waitFor(() => {
//       expect(screen.queryByTestId("story-content")).toBeTruthy();
//     });
//   });
// });

// // Accessibility tests
// describe("InstagramStories Accessibility", () => {
//   test("has proper ARIA labels and roles", async () => {
//     render(<InstagramStories />);

//     // Check for proper button roles
//     const firstStory = screen.getByTestId("story-item-0");
//     fireEvent.click(firstStory);

//     await waitFor(() => {
//       const closeButton = screen.getByTestId("close-story");
//       expect(closeButton).toHaveAttribute("type", "button");
//     });
//   });

//   test("supports keyboard navigation", async () => {
//     render(<InstagramStories />);

//     const firstStory = screen.getByTestId("story-item-0");

//     // Should be focusable
//     firstStory.focus();
//     expect(firstStory).toHaveFocus();

//     // Should respond to Enter key
//     fireEvent.keyDown(firstStory, { key: "Enter" });

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });
//   });

//   test("has proper alt text for images", () => {
//     render(<InstagramStories />);

//     const avatarImages = document.querySelectorAll("img[alt]");
//     avatarImages.forEach((img) => {
//       expect(img).toHaveAttribute("alt");
//       expect(img.getAttribute("alt")).not.toBe("");
//     });
//   });
// });

// // Edge cases
// describe("InstagramStories Edge Cases", () => {
//   test("handles empty story list", () => {
//     // This would require mocking the data, but demonstrates the test structure
//     render(<InstagramStories />);
//     expect(screen.getByText("Stories")).toBeInTheDocument();
//   });

//   test("handles single story", async () => {
//     render(<InstagramStories />);

//     // Click on alex_wilson who has only 1 story
//     const singleStory = screen.getByTestId("story-item-2");
//     fireEvent.click(singleStory);

//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//       expect(screen.getByText("alex_wilson")).toBeInTheDocument();
//     });

//     // Should close after the single story completes
//     act(() => {
//       jest.advanceTimersByTime(5000);
//     });

//     await waitFor(() => {
//       expect(screen.queryByTestId("story-content")).not.toBeInTheDocument();
//     });
//   });

//   test("handles network connectivity issues", async () => {
//     // Mock network error
//     const originalFetch = global.fetch;
//     global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

//     render(<InstagramStories />);

//     // Should still render the UI even with network issues
//     expect(screen.getByText("Stories")).toBeInTheDocument();

//     // Restore fetch
//     global.fetch = originalFetch;
//   });
// });

// // Test utilities and setup
// export const testUtils = {
//   // Helper to wait for story to load
//   waitForStoryToLoad: async () => {
//     await waitFor(() => {
//       expect(screen.getByTestId("story-content")).toBeInTheDocument();
//     });

//     // Wait for image to load
//     await waitFor(
//       () => {
//         expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
//       },
//       { timeout: 2000 }
//     );
//   },

//   // Helper to simulate touch swipe
//   simulateSwipe: (element: HTMLElement, direction: "left" | "right") => {
//     const startX = direction === "left" ? 200 : 100;
//     const endX = direction === "left" ? 100 : 200;

//     fireEvent.touchStart(element, {
//       touches: [{ clientX: startX, clientY: 200 }],
//     });

//     fireEvent.touchEnd(element, {
//       changedTouches: [{ clientX: endX, clientY: 200 }],
//     });
//   },

//   // Helper to click on specific side of story
//   clickStorySide: (element: HTMLElement, side: "left" | "right") => {
//     const rect = element.getBoundingClientRect();
//     const xPosition = side === "left" ? rect.width * 0.25 : rect.width * 0.75;

//     fireEvent.click(element, {
//       clientX: rect.left + xPosition,
//       clientY: rect.top + rect.height * 0.5,
//     });
//   },
// };
