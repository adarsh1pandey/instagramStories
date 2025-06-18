import React, { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
// Types
interface Story {
  id: string;
  imageUrl: string;
  username: string;
  profilePic: string;
}

// Mock data - simulates external file/API
const mockStories: Story[] = [
  {
    id: "1",
    imageUrl: "https://picsum.photos/400/600?random=1",
    username: "john_doe",
    profilePic: "https://picsum.photos/40/40?random=11",
  },
  {
    id: "2",
    imageUrl: "https://picsum.photos/400/600?random=2",
    username: "jane_smith",
    profilePic: "https://picsum.photos/40/40?random=12",
  },
  {
    id: "3",
    imageUrl: "https://picsum.photos/400/600?random=3",
    username: "mike_wilson",
    profilePic: "https://picsum.photos/40/40?random=13",
  },
  {
    id: "4",
    imageUrl: "https://picsum.photos/400/600?random=4",
    username: "sarah_jones",
    profilePic: "https://picsum.photos/40/40?random=14",
  },
  {
    id: "5",
    imageUrl: "https://picsum.photos/400/600?random=5",
    username: "alex_brown",
    profilePic: "https://picsum.photos/40/40?random=15",
  },
];

// Story Preview Component
const StoryPreview: React.FC<{
  story: Story;
  isViewed: boolean;
  onClick: () => void;
}> = ({ story, isViewed, onClick }) => {
  return (
    <div className="story-preview" onClick={onClick}>
      <div className={`story-ring ${isViewed ? "viewed" : ""}`}>
        <img src={story.profilePic} alt={story.username} loading="lazy" />
      </div>
      <span className="story-username">{story.username}</span>
    </div>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<{
  duration: number;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}> = ({ duration, isActive, isCompleted, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive || isCompleted) {
      setProgress(isCompleted ? 100 : 0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 100 / (duration / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, isCompleted, duration, onComplete]);

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

// Story Viewer Component
const StoryViewer: React.FC<{
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onStoryChange: (index: number) => void;
}> = ({ stories, currentIndex, onClose, onStoryChange }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingStories, setLoadingStories] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentStory = stories[currentIndex];

  // Handle story navigation
  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      onStoryChange(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onStoryChange, onClose]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      onStoryChange(currentIndex - 1);
    }
  }, [currentIndex, onStoryChange]);

  // Handle image loading
  useEffect(() => {
    setImageLoaded(false);
    setLoadingStories((prev) => new Set(prev).add(currentIndex));

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setLoadingStories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentIndex);
        return newSet;
      });
    };
    img.src = currentStory.imageUrl;
  }, [currentStory.imageUrl, currentIndex]);

  // Enhanced touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Click handlers for left/right tap
  const handleStoryClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (clickX < centerX) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <div className="story-viewer">
      <div className="story-header">
        <div className="progress-bars">
          {stories.map((_, index) => (
            <ProgressBar
              key={index}
              duration={5000}
              isActive={index === currentIndex && imageLoaded}
              isCompleted={index < currentIndex}
              onComplete={goToNext}
            />
          ))}
        </div>

        <div className="story-info">
          <img
            src={currentStory.profilePic}
            alt={currentStory.username}
            className="profile-pic"
            loading="lazy"
          />
          <span className="username">{currentStory.username}</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div
        className="story-content"
        onClick={handleStoryClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loadingStories.has(currentIndex) && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        <img
          src={currentStory.imageUrl}
          alt={`Story by ${currentStory.username}`}
          className={`story-image ${imageLoaded ? "loaded" : ""}`}
          loading="lazy"
        />

        {/* Navigation hints */}
        <div className="nav-hint left"></div>
        <div className="nav-hint right"></div>
      </div>
    </div>
  );
};

// Main App Component
const InstagramStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Disable body scroll when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  // Simulate fetching stories from external source
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStories(mockStories);
      setLoading(false);
    };

    fetchStories();
  }, []);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setViewedStories((prev) => new Set(prev).add(stories[index].id));
  };

  const handleStoryClose = () => {
    setSelectedStoryIndex(null);
  };

  const handleStoryChange = (index: number) => {
    setSelectedStoryIndex(index);
    setViewedStories((prev) => new Set(prev).add(stories[index].id));
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="instagram-stories">
      <div className="stories-header">
        <h1>Stories</h1>
      </div>

      <div className="stories-container">
        <div className="stories-list">
          {stories.map((story, index) => (
            <StoryPreview
              key={story.id}
              story={story}
              isViewed={viewedStories.has(story.id)}
              onClick={() => handleStoryClick(index)}
            />
          ))}
        </div>
      </div>

      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          currentIndex={selectedStoryIndex}
          onClose={handleStoryClose}
          onStoryChange={handleStoryChange}
        />
      )}
    </div>
  );
};

export default InstagramStories;
