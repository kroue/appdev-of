import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const modalContents = {
  'About the App': 'OnlyFriends is a modern attendance and scheduling app for employees. Version 1.0.0.',
  'Terms of Service': 'By using this app, you agree to our terms: use responsibly, respect privacy, and follow company policy.',
  'Privacy Policy': 'We value your privacy. Your data is stored securely and never shared with third parties.',
  'App Version': 'App Version: 1.0.0\nBuild: 100',
  'Contact Support': 'For support, email support@onlyfriends.com or call 1-800-123-4567.',
  'Report a Bug / Send Feedback': 'To report a bug or send feedback, email bugs@onlyfriends.com.',
  'FAQ / Help Center': 'Visit our Help Center for FAQs and guides at help.onlyfriends.com.',
};

const settingsIcons = [
  { label: 'About the App', icon: 'information-circle-outline' },
  { label: 'Terms of Service', icon: 'document-text-outline' },
  { label: 'Privacy Policy', icon: 'lock-closed-outline' },
  { label: 'App Version', icon: 'information-circle-outline' },
];

const AppSettingsScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openModal = (title) => {
    setModalTitle(title);
    setModalContent(modalContents[title]);
    setModalVisible(true);
  };

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
          <TouchableOpacity
            key={index}
            style={styles.iconButton}
            onPress={() => openModal(item.label)}
          >
            <Ionicons name={item.icon} size={30} color="#000" />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Middle Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => openModal('Contact Support')}
        >
          <Text style={styles.outlinedText}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => openModal('Report a Bug / Send Feedback')}
        >
          <Text style={styles.outlinedText}>Report a Bug / Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filledButton}
          onPress={() => openModal('FAQ / Help Center')}
        >
          <Text style={styles.filledText}>FAQ / Help Center</Text>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <Text style={styles.supportTitle}>Support</Text>
      <View style={styles.supportItem}>
        <Ionicons name="help-circle-outline" size={20} color="#000" />
        <Text style={styles.supportText} onPress={() => openModal('FAQ / Help Center')}>FAQ / Help Center</Text>
      </View>
      <View style={styles.supportItem}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
        <Text style={styles.supportText} onPress={() => openModal('Contact Support')}>Contact Support</Text>
      </View>
      <View style={styles.supportItem}>
        <Ionicons name="bug-outline" size={20} color="#000" />
        <Text style={styles.supportText} onPress={() => openModal('Report a Bug / Send Feedback')}>Report a Bug / Send Feedback</Text>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalContent}>{modalContent}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  modalCloseButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    color: '#0a469e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
