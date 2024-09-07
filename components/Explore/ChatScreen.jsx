import { View, Text, TextInput, TouchableOpacity, ToastAndroid, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { arrayUnion, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';

export default function ChatScreen() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            const docRef = doc(db, 'Chat', user.id);
            const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const allMessages = docSnapshot.data().messages || [];
                    // Sort messages by timestamp in descending order
                    allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    // Limit to the last 200 messages
                    const limitedMessages = allMessages.slice(0, 200);
                    setMessages(limitedMessages);
                }
            });
            return unsubscribe;
        }
    }, [user]);

    const onSubmit = async () => {
        if (!user || !user.fullName) {
            ToastAndroid.show('User not found', ToastAndroid.SHORT);
            return;
        }

        try {
            const docRef = doc(db, 'Chat', user.id);
            const docSnapshot = await getDoc(docRef);

            if (!docSnapshot.exists()) {
                await setDoc(docRef, { messages: [] });
            }

            await updateDoc(docRef, {
                messages: arrayUnion({
                    userName: user.fullName,
                    comment: userInput,
                    timestamp: new Date().toISOString()
                })
            });

            ToastAndroid.show('Chat added', ToastAndroid.SHORT);
            setUserInput('');
        } catch (error) {
            console.error('Error adding chat: ', error);
            ToastAndroid.show('Failed to add chat', ToastAndroid.SHORT);
        }
    };

    return (
        <ScrollView style={{ padding: 10, backgroundColor: '#fff', marginTop: -150, height:400 }}>
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>ChatScreen</Text>
            <TextInput 
                onChangeText={setUserInput}
                value={userInput}
                placeholder='Write chat'
                style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: Colors.GRAY,
                    height: 50,
                    marginTop: 20
                }}
            />
            <TouchableOpacity 
                disabled={!userInput}
                onPress={onSubmit}
                style={{
                    padding: 10,
                    backgroundColor: Colors.PRIMARY,
                    borderRadius: 9,
                    marginTop: 20
                }}
            >
                <Text style={{ textAlign: 'center', color: '#fff' }}>Submit</Text>
            </TouchableOpacity>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ paddingVertical: 10 }}>
                        <Text>{item.userName}: {item.comment}</Text>
                        <Text style={{ fontSize: 10, color: Colors.GRAY }}>{new Date(item.timestamp).toLocaleString()}</Text>
                    </View>
                )}
                style={{ marginTop: 20 }}
            />
        </ScrollView>
    );
}
