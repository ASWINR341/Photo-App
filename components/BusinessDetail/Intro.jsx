import { View, Text, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function Intro({ business }) {
  const {user}= useUser();
  const router = useRouter();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const onDelete = ()=>{
    Alert.alert('Do you want to delete?','Do you really want to delete this business?',[{

      text:'Cancel',
      style:'cancel'
    },
    {
      text:'Delete',
      style:'destructive',
      onPress:()=>deleteBusiness()
    }])
    
  }
  const deleteBusiness = async()=>{
    await deleteDoc(doc(db, "BusinessList", business?.id));
    router.back();
    ToastAndroid.show('Business Deleted!', ToastAndroid.LONG)
  }
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsHeartFilled(!isHeartFilled)}>
        <Ionicons 
            name={isHeartFilled ? "heart" : "heart-outline"} 
            size={40} 
            color={isHeartFilled ? "red" : "white"} 
          />
        </TouchableOpacity>
      </View>
      {business?.imageUrl ? (
        <Image
          source={{ uri: business.imageUrl }}
          style={{
            width: '100%',
            height: 340,
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 340,
            backgroundColor: '#f0f0f0',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>No Image Available</Text>
        </View>
      )}
      <View style={{
      padding: 20,
      marginTop: -20,
      display:'flex',
      flexDirection:'row',
      justifyContent: 'space-between',
      backgroundColor:'#fff',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,

      }}>
      <View
        style={{
          padding: 20,
          marginTop: -20,
          backgroundColor: '#fff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 26,
          }}
        >
          {business?.name || 'No Name Available'}
        </Text>
        <Text
          style={{
            fontFamily: 'outfit',
            fontSize: 20,
          }}
        >
          {business?.address || 'No Address Available'}
        </Text>
      </View>
     {user?.primaryEmailAddress.emailAddress==business?.userEmail && <TouchableOpacity onPress={()=>onDelete()} >
      <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>}
      </View>
    </View>
  );
}
