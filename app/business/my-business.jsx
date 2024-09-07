import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import BusinessListCard from './../../components/Explore/BusinessListCard';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function MyBusiness() {
    const { user } = useUser();
    const [businessList, setBusinessList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
          headerShown:true,
          headerTitle:'My Pics',
          headerStyle:{
            backgroundColor:Colors.PRIMARY,
          }
        })
        if (user) {
            console.log('User is available:', user);
            GetUserBusiness();
        } else {
            console.log('User is not available');
        }
    }, [user]);

    const GetUserBusiness = async () => {
        setLoading(true);
        setBusinessList([]);
        console.log('Fetching business list...');
        try {
            const q = query(
                collection(db, 'BusinessList'),
                where('userEmail', '==', user?.primaryEmailAddress.emailAddress)
            );

            const querySnapShot = await getDocs(q);
            const businesses = [];
            querySnapShot.forEach((doc) => {
                console.log('Business data:', doc.data());
                businesses.push({ id: doc.id, ...doc.data() });
            });
            setBusinessList(businesses);
            console.log('Business list set:', businesses);
        } catch (error) {
            console.error('Error fetching business list:', error);
        }
        setLoading(false);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 30 }}>My Pics</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : businessList.length === 0 ? (
                <Text>No Pics found</Text>
            ) : (
                <FlatList
                    onRefresh={GetUserBusiness}
                    refreshing={loading}
                    data={businessList}
                    renderItem={({ item }) => (
                        <BusinessListCard business={item} key={item.id} />
                    )}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
}
