import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../firebase';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInput = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out all fields.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Password should not be less than 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    if (!validateInput()) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Success', 'User registered successfully! 😍', [
          { text: 'Go to Login', onPress: () => router.replace('login') }
        ]);
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'This email is already in use. Please log in or use a different email.');
        } else {
          Alert.alert('Signup failed', error.message || 'An error occurred during signup.');
        }
        console.log(error);
      });
  };

  return (
    <View>
      <Text>Create Account</Text>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleSignup}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('login')}>
        <Text>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
