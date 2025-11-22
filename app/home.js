import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { auth, db } from "../firebase";
import { clearLogin } from "../mmkvStorage";

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [profile, setProfile] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const bgPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      setFirebaseUser(user);

      try {
        const ref = doc(db, "mahasiswa", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile({
            nama: user.displayName || user.email || "Mahasiswa",
            email: user.email,
            nim: "-",
            kelas: "-",
            prodi: "-",
          });
        }
      } catch (e) {
        console.log(e);
        alert("Gagal mengambil data mahasiswa.");
      } finally {
        setLoading(false);
      }
    });

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

    return () => unsub();
  }, [router, cardOpacity, cardScale, bgPulse]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearLogin();
      router.replace("/");
    } catch (e) {
      console.log(e);
      alert(e.message);
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

  const displayName = profile?.nama || firebaseUser?.email || "Mahasiswa";

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

      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        <View style={styles.bannerRow}>
          <Text style={styles.bannerText}>Selamat datang, {displayName}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.contentRow,
            isSmallScreen && styles.contentColumn,
          ]}
        >
          <View
            style={[
              styles.leftPanel,
              isSmallScreen && styles.leftMobile,
            ]}
          >
            <Text style={styles.title}>Data Mahasiswa</Text>
            <Text style={styles.subtitle}>
              Ini adalah data yang kamu isi saat proses registrasi. Kamu bisa
              melihat detailnya di kartu di sebelah{" "}
              {isSmallScreen ? "bawah" : "kanan"}.
            </Text>
          </View>

          <View
            style={[
              styles.rightPanel,
              isSmallScreen && styles.rightMobile,
            ]}
          >
            <View style={styles.detailWrapper}>
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>
                  {profile?.nama || "Nama belum diisi"}
                </Text>
                <Text style={styles.detailHint}>
                  Klik tombol di bawah untuk melihat detail lengkap.
                </Text>

                {loading && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <ActivityIndicator color="#6366f1" />
                    <Text style={styles.detailLoading}>
                      Mengambil data...
                    </Text>
                  </View>
                )}

                {!loading && showDetails && (
                  <View style={styles.detailBody}>
                    <Text style={styles.detailItem}>
                      NIM : {profile?.nim || "-"}
                    </Text>
                    <Text style={styles.detailItem}>
                      Kelas : {profile?.kelas || "-"}
                    </Text>
                    <Text style={styles.detailItem}>
                      Prodi : {profile?.prodi || "-"}
                    </Text>

                    <View style={styles.emailRow}>
                      <Text style={styles.detailItem}>
                        Email:{" "}
                        {showEmail
                          ? profile?.email || firebaseUser?.email || "-"
                          : "••••••••••"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowEmail((prev) => !prev)}
                      >
                        <Text style={styles.emailToggle}>
                          {showEmail ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => setShowDetails((prev) => !prev)}
                  disabled={loading}
                >
                  <Text style={styles.smallButtonText}>
                    {showDetails ? "Sembunyikan Detail" : "Lihat Detail"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
    paddingBottom: 16,
  },

  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#6366f1",
  },
  bannerText: {
    color: "#f9fafb",
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  logoutButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },

  contentRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  contentColumn: {
    flexDirection: "column",
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 16,
  },

  leftPanel: {
    flex: 1,
    paddingRight: 16,
    justifyContent: "center",
  },
  rightPanel: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // override hp
  leftMobile: {
    flex: 0,
    paddingRight: 0,
    justifyContent: "flex-start",
  },
  rightMobile: {
    flex: 0,
    paddingLeft: 0,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 8,
  },
  subtitle: {
    color: "#cbd5f5",
    fontSize: 14,
  },

  detailWrapper: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  detailCard: {
    borderRadius: 24,
    backgroundColor: "rgba(15,23,42,0.9)",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 20px 40px rgba(15,23,42,0.6)",
        }
      : {}),
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  detailHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 10,
  },
  detailLoading: {
    fontSize: 13,
    color: "#a5b4fc",
    marginLeft: 8,
  },
  detailBody: {
    marginBottom: 12,
    gap: 4,
  },
  detailItem: {
    color: "#e5e7eb",
    fontSize: 13,
  },
  emailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  emailToggle: {
    color: "#93c5fd",
    fontWeight: "600",
    fontSize: 12,
  },
  smallButton: {
    backgroundColor: "#6366f1",
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 8,
  },
  smallButtonText: {
    color: "#f9fafb",
    fontSize: 13,
    fontWeight: "600",
  },
});
