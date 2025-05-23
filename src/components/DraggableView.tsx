import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  ViewStyle,
} from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
interface Props {
  initialPosition?: { x: number; y: number };
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  style?: ViewStyle;
  children: React.ReactNode;
}
const DraggableView: React.FC<Props> = ({
  initialPosition = { x: 0, y: 0 },
  minX = 0,
  maxX = screenWidth,
  minY = 0,
  maxY = screenHeight,
  style,
  children,
}) => {
  const [position] = useState(new Animated.ValueXY(initialPosition));
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(minX, Math.min(maxX - dimensions.width, initialPosition.x + gesture.dx));
        const newY = Math.max(minY, Math.min(maxY - dimensions.height, initialPosition.y + gesture.dy));
        position.setValue({
          x: newX,
          y: newY
        });
      },
      onPanResponderRelease: (_, gesture) => {
        initialPosition.x += gesture.dx;
        initialPosition.y += gesture.dy;
        // Keep within bounds
        initialPosition.x = Math.max(minX, Math.min(maxX - dimensions.width, initialPosition.x));
        initialPosition.y = Math.max(minY, Math.min(maxY - dimensions.height, initialPosition.y));
      },
    })
  ).current;
  return (
    <Animated.View
      {...panResponder.panHandlers}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
      style={[
        styles.container,
        style,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
export default DraggableView;

