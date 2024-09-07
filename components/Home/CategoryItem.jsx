import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'

export default function CategoryItem({category, onCategoryPress}) {
  return (
    <TouchableOpacity onPress={()=>onCategoryPress(category)}>
        <View style={{
            padding:15,
            // backgroundColor:Colors.ICON_BG,
            borderRadius:99,
            marginRight:15
        }}>
      <Image source= {{uri:category.icon}}
      style={{
        width:60,
        height:60,
        borderRadius:20
      }}
      
      />
      </View>
      <Text
      style={{
        fontSize:10,
        fontFamily:'outfit-bold',
        paddingRight:15,
        textAlign:'center'
      }}
      >{category.name}</Text>
    </TouchableOpacity>
  )
}