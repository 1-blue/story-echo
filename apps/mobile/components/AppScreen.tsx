import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";

type AppScreenProps = {
  title: string;
  body?: string;
  action?: ReactNode;
};

export function AppScreen({ title, body, action }: AppScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

type AppScreenButtonProps = {
  label: string;
  onPress: () => void;
};

export function AppScreenButton({ label, onPress }: AppScreenButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  action: {
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.tint,
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
