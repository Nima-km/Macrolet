import { colors } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";

export default function Profile() {
  const [startWeight, setStartWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.h1}>Weight Goals</Text>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Start Weight</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setStartWeight}
            value={startWeight}
            placeholder="Lbs"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Start Weight</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setCurrentWeight}
            value={currentWeight}
            placeholder="Lbs"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Start Weight</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setGoalWeight}
            value={goalWeight}
            placeholder="Lbs"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.box}>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  centerContainter: {
      alignItems: "center",
      justifyContent: "center"
  },
  rowContainer: {
      flexDirection: 'row',
  },
  barChartContainer: {
      width: 320,
      height: 300,
  },
  input: {
      flex: 1,
      backgroundColor: colors.box,
      borderRadius: 10,
      padding: 10,
      marginLeft: 50,
      marginVertical: 10,
  },
  button: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 10,
  },
  buttonText: {
      color: "black",
      fontSize: 12,
  },
  titleText: {
      color: "black",
      marginHorizontal: 20,
      fontSize: 20,
  },
  smallText: {
      color: "black",
      marginHorizontal: 60,
      fontSize: 12,
  },
  box: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginTop: 10,
      marginHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: 10,
  },
  boxColorless: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginTop: 10,
      marginHorizontal: 15,
      borderRadius: 4,
  },
  constrainedBox: {
      height: 350
  },
  smallBox: {
      width: 180,
      height: 180,
      marginHorizontal: 5,
  },
  item: {
      padding: 10,
      backgroundColor: colors.secondary,
      marginRight: 30,

  },
  h1: {
      fontFamily: 'Geist',
      fontWeight: '600',
      fontSize: 28,
  },
  h2: {
      fontFamily: 'Geist',
      fontWeight: '800',
      fontSize: 22,
  },
  h3: {
      fontFamily: 'Metro-Medium',
      fontSize: 20,
  },
  h4: {
      fontFamily: 'Metro-Medium',
      fontSize: 18  ,
  },
  h5: {
      fontFamily: 'Metro-SemiBold',
      fontSize: 17,
  },
  h6: {
      fontFamily: 'Metro-Regular',
      fontSize: 16,
  },
  h7: {
      fontFamily: 'Metro-Bold',
      fontSize: 18,
  },
  h8: {
      fontFamily: 'Metro-Regular',
      fontSize: 14,
  },
})