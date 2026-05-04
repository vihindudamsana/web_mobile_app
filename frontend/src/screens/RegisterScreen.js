import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/Theme';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';

export default function RegisterScreen({ navigation }) {
  const [form, setForm]       = useState({ name: "", email: "", password: "", contact: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (key, val) => setForm({ ...form, [key]: val });

  const handleRegister = async () => {
    setError("");
    const { name, email, password, contact } = form;
    if (!name || !email || !password || !contact) {
      setError("All fields are required."); return;
    }
    setLoading(true);
    try {
      const assignedRole = form.role === "admin" ? "admin" : "user";
      const res = await axios.post(`${API_BASE_URL}/user/register`, { ...form, role: assignedRole });
      navigation.navigate("VerifyOtp", {
        activationToken: res.data.activationToken,
        email: form.email,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        <View style={s.header}>
          <Text style={s.brand}>shop<Text style={s.dot}>.</Text></Text>
          <Text style={s.welcomeText}>Create Account</Text>
          <Text style={s.subText}>Join our premium mobile shop today</Text>
        </View>

        <View style={s.form}>
          {!!error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <AppInput
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
          />

          <AppInput
            label="Contact Number"
            placeholder="0771234567"
            keyboardType="phone-pad"
            value={form.contact}
            onChangeText={(v) => handleChange("contact", v)}
          />

          <AppInput
            label="Email Address"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />

          <AppInput
            label="Password"
            placeholder="Min. 8 characters"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />

          <AppInput
            label="Role (Optional)"
            placeholder="Type 'admin' for admin access"
            autoCapitalize="none"
            value={form.role}
            onChangeText={(v) => handleChange("role", v)}
          />

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={s.registerBtn}
          />

          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account? </Text>
            <AppButton
              variant="ghost"
              title="Sign In"
              onPress={() => navigation.navigate("Login")}
              style={s.loginLinkBtn}
              textStyle={s.loginLinkText}
            />
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  page: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scroll: { 
    flexGrow: 1, 
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brand: { 
    ...TYPOGRAPHY.h1,
    color: COLORS.white, 
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  dot: { 
    color: COLORS.primary 
  },
  welcomeText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textMuted,
  },
  form: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xxl,
  },
  registerBtn: {
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textDim,
  },
  loginLinkBtn: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  loginLinkText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  errorBox: { 
    backgroundColor: 'rgba(255, 75, 75, 0.1)', 
    borderRadius: BORDER_RADIUS.md, 
    padding: SPACING.md, 
    marginBottom: SPACING.lg, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 75, 75, 0.2)' 
  },
  errorText: { 
    color: COLORS.error, 
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});