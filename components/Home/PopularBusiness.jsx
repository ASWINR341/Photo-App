import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Colors} from './../../constants/Colors'
import { collection, doc, getDocs, limit, query } from 'firebase/firestore'
import { db } from '../../configs/FirebaseConfig'
import PopularBusinessCard from './PopularBusinessCard'

export default function PopularBusiness() {
    const [businessList, setBusinessList] = useState([]);

    useEffect(() => {
        GetBusinessList();
    }, []);

    const GetBusinessList = async () => {
        setBusinessList([]);
        const q = query(collection(db, 'BusinessList'), limit(10))
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setBusinessList(prev => [...prev, { id: doc.id, ...doc.data() }])
        })
    }

    return (
        <View>
            <View style={{
                paddingLeft: 20,
                marginBottom: 15,
                flexDirection: 'row',
                alignItems: 'flex-start', // Align children to the start (left side)
                marginTop: 20,
                
            }}>
                <Text style={{
                    fontSize: 20,
                    fontFamily: 'outfit-bold',
                }}>
                    Popular Pics
                </Text>
                <Text style={{ color: Colors.PRIMARY, fontFamily: 'outfit-medium', marginLeft: 140, padding:5 }}>
                {/* Scroll to view All→  */}
                </Text>
            </View>
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={businessList}
                renderItem={({ item, index }) => (
                    <PopularBusinessCard
                        business={item}
                        key={index}
                    />
                )}
            />
        </View>
    )
}
