import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import "./index.css";

// Types
interface Story {
  id: string;
  image: string;
  duration?: number;
}

interface User {
  id: string;
  username: string;
  avatar: string;
  stories: Story[];
}

// Mock data - in real app, this would come from an external file/API
const mockUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    stories: [
      {
        id: "1-1",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      },
      {
        id: "1-2",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
      },
      {
        id: "1-3",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
      },
    ],
  },
  {
    id: "2",
    username: "jane_smith",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    stories: [
      {
        id: "2-1",
        image:
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop",
      },
      {
        id: "2-2",
        image:
          "https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400&h=600&fit=crop",
      },
    ],
  },
  {
    id: "3",
    username: "alex_wilson",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
    stories: [
      {
        id: "3-1",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      },
    ],
  },
  {
    id: "4",
    username: "sarah_jones",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    stories: [
      {
        id: "4-1",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      },
      {
        id: "4-2",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop",
      },
    ],
  },
];

// Progress Bar Component
const ProgressBar: React.FC<{
  duration: number;
  isPaused: boolean;
  onComplete: () => void;
  key: string;
}> = ({ duration, isPaused, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setProgress(0);

    const updateProgress = () => {
      if (!isPaused) {
        const elapsed =
          Date.now() - startTimeRef.current - pausedTimeRef.current;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          onComplete();
          return;
        }
      }
    };

    intervalRef.current = setInterval(updateProgress, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, onComplete]);

  useEffect(() => {
    if (isPaused) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
    } else {
      startTimeRef.current = Date.now();
    }
  }, [isPaused]);

  return (
    <div className="w-full h-1 bg-gray-600 bg-opacity-50 rounded-full overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Story List Component
const StoryList: React.FC<{
  users: User[];
  onStorySelect: (userIndex: number, storyIndex: number) => void;
}> = ({ users, onStorySelect }) => {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
      {users.map((user, userIndex) => (
        <div
          key={user.id}
          className="flex flex-col items-center gap-2 min-w-fit cursor-pointer"
          onClick={() => onStorySelect(userIndex, 0)}
          data-testid={`story-item-${userIndex}`}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover border-2 border-white"
                loading="lazy"
              />
            </div>
            {user.stories.length > 0 && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user.stories.length}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-800 max-w-16 truncate">
            {user.username}
          </span>
        </div>
      ))}
    </div>
  );
};

// Story Viewer Component
const StoryViewer: React.FC<{
  users: User[];
  currentUserIndex: number;
  currentStoryIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}> = ({
  users,
  currentUserIndex,
  currentStoryIndex,
  onClose,
  onPrevious,
  onNext,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentUser = users[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];
  const storyDuration = 5000; // 5 seconds

  // Handle story completion
  const handleStoryComplete = useCallback(() => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      onNext();
    } else if (currentUserIndex < users.length - 1) {
      // Move to next user's first story
      onNext();
    } else {
      // All stories completed
      onClose();
    }
  }, [
    currentStoryIndex,
    currentUser?.stories.length,
    currentUserIndex,
    users.length,
    onNext,
    onClose,
  ]);

  // Handle touch events for navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        onPrevious();
      } else {
        onNext();
      }
    }

    touchStartRef.current = null;
  };

  // Handle click navigation
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 2) {
      onPrevious();
    } else {
      onNext();
    }
  };

  // Reset image loading state when story changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentStory?.id]);

  if (!currentUser || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white relative z-10">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium">{currentUser.username}</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          data-testid="close-story"
        >
          <X size={24} />
        </button>
      </div>

      {/* Progress Bars */}
      <div className="flex gap-1 px-4 pb-4 relative z-10">
        {currentUser.stories.map((_, index) => (
          <div key={`progress-${index}`} className="flex-1">
            {index < currentStoryIndex ? (
              <div className="w-full h-1 bg-white rounded-full" />
            ) : index === currentStoryIndex ? (
              <ProgressBar
                key={`${currentUser.id}-${index}`}
                duration={storyDuration}
                isPaused={isPaused || !imageLoaded}
                onComplete={handleStoryComplete}
              />
            ) : (
              <div className="w-full h-1 bg-gray-600 bg-opacity-50 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div
        className="flex-1 relative overflow-hidden cursor-pointer select-none"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        data-testid="story-content"
      >
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error State */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <p className="text-lg mb-2">Failed to load image</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageError(false);
                  setImageLoaded(false);
                }}
                className="px-4 py-2 bg-blue-500 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Story Image */}
        <img
          src={currentStory.image}
          alt="Story"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Navigation Hints */}
        <div className="absolute inset-0 flex">
          <div
            className="flex-1 flex items-center justify-start pl-8"
            data-testid="previous-area"
          >
            <ChevronLeft
              size={32}
              className="text-white opacity-0 hover:opacity-50 transition-opacity pointer-events-none"
            />
          </div>
          <div
            className="flex-1 flex items-center justify-end pr-8"
            data-testid="next-area"
          >
            <ChevronRight
              size={32}
              className="text-white opacity-0 hover:opacity-50 transition-opacity pointer-events-none"
            />
          </div>
        </div>

        {/* Pause/Play Button */}
        <button
          className="absolute bottom-8 right-8 bg-black bg-opacity-50 text-white p-3 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setIsPaused(!isPaused);
          }}
          data-testid="pause-play-button"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>
    </div>
  );
};

// Main App Component
const InstagramStories: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(-1);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleStorySelect = (userIndex: number, storyIndex: number) => {
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(storyIndex);
    setIsViewerOpen(true);
  };

  const handleClose = () => {
    setIsViewerOpen(false);
    setCurrentUserIndex(-1);
    setCurrentStoryIndex(0);
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      const prevUser = users[currentUserIndex - 1];
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(prevUser.stories.length - 1);
    }
  };

  const handleNext = () => {
    const currentUser = users[currentUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      handleClose();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">Stories</h1>
      </div>

      {/* Story List */}
      <StoryList users={users} onStorySelect={handleStorySelect} />

      {/* Story Viewer */}
      {isViewerOpen && (
        <StoryViewer
          users={users}
          currentUserIndex={currentUserIndex}
          currentStoryIndex={currentStoryIndex}
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default InstagramStories;
