import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Alert, Animated, TouchableOpacity } from "react-native";
import SplashScreen from "./src/Screens/SplashScreen";
import AllRoute from "./src/navigation/AllRoute";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadBundle } from "./src/helper/loadBundle";
import Modal from "react-native-modal";
import * as Progress from "react-native-progress";

const SERVER_URL =
  "https://raw.githubusercontent.com/AMAN86191/VoiceToVoiceAI/main/version.json";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [updateChecked, setUpdateChecked] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  
  const progressAnimated = useRef(new Animated.Value(0)).current;

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  const animateProgress = (toValue) => {
    Animated.timing(progressAnimated, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const simulateDownloadProgress = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05; // Increment by 5% each time
        if (progress >= 1) {
          clearInterval(interval);
          setDownloadProgress(1);
          animateProgress(1);
          resolve();
        } else {
          setDownloadProgress(progress);
          animateProgress(progress);
        }
      }, 200);
    });
  };

  const startDownload = async (bundleUrl, newVersion) => {
    try {
      setIsDownloading(true);
      
      // Simulate download progress
      await simulateDownloadProgress();
      
      // Load the actual bundle
      await loadBundle(bundleUrl);
      
      // Store new version
      await AsyncStorage.setItem("appVersion", newVersion);
      
      // Success
      setShowModal(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      animateProgress(0);
      
      Alert.alert(
        "Update Complete",
        "App has been updated successfully!",
        [{ text: "OK" }]
      );
      
    } catch (e) {
      setError(e);
      setShowModal(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      animateProgress(0);
      Alert.alert("Update Failed", "Failed to download update. Please try again later.");
    }
  };

  const checkForUpdate = async () => {
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      console.log('data', data)
      const storedVersion = await AsyncStorage.getItem("appVersion");
      const localVersion = storedVersion || "1.0";

      if (data.version !== localVersion) {
        setPendingUpdate({
          bundleUrl: data.bundleUrl,
          version: data.version,
          updateData: data
        });
        setShowModal(true);
      }
      setUpdateChecked(true);
    } catch (e) {
      console.error("Update check failed:", e);
      setError(e);
      setUpdateChecked(true);
    }
  };

  const handleAskLater = () => {
    setShowModal(false);
    setPendingUpdate(null);
  };

  const handleDownload = () => {
    if (pendingUpdate) {
      startDownload(pendingUpdate.bundleUrl, pendingUpdate.version);
    }
  };

  useEffect(() => {
    if (!isSplashVisible && !updateChecked) {
      checkForUpdate();
    }
  }, [isSplashVisible, updateChecked]);

  // Reset states when modal closes
  useEffect(() => {
    if (!showModal) {
      setIsDownloading(false);
      setDownloadProgress(0);
      animateProgress(0);
    }
  }, [showModal]);

  if (isSplashVisible) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!updateChecked) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Checking for updates...</Text>
      </View>
    );
  }

  if (error && !showModal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Error loading OTA update</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AllRoute />
      <Modal
        isVisible={showModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.5}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={300}
        onBackdropPress={isDownloading ? undefined : handleAskLater}
        onBackButtonPress={isDownloading ? undefined : handleAskLater}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {!isDownloading ? (
            // Update Prompt View
            <>
              <Text style={styles.modalTitle}>🎉 Update Available!</Text>
              <Text style={styles.modalMessage}>
                A new version {pendingUpdate?.version} is available. 
                Would you like to download it now?
              </Text>
              <Text style={styles.updateNote}>
                {pendingUpdate?.updateData?.description || "Bug fixes and performance improvements"}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.askLaterButton]}
                  onPress={handleAskLater}
                >
                  <Text style={styles.askLaterText}>Later</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.downloadButton]}
                  onPress={handleDownload}
                >
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Download Progress View
            <>
              <Text style={styles.modalTitle}>Downloading Update...</Text>
              <Progress.Bar
                progress={progressAnimated}
                width={250}
                height={12}
                color="#2196F3"
                borderColor="#ddd"
                borderRadius={6}
                animationConfig={{ bounciness: 0 }}
                
              />
              <Text style={styles.progressText}>
                {Math.round(downloadProgress * 100)}% Complete
              </Text>
              <Text style={styles.downloadNote}>
                Please don't close the app during update
              </Text>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: '#fff'
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 18,
    color: '#ff4444',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modal: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
    width: 320,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 12,
    color: '#333',
    textAlign: 'center'
  },
  modalMessage: { 
    fontSize: 16, 
    marginBottom: 8, 
    textAlign: "center",
    color: '#666',
    lineHeight: 22
  },
  updateNote: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic'
  },
  downloadNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  askLaterButton: {
    backgroundColor: "#f5f5f5",
  },
  downloadButton: {
    backgroundColor: "#2196F3",
  },
  askLaterText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
  },
  downloadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  progressText: { 
    marginTop: 15, 
    fontSize: 16, 
    fontWeight: '600',
    color: '#2196F3'
  },
});