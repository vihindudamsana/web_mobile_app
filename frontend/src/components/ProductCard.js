import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/Theme';
import { BASE_URL } from '../config';

export const ProductCard = ({ item, onPress, onAddPress, inCart, cartQty }) => {
  const discount = item.mrp > item.price
    ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
    : 0;

  const imageUrl = item.image 
    ? (item.image.startsWith("http") ? item.image : `${BASE_URL}/${item.image}`)
    : null;

  const liveStock = item.stock - (cartQty || 0);

  return (
    <TouchableOpacity
      style={s.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={s.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={s.image} resizeMode="cover" />
        ) : (
          <View style={s.placeholder}><Text style={{fontSize: 32}}>📦</Text></View>
        )}
        {discount > 0 && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{discount}% OFF</Text>
          </View>
        )}
      </View>

      <View style={s.content}>
        <Text style={s.title} numberOfLines={1}>{item.name || item.title}</Text>
        
        <View style={s.priceRow}>
          <Text style={s.price}>Rs. {item.price?.toLocaleString()}</Text>
          {item.mrp > item.price && (
            <Text style={s.mrp}>Rs. {item.mrp?.toLocaleString()}</Text>
          )}
        </View>

        <View style={s.footer}>
          <Text style={[s.stock, liveStock < 5 && liveStock > 0 && s.lowStock]}>
            {liveStock <= 0 ? "OUT OF STOCK" : `${liveStock} IN STOCK`}
          </Text>
          
          <TouchableOpacity 
            style={[s.addBtn, (liveStock <= 0) && s.disabledBtn]} 
            onPress={onAddPress}
            disabled={liveStock <= 0}
          >
            <Text style={s.addBtnText}>{inCart ? `+${cartQty}` : "+"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    width: '48%',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.surfaceLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    color: COLORS.black,
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    padding: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  mrp: {
    fontSize: 10,
    color: COLORS.textDim,
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stock: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  lowStock: {
    color: COLORS.error,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
});
