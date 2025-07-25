import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CenteredHeaderTitle = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', 
  },
});

export default CenteredHeaderTitle;
