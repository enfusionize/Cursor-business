import React, { useState } from 'react';
import { FlatList, Image, View, Text, Dimensions, StyleSheet } from 'react-native';
import { PAGES } from '../data/pages';
import { COLORS, FONTS } from '../styles/theme';

export default function BookReaderScreen() {
  const { width, height } = Dimensions.get('window');
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.root}>
      <FlatList
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        keyExtractor={item => item.slug}
        renderItem={({ item }) => (
          <Image source={item.image} style={{ width, height }} resizeMode="cover" />
        )}
      />
      <Text style={styles.caption}>{PAGES[index].title}</Text>
      <Text style={styles.pagination}>
        {index + 1}/{PAGES.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  caption: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    color: COLORS.accentGold,
    fontFamily: FONTS.body,
    fontSize: 14
  },
  pagination: {
    position: 'absolute',
    top: 48,
    alignSelf: 'center',
    color: COLORS.textSecondary,
    fontFamily: FONTS.body,
    fontSize: 12
  }
});