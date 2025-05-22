import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const settingsIcons = [
  { label: 'About the App', icon: 'information-circle-outline' },
  { label: 'Terms of Service', icon: 'document-text-outline' },
  { label: 'Privacy Policy', icon: 'lock-closed-outline' },
  { label: 'App Version', icon: 'information-circle-outline' },
];

const AppSettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Top Icon Buttons */}
      <View style={styles.iconRow}>
        {settingsIcons.map((item, index) => (
          <TouchableOpacity key={index} style={styles.iconButton}>
            <Ionicons name={item.icon} size={30} color="#000" />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Middle Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.outlinedText}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.outlinedText}>Report a Bug / Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filledButton}>
          <Text style={styles.filledText}>FAQ / Help Center</Text>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <Text style={styles.supportTitle}>Support</Text>
      <View style={styles.supportItem}>
        <Ionicons name="help-circle-outline" size={20} color="#000" />
        <Text style={styles.supportText}>FAQ / Help Center</Text>
      </View>
      <View style={styles.supportItem}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
        <Text style={styles.supportText}>Contact Support</Text>
      </View>
      <View style={styles.supportItem}>
        <Ionicons name="bug-outline" size={20} color="#000" />
        <Text style={styles.supportText}>Report a Bug / Send Feedback</Text>
      </View>
    </ScrollView>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0a469e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  iconButton: {
    alignItems: 'center',
    width: 70,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlinedText: {
    fontWeight: '500',
  },
  filledButton: {
    backgroundColor: '#0a469e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 25,
  },
  filledText: {
    color: '#fff',
    fontWeight: '600',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  supportText: {
    marginLeft: 10,
    fontSize: 14,
  },
});
