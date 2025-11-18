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
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { LinearGradient } from "expo-linear-gradient";
import { doc, setDoc } from "firebase/firestore";

function CardContent({
  isSmallScreen,
  step,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  nim,
  setNim,
  kelas,
  setKelas,
  prodi,
  setProdi,
  goNext,
  goBack,
  register,
  cardOpacity,
  cardScale,
  float,
}) {
  return (
    <Animated.View
      style={[
        styles.card,
        isSmallScreen ? styles.cardColumn : styles.cardRow,
        {
          opacity: cardOpacity,
          transform: [{ scale: cardScale }],
        },
      ]}
    >
      {/* kiri */}
      <View style={[styles.leftPanel, isSmallScreen && styles.leftMobile]}>
        <Text style={styles.stepText}>Step {step} of 2</Text>
        <Text style={styles.title}>
          {step === 1 ? "Create\nYour Account" : "Student\nDetails"}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Set up your login information first."
            : "Tell us more about your student profile."}
        </Text>

        {step === 1 ? (
          <>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
            />

            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
            />

            <TouchableOpacity style={styles.button} onPress={goNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              placeholder="NIM"
              value={nim}
              onChangeText={setNim}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
            />

            <TextInput
              placeholder="Kelas"
              value={kelas}
              onChangeText={setKelas}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
            />

            <TextInput
              placeholder="Prodi"
              value={prodi}
              onChangeText={setProdi}
              style={styles.input}
              placeholderTextColor="#9ca3b7"
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { flex: 1, backgroundColor: "#111827" },
                ]}
                onPress={goBack}
              >
                <Text style={[styles.buttonText, { color: "#e5e7eb" }]}>
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1 }]}
                onPress={register}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Link href="/" style={styles.linkText}>
            Sign In
          </Link>
        </Text>
      </View>

      {/* kanan*/}
      {!isSmallScreen && (
        <View style={styles.rightPanel}>
          <Animated.View
            style={[
              styles.illusWrapper,
              { transform: [{ translateY: float }] },
            ]}
          >
            <View style={styles.illusCircle}>
              <View style={styles.illusCard}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>👩🏻‍🎓</Text>
                </View>

                <Text style={styles.illusTitle}>
                  {step === 1 ? "Secure account" : "Student profile"}
                </Text>

                <View style={styles.tagRow}>
                  <View style={styles.tagPill}>
                    <Text style={styles.tagText}>Mahasiswa</Text>
                  </View>
                  <View
                    style={[styles.tagPill, { backgroundColor: "#e0f2fe" }]}
                  >
                    <Text style={[styles.tagText, { color: "#0369a1" }]}>
                      Step {step}/2
                    </Text>
                  </View>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: step === 1 ? "50%" : "100%" },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.starOne} />
              <View style={styles.starTwo} />
            </View>
          </Animated.View>
        </View>
      )}
    </Animated.View>
  );
}

export default function Register() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  // step kontrol
  const [step, setStep] = useState(1);

  // step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // step 2
  const [nim, setNim] = useState("");
  const [kelas, setKelas] = useState("");
  const [prodi, setProdi] = useState("");

  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const bgPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(bgPulse, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const goNext = () => {
    const trimmedEmail = email.trim();

    if (!name || !trimmedEmail || !password || !confirmPassword) {
      alert("Semua field wajib diisi");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak sama");
      return;
    }

    setStep(2);
  };

  const goBack = () => setStep(1);

  const register = async () => {
    const trimmedEmail = email.trim();

    if (!nim || !kelas || !prodi) {
      alert("NIM, Kelas, dan Prodi wajib diisi");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );
      const uid = cred.user.uid;

      await setDoc(doc(db, "mahasiswa", uid), {
        nama: name,
        email: trimmedEmail,
        nim,
        kelas,
        prodi,
        uid,
        createdAt: new Date(),
      });

      alert("Register berhasil! Silakan login.");
      router.replace("/");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const blobScale = bgPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });
  const blobOpacity = bgPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <LinearGradient
      colors={["#020617", "#0b1020", "#020617"]}
      style={styles.root}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          {
            top: -40,
            left: -60,
            transform: [{ scale: blobScale }],
            opacity: blobOpacity,
          },
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

      {isSmallScreen ? (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={styles.mobileContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CardContent
            isSmallScreen={isSmallScreen}
            step={step}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            nim={nim}
            setNim={setNim}
            kelas={kelas}
            setKelas={setKelas}
            prodi={prodi}
            setProdi={setProdi}
            goNext={goNext}
            goBack={goBack}
            register={register}
            cardOpacity={cardOpacity}
            cardScale={cardScale}
            float={float}
          />
        </ScrollView>
      ) : (
        <CardContent
          isSmallScreen={isSmallScreen}
          step={step}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          nim={nim}
          setNim={setNim}
          kelas={kelas}
          setKelas={setKelas}
          prodi={prodi}
          setProdi={setProdi}
          goNext={goNext}
          goBack={goBack}
          register={register}
          cardOpacity={cardOpacity}
          cardScale={cardScale}
          float={float}
        />
      )}
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
  mobileContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  blob: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(147,51,234,0.55)",
  },

  card: {
    width: "100%",
    maxWidth: 960,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 24 },
  },
  cardRow: {
    flexDirection: "row",
    minHeight: 380,
  },
  cardColumn: {
    flexDirection: "column",
  },

  leftPanel: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 24,
    justifyContent: "center",
  },
  leftMobile: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  rightPanel: {
    flex: 1,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  stepText: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f9fafb",
    marginBottom: 8,
  },
  subtitle: {
    color: "#cbd5f5",
    marginBottom: 20,
    fontSize: 14,
  },

  input: {
    backgroundColor: "rgba(15,23,42,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(31,41,55,0.9)",
    color: "#e5e7eb",
    fontSize: 14,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 0 0 1px rgba(148,163,184,0.1)",
        }
      : {}),
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#6366f1",
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonText: {
    color: "#f9fafb",
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
  bottomText: {
    marginTop: 16,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  linkText: {
    color: "#fbbf24",
    fontWeight: "600",
  },

  // Ilustrasi (web / tablet)
  illusWrapper: {
    width: "85%",
    maxWidth: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  illusCircle: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  illusCard: {
    width: "75%",
    borderRadius: 24,
    backgroundColor: "#f9fafb",
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
  },
  illusTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4f46e5",
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4f46e5",
  },
  starOne: {
    position: "absolute",
    top: 26,
    right: 42,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#fbbf24",
  },
  starTwo: {
    position: "absolute",
    bottom: 26,
    left: 40,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#f97316",
  },
});
