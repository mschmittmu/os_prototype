import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { Spacing } from "@/constants/theme";

export function HeaderTitle() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: 48,
    height: 32,
    marginLeft: -Spacing.sm,
  },
});
