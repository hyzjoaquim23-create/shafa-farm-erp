import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goatAPI } from '../../api';

const GoatDetailScreen = ({ route }) => {
  const { goatId } = route.params;
  const [goat, setGoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoatDetails();
  }, [goatId]);

  const fetchGoatDetails = async () => {
    try {
      setError(null);
      const response = await goatAPI.getGoat(goatId);
      setGoat(response.data);
    } catch (err) {
      setError('Failed to load goat details');
      console.error('Goat detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B7355" />
      </View>
    );
  }

  if (!goat) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Goat not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{goat.name}</Text>
          <Text style={styles.tagNumber}>ID: {goat.tagNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(goat.status) }]}>
          <Text style={styles.statusText}>{goat.status || 'Active'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <InfoRow label="Gender" value={goat.gender} />
        <InfoRow label="Date of Birth" value={goat.dateOfBirth} />
        <InfoRow label="Breed" value={goat.breed} />
        <InfoRow label="Location" value={goat.location} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        <InfoRow label="Health Status" value={goat.healthStatus} />
        <InfoRow label="Last Vaccination" value={goat.lastVaccination} />
        <InfoRow label="Weight" value={`${goat.weight} kg`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Breeding Information</Text>
        <InfoRow label="Breeding Status" value={goat.breedingStatus} />
        <InfoRow label="Parent 1" value={goat.parent1} />
        <InfoRow label="Parent 2" value={goat.parent2} />
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil" size={16} color="#8B7355" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'healthy':
      return '#C8E6C9';
    case 'sick':
      return '#FFCCBC';
    case 'pregnant':
      return '#B3E5FC';
    default:
      return '#F0F0F0';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    backgroundColor: '#8B7355',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tagNumber: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  actionSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B7355',
    backgroundColor: '#fff',
    gap: 6,
  },
  dangerButton: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7355',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#F44336',
    marginTop: 20,
  },
});

export default GoatDetailScreen;
