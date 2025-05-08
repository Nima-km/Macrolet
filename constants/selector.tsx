import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

interface Option {
  label: string;
  value: number;
}

interface SelectionComponentProps {
  options: Option[];
  onSelect: (value: number) => void;
}

const RadioButton = ({ options, onSelect }: SelectionComponentProps) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(options[0].value);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <View style={[styles.container]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            selectedValue === option.value && styles.selectedButton,
          ]}
          onPress={() => handleSelect(option.value)}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedValue === option.value }}
        >
          <Text style={[styles.h6]} >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        gap: 0,
        backgroundColor: colors.box,
        borderRadius: 10,
        padding: 4,
    },
    optionButton: {
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    // backgroundColor: 'white',
    },
    selectedButton: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000000',
    },
    shadowProp: {
        elevation: 5,
        shadowColor: '#000000',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
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
});

export default RadioButton;