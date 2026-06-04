import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

type BrandedLoadingProps = {
  message?: string;
};

export function BrandedLoading({ message = "불러오는 중…" }: BrandedLoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.light.tint} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: Colors.light.background,
  },
  message: {
    fontSize: 14,
    color: Colors.light.muted,
  },
});
