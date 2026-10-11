"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/providers/ThemeProvider";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const { theme, mounted } = useTheme();
  const isDark = !mounted || theme === "dark";

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // ── theme tokens ──────────────────────────────────────────────────────────
  const tok = {
    bg:          isDark ? "var(--clr-bg)"          : "#ffffff",
    text:        isDark ? "#ffffff"                 : "#0f172a",
    textMuted:   isDark ? "rgba(255,255,255,0.55)"  : "rgba(15,23,42,0.55)",
    border:      isDark ? "rgba(255,255,255,0.12)"  : "rgba(15,23,42,0.12)",
    cardBg:      isDark ? "rgba(6,6,9,0.92)"        : "rgba(255,255,255,0.96)",
    nodeBg:      isDark ? "var(--clr-bg)"           : "#ffffff",
    nodeText:    isDark ? "#ffffff"                 : "#0f172a",
    nodeBorder:  isDark ? "rgba(255,255,255,0.35)"  : "rgba(15,23,42,0.35)",
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const newPulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const t = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(t);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    setRotationAngle(270 - (nodeIndex / timelineData.length) * 360);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const radius = 200;
    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
      zIndex: Math.round(100 + 50 * Math.cos(radian)),
      opacity: Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))),
    };
  };

  const getRelatedItems = (itemId: number): number[] =>
    timelineData.find((item) => item.id === itemId)?.relatedIds ?? [];

  const isRelatedToActive = (itemId: number) =>
    activeNodeId !== null && getRelatedItems(activeNodeId).includes(itemId);

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    if (isDark) {
      switch (status) {
        case "completed":   return "text-white bg-black border-white";
        case "in-progress": return "text-black bg-white border-black";
        default:            return "text-white bg-black/40 border-white/50";
      }
    } else {
      switch (status) {
        case "completed":   return "text-white bg-slate-800 border-slate-800";
        case "in-progress": return "text-white bg-blue-600 border-blue-600";
        default:            return "text-slate-500 bg-slate-100 border-slate-300";
      }
    }
  };

  return (
    <div
      className="w-full h-[520px] md:h-[600px] flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: tok.bg }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Centre orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>

          {/* Orbit ring */}
          <div className="absolute w-96 h-96 rounded-full" style={{ border: `1px solid ${tok.border}` }} />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            // Node colours per state
            const nodeStyle: React.CSSProperties = isExpanded
              ? { background: tok.text,   color: tok.bg,   border: `2px solid ${tok.text}`,   transform: "scale(1.5)" }
              : isRelated
              ? { background: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.15)", color: tok.text, border: `2px solid ${tok.text}` }
              : { background: tok.nodeBg, color: tok.nodeText, border: `2px solid ${tok.nodeBorder}` };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Energy aura */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5) / 2}px`,
                    top: `-${(item.energy * 0.5) / 2}px`,
                  }}
                />

                {/* Node icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isRelated ? "animate-pulse" : ""}`}
                  style={nodeStyle}
                >
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${isExpanded ? "scale-125" : ""}`}
                  style={{ color: tok.text }}
                >
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card
                    className="absolute top-20 left-1/2 -translate-x-1/2 w-64 backdrop-blur-lg shadow-xl overflow-visible"
                    style={{
                      background: tok.cardBg,
                      border: `1px solid ${tok.border}`,
                      color: tok.text,
                    }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3" style={{ background: tok.border }} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "COMPLETE" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                        </Badge>
                        <span className="text-xs font-mono" style={{ color: tok.textMuted }}>{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2" style={{ color: tok.text }}>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs" style={{ color: tok.text }}>
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${tok.border}` }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center gap-1" style={{ color: tok.textMuted }}>
                            <Zap size={10} />Energy
                          </span>
                          <span className="font-mono" style={{ color: tok.text }}>{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: tok.border }}>
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${tok.border}` }}>
                          <div className="flex items-center mb-2 gap-1">
                            <Link size={10} style={{ color: tok.textMuted }} />
                            <h4 className="text-xs uppercase tracking-wider font-medium" style={{ color: tok.textMuted }}>Connected</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 py-0 text-xs rounded-none bg-transparent hover:opacity-80"
                                  style={{ borderColor: tok.border, color: tok.text }}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1" style={{ color: tok.textMuted }} />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
