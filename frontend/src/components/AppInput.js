import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/Theme';

export const AppInput = ({ 
  label, 
  error, 
  style, 
  ...props 
}) => {
  return (
    <View style={[s.container, style]}>
      {label && <Text style={s.label}>{label}</Text>}
      <TextInput
        style={[s.input, !!error && s.inputError]}
        placeholderTextColor={COLORS.textDim}
        {...props}
      />
      {error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    ...TYPOGRAPHY.body,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: 4,
  },
});
