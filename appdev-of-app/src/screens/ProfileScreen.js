import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const dummyImages = [
  require('../assets/sample-prof-photo.png'),
  require('../assets/sample-prof-photo.png'),
  require('../assets/sample-prof-photo.png'),
];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slide);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Save logic can go here, e.g. API call
      console.log('Saving profile...', {
        fullName,
        gender,
        age,
        phone,
        email,
        password,
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar & Name */}
      <View style={styles.profileInfo}>
        <View style={styles.avatar} />
        <Text style={styles.userName}>Your Name</Text>
      </View>

      {/* Inputs */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          editable={isEditing}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          placeholder="Enter your gender"
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          editable={isEditing}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          placeholder="Enter your age"
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          editable={isEditing}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="Enter your phone number"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={isEditing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={isEditing}
        />
      </View>

      {/* Profile Pictures Carousel */}
      <Text style={styles.label}>Profile Pictures</Text>
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {dummyImages.map((img, index) => (
            <View key={index} style={styles.slide}>
              <Image source={img} style={styles.slideImage} resizeMode="cover" />
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {dummyImages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentSlide ? '#000' : '#ccc' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Edit / Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: isEditing ? '#0a469e' : '#e53935' }, // blue for save, red for edit
        ]}
        onPress={handleToggleEdit}
      >
        <Text style={styles.saveButtonText}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginLeft: 15,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    height: 250,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: width - 30,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  dots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  saveButton: {
    backgroundColor: '#0a469e',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
