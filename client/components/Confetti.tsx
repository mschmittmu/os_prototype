import React, { useEffect, useRef } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#E31837",
  "#1E3A8A",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#FFD700",
];

interface ConfettiPieceProps {
  index: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  delay: number;
  size: number;
  shape: "square" | "rectangle" | "circle";
}

function ConfettiPiece({
  color,
  startX,
  startY,
  endX,
  endY,
  rotation,
  delay,
  size,
  shape,
}: ConfettiPieceProps) {
  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 100, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 1400 })
      )
    );
    translateY.value = withDelay(
      delay,
      withTiming(endY, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(endX, {
        duration: 1500,
        easing: Easing.out(Easing.sin),
      })
    );
    rotate.value = withDelay(
      delay,
      withTiming(rotation, {
        duration: 1500,
        easing: Easing.linear,
      })
    );
    opacity.value = withDelay(
      delay + 1000,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getShapeStyle = () => {
    switch (shape) {
      case "circle":
        return { width: size, height: size, borderRadius: size / 2 };
      case "rectangle":
        return { width: size * 0.5, height: size * 1.5, borderRadius: 2 };
      default:
        return { width: size, height: size, borderRadius: 2 };
    }
  };

  return (
    <Animated.View
      style={[
        styles.piece,
        { backgroundColor: color },
        getShapeStyle(),
        animatedStyle,
      ]}
    />
  );
}

interface ConfettiProps {
  active: boolean;
  count?: number;
  origin?: { x: number; y: number };
  onComplete?: () => void;
}

export function Confetti({
  active,
  count = 50,
  origin = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 3 },
  onComplete,
}: ConfettiProps) {
  const [pieces, setPieces] = React.useState<ConfettiPieceProps[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPieceProps[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 150 + Math.random() * 200;
        const endX = origin.x + Math.cos(angle) * velocity;
        const endY = origin.y + Math.sin(angle) * velocity + SCREEN_HEIGHT * 0.4;
        
        newPieces.push({
          index: i,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          startX: origin.x,
          startY: origin.y,
          endX,
          endY,
          rotation: Math.random() * 720 - 360,
          delay: Math.random() * 300,
          size: 8 + Math.random() * 8,
          shape: ["square", "rectangle", "circle"][Math.floor(Math.random() * 3)] as "square" | "rectangle" | "circle",
        });
      }
      setPieces(newPieces);

      if (onComplete) {
        timerRef.current = setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } else {
      setPieces([]);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, count, origin.x, origin.y]);

  if (!active || pieces.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.index} {...piece} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1001,
  },
  piece: {
    position: "absolute",
  },
});
