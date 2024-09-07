import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'
import Category from '../../components/Home/Category'
import { collection, getDocs, query, where } from 'firebase/firestore'
import ExploreBusinessList from '../../components/Explore/ExploreBusinessList'
import { db } from '../../firebaseConfig' // Import your Firebase configuration

export default function Explore() {
  const [businessList, setBusinessList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getBusinessByCategory = async (category) => {
    try {
      const q = query(collection(db, 'BusinessList'), where('category', '==', category));
      const querySnapshot = await getDocs(q); 
      const businesses = [];
      querySnapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });
      setBusinessList(businesses);
    } catch (error) {
      console.error("Error fetching businesses: ", error);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 30 }}>Explore More</Text>
      {/* SearchBar */}
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 10,
        marginTop: 10,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: Colors.PRIMARY
      }}>
        <Ionicons name="search" size={24} color={Colors.PRIMARY} />
        <TextInput
          placeholder='Search...'
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            fontFamily: 'outfit',
            fontSize: 16
          }}
        />
      </View>
      {/* Category */}
      <Category
        explore={true}
        onCategorySelect={(category) => getBusinessByCategory(category)}
      />
      {/* Business List */}
      <ExploreBusinessList businessList={businessList} />
    </View>
  )
}
