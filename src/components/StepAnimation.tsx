import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '../constants/theme';
interface StepAnimationProps {
  isActive: boolean;
  size?: number;
  speed?: number;
  loop?: boolean;
  autoPlay?: boolean;
  style?: any;
  color?: string;
}
const StepAnimation: React.FC<StepAnimationProps> = ({
  isActive,
  size = 30,
  speed = 1.2,
  loop = false,
  autoPlay = false,
  style,
  color = COLORS.primary
}) => {
  const animationRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isActive) {
      // Reset and play the animation from the beginning
      if (animationRef.current) {
        animationRef.current.reset();
        animationRef.current.play();
      }
      // Simple fade in and out
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          delay: 400, // Keep visible briefly
          useNativeDriver: true
        })
      ]).start();
    } else {
      // Ensure animation is hidden when not active
      fadeAnim.setValue(0);
      if (animationRef.current) {
        animationRef.current.pause();
      }
    }
    return () => {
      fadeAnim.stopAnimation();
    };
  }, [isActive, fadeAnim]);
  // Don't render anything if not active for better performance
  if (!isActive) return null;
  return (
    <Animated.View 
      style={[
        styles.container, 
        { width: size, height: size, opacity: fadeAnim }, 
        style
      ]}
    >
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/walking.json')}
        style={styles.animation}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        colorFilters={[
          {
            keypath: "**",
            color: color
          }
        ]}
      />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 40,
  },
  animation: {
    width: '100%',
    height: '100%',
  }
});
export default StepAnimation;

