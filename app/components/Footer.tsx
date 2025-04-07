import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© {new Date().getFullYear()} EJP Designs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
});
