import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

async function fetchHealth() {
  const base = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/v1/health`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ status: string; version: string }>;
}

export function HealthCheck() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <View style={styles.box}>
      <Text style={styles.label}>API 상태</Text>
      {isLoading && <Text style={styles.muted}>확인 중…</Text>}
      {error && <Text style={styles.error}>{(error as Error).message}</Text>}
      {data && (
        <Text style={styles.ok}>
          {data.status} · v{data.version}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: "#E8E0D4",
    gap: 4,
  },
  label: { fontSize: 12, fontWeight: "600", color: Colors.light.muted },
  muted: { fontSize: 14, color: Colors.light.muted },
  ok: { fontSize: 14, color: "#4A8B6B" },
  error: { fontSize: 14, color: "#C44A4A" },
});
