import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [expandedDates, setExpandedDates] = useState({}); // Add this
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  // Fetch logged-in user data
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const userData = await AsyncStorage.getItem('loggedInUser');
      if (userData) {
        setLoggedInUser(JSON.parse(userData));
      }
    };

    fetchLoggedInUser();
  }, []);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('http://192.168.1.12:5000/api/schedules');
        const data = await response.json();
        setSchedules(data); // Save schedules to state
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const response = await fetch(`http://192.168.1.12:5000/api/logs?userId=${loggedInUser.id}`);
      const data = await response.json();
      setHistory(data); // Save logs to state
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchLogs();
    }
  }, [loggedInUser]);

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleClockIn = async () => {
    if (!selectedSchedule) {
      Alert.alert('Error', 'Please select a schedule before clocking in.');
      return;
    }

    if (clockedIn) {
      Alert.alert('Already Clocked In', 'You must clock out before clocking in again.');
      return;
    }

    const now = new Date();
    const localTime = now.toLocaleString();

    try {
      const response = await fetch('http://192.168.1.12:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUser.id,
          type: 'in', // or 'out'
          time: localTime,
          scheduleId: selectedSchedule?.id,
        }),
      });

      if (response.ok) {
        setClockedIn(true);
        setClockInTime(now.toString());
        fetchLogs(); // Refresh logs
        Alert.alert('Clocked In', `You clocked in at ${now.toLocaleTimeString()}`);
      } else {
        Alert.alert('Error', 'Failed to clock in.');
      }
    } catch (error) {
      console.error('Error during clock-in:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleClockOut = async () => {
    if (!selectedSchedule) {
      Alert.alert('Error', 'Please select a schedule before clocking out.');
      return;
    }

    if (!clockedIn) {
      Alert.alert('Not Clocked In', 'You must clock in before clocking out.');
      return;
    }

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const mysqlDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    try {
      const response = await fetch('http://192.168.1.12:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUser.id,
          type: 'out',
          time: mysqlDateTime,
          scheduleId: selectedSchedule?.id,
        }),
      });

      if (response.ok) {
        fetchLogs(); // Refresh logs
        setClockedIn(false);
        setClockInTime(null);
        Alert.alert('Clocked Out', `You clocked out at ${now.toLocaleTimeString()}`);
      } else {
        Alert.alert('Error', 'Failed to clock out.');
      }
    } catch (error) {
      console.error('Error during clock-out:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  // Group logs by date
  const logsByDate = history.reduce((acc, log) => {
    let date = 'Invalid Date';
    const dateObj = new Date(log.time);
    if (!isNaN(dateObj.getTime())) {
      date = dateObj.toISOString().split('T')[0];
    } else if (typeof log.time === 'string' && log.time.length >= 10) {
      date = log.time.slice(0, 10); // fallback for invalid dates
    }
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  // Generate random sales data for a date (random but stable for session)
  const getSalesDataForDate = (date) => {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash += date.charCodeAt(i);
    }
    // Add some randomness per session
    return 1000 + ((hash + date.length * 1234) % 9000);
  };

  const handleToggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Floating logout handler
  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Onlyfriends</Text>
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <Image source={require('../assets/sample-prof-photo.png')} style={styles.profilePic} />
        <Text style={styles.userName}>{loggedInUser ? loggedInUser.full_name : 'Your Name'}</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setScheduleModalVisible(true)}
        >
          <FontAwesome name="calendar" size={28} color="#333" />
          <Text>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={28} color="#333" />
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="cog" size={28} color="#333" />
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Schedules Modal */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>All Schedules</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {schedules.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#888' }}>No schedules found.</Text>
              ) : (
                schedules.map((schedule) => (
                  <View key={schedule.id} style={styles.scheduleItem}>
                    <Text style={styles.scheduleTextModal}>
                      {new Date(schedule.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      - {schedule.time}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setScheduleModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Available Schedules */}
      <Text style={styles.sectionTitle}>Available Schedules</Text>
      <ScrollView horizontal style={styles.scheduleList}>
        {schedules.map((schedule) => (
          <TouchableOpacity
            key={schedule.id}
            style={[
              styles.scheduleButton,
              selectedSchedule?.id === schedule.id && styles.selectedScheduleButton,
            ]}
            onPress={() => handleSelectSchedule(schedule)}
          >
            <Text style={styles.scheduleText}>
              {new Date(schedule.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              - {schedule.time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Attendance Checker */}
      <Text style={styles.sectionTitle}>Attendance Checker</Text>
      <View style={styles.attendanceSection}>
        <Text style={styles.attendanceText}>
          {clockedIn ? `Clocked in at: ${new Date(clockInTime).toLocaleString()}` : 'Not Clocked In'}
        </Text>

        <View style={styles.attendanceButtons}>
          <TouchableOpacity
            style={[styles.attendanceButton, { backgroundColor: clockedIn ? '#ccc' : '#207cca' }]}
            onPress={handleClockIn}
            disabled={clockedIn}
          >
            <Text style={styles.attendanceButtonText}>Clock In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.attendanceButton, { backgroundColor: clockedIn ? '#f44336' : '#ccc' }]}
            onPress={handleClockOut}
            disabled={!clockedIn}
          >
            <Text style={styles.attendanceButtonText}>Clock Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* History Log Section */}
      <Text style={styles.sectionTitle}>Clock-In/Out History</Text>
      <View style={styles.historyContainer}>
        {Object.keys(logsByDate).length === 0 ? (
          <Text style={styles.noHistoryText}>No history yet.</Text>
        ) : (
          Object.keys(logsByDate).map((date) => (
            <View key={date} style={styles.logDateCard}>
              <TouchableOpacity
                style={[
                  styles.logDateButton,
                  expandedDates[date] && styles.logDateButtonExpanded,
                ]}
                onPress={() => handleToggleDate(date)}
                activeOpacity={0.8}
              >
                <Text style={styles.logDateButtonText}>
                  {isNaN(new Date(date).getTime())
                    ? date // fallback: show the raw date string
                    : new Date(date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                </Text>
                <Text style={styles.logDateButtonArrow}>
                  {expandedDates[date] ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {expandedDates[date] && (
                <View style={styles.logDetails}>
                  <Text style={styles.salesDataText}>
                    Sales Data: ₱{getSalesDataForDate(date)}
                  </Text>
                  {logsByDate[date].map((log, idx) => {
                    const timeObj = new Date(log.time);
                    return (
                      <View key={idx} style={styles.historyCard}>
                        <Text style={styles.historyText}>
                          {log.type === 'in' ? 'Clocked In' : 'Clocked Out'} at{' '}
                          {isNaN(timeObj.getTime()) ? log.time : timeObj.toLocaleTimeString()}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Floating Logout Button */}
      <TouchableOpacity
        style={styles.fabLogout}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <FontAwesome name="sign-out" size={28} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0a469e',
    padding: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  navButton: {
    alignItems: 'center',
    width: 80,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginHorizontal: 15,
    marginBottom: 8,
  },
  scheduleList: {
    marginHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
  },
  scheduleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedScheduleButton: {
    backgroundColor: '#207cca',
  },
  scheduleText: {
    color: '#333',
    fontWeight: '600',
  },
  attendanceSection: {
    marginHorizontal: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  attendanceText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  attendanceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  attendanceButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  historyContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    padding: 10,
  },
  logDateCard: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f7fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logDateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#e3eafc',
  },
  logDateButtonExpanded: {
    backgroundColor: '#1976d2',
  },
  logDateButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  logDateButtonArrow: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  logDetails: {
    padding: 12,
    backgroundColor: '#fff',
  },
  salesDataText: {
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 8,
  },
  historyCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  noHistoryText: {
    fontStyle: 'italic',
    color: '#777',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalCloseButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  modalCloseText: {
    color: '#0a469e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scheduleTextModal: {
    fontSize: 15,
    color: '#222',
  },
  fabLogout: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#e53935',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 99,
  },
});

export default DashboardScreen;