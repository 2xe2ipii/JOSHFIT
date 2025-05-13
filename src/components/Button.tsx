import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: StyleProp<ViewStyle> = {};
    
    // Type styles
    switch (type) {
      case 'primary':
        buttonStyle = styles.primaryButton;
        break;
      case 'secondary':
        buttonStyle = styles.secondaryButton;
        break;
      case 'outline':
        buttonStyle = styles.outlineButton;
        break;
      case 'text':
        buttonStyle = styles.textButton;
        break;
      default:
        buttonStyle = styles.primaryButton;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
      default:
        // Medium is default, no additional styles needed
        break;
    }
    
    // Disabled state
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleVar: StyleProp<TextStyle> = {};
    
    // Type styles
    switch (type) {
      case 'primary':
        textStyleVar = styles.primaryText;
        break;
      case 'secondary':
        textStyleVar = styles.secondaryText;
        break;
      case 'outline':
        textStyleVar = styles.outlineText;
        break;
      case 'text':
        textStyleVar = styles.textButtonText;
        break;
      default:
        textStyleVar = styles.primaryText;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        textStyleVar = { ...textStyleVar, ...styles.smallText };
        break;
      case 'large':
        textStyleVar = { ...textStyleVar, ...styles.largeText };
        break;
      default:
        // Medium is default, no additional styles needed
        break;
    }
    
    // Disabled state
    if (disabled) {
      textStyleVar = { ...textStyleVar, ...styles.disabledText };
    }
    
    return textStyleVar;
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'outline' || type === 'text' ? COLORS.primary : COLORS.white} 
          size="small" 
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.borderRadiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    minWidth: 120,
  },
  text: {
    fontSize: FONTS.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Type styles
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.accent,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    minWidth: 0,
  },
  textButtonText: {
    color: COLORS.primary,
  },
  // Size styles
  smallButton: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    minWidth: 80,
  },
  smallText: {
    fontSize: FONTS.small,
  },
  largeButton: {
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.xl,
    minWidth: 160,
  },
  largeText: {
    fontSize: FONTS.h4,
  },
  // State styles
  disabledButton: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  disabledText: {
    color: COLORS.gray,
  },
});

export default Button;
