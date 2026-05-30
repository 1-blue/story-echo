import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <Text style={styles.subtitle}>알림 · 계정 · 글자 크기 (준비 중)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: { fontSize: 20, fontWeight: "600", color: Colors.light.text },
  subtitle: { fontSize: 14, color: Colors.light.muted },
});
