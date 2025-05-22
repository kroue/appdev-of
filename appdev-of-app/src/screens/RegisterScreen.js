import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    if (!agreedToTerms) {
      Alert.alert('Error', 'You must agree to the Terms and Conditions.');
      return;
    }

    const userData = {
      fullName,
      gender,
      age,
      phoneNumber: phone,
      email,
      password,
    };

    try {
      const response = await fetch('http://192.168.1.12:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
    
      console.log('Response status:', response.status); // Log the status code
      console.log('Response body:', await response.text()); // Log the response body
    
      if (response.ok) {
        console.log('Navigating to Login screen...');
        navigation.navigate('Login'); // Direct navigation
      }else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error); // Log the error
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Logo */}
          <Text style={styles.logo}>
            <Text style={styles.only}>Only</Text>
            <Text style={styles.friends}>Friends</Text>
          </Text>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Please Register to Continue.</Text>
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Please Enter your Full Name."
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderOption, gender === 'Male' && styles.genderSelected]}
              onPress={() => setGender('Male')}
            >
              <Text style={[styles.genderText, gender === 'Male' && styles.genderTextSelected]}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderOption, gender === 'Female' && styles.genderSelected]}
              onPress={() => setGender('Female')}
            >
              <Text style={[styles.genderText, gender === 'Female' && styles.genderTextSelected]}>Female</Text>
            </TouchableOpacity>
          </View>

          {/* Age */}
          <View style={styles.inputContainer}>
            <Icon name="calendar" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Age"
              keyboardType="numeric"
              style={styles.input}
              value={age}
              onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Please Enter your Phone Number."
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Please Enter your Email."
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Please Enter the Password."
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Terms with Checkbox */}
          <TouchableOpacity
            style={styles.termsContainer}
            activeOpacity={1}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={styles.checkbox}>
              {agreedToTerms && <View style={styles.checkedBox} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.link} onPress={() => setModalVisible(true)}>
                terms of service and privacy policy
              </Text>.
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Login Redirect */}
          <Text style={styles.loginRedirect}>
            Already have an account?
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              {' '}Login Here
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Modal for Terms */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Terms of Service and Privacy Policy</Text>
              <Text style={styles.modalContent}>
                This is a placeholder for your full terms and privacy policy content.
                You can write as much as you'd like here.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D5997',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  container: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingVertical: 80,
    paddingHorizontal: 55,
    width: '100%',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Rasa-Bold',
  },
  only: { color: '#3082C6' },
  friends: { color: '#0D5997' },
  titleBlock: { marginVertical: 20 },
  title: {
    fontSize: 26,
    color: '#1a56db',
    fontFamily: 'Rasa-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Rasa-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: 'Rasa-Regular',
    paddingVertical: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    borderRadius: 20,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#1a56db',
  },
  genderText: {
    fontSize: 14,
    fontFamily: 'Rasa-Bold',
    color: '#333',
  },
  genderTextSelected: {
    color: '#fff',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#999',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: '#1a56db',
    borderRadius: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    fontFamily: 'Rasa-Regular',
  },
  link: {
    color: '#1a56db',
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
  registerButton: {
    backgroundColor: '#1a56db',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 60,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Rasa-Bold',
  },
  loginRedirect: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Rasa-Regular',
    fontSize: 13,
  },
  loginLink: {
    color: '#1a56db',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
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
    fontFamily: 'Rasa-Bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 14,
    fontFamily: 'Rasa-Regular',
    color: '#444',
  },
  modalCloseButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    color: '#1a56db',
    fontSize: 16,
    fontFamily: 'Rasa-Bold',
  },
});

export default RegisterScreen;
