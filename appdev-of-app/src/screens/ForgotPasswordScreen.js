import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Step 1: Send code
  const handleSendCode = async () => {
    try {
      const response = await fetch('http://192.168.1.12:5000/api/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setCode(data.code); // For demo, backend should not return code in production!
        setStep(2);
        Alert.alert('Success', 'A one-time code has been sent to your email.');
      } else {
        Alert.alert('Error', data.message || 'Failed to send code.');
      }
    } catch (error) {
      Alert.alert('Error', 'Server error.');
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = () => {
    if (inputCode === code) {
      setStep(3);
    } else {
      Alert.alert('Error', 'Invalid code.');
    }
  };

  // Step 3: Change password
  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://192.168.1.12:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Password changed!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Failed to change password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Server error.');
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.title}>Enter One-Time Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter code"
            value={inputCode}
            onChangeText={setInputCode}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 3 && (
        <>
          <Text style={styles.title}>Set New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#1976d2', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ForgotPasswordScreen;