"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";

// Emotion color palette - bright and alive, showing mood
const EMOTION_COLORS = {
  calm: "rgba(56, 230, 213, 0.95)",      // bright cyan teal
  happy: "rgba(255, 180, 50, 0.95)",     // bright orange
  sad: "rgba(90, 165, 255, 0.95)",       // bright blue
  tired: "rgba(160, 200, 220, 0.95)",    // soft sky blue
  anxious: "rgba(255, 120, 180, 0.95)",  // bright rose pink
  angry: "rgba(255, 50, 50, 1)",         // bright vivid red
} as const;

type Emotion = keyof typeof EMOTION_COLORS;

// User emotion entry that appears and stays
interface UserEmotion {
  id: string;
  lat: number;
  lng: number;
  emotion: Emotion;
  comment: string;
  delay: number;
  bubblePosition: "left" | "right";
}

// Pre-defined locations and sample comments - spread across the world
// Mobile shows Africa/Middle East region, so include markers there
const SAMPLE_EMOTIONS: Array<{
  lat: number;
  lng: number;
  emotion: Emotion;
  comment: string;
  bubblePosition: "left" | "right";
}> = [
  // Africa (visible on mobile) - 2
  { lat: 5, lng: 20, emotion: "happy", comment: "good vibes", bubblePosition: "right" },
  { lat: -15, lng: 30, emotion: "calm", comment: "peaceful morning", bubblePosition: "left" },
  // America - 2
  { lat: 40, lng: -100, emotion: "tired", comment: "long day ahead", bubblePosition: "right" },
  { lat: -15, lng: -60, emotion: "happy", comment: "feeling grateful", bubblePosition: "left" },
  // Other regions
  { lat: 54, lng: 10, emotion: "calm", comment: "quiet evening", bubblePosition: "left" },
  { lat: 32, lng: 135, emotion: "anxious", comment: "big meeting", bubblePosition: "right" },
  { lat: -28, lng: 135, emotion: "sad", comment: "ocean breeze", bubblePosition: "left" },
  { lat: 22, lng: 78, emotion: "tired", comment: "need rest", bubblePosition: "left" },
];

// Extra messages pool - unique for each emotion (more variety, no repeats)
const EXTRA_MESSAGES: Record<Emotion, string[]> = {
  calm: ["breathing deep", "at peace", "feeling zen", "so relaxed", "quiet moment", "inner peace", "serenity now", "gentle breeze"],
  happy: ["best day ever", "so excited", "loving life", "can't stop smiling", "pure joy", "on cloud nine", "blessed", "living the dream"],
  sad: ["feeling low", "need a hug", "rainy mood", "heavy heart", "melancholy", "tearful", "feeling empty", "blue today"],
  tired: ["exhausted", "running low", "sleepy vibes", "need coffee", "barely awake", "drained", "fading fast", "worn out"],
  anxious: ["nervous", "overthinking", "heart racing", "can't relax", "worried sick", "on edge", "restless", "mind racing"],
  angry: ["so mad", "not okay", "really upset", "boiling inside", "losing patience", "furious", "seeing red", "had enough"],
};

// Extra locations spread across the globe
const EXTRA_LOCATIONS: Array<{ lat: number; lng: number }> = [
  // Africa - 2
  { lat: 10, lng: 15 },     // West Africa
  { lat: -20, lng: 25 },    // Southern Africa
  // America - 2
  { lat: 35, lng: -90 },    // Central USA
  { lat: -25, lng: -55 },   // South America
  // Other regions
  { lat: 55, lng: 10 },     // Europe
  { lat: 50, lng: 90 },     // Asia
  { lat: -35, lng: 140 },   // Australia
  { lat: 30, lng: 120 },    // China
];

// Convert lat/lng to SVG coordinates
function projectPoint(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// Typing animation text component for SVG
function TypingText({
  text,
  x,
  y,
  delay,
  fontSize = 1.1,
}: {
  text: string;
  x: number;
  y: number;
  delay: number;
  fontSize?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Hide cursor after typing is done
          setTimeout(() => setShowCursor(false), 1500);
        }
      }, 80); // 80ms per character

      return () => clearInterval(typingInterval);
    }, delay * 1000 + 600); // Start after marker appears + bubble fade

    return () => clearTimeout(startDelay);
  }, [text, delay]);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="rgba(220, 220, 230, 0.6)"
      style={{ fontSize: `${fontSize}px`, fontFamily: "system-ui" }}
    >
      {displayedText}
      {showCursor && (
        <tspan fill="rgba(220, 220, 230, 0.5)">|</tspan>
      )}
    </text>
  );
}

interface UserMarkerProps {
  entry: UserEmotion;
  width: number;
  height: number;
  isMobile: boolean;
}

function UserMarker({ entry, width, height, isMobile }: UserMarkerProps) {
  const { x, y } = projectPoint(entry.lat, entry.lng, width, height);
  const color = EMOTION_COLORS[entry.emotion];
  const isRight = entry.bubblePosition === "right";

  // Scale sizes for mobile
  const scale = isMobile ? 1.5 : 1;
  
  // Calculate bubble dimensions - compact chat style
  const bubbleWidth = Math.max(entry.comment.length * 0.38 * scale, 4 * scale);
  const bubbleHeight = 1.2 * scale;
  const tailSize = 0.5 * scale;
  
  // Position bubble on left or right of dot
  const bubbleX = isRight 
    ? x + (0.7 + tailSize) * scale
    : x - (0.7 + tailSize) * scale - bubbleWidth;
  const bubbleY = y - bubbleHeight / 2;

  // Build path based on bubble position
  const bubblePath = isRight
    ? `
        M ${x + 0.6 * scale} ${y}
        L ${bubbleX} ${y - tailSize * 0.7}
        L ${bubbleX} ${bubbleY + 0.4 * scale}
        Q ${bubbleX} ${bubbleY} ${bubbleX + 0.4 * scale} ${bubbleY}
        L ${bubbleX + bubbleWidth - 0.4 * scale} ${bubbleY}
        Q ${bubbleX + bubbleWidth} ${bubbleY} ${bubbleX + bubbleWidth} ${bubbleY + 0.4 * scale}
        L ${bubbleX + bubbleWidth} ${bubbleY + bubbleHeight - 0.4 * scale}
        Q ${bubbleX + bubbleWidth} ${bubbleY + bubbleHeight} ${bubbleX + bubbleWidth - 0.4 * scale} ${bubbleY + bubbleHeight}
        L ${bubbleX + 0.4 * scale} ${bubbleY + bubbleHeight}
        Q ${bubbleX} ${bubbleY + bubbleHeight} ${bubbleX} ${bubbleY + bubbleHeight - 0.4 * scale}
        L ${bubbleX} ${y + tailSize * 0.7}
        Z
      `
    : `
        M ${x - 0.6 * scale} ${y}
        L ${bubbleX + bubbleWidth} ${y - tailSize * 0.7}
        L ${bubbleX + bubbleWidth} ${bubbleY + 0.4 * scale}
        Q ${bubbleX + bubbleWidth} ${bubbleY} ${bubbleX + bubbleWidth - 0.4 * scale} ${bubbleY}
        L ${bubbleX + 0.4 * scale} ${bubbleY}
        Q ${bubbleX} ${bubbleY} ${bubbleX} ${bubbleY + 0.4 * scale}
        L ${bubbleX} ${bubbleY + bubbleHeight - 0.4 * scale}
        Q ${bubbleX} ${bubbleY + bubbleHeight} ${bubbleX + 0.4 * scale} ${bubbleY + bubbleHeight}
        L ${bubbleX + bubbleWidth - 0.4 * scale} ${bubbleY + bubbleHeight}
        Q ${bubbleX + bubbleWidth} ${bubbleY + bubbleHeight} ${bubbleX + bubbleWidth} ${bubbleY + bubbleHeight - 0.4 * scale}
        L ${bubbleX + bubbleWidth} ${y + tailSize * 0.7}
        Z
      `;

  const glowRadius = 1 * scale;
  const mainRadius = 0.5 * scale;
  const centerRadius = 0.15 * scale;

  return (
    <motion.g>
      {/* Soft glow behind marker - very subtle */}
      <motion.circle
        cx={x}
        cy={y}
        r={glowRadius || 1}
        fill={color}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          opacity: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: entry.delay + 0.5 },
        }}
      />

      {/* Location pin circle - main dot */}
      <motion.circle
        cx={x}
        cy={y}
        r={mainRadius || 0.5}
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{
          duration: 0.8,
          delay: entry.delay,
          ease: "easeOut",
        }}
      />

      {/* Blinking center dot */}
      <motion.circle
        cx={x}
        cy={y}
        r={centerRadius || 0.15}
        fill="rgba(255,255,255,0.6)"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.6, 0.3, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: entry.delay + 0.8,
        }}
      />

      {/* Speech bubble */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
        transition={{
          duration: 0.3,
          delay: entry.delay + 0.8,
          ease: "easeOut",
        }}
      >
        {/* Combined bubble shape with tail */}
        <path
          d={bubblePath}
          fill="rgba(255, 255, 255, 0.12)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={0.06 * scale}
        />

        {/* Typing animation text */}
        <TypingText
          text={entry.comment}
          x={bubbleX + bubbleWidth / 2}
          y={y + 0.22 * scale}
          delay={entry.delay}
          fontSize={0.65 * scale}
        />
      </motion.g>
    </motion.g>
  );
}

interface WorldfeltBackgroundProps {
  className?: string;
}

export function WorldfeltBackground({ className }: WorldfeltBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [userEmotions, setUserEmotions] = useState<UserEmotion[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on the client and detect mobile
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate the dotted map - runs only on server/initial render
  const mapData = useMemo(() => {
    const map = new DottedMap({ height: 60, grid: "vertical" });
    const svgString = map.getSVG({
      radius: 0.22,
      color: "currentColor",
      shape: "circle",
    });

    // Extract viewBox from the SVG string using regex (works on server)
    const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 120 60";
    const [, , w, h] = viewBox.split(" ").map(Number);

    // Extract the circles/content (everything between <svg> and </svg>)
    const contentMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const content = contentMatch ? contentMatch[1] : "";

    return { viewBox, width: w || 120, height: h || 60, content };
  }, []);

  // Spawn user emotions with staggered delays, then add extra ones every 3 sec
  useEffect(() => {
    if (!isClient) return;

    // Fewer initial dots on mobile
    const initialSamples = isMobile ? SAMPLE_EMOTIONS.slice(0, 5) : SAMPLE_EMOTIONS;
    
    // First show all initial emotions with staggered timing
    const initialEmotions: UserEmotion[] = initialSamples.map((sample, index) => ({
      id: `user-${index}`,
      ...sample,
      delay: 0.5 + index * 1.2,
    }));

    setUserEmotions(initialEmotions);

    // After all initial ones are shown, start adding extra dots
    const initialDuration = 0.5 + initialSamples.length * 1.2 + 2;
    
    const emotions: Emotion[] = ["calm", "happy", "sad", "tired", "anxious", "angry"];
    let emotionIndex = 0;
    const maxExtraDots = isMobile ? 3 : 5; // Fewer extras on mobile
    
    // Track used messages to avoid repeats
    const usedMessages = new Set<string>();
    // Track used location indices for extras
    const usedLocationIndices = new Set<number>();

    const startExtraDots = setTimeout(() => {
      const interval = setInterval(() => {
        // Cycle through all emotions
        const emotion = emotions[emotionIndex % emotions.length];
        const messages = EXTRA_MESSAGES[emotion];
        
        // Find an unused message for this emotion
        let message = "";
        for (const msg of messages) {
          if (!usedMessages.has(msg)) {
            message = msg;
            usedMessages.add(msg);
            break;
          }
        }
        // If all used, clear and start over
        if (!message) {
          usedMessages.clear();
          message = messages[0];
          usedMessages.add(message);
        }
        
        // Find an unused location
        let locationIndex = 0;
        for (let i = 0; i < EXTRA_LOCATIONS.length; i++) {
          if (!usedLocationIndices.has(i)) {
            locationIndex = i;
            usedLocationIndices.add(i);
            break;
          }
        }
        // If all used, clear oldest and reuse
        if (usedLocationIndices.size > maxExtraDots) {
          const firstUsed = usedLocationIndices.values().next().value;
          if (firstUsed !== undefined) {
            usedLocationIndices.delete(firstUsed);
          }
        }
        
        const location = EXTRA_LOCATIONS[locationIndex];
        
        const newEmotion: UserEmotion = {
          id: `extra-${Date.now()}`,
          lat: location.lat,
          lng: location.lng,
          emotion: emotion,
          comment: message,
          bubblePosition: locationIndex % 2 === 0 ? "right" : "left",
          delay: 0,
        };

        setUserEmotions((prev) => {
          const initialOnes = prev.filter((e) => e.id.startsWith("user-"));
          const extraOnes = prev.filter((e) => e.id.startsWith("extra-"));
          
          const updatedExtras = [...extraOnes, newEmotion];
          if (updatedExtras.length > maxExtraDots) {
            updatedExtras.shift();
          }
          
          return [...initialOnes, ...updatedExtras];
        });

        emotionIndex++;
      }, 3000);

      return () => clearInterval(interval);
    }, initialDuration * 1000);

    return () => clearTimeout(startExtraDots);
  }, [isClient, isMobile]);

  if (!isClient) {
    // Server-side: render just the map without animations
    return (
      <div
        className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className || ""}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.25]">
          <svg
            viewBox={mapData.viewBox}
            className="w-[200%] sm:w-full h-full max-w-none text-neutral-500"
            preserveAspectRatio="xMidYMid slice"
            dangerouslySetInnerHTML={{ __html: mapData.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className || ""}`}
      aria-hidden="true"
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      {/* Map container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={mapData.viewBox}
          className="w-[200%] sm:w-full h-full max-w-none text-neutral-400/[0.25] dark:text-neutral-500/[0.25]"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Base dotted map */}
          <g dangerouslySetInnerHTML={{ __html: mapData.content }} />

          {/* User emotion markers */}
          <AnimatePresence>
            {userEmotions.map((entry) => (
              <UserMarker
                key={entry.id}
                entry={entry}
                width={mapData.width}
                height={mapData.height}
                isMobile={isMobile}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/30" />
    </div>
  );
}

export default WorldfeltBackground;
