import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goatAPI } from '../../api';

const GoatInventoryScreen = ({ navigation }) => {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoats = async () => {
    try {
      setError(null);
      const response = await goatAPI.getGoats();
      setGoats(response.data || []);
    } catch (err) {
      setError('Failed to load goats');
      console.error('Goats error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchGoats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoats();
  };

  const handleDeleteGoat = (id, name) => {
    Alert.alert('Delete Goat', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await goatAPI.deleteGoat(id);
            fetchGoats();
            Alert.alert('Success', 'Goat deleted successfully');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete goat');
          }
        },
      },
    ]);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B7355" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={goats}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.goatCard}
            onPress={() => navigation.navigate('GoatDetail', { goatId: item.id })}
          >
            <View style={styles.goatHeader}>
              <View style={styles.goatInfo}>
                <Text style={styles.goatName}>{item.name || 'Unknown'}</Text>
                <Text style={styles.goatTag}>ID: {item.tagNumber || item.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status || 'Active'}</Text>
              </View>
            </View>

            <View style={styles.goatDetails}>
              <DetailItem icon="transgender" label="Gender" value={item.gender || 'N/A'} />
              <DetailItem icon="calendar" label="Age" value={item.age || 'N/A'} />
              <DetailItem icon="map-pin" label="Location" value={item.location || 'N/A'} />
            </View>

            <View style={styles.goatActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                <Ionicons name="pencil" size={16} color="#8B7355" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteGoat(item.id, item.name)}
              >
                <Ionicons name="trash" size={16} color="#F44336" />
                <Text style={[styles.actionText, { color: '#F44336' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>No goats found</Text>
            <Text style={styles.emptySubtext}>Add your first goat to get started</Text>
          </View>
        }
        contentContainerStyle={goats.length === 0 ? { flex: 1 } : { padding: 16 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGoat')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Ionicons name={icon} size={14} color="#8B7355" />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  goatCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  goatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goatInfo: {
    flex: 1,
  },
  goatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  goatTag: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  goatDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    marginRight: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  goatActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B7355',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default GoatInventoryScreen;
