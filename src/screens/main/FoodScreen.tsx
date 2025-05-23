import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useSelector } from 'react-redux';
import { fetchFoodLogs, addFoodLog, deleteFoodLog, searchFood, clearSearchResults } from '../../redux/foodLogSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import ScreenContainer from '../../components/ScreenContainer';
import { FoodLog, UserRole } from '../../types';
import { NutritionixFoodItem } from '../../services/nutritionixApi';
const FoodScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { foodLogs, searchResults, isLoading, isSearching, error } = useSelector((state: RootState) => state.foodLog);
  const [foodInput, setFoodInput] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [foodServings, setFoodServings] = useState<{[key: string]: number}>({});
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  // Check if user has access to this premium feature
  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;
  useEffect(() => {
    if (user && isPremium) {
      dispatch(fetchFoodLogs(user.id));
    }
  }, [dispatch, user, isPremium]);
  useEffect(() => {
    // Calculate total calories consumed
    const total = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    setTotalCalories(total);
  }, [foodLogs]);
  // Handle food search when user types in search box
  const handleFoodSearch = (text: string) => {
    setSearchQuery(text);
    // Clear previous timeout to avoid multiple API calls
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    // Set a new timeout to delay the API call until user stops typing
    const timeout = setTimeout(() => {
      if (text.trim().length > 2) {
        dispatch(searchFood(text));
      } else if (text.trim().length === 0) {
        dispatch(clearSearchResults());
      }
    }, 500);
    setSearchTimeout(timeout);
  };
  // Open search modal
  const openSearchModal = () => {
    setSearchModalVisible(true);
    setSearchQuery('');
    setFoodServings({});
    dispatch(clearSearchResults());
  };
  // Close search modal
  const closeSearchModal = () => {
    setSearchModalVisible(false);
    setSearchQuery('');
    dispatch(clearSearchResults());
  };
  // Handle selection of a food item from search results
  const handleSelectFood = (foodItem: NutritionixFoodItem) => {
    if (user) {
      dispatch(addFoodLog({ 
        userId: user.id,
        foodItem
      }));
      closeSearchModal();
    }
  };
  // Legacy method - kept for backward compatibility
  const handleAddFoodLog = () => {
    if (!foodInput.trim()) {
      Alert.alert('Error', 'Please enter a food item');
      return;
    }
    // Open search modal instead of directly adding food
    setSearchQuery(foodInput);
    dispatch(searchFood(foodInput));
    setSearchModalVisible(true);
  };
  const handleDeleteFoodLog = (logId: string) => {
    Alert.alert(
      'Delete Food Entry',
      'Are you sure you want to delete this food entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteFoodLog(logId)),
        },
      ]
    );
  };
  const renderFoodLogItem = ({ item }: { item: FoodLog }) => {
    return (
      <Card style={styles.foodLogCard}>
        <View style={styles.foodLogHeader}>
          <View>
            <Text style={styles.foodName}>{item.foodName}</Text>
            <Text style={styles.servingSize}>{item.servingSize}</Text>
          </View>
          <View style={styles.calorieContainer}>
            <Text style={styles.calories}>{item.calories}</Text>
            <Text style={styles.caloriesLabel}>cal</Text>
          </View>
        </View>
        <View style={styles.foodLogFooter}>
          <Text style={styles.timeText}>
            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteFoodLog(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };
  const renderAccessDenied = () => {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed" size={64} color={COLORS.gray} />
        <Text style={styles.accessDeniedTitle}>Premium Feature</Text>
        <Text style={styles.accessDeniedText}>
          Food and calorie logging is available only for Premium and Admin users.
        </Text>
      </View>
    );
  };
  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="restaurant-outline" size={64} color={COLORS.lightGray} />
        <Text style={styles.emptyTitle}>No Food Entries</Text>
        <Text style={styles.emptyDescription}>
          Start logging your meals using the input field below to track your calories.
        </Text>
      </View>
    );
  };
  if (!isPremium) {
    return (
      <ScreenContainer style={styles.container} scrollable={false}>
        <View style={styles.accessDeniedContainer}>
          <Ionicons name="lock-closed" size={64} color={COLORS.darkGray} />
          <Text style={styles.accessDeniedTitle}>Premium Feature</Text>
          <Text style={styles.accessDeniedText}>
            Food tracking is available exclusively for premium users.
          </Text>
        </View>
      </ScreenContainer>
    );
  }
  return (
    <View style={styles.mainContainer}>
      {}
      <View style={[styles.stickyHeader, isDarkMode && styles.darkStickyHeader]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>Food Tracker</Text>
          <View style={styles.caloriesSummaryContainer}>
            <Text style={styles.caloriesSummaryLabel}>Total Calories:</Text>
            <Text style={styles.caloriesSummaryValue}>{totalCalories}</Text>
          </View>
        </View>
      </View>
      {}
      <View style={styles.container}>
        {isLoading ? (
          <View style={[styles.loadingContainer, styles.contentWithPadding]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View style={[styles.errorContainer, styles.contentWithPadding]}>
            <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorDescription}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                if (user) {
                  dispatch(fetchFoodLogs(user.id));
                }
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={foodLogs}
            renderItem={renderFoodLogItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.foodLogList}
            ListEmptyComponent={renderEmptyList}
            ListHeaderComponent={<View style={styles.minimalHeaderPadding} />}
            ListFooterComponent={<View style={{ height: 80 }} />}
          />
        )}
        {}
        {}
        <Modal
          visible={searchModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeSearchModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Search Food</Text>
                <TouchableOpacity onPress={closeSearchModal}>
                  <Ionicons name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for food (e.g. apple, chicken)..."
                  value={searchQuery}
                  onChangeText={handleFoodSearch}
                  autoFocus
                />
                {isSearching && (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                )}
              </View>
              {searchResults && searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item, index) => `${item.food_name}-${index}`}
                  renderItem={({ item, index }) => {
                    // Generate a unique key for this food item
                    const itemKey = `${item.food_name}-${index}`;
                    // Get the current serving quantity (default to the item's original serving_qty)
                    const currentServingQty = foodServings[itemKey] !== undefined ? 
                      foodServings[itemKey] : item.serving_qty;
                    // Calculate calories based on serving size
                    const caloriesPerUnit = item.nf_calories / item.serving_qty;
                    const calories = Math.round(caloriesPerUnit * currentServingQty);
                    return (
                      <View style={styles.foodSearchItem}>
                        <Image 
                          source={{ uri: item.photo.thumb }} 
                          style={styles.foodImage}
                          onError={(e) => {
                            console.log('Image load error:', e.nativeEvent.error);
                          }}
                          defaultSource={{ uri: 'https://via.placeholder.com/100' }}
                        />
                        <View style={styles.foodItemDetails}>
                          <Text style={styles.foodItemName}>{item.food_name}</Text>
                          <Text style={styles.foodItemServing}>
                            {currentServingQty} {item.serving_unit} ({calories} cal)
                          </Text>
                        </View>
                        <View style={styles.servingControls}>
                          <TouchableOpacity
                            style={styles.servingButton}
                            onPress={() => {
                              if (currentServingQty > 0.5) {
                                const newServingQty = currentServingQty - 0.5;
                                setFoodServings({
                                  ...foodServings,
                                  [itemKey]: newServingQty
                                });
                              }
                            }}
                          >
                            <Ionicons name="remove" size={18} color={COLORS.white} />
                          </TouchableOpacity>
                          <Text style={styles.servingQty}>{currentServingQty}</Text>
                          <TouchableOpacity
                            style={styles.servingButton}
                            onPress={() => {
                              const newServingQty = currentServingQty + 0.5;
                              setFoodServings({
                                ...foodServings,
                                [itemKey]: newServingQty
                              });
                            }}
                          >
                            <Ionicons name="add" size={18} color={COLORS.white} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={styles.logButton}
                          onPress={() => {
                            // Create a copy of the item with the updated serving quantity
                            const updatedItem = {
                              ...item,
                              serving_qty: currentServingQty,
                              nf_calories: caloriesPerUnit * currentServingQty
                            };
                            handleSelectFood(updatedItem);
                          }}
                        >
                          <Text style={styles.logButtonText}>LOG</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  contentContainerStyle={styles.searchResultsList}
                />
              ) : searchQuery.length > 2 && !isSearching ? (
                <View style={styles.emptySearchContainer}>
                  <Ionicons name="nutrition-outline" size={64} color={COLORS.lightGray} />
                  <Text style={styles.emptySearchText}>No foods found</Text>
                  <Text style={styles.emptySearchSubtext}>Try a different search term</Text>
                </View>
              ) : searchQuery.length > 0 && searchQuery.length <= 2 ? (
                <View style={styles.emptySearchContainer}>
                  <Text style={styles.emptySearchSubtext}>Type at least 3 characters to search</Text>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </View>
      {}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={openSearchModal}
        >
          <Ionicons name="search" size={20} color={COLORS.white} />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    zIndex: 1,
  },
  contentContainer: {
    padding: SIZES.md,
    paddingTop: 0, // No top padding as we have the sticky header
    paddingBottom: SIZES.xl, // Extra padding at the bottom
  },
  contentPadding: {
    height: 90, // Height to account for the sticky header
  },
  minimalHeaderPadding: {
    height: Platform.OS === 'ios' ? 90 : StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 70, // Match exactly the header height
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.md,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: SIZES.md,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    height: Platform.OS === 'ios' ? 90 : StatusBar.currentHeight ? StatusBar.currentHeight + 60 : 70, // Fixed height for header
  },
  darkStickyHeader: {
    backgroundColor: COLORS.darkBackground,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  darkText: {
    color: COLORS.white,
  },
  caloriesSummaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.md,
  },
  caloriesSummaryLabel: {
    fontSize: FONTS.small,
    color: COLORS.white,
    marginRight: SIZES.xs,
  },
  caloriesSummaryValue: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  contentWithPadding: {
    padding: SIZES.md,
    paddingTop: 90, // Account for sticky header
  },
  foodLogList: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
  },
  foodLogCard: {
    marginBottom: SIZES.md,
    width: '90%', // Make cards less wide than the full screen width
    alignSelf: 'center', // Center the cards horizontally
  },
  foodLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  servingSize: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calories: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: SIZES.xs,
  },
  caloriesLabel: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  foodLogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.sm,
    paddingTop: SIZES.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  timeText: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  deleteButton: {
    padding: SIZES.xs,
  },
  inputContainer: {
    marginTop: SIZES.lg,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 15, // Position above the navigation bar
    alignSelf: 'center',
    width: '50%', // Make it narrower
    zIndex: 10,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: SIZES.md,
    ...SHADOWS.medium,
  },
  searchButtonText: {
    color: COLORS.white,
    marginLeft: SIZES.sm,
    fontSize: FONTS.body,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.lg,
    borderTopRightRadius: SIZES.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    margin: SIZES.md,
    borderRadius: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: FONTS.body,
  },
  searchResultsList: {
    paddingHorizontal: SIZES.md,
  },
  foodSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.md,
  },
  foodItemDetails: {
    flex: 1,
  },
  foodItemName: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.black,
    textTransform: 'capitalize',
  },
  foodItemServing: {
    fontSize: FONTS.small,
    color: COLORS.darkGray,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  servingButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingQty: {
    marginHorizontal: SIZES.sm,
    fontSize: FONTS.body,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  logButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.sm,
  },
  logButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyDescription: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    textAlign: 'center',
  },
  emptySearchContainer: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: SIZES.md,
  },
  emptySearchSubtext: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  errorTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.error,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  errorDescription: {
    fontSize: FONTS.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  accessDeniedTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  accessDeniedText: {
    fontSize: FONTS.body,
    color: COLORS.gray,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default FoodScreen;

