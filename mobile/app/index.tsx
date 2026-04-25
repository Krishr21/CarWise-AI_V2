import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Search, Car, DollarSign, MapPin, ExternalLink, CheckCircle2, XCircle } from 'lucide-react-native';
import { CarListing, SearchFilters, SearchState } from '../types';
import { searchCars } from '../services/geminiService';
import Chatbot from '../components/Chatbot';

export default function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    budgetMin: '',
    budgetMax: '',
    makeModel: '',
    yearMin: '',
    location: ''
  });

  const [state, setState] = useState<SearchState>({
    isSearching: false,
    status: 'idle',
    results: []
  });

  const handleSearch = async () => {
    if (!filters.query && !filters.makeModel) return;
    setState({ ...state, isSearching: true, status: 'researching', results: [] });

    try {
      setTimeout(() => {
        setState(prev => ({ ...prev, status: 'analyzing' }));
      }, 2000);

      const results = await searchCars(filters);
      setState({
        isSearching: false,
        status: 'completed',
        results
      });
    } catch (error) {
      setState({
        isSearching: false,
        status: 'error',
        results: [],
        error: 'Failed to find listings. Please try again.'
      });
    }
  };

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Car color="#E4E3E0" size={20} />
          </View>
          <Text style={styles.logoText}>CARWISE-AI</Text>
        </View>

        <Text style={styles.title}>Find your next{'\n'}<Text style={styles.titleBold}>perfect drive.</Text></Text>

        <View style={styles.searchForm}>
          <View style={styles.inputWrapper}>
            <Search color="#141414" size={20} style={styles.inputIcon} opacity={0.3} />
            <TextInput
              style={styles.input}
              placeholder="Search anything..."
              placeholderTextColor="#888"
              value={filters.query}
              onChangeText={(text) => setFilters({ ...filters, query: text })}
            />
          </View>
          
          <View style={styles.rowInputs}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
              <DollarSign color="#141414" size={16} style={styles.inputIcon} opacity={0.3} />
              <TextInput
                style={styles.input}
                placeholder="Max Budget"
                placeholderTextColor="#888"
                value={filters.budgetMax}
                onChangeText={(text) => setFilters({ ...filters, budgetMax: text })}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
              <MapPin color="#141414" size={16} style={styles.inputIcon} opacity={0.3} />
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#888"
                value={filters.location}
                onChangeText={(text) => setFilters({ ...filters, location: text })}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, state.isSearching && styles.buttonDisabled]} 
            onPress={handleSearch}
            disabled={state.isSearching}
          >
            {state.isSearching ? (
              <ActivityIndicator color="#E4E3E0" />
            ) : (
              <Text style={styles.buttonText}>SEARCH</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        {state.isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#141414" />
            <Text style={styles.loadingText}>
              {state.status === 'researching' ? 'Researcher is scanning listings...' : 'Analyst is ranking options...'}
            </Text>
          </View>
        )}

        {state.status === 'completed' && state.results.map((car, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{car.title}</Text>
              <Text style={styles.cardSubtitle}>{car.source} • {car.location}</Text>
            </View>
            <View style={styles.cardPriceRow}>
              <Text style={styles.cardPrice}>{car.price}</Text>
              <Text style={styles.cardMileage}>{car.mileage}</Text>
            </View>
            
            <Text style={styles.cardSummary}>"{car.summary}"</Text>

            <View style={styles.prosConsContainer}>
              <View style={styles.prosConsColumn}>
                <View style={styles.prosConsTitle}>
                  <CheckCircle2 color="#059669" size={14} />
                  <Text style={styles.prosConsTitleText}>PROS</Text>
                </View>
                {(car.pros || []).map((pro, j) => (
                  <Text key={j} style={styles.prosConsText}>• {pro}</Text>
                ))}
              </View>
              <View style={styles.prosConsColumn}>
                <View style={styles.prosConsTitle}>
                  <XCircle color="#e11d48" size={14} />
                  <Text style={styles.prosConsTitleText}>CONS</Text>
                </View>
                {(car.cons || []).map((con, j) => (
                  <Text key={j} style={styles.prosConsText}>• {con}</Text>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => Linking.openURL(car.url)}
            >
              <Text style={styles.linkButtonText}>VIEW ORIGINAL LISTING</Text>
              <ExternalLink color="#E4E3E0" size={16} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
    <Chatbot />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E4E3E0' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: 32 },
  logoContainer: { flexDirection: 'row', marginBottom: 24, alignItems: 'center' },
  logoIcon: { width: 32, height: 32, backgroundColor: '#141414', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  logoText: { fontSize: 12, fontWeight: '700', letterSpacing: 2, opacity: 0.5 },
  title: { fontSize: 40, fontWeight: '400', fontStyle: 'italic', marginBottom: 24 },
  titleBold: { fontWeight: '800', fontStyle: 'normal', textTransform: 'uppercase' },
  searchForm: { gap: 12 },
  inputWrapper: { justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderColor: '#141414', padding: 16, paddingLeft: 48, fontSize: 16 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: '#141414', padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#E4E3E0', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  main: { marginTop: 16 },
  loadingContainer: { alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 16, fontSize: 16, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#141414', marginBottom: 24, padding: 24 },
  cardHeader: { marginBottom: 12 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, opacity: 0.5, textTransform: 'uppercase' },
  cardPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(20,20,20,0.1)' },
  cardPrice: { fontSize: 24, fontWeight: 'bold' },
  cardMileage: { fontSize: 14, opacity: 0.5 },
  cardSummary: { fontSize: 14, fontStyle: 'italic', opacity: 0.8, marginBottom: 20, lineHeight: 22 },
  prosConsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  prosConsColumn: { flex: 1 },
  prosConsTitle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  prosConsTitleText: { fontSize: 10, fontWeight: 'bold', opacity: 0.5 },
  prosConsText: { fontSize: 12, marginBottom: 4, opacity: 0.8 },
  linkButton: { backgroundColor: '#141414', padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  linkButtonText: { color: '#E4E3E0', fontWeight: 'bold', fontSize: 12 }
});
