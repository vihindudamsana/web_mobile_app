import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/Theme';
import * as Haptics from 'expo-haptics';

export const AppButton = ({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'primary', 
  style, 
  textStyle,
  disabled = false 
}) => {
  const handlePress = () => {
    if (!loading && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      style={[
        s.button,
        variant === 'primary' && s.primary,
        isOutline && s.outline,
        isGhost && s.ghost,
        (disabled || loading) && s.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? COLORS.primary : COLORS.black} />
      ) : (
        <Text style={[
          s.text,
          variant === 'primary' && s.primaryText,
          (isOutline || isGhost) && s.outlineText,
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
  primaryText: {
    color: COLORS.black,
  },
  outlineText: {
    color: COLORS.primary,
  },
});
