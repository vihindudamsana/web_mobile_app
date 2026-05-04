import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from '../config';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/Theme';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/user/login`, { email, password }, { timeout: 10000 });
      await login(res.data.token, res.data.user);
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError("Server not responding. Check your connection.");
      } else if (!err.response) {
        setError("Cannot reach server. Make sure backend is running.");
      } else {
        setError(err.response?.data?.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        
        <View style={s.header}>
          <Text style={s.brand}>shop<Text style={s.dot}>.</Text></Text>
          <Text style={s.welcomeText}>Welcome back</Text>
          <Text style={s.subText}>Sign in to continue shopping</Text>
        </View>

        <View style={s.form}>
          {!!error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <AppInput
            label="Email Address"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={s.loginBtn}
          />

          <View style={s.footer}>
            <Text style={s.footerText}>New here? </Text>
            <AppButton
              variant="ghost"
              title="Create Account"
              onPress={() => navigation.navigate("Register")}
              style={s.registerBtn}
              textStyle={s.registerBtnText}
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
    justifyContent: "center", 
    padding: SPACING.xl 
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  brand: { 
    ...TYPOGRAPHY.h1,
    color: COLORS.white, 
    fontSize: 42,
    marginBottom: SPACING.md,
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
  },
  loginBtn: {
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
  registerBtn: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  registerBtnText: {
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