"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { motion, AnimatePresence } from "framer-motion";

// Feeling options for sharing
const FEELING_OPTIONS = [
  { feeling: "hopeful", color: "#22d3ee", emoji: "✨" },
  { feeling: "peaceful", color: "#a78bfa", emoji: "🌸" },
  { feeling: "grateful", color: "#34d399", emoji: "💚" },
  { feeling: "tender", color: "#fb7185", emoji: "🌷" },
  { feeling: "calm", color: "#38bdf8", emoji: "🌊" },
  { feeling: "reflective", color: "#fbbf24", emoji: "🌅" },
  { feeling: "anxious", color: "#f472b6", emoji: "💭" },
  { feeling: "tired", color: "#94a3b8", emoji: "🌙" },
];

// Sample feelings data for the globe - using precise coordinates
const SAMPLE_FEELINGS = [
  { id: 1, lng: -122.4194, lat: 37.7749, feeling: "hopeful", user: "someone in San Francisco", color: "#22d3ee", time: "2m ago", message: "the fog cleared today" },
  { id: 2, lng: 2.3522, lat: 48.8566, feeling: "peaceful", user: "someone in Paris", color: "#a78bfa", time: "5m ago", message: "coffee by the seine" },
  { id: 3, lng: 139.6917, lat: 35.6895, feeling: "grateful", user: "someone in Tokyo", color: "#34d399", time: "8m ago", message: "cherry blossoms are early" },
  { id: 4, lng: -43.1729, lat: -22.9068, feeling: "tender", user: "someone in Rio", color: "#fb7185", time: "12m ago", message: "missing home" },
  { id: 5, lng: 151.2093, lat: -33.8688, feeling: "calm", user: "someone in Sydney", color: "#38bdf8", time: "15m ago", message: "ocean sounds" },
  { id: 6, lng: 77.2090, lat: 28.6139, feeling: "reflective", user: "someone in Delhi", color: "#fbbf24", time: "18m ago", message: "monsoon thoughts" },
  { id: 7, lng: -0.1276, lat: 51.5074, feeling: "content", user: "someone in London", color: "#a3e635", time: "22m ago", message: "tea and rain" },
  { id: 8, lng: 31.2357, lat: 30.0444, feeling: "still", user: "someone in Cairo", color: "#e879f9", time: "25m ago", message: "sunset over the nile" },
  { id: 9, lng: -74.0060, lat: 40.7128, feeling: "anxious", user: "someone in New York", color: "#f472b6", time: "28m ago", message: "deadline tomorrow" },
  { id: 10, lng: 116.4074, lat: 39.9042, feeling: "tired", user: "someone in Beijing", color: "#94a3b8", time: "32m ago", message: "long day, longer night" },
  { id: 11, lng: -99.1332, lat: 19.4326, feeling: "hopeful", user: "someone in Mexico City", color: "#22d3ee", time: "35m ago", message: "new beginnings" },
  { id: 12, lng: 37.6173, lat: 55.7558, feeling: "calm", user: "someone in Moscow", color: "#38bdf8", time: "40m ago", message: "snow falling softly" },
];

// Floating comment bubble component
function FloatingComment({ 
  feeling, 
  position,
  opacity,
  onClick 
}: { 
  feeling: typeof SAMPLE_FEELINGS[0]; 
  position: { x: number; y: number } | null;
  opacity: number;
  onClick: () => void;
}) {
  if (!position) return null;
  
  const isFar = opacity < 0.7;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: opacity, scale: isFar ? 0.85 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute pointer-events-auto cursor-pointer z-10"
      style={{ 
        left: position.x + 20, 
        top: position.y - 30,
        transform: 'translate(0, -50%)',
        filter: isFar ? 'blur(0.5px)' : 'none'
      }}
      onClick={onClick}
    >
      <div className={`relative max-w-[180px] px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] backdrop-blur-sm transition-all ${isFar ? 'hover:opacity-100' : ''}`}>
        {/* Arrow pointing to dot */}
        <div 
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0 
            border-t-[6px] border-t-transparent 
            border-b-[6px] border-b-transparent 
            border-r-[6px] border-r-zinc-900/90" 
        />
        
        {/* Feeling label */}
        <p className="text-[10px] font-[family-name:var(--font-smooch-sans)] mb-0.5 text-white/40">
          feeling <span style={{ color: feeling.color }} className="font-medium">{feeling.feeling}</span>
        </p>
        
        {/* Message */}
        <p className="text-xs font-[family-name:var(--font-smooch-sans)] leading-tight text-white/70">
          "{feeling.message}"
        </p>
        
        {/* Glow effect */}
        <div 
          className="absolute -inset-1 rounded-xl blur-md opacity-20 -z-10"
          style={{ background: feeling.color }}
        />
      </div>
    </motion.div>
  );
}

export function GlobeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<typeof SAMPLE_FEELINGS[0] | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [visibleComments, setVisibleComments] = useState<Map<number, { x: number; y: number; opacity: number }>>(new Map());
  const [showShareModal, setShowShareModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [shareFeeling, setShareFeeling] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [feelings, setFeelings] = useState(SAMPLE_FEELINGS);
  const [isLoadingFeelings, setIsLoadingFeelings] = useState(true);
  const rotationRef = useRef<number | null>(null);
  const isUserInteracting = useRef(false);

  // Load feelings from API
  useEffect(() => {
    const loadFeelings = async () => {
      try {
        const response = await fetch('/api/feelings');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match our component format
          const transformedFeelings = data.map((f: any) => ({
            id: f.id,
            lng: f.longitude,
            lat: f.latitude,
            feeling: f.feeling,
            user: "someone",
            color: FEELING_OPTIONS.find(opt => opt.feeling === f.feeling)?.color || "#22d3ee",
            time: getTimeAgo(new Date(f.createdAt)),
            message: f.comment || "",
          }));
          
          // Combine with sample feelings if no data exists
          if (transformedFeelings.length > 0) {
            setFeelings(transformedFeelings);
          }
        }
      } catch (error) {
        console.error('Error loading feelings:', error);
      } finally {
        setIsLoadingFeelings(false);
      }
    };

    loadFeelings();
    // Refresh feelings every 30 seconds
    const interval = setInterval(loadFeelings, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get relative time
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleFeelingClick = useCallback((feeling: typeof SAMPLE_FEELINGS[0]) => {
    setSelectedFeeling(feeling);
    map.current?.flyTo({
      center: [feeling.lng, feeling.lat],
      zoom: 4,
      pitch: 45,
      duration: 2000,
      essential: true,
    });
  }, []);

  // Get user location
  const getUserLocation = useCallback(() => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    // Use lower accuracy first for faster response, then try high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
        setShowShareModal(true);
        
        // Fly to user location
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 5,
          pitch: 45,
          duration: 2000,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        // Retry with lower accuracy if high accuracy fails
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setIsGettingLocation(false);
            setShowShareModal(true);
            map.current?.flyTo({
              center: [longitude, latitude],
              zoom: 5,
              pitch: 45,
              duration: 2000,
            });
          },
          () => {
            alert("Unable to get your location. Please enable location services.");
            setIsGettingLocation(false);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  // Share feeling
  const handleShareFeeling = useCallback(async () => {
    if (!userLocation || !shareFeeling || !shareMessage) return;

    try {
      // Save to database
      const response = await fetch('/api/feelings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          feeling: shareFeeling,
          comment: shareMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save feeling');
      }

      const savedFeeling = await response.json();

      const feelingOption = FEELING_OPTIONS.find(f => f.feeling === shareFeeling);
      const newFeeling = {
        id: savedFeeling.id,
        lng: userLocation.lng,
        lat: userLocation.lat,
        feeling: shareFeeling,
        user: "you",
        color: feelingOption?.color || "#22d3ee",
        time: "just now",
        message: shareMessage,
      };

      setFeelings(prev => [newFeeling, ...prev]);
      
      // Update the map source
      if (map.current?.getSource("feelings")) {
        const source = map.current.getSource("feelings") as maplibregl.GeoJSONSource;
        source.setData({
          type: "FeatureCollection",
          features: [newFeeling, ...feelings].map((f) => ({
            type: "Feature" as const,
            properties: { id: f.id, feeling: f.feeling, user: f.user, color: f.color, time: f.time },
            geometry: { type: "Point" as const, coordinates: [f.lng, f.lat] },
          })),
        });
      }

      setShowShareModal(false);
      setShareFeeling("");
      setShareMessage("");
      setSelectedFeeling(newFeeling);
    } catch (error) {
      console.error('Error saving feeling:', error);
      alert('Failed to share your feeling. Please try again.');
    }
  }, [userLocation, shareFeeling, shareMessage, feelings]);

  // Toggle rotation
  const toggleRotation = useCallback(() => {
    setIsRotating((prev) => !prev);
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    map.current?.flyTo({
      center: [20, 15],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      duration: 1500,
    });
    setSelectedFeeling(null);
  }, []);

  // Random feeling
  const goToRandomFeeling = useCallback(() => {
    const randomFeeling = feelings[Math.floor(Math.random() * feelings.length)];
    handleFeelingClick(randomFeeling);
  }, [handleFeelingClick, feelings]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Dark theme configuration
    const darkStyle = {
      tiles: "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
      background: "#050508",
      rasterOpacity: 0.9,
      saturation: -0.5,
      brightness: 0.7,
    };

    // Initialize the map with globe projection
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        projection: { type: "globe" },
        sky: {
          "sky-color": "#050508",
          "horizon-color": "#0a0a0f",
          "fog-color": "#050508",
          "sky-horizon-blend": 0.8,
          "horizon-fog-blend": 0.5,
          "fog-ground-blend": 1.0,
        },
        light: {
          anchor: "viewport",
          color: "#ffffff",
          intensity: 0.4,
        },
        sources: {
          "carto-tiles": {
            type: "raster",
            tiles: [
              darkStyle.tiles,
              darkStyle.tiles.replace("a.basemaps", "b.basemaps"),
              darkStyle.tiles.replace("a.basemaps", "c.basemaps"),
            ],
            tileSize: 256,
            attribution: '&copy; CARTO',
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": darkStyle.background },
          },
          {
            id: "carto-layer",
            type: "raster",
            source: "carto-tiles",
            minzoom: 0,
            maxzoom: 19,
            paint: {
              "raster-opacity": darkStyle.rasterOpacity,
              "raster-saturation": darkStyle.saturation,
              "raster-brightness-max": darkStyle.brightness,
              "raster-contrast": 0.2,
            },
          },
        ],
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: [20, 15],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      minZoom: 1.5,
      maxZoom: 12,
      maxPitch: 85,
    });

    // Add navigation controls (compass only, zoom will be custom)
    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: false, visualizePitch: true }),
      "bottom-right"
    );

    map.current.on("load", () => {
      if (!map.current) return;
      
      setIsLoaded(true);

      // Add GeoJSON source for feelings
      map.current.addSource("feelings", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: feelings.map((f) => ({
            type: "Feature" as const,
            properties: { id: f.id, feeling: f.feeling, user: f.user, color: f.color, time: f.time },
            geometry: { type: "Point" as const, coordinates: [f.lng, f.lat] },
          })),
        },
      });

      // Add glow/halo layer (larger, more transparent)
      map.current.addLayer({
        id: "feelings-glow",
        type: "circle",
        source: "feelings",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 20, 5, 35, 10, 50],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.15,
          "circle-blur": 1,
        },
      });

      // Add pulse layer (medium size)
      map.current.addLayer({
        id: "feelings-pulse",
        type: "circle",
        source: "feelings",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 12, 5, 20, 10, 30],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.25,
          "circle-blur": 0.5,
        },
      });

      // Add main dot layer (small, solid)
      map.current.addLayer({
        id: "feelings-dots",
        type: "circle",
        source: "feelings",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 5, 5, 8, 10, 12],
          "circle-color": ["get", "color"],
          "circle-opacity": 1,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": 0.3,
        },
      });

      // Click handler for feelings
      map.current.on("click", "feelings-dots", (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const feeling = feelings.find((f) => f.id === props?.id);
          if (feeling) {
            handleFeelingClick(feeling);
          }
        }
      });

      // Change cursor on hover
      map.current.on("mouseenter", "feelings-dots", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "feelings-dots", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      // Update visible comments positions
      const updateCommentPositions = () => {
        if (!map.current) return;
        
        const newPositions = new Map<number, { x: number; y: number; opacity: number }>();
        const bounds = map.current.getBounds();
        const zoom = map.current.getZoom();
        const center = map.current.getCenter();
        
        feelings.forEach((feeling) => {
          // Check if point is in view
          if (bounds && bounds.contains([feeling.lng, feeling.lat])) {
            const point = map.current!.project([feeling.lng, feeling.lat]);
            
            // Calculate angular distance from center to determine if on "back" of globe
            const lngDiff = Math.abs(feeling.lng - center.lng);
            const latDiff = Math.abs(feeling.lat - center.lat);
            const angularDistance = Math.sqrt(lngDiff * lngDiff + latDiff * latDiff);
            
            // Calculate opacity based on distance from center (farther = more faded)
            // Points near the edge (> 60 degrees away) start to fade
            let opacity = 1;
            if (angularDistance > 60) {
              opacity = Math.max(0.3, 1 - (angularDistance - 60) / 60);
            }
            
            // Only show comments at certain zoom levels and if point is on screen
            if (zoom > 1.5 && point.x > 50 && point.x < window.innerWidth - 200 && point.y > 50 && point.y < window.innerHeight - 100) {
              newPositions.set(feeling.id, { x: point.x, y: point.y, opacity });
            }
          }
        });
        
        setVisibleComments(newPositions);
      };

      // Update on map move
      map.current.on("move", updateCommentPositions);
      map.current.on("zoom", updateCommentPositions);
      
      // Initial update
      setTimeout(updateCommentPositions, 500);
    });

    // Stop rotation on user interaction
    const onInteractionStart = () => {
      isUserInteracting.current = true;
    };
    
    const onInteractionEnd = () => {
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 5000);
    };
    
    map.current.on("mousedown", onInteractionStart);
    map.current.on("touchstart", onInteractionStart);
    map.current.on("wheel", onInteractionStart);
    map.current.on("mouseup", onInteractionEnd);
    map.current.on("touchend", onInteractionEnd);
    map.current.on("dragend", onInteractionEnd);
    map.current.on("zoomend", onInteractionEnd);

    return () => {
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current);
      map.current?.remove();
      map.current = null;
    };
  }, [handleFeelingClick, feelings]);

  // Handle rotation animation
  useEffect(() => {
    if (!isLoaded) return;

    const rotateGlobe = () => {
      if (!map.current || !isRotating || isUserInteracting.current) {
        rotationRef.current = requestAnimationFrame(rotateGlobe);
        return;
      }
      const center = map.current.getCenter();
      center.lng += 0.015;
      map.current.setCenter(center);
      rotationRef.current = requestAnimationFrame(rotateGlobe);
    };

    const timeout = setTimeout(() => {
      rotationRef.current = requestAnimationFrame(rotateGlobe);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current);
    };
  }, [isLoaded, isRotating]);

  return (
    <>
      {/* Map container - full screen */}
      <div 
        ref={mapContainer} 
        className="fixed inset-0 w-screen h-screen z-0"
        style={{ background: "#050508" }}
      />

      {/* Atmospheric glow around globe edges */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_30%,rgba(34,211,238,0.03)_60%,rgba(5,5,8,0.95)_100%)]" />
      </div>

      {/* Subtle vignette for depth */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_20%,rgba(5,5,8,0.5)_70%,rgba(5,5,8,0.9)_100%)]" />

      {/* Top gradient fade */}
      <div className="fixed top-0 left-0 right-0 h-32 z-[2] pointer-events-none bg-gradient-to-b from-zinc-950 via-zinc-950/50 to-transparent" />
      
      {/* Bottom gradient fade */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[2] pointer-events-none bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"
        style={{ height: 'max(6rem, calc(env(safe-area-inset-bottom) + 5rem))' }}
      />

      {/* Floating Comments near dots */}
      <AnimatePresence>
        {Array.from(visibleComments.entries()).map(([id, position]) => {
          const feeling = feelings.find(f => f.id === id);
          if (!feeling) return null;
          
          return (
            <FloatingComment
              key={id}
              feeling={feeling}
              position={position}
              opacity={position.opacity}
              onClick={() => handleFeelingClick(feeling)}
            />
          );
        })}
      </AnimatePresence>

      {/* Interactive Controls Panel - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 px-2 sm:px-0"
        style={{ bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}
      >
        {/* Drop Pin Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getUserLocation}
          disabled={isGettingLocation}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-zinc-900/90 border border-white/[0.08] hover:bg-zinc-800/90 backdrop-blur-xl ${isGettingLocation ? "text-cyan-400" : "text-white/70 hover:text-white"}`}
          title="Drop a feeling at your location"
        >
          {isGettingLocation ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
            />
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </motion.button>

        {/* Rotation Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRotation}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-zinc-900/90 border border-white/[0.08] hover:bg-zinc-800/90 backdrop-blur-xl ${isRotating ? "text-cyan-400" : "text-white/40"}`}
          title={isRotating ? "Pause rotation" : "Resume rotation"}
        >
          {isRotating ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </motion.button>

        {/* Reset View */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetView}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-zinc-900/90 border border-white/[0.08] text-white/70 hover:text-white hover:bg-zinc-800/90 backdrop-blur-xl"
          title="Reset view"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>

        {/* Random Feeling */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToRandomFeeling}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-zinc-900/90 border border-white/[0.08] text-white/70 hover:text-white hover:bg-zinc-800/90 backdrop-blur-xl"
          title="Discover a random feeling"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </motion.button>

        {/* Divider - hidden on very small screens */}
        <div className="w-px h-5 sm:h-6 bg-white/10 hidden xs:block" />

        {/* Zoom Out */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => map.current?.zoomOut()}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-zinc-900/90 border border-white/[0.08] text-white/70 hover:text-white hover:bg-zinc-800/90 backdrop-blur-xl"
          title="Zoom out"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </motion.button>

        {/* Zoom In */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => map.current?.zoomIn()}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-zinc-900/90 border border-white/[0.08] text-white/70 hover:text-white hover:bg-zinc-800/90 backdrop-blur-xl"
          title="Zoom in"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>

        {/* Divider - hidden on mobile */}
        <div className="w-px h-5 sm:h-6 bg-white/10 hidden sm:block" />

        {/* Feelings Counter - hidden on very small screens, compact on mobile */}
        <div className="h-9 sm:h-11 px-2 sm:px-4 rounded-lg sm:rounded-xl hidden xs:flex items-center gap-1.5 sm:gap-2 bg-zinc-900/90 border border-white/[0.08] backdrop-blur-xl">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400"
          />
          <p className="font-[family-name:var(--font-smooch-sans)] text-xs sm:text-sm text-white/60">
            <span className="text-cyan-400">{feelings.length}</span>
            <span className="hidden sm:inline"> feelings live</span>
          </p>
        </div>
      </motion.div>

      {/* Share Feeling Modal */}
      <AnimatePresence>
        {showShareModal && userLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900/95 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md mx-4 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-[family-name:var(--font-exo-2)] text-xl text-white">
                  Share how you feel
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Location indicator */}
              <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-[family-name:var(--font-smooch-sans)]">Your location</p>
                  <p className="text-sm text-white/70 font-[family-name:var(--font-smooch-sans)]">
                    {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
                  </p>
                </div>
              </div>

              {/* Feeling selector */}
              <div className="mb-6">
                <p className="text-sm text-white/50 font-[family-name:var(--font-smooch-sans)] mb-3">How are you feeling?</p>
                <div className="grid grid-cols-4 gap-2">
                  {FEELING_OPTIONS.map((option) => (
                    <button
                      key={option.feeling}
                      onClick={() => setShareFeeling(option.feeling)}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        shareFeeling === option.feeling
                          ? "border-cyan-400/50 bg-cyan-400/10"
                          : "border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02]"
                      }`}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span className="text-[10px] font-[family-name:var(--font-smooch-sans)] text-white/60">{option.feeling}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message input */}
              <div className="mb-6">
                <p className="text-sm text-white/50 font-[family-name:var(--font-smooch-sans)] mb-3">Say something (optional)</p>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="what's on your mind..."
                  maxLength={100}
                  className="w-full h-24 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-white/80 placeholder:text-white/30 font-[family-name:var(--font-smooch-sans)] text-sm resize-none focus:outline-none focus:border-cyan-400/30 transition-all"
                />
                <p className="text-right text-xs text-white/30 mt-1">{shareMessage.length}/100</p>
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareFeeling}
                disabled={!shareFeeling || !shareMessage}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-[family-name:var(--font-smooch-sans)] text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Drop your feeling ✨
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {!isLoaded && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-zinc-950">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full mx-auto mb-4"
            />
            <p className="text-white/50 font-[family-name:var(--font-smooch-sans)] text-lg">
              Loading the world...
            </p>
          </motion.div>
        </div>
      )}

      {/* Selected feeling popup */}
      <AnimatePresence>
        {selectedFeeling && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed left-1/2 -translate-x-1/2 z-20"
            style={{ bottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))' }}
          >
            <div className="backdrop-blur-xl border rounded-2xl p-5 min-w-[320px] relative overflow-hidden bg-zinc-900/90 border-white/[0.08]">
              {/* Decorative corner lines */}
              <div className="absolute top-0 left-4 w-px h-10 bg-gradient-to-b from-cyan-400/40 to-transparent" />
              <div className="absolute top-4 left-0 h-px w-10 bg-gradient-to-r from-cyan-400/40 to-transparent" />
              <div className="absolute bottom-0 right-4 w-px h-10 bg-gradient-to-t from-purple-400/40 to-transparent" />
              <div className="absolute bottom-4 right-0 h-px w-10 bg-gradient-to-l from-purple-400/40 to-transparent" />
              
              {/* Glow effect */}
              <div 
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20"
                style={{ background: selectedFeeling.color }}
              />
              
              <div className="flex items-start gap-4 relative">
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-4 h-4 rounded-full mt-1"
                  style={{ background: selectedFeeling.color, boxShadow: `0 0 20px ${selectedFeeling.color}` }}
                />
                <div>
                  <p className="font-[family-name:var(--font-smooch-sans)] text-xl mb-1 text-white/90">
                    feeling <span style={{ color: selectedFeeling.color }} className="font-medium">{selectedFeeling.feeling}</span>
                  </p>
                  <p className="text-base font-[family-name:var(--font-smooch-sans)] mb-2 text-white/70">
                    "{selectedFeeling.message}"
                  </p>
                  <p className="text-sm font-[family-name:var(--font-smooch-sans)] text-white/40">
                    {selectedFeeling.user} · {selectedFeeling.time}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedFeeling(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all text-sm bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.1]"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles */}
      <style jsx global>{`
        .maplibregl-canvas {
          outline: none;
        }
        
        .maplibregl-ctrl-attrib {
          display: none !important;
        }
        
        .maplibregl-ctrl-logo {
          display: none !important;
        }
        
        .maplibregl-ctrl-group {
          background: rgba(24, 24, 27, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 14px !important;
          overflow: hidden;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .maplibregl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
          background: transparent !important;
          border: none !important;
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        .maplibregl-ctrl-group button:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .maplibregl-ctrl-group button + button {
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        
        .maplibregl-ctrl-zoom-in .maplibregl-ctrl-icon {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23999'%3E%3Cpath d='M10 5v10M5 10h10' stroke='%23888' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") !important;
        }
        
        .maplibregl-ctrl-zoom-out .maplibregl-ctrl-icon {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 10h10' stroke='%23888' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") !important;
        }
        
        .maplibregl-ctrl-compass .maplibregl-ctrl-icon {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon fill='%2322d3ee' points='10,2 12,10 10,8 8,10'/%3E%3Cpolygon fill='%23666' points='10,18 12,10 10,12 8,10'/%3E%3C/svg%3E") !important;
        }
      `}</style>
    </>
  );
}
