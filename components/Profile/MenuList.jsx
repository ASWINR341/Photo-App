import { View, Text, FlatList,Image, TouchableOpacity, Share } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function MenuList() {
    const {signOut} = useAuth();
    const MenuList=[
        {
            id:1,
            name:'Add Pics',
            icon: require('./../../assets/images/add.png'),
            path:'/business/add-business'
        },
        {
            id:2,
            name:'My Pics',
            icon: require('./../../assets/images/camera.png'),
            path:'/business/my-business'
        },
        {
            id:3,
            name:'Share App',
            icon: require('./../../assets/images/share-app.png'),
            path:'share'
        },        {
            id:4,
            name:'Logout',
            icon: require('./../../assets/images/logout.png'),
            path:'logout'
        }
        

    ]
    const router = useRouter();

    const onMenuClick = (item)=>{
      if(item.path=='logout'){
        signOut();
        return;
      }
      if(item.path=="share"){
        Share.share(
          {message:'Download the App by Kuttappu Download URL: Ask kuttappu'}
          )
        return;
      }
      router.push(item.path)
    }
  return (
    <View style={{
      marginTop:40
    }}>
      <FlatList
      data={MenuList}
      numColumns={2}
      renderItem={({item,index})=>(
        <TouchableOpacity 
        onPress={()=>onMenuClick(item)}
        style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            gap:10,
            flex:1,
            padding:10,
            borderRadius:15,
            borderWidth:1,
            backgroundColor:'#fff',
            borderColor:Colors.PRIMARY,
            marginBottom:20,
            marginHorizontal:15
        }}>
            <Image source={item.icon}
            style={{
                width:40,
                height:40
            }}
            />
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:16,
        flex:1
      }}>{item.name}</Text>
      </TouchableOpacity>
      )}
      />
      <Text style={{
        fontFamily:'outfit-bold',
        textAlign:'center',
        marginTop:50,
        color:Colors.GRAY
      }}>Developed by Kuttappu @ 2024</Text>
    </View>

  )
}