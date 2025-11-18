import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const bgPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 2000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 8, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(bgPulse, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const login = async () => {
    if (!email.trim() || !password) return alert("Email dan password wajib diisi");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) return alert("Masukkan email dahulu.");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Link reset password sudah dikirim.");
    } catch (error) {
      alert(error.message);
    }
  };

  const blobScale = bgPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const blobOpacity = bgPulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] });

  return (
    <LinearGradient colors={["#020617", "#0b1020", "#020617"]} style={styles.root}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          { top: -40, left: -60, transform: [{ scale: blobScale }], opacity: blobOpacity },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          {
            bottom: -60,
            right: -40,
            backgroundColor: "rgba(59,130,246,0.55)",
            transform: [{ scale: blobScale }],
            opacity: blobOpacity,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.card,
          isMobile ? styles.cardColumn : styles.cardRow,
          { opacity: cardOpacity, transform: [{ scale: cardScale }] },
        ]}
      >
        <View style={[styles.leftPanel, isMobile && styles.leftMobile]}>
          <Text style={styles.title}>Hallo,{`\n`}Welcome Back</Text>
          <Text style={styles.subtitle}>Hey, welcome back to your special place</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9ca3b7"
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="#9ca3b7"
            style={styles.input}
          />

          <View style={styles.rowBetween}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don’t have an account?{" "}
            <Link href="/register" style={styles.linkText}>
              Sign Up
            </Link>
          </Text>
        </View>

        {!isMobile && (
          <View style={styles.rightPanel}>
            <Animated.View style={[styles.illusWrapper, { transform: [{ translateY: float }] }]}>
              <View style={styles.illusCircle}>
                <View style={styles.illusCard}>
                  <View style={styles.lockCircle}>
                    <Text style={styles.lockText}>🔒</Text>
                  </View>

                  <View style={styles.passwordBar}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <View key={i} style={styles.passwordDot} />
                    ))}
                  </View>

                  <View style={styles.smallButton}>
                    <Text style={styles.smallButtonText}>Sign in</Text>
                  </View>
                </View>

                <View style={styles.dotDecorOne} />
                <View style={styles.dotDecorTwo} />
              </View>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  blob: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(147,51,234,0.55)",
  },

  card: {
    width: "100%",
    maxWidth: 960,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    overflow: "hidden",
  },

  cardRow: {
    flexDirection: "row",
    minHeight: 400,
  },

  cardColumn: {
    flexDirection: "column",
    minHeight: 450,
  },

  leftPanel: {
    flex: 1,
    paddingHorizontal: 36,
    paddingVertical: 30,
    justifyContent: "center",
  },

  leftMobile: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },

  rightPanel: {
    flex: 1,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },

  subtitle: {
    color: "#cbd5f5",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "rgba(31,41,55,0.9)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(55,65,81,0.8)",
    color: "white",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  checkboxChecked: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },

  checkboxTick: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  rememberText: {
    color: "#e5e7eb",
  },

  forgotText: {
    color: "#93c5fd",
  },

  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  bottomText: {
    marginTop: 18,
    textAlign: "center",
    color: "#9ca3af",
  },

  linkText: {
    color: "#fbbf24",
    fontWeight: "600",
  },

  /* ilustrasi (web) */
  illusWrapper: { width: "85%", maxWidth: 360, alignItems: "center" },
  illusCircle: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  illusCard: {
    width: "70%",
    borderRadius: 24,
    backgroundColor: "white",
    paddingVertical: 16,
    alignItems: "center",
  },
  lockCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  lockText: { fontSize: 28 },
  passwordBar: { flexDirection: "row", marginBottom: 12 },
  passwordDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    marginHorizontal: 2,
  },
  smallButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  smallButtonText: { color: "white" },
  dotDecorOne: {
    position: "absolute",
    top: 22,
    right: 38,
    width: 14,
    height: 14,
    backgroundColor: "#fbbf24",
    borderRadius: 999,
  },
  dotDecorTwo: {
    position: "absolute",
    bottom: 22,
    left: 38,
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: "#facc15",
    borderRadius: 999,
  },
});
