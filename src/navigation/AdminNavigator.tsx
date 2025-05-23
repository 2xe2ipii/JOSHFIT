import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminStackParamList } from './types';
// Import screens
import UserListScreen from '../screens/admin/UserListScreen';
import UserDetailScreen from '../screens/admin/UserDetailScreen';
import AddUserScreen from '../screens/admin/AddUserScreen';
const Stack = createStackNavigator<AdminStackParamList>();
const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="UserList" 
        component={UserListScreen} 
        options={{ title: 'User Management' }}
      />
      <Stack.Screen 
        name="UserDetail" 
        component={UserDetailScreen} 
        options={({ route }) => ({ title: 'User Details' })}
      />
      <Stack.Screen 
        name="AddUser" 
        component={AddUserScreen} 
        options={{ title: 'Add New User' }}
      />
    </Stack.Navigator>
  );
};
export default AdminNavigator;

