import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView, Modal, StatusBar,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from '../config';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/Theme';
import { ProductCard } from '../components/ProductCard';

export default function ProductsScreen({ navigation, route }) {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [cart, setCart]         = useState([]);
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (route.params?.updatedCart) {
      setCart(route.params.updatedCart);
      navigation.setParams({ updatedCart: null });
    }
  }, [route.params?.updatedCart]);

  useEffect(() => {
    if (route.params?.orderSuccess) {
      setCart([]);
      setOrderDone(true);
      fetchProducts();
      navigation.setParams({ orderSuccess: false });
    }
  }, [route.params?.orderSuccess]);

  const fetchProducts = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/product/allproducts`);
      setProducts(res.data.products);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      const currentQty = existing?.qty || 0;
      if (currentQty >= product.stock) return prev;
      if (existing) {
        return prev.map((i) => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, product: product._id, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <SafeAreaView style={s.page}>
      <StatusBar barStyle="light-content" />

      {/* Navbar */}
      <View style={s.nav}>
        <Text style={s.navBrand}>shop<Text style={{ color: COLORS.primary }}>.</Text></Text>
        <View style={s.navRight}>
          <TouchableOpacity style={s.cartBtn} onPress={() => navigation.navigate("Cart", { cart })}>
            <Text style={s.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("MyOrders")} style={s.navAction}>
            <Text style={s.navActionText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchProducts} style={s.retryBtn}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => navigation.navigate("ProductDetail", { product: item, cart })}
              onAddPress={() => addToCart(item)}
              inCart={cart.some(i => i._id === item._id)}
              cartQty={cart.find(i => i._id === item._id)?.qty}
            />
          )}
          numColumns={2}
          columnWrapperStyle={s.listRow}
          contentContainerStyle={s.list}
          ListHeaderComponent={
            <View style={s.header}>
              <Text style={s.title}>New Arrivals</Text>
              <Text style={s.subtitle}>Premium mobile collection</Text>
            </View>
          }
        />
      )}

      {/* Success Modal */}
      <Modal visible={orderDone} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.successCircle}>
              <Text style={{fontSize: 32}}>✅</Text>
            </View>
            <Text style={s.modalTitle}>Order Confirmed!</Text>
            <Text style={s.modalSub}>Your purchase was successful.</Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => setOrderDone(false)}>
              <Text style={s.modalBtnText}>Back to Shop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  nav: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  navBrand: { ...TYPOGRAPHY.h3, color: COLORS.white, fontSize: 24 },
  navRight: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  navAction: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BORDER_RADIUS.sm },
  navActionText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  cartBtn: { position: 'relative', padding: 4 },
  cartIcon: { fontSize: 22 },
  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: COLORS.primary, width: 16, height: 16,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: COLORS.black, fontSize: 10, fontWeight: '800' },
  logoutText: { color: COLORS.textDim, fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: SPACING.lg },
  title: { ...TYPOGRAPHY.h2, color: COLORS.white },
  subtitle: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  list: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  listRow: { justifyContent: 'space-between' },
  errorText: { color: COLORS.error, marginBottom: 16 },
  retryBtn: { padding: 10, backgroundColor: COLORS.surface, borderRadius: 8 },
  retryText: { color: COLORS.primary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: 32, alignItems: 'center', width: '85%', borderWidth: 1, borderColor: COLORS.border },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,200,83,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { ...TYPOGRAPHY.h2, color: COLORS.white, marginBottom: 8 },
  modalSub: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, textAlign: 'center', marginBottom: 24 },
  modalBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: BORDER_RADIUS.md },
  modalBtnText: { color: COLORS.black, fontWeight: '700' },
});