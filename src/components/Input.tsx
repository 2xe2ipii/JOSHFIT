import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  leftIcon,
  rightIcon,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        disabled ? styles.inputDisabled : null,
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon || secureTextEntry ? styles.inputWithRightIcon : null,
            multiline ? styles.multilineInput : null,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
    width: '100%',
  },
  label: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.borderRadiusMd,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: SIZES.md,
    fontSize: FONTS.body,
    color: COLORS.black,
  },
  inputWithLeftIcon: {
    paddingLeft: SIZES.xs,
  },
  inputWithRightIcon: {
    paddingRight: SIZES.xs,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SIZES.md,
  },
  leftIconContainer: {
    paddingHorizontal: SIZES.md,
  },
  rightIconContainer: {
    paddingHorizontal: SIZES.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.small,
    marginTop: SIZES.xs,
  },
});

export default Input;
