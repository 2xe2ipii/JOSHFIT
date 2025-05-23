import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}
const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  return (
    <CardComponent
      style={[styles.card, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      {children}
    </CardComponent>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.md,
    marginVertical: SIZES.sm,
    ...SHADOWS.small,
  },
});
export default Card;

