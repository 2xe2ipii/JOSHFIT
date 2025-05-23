import React, { ReactNode } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  ViewStyle, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { COLORS } from '../constants/theme';
interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  disableSafeArea?: boolean;
}
// Get device dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  disableSafeArea = false
}) => {
  const { darkMode } = useSelector((state: RootState) => state.settings);
  // Get the status bar height for proper padding
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  // Calculate appropriate padding based on device height
  // Use a fixed value that ensures content is visible
  const additionalPadding = 16; // Fixed padding that works well across devices
  // If SafeArea is disabled, we need to manually handle the top padding
  // For Android, add the status bar height to ensure content is below the status bar
  const topPadding = disableSafeArea ? statusBarHeight + additionalPadding : additionalPadding;
  const Container = disableSafeArea ? View : SafeAreaView;
  return (
    <Container 
      style={[
        styles.container, 
        darkMode && styles.darkContainer,
        { paddingTop: topPadding },
        style
      ]}
    >
      {scrollable ? (
        // Use ScrollView when scrollable is true
        <ScrollView 
          style={styles.content}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>
          {children}
        </View>
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    height: windowHeight,
    width: windowWidth,
  },
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  content: {
    flex: 1,
    paddingVertical: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  darkScrollContent: {
    backgroundColor: COLORS.darkBackground,
  }
});
export default ScreenContainer;

