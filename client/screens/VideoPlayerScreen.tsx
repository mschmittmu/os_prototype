import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ThemedText";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type VideoPlayerRouteProp = RouteProp<RootStackParamList, "VideoPlayer">;

function getYouTubeVideoId(url: string): string | null {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return videoIdMatch ? videoIdMatch[1] : null;
}

function getYouTubeEmbedHtml(videoId: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
          .container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </body>
    </html>
  `;
}

export default function VideoPlayerScreen() {
  const { theme } = useTheme();
  const route = useRoute<VideoPlayerRouteProp>();
  const { videoUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const videoId = getYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText type="body">Unable to load video</ThemedText>
      </View>
    );
  }

  const html = getYouTubeEmbedHtml(videoId);

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : null}
      {error ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
          <ThemedText type="body">Failed to load video</ThemedText>
        </View>
      ) : null}
      <WebView
        source={{ html }}
        style={[styles.webview, { opacity: loading ? 0 : 1 }]}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
});
