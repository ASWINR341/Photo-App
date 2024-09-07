import { View, Text, TextInput, TouchableOpacity, ToastAndroid, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../constants/Colors';
import { Rating } from 'react-native-ratings';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../configs/FirebaseConfig';

export default function Reviews({ business }) {
  const [rating, setRating] = useState(4);
  const [userInput, setUserInput] = useState('');
  const { user } = useUser();

  const onSubmit = async () => {
    if (!user) {
      ToastAndroid.show('User not logged in', ToastAndroid.BOTTOM);
      return;
    }

    try {
      const docRef = doc(db, 'BusinessList', business?.id);
      await updateDoc(docRef, {
        reviews: arrayUnion({
          rating: rating,
          comment: userInput,
          userName: user?.fullName,
          userImage: user?.imageUrl,
          userEmail: user?.primaryEmailAddress?.emailAddress
        })
      });
      ToastAndroid.show('Comment Added Successfully!', ToastAndroid.BOTTOM);
      setUserInput(''); // Clear the input after submission
      setRating(4); // Reset the rating if needed
    } catch (error) {
      ToastAndroid.show('Error adding comment', ToastAndroid.BOTTOM);
      console.error("Error adding document: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomColor: Colors.GRAY, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth:1,borderRightColor:Colors.GRAY, borderRadius:9, marginTop:10 }}>
      <Image source={{ uri: item.userImage }} style={{ width: 50, height: 50, borderRadius: 99, marginRight: 10 }} />
      <View style={{
        display: 'flex'
      }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 14 }}>{item.userName}</Text>
        <Text style={{ fontFamily: 'outfit', fontSize: 14 }}>{item.comment}</Text>
        <Rating
          imageSize={20}
          startingValue={item.rating}
          readonly
          style={{ alignItems: 'flex-start' }}
        />
      </View>
    </View>
  );

  return (
    <View style={{
      padding: 20,
      backgroundColor: '#fff'
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20,
      }}>Reviews</Text>
      <View>
        <Rating
          showRating={false}
          imageSize={20}
          onFinishRating={(rating) => setRating(rating)}
          style={{ paddingVertical: 10 }}
        />
        <TextInput
          placeholder='Write your comment'
          numberOfLines={4}
          value={userInput}
          onChangeText={(value) => setUserInput(value)}
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: Colors.GRAY,
            textAlignVertical: 'top'
          }}
        />
        <TouchableOpacity
          disabled={!userInput}
          onPress={onSubmit}
          style={{
            padding: 10,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 6,
            marginTop: 10,
          }}>
          <Text style={{
            fontFamily: 'outfit',
            color: '#fff',
            textAlign: 'center'
          }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
      {/* Display Previous Reviews */}
      <FlatList
        data={business?.reviews || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
