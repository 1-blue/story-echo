import { HealthCheck } from "@/components/HealthCheck";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>오늘, 어떤 이야기가 떠오르나요?</Text>
      <Text style={styles.subtitle}>질문 리스트는 추후 등록됩니다.</Text>
      <HealthCheck />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 24,
    justifyContent: "center",
    gap: 12,
  },
  question: {
    fontSize: 28,
    fontWeight: "500",
    color: Colors.light.text,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.muted,
  },
});
