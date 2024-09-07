import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // corrected import
import { Colors } from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { db, storage } from '../../configs/FirebaseConfig';
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo'; // corrected import

export default function AddBusiness() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add New Pic',
      headerShown: true,
    });
    getCategoryList(); // corrected function name
  }, []);

  const onImagePick = async () => {
    // Request permission to access the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      ToastAndroid.show('Permission to access media library is required!', ToastAndroid.LONG);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) { // corrected property name
      setImage(result.assets[0].uri); // corrected property name
    }
  };

  const getCategoryList = async () => { // corrected function name
    const q = query(collection(db, 'Category'));
    const snapShot = await getDocs(q);

    const categories = [];
    snapShot.forEach((doc) => {
      categories.push({
        label: doc.data().name,
        value: doc.data().name,
      });
    });
    setCategoryList(categories);
  };

  const onAddNewBusiness = async () => {
    if (!image || !name || !address || !about || !category) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.LONG);
      return;
    }

    setLoading(true);
    const fileName = Date.now().toString() + '.jpg';
    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef = ref(storage, 'business-app/' + fileName);

    try {
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);
      await saveBusinessDetail(downloadUrl);
      ToastAndroid.show('New Pic added', ToastAndroid.LONG);
    } catch (error) {
      console.error('Error uploading image:', error);
      ToastAndroid.show('Failed to add business', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const saveBusinessDetail = async (imageUrl) => {
    try {
      await setDoc(doc(db, 'BusinessList', Date.now().toString()), {
        name: name,
        address: address,
        about: about,
        category: category,
        userName: user?.fullName,
        userEmail: user?.primaryEmailAddress.emailAddress,
        userImage: user?.imageUrl,
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error('Error saving business details:', error);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}>Add New Pic</Text>
      <Text style={{ fontFamily: 'outfit', color: Colors.GRAY }}>
        Fill all details in order to add a new pic
      </Text>
      <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
        {!image ? (
          <Image
            source={require('../../assets/images/camera.png')}
            style={{ width: 100, height: 100 }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 15 }}
          />
        )}
      </TouchableOpacity>
      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={(v) => setName(v)}
        style={styles.input}
      />
      <TextInput
        placeholder='Location'
        value={address}
        onChangeText={(v) => setAddress(v)}
        style={styles.input}
      />
      <TextInput
        placeholder='About'
        value={about}
        onChangeText={(v) => setAbout(v)}
        multiline
        numberOfLines={5}
        style={[styles.input, { height: 100 }]}
      />
      <View style={styles.input}>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={categoryList}
        />
      </View>
      <TouchableOpacity
        disabled={loading}
        style={styles.button}
        onPress={onAddNewBusiness}
      >
        {loading ? (
          <ActivityIndicator size='large' color='#fff' />
        ) : (
          <Text style={styles.buttonText}>Add New Pic</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: '#fff',
    marginTop: 10,
    borderColor: Colors.PRIMARY,
    fontFamily: 'outfit',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    color: '#fff',
  },
};
