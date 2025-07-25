import { DarkTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

const SettingsScreen = ({ onClose,settings,toggleVibrations,toggleTheme,toggleSound }) => {

console.log("onClose is:", typeof onClose);
console.log("toggleSound is:", typeof toggleSound);
  return (
   
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.label}>Dark Theme</Text>
            <Switch
              value={settings.theme=== 'dark'}
              onValueChange={toggleTheme}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.label}>Sound</Text>
            <Switch
              value={settings.sound}
              onValueChange={toggleSound}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.label}>Vibrations</Text>
            <Switch
              value={settings.vibrations}
              onValueChange={toggleVibrations}
            />
          </View>

          <TouchableOpacity onPress={onClose}
style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
     backgroundColor: 'rgba(102, 102, 102, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    elevation: 10,
      zIndex: 10,  
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});