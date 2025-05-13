import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';

type UtilityMode = 'clock' | 'timer' | 'stopwatch';

const { width } = Dimensions.get('window');

const FloatingUtilityTool: React.FC = () => {
  const [mode, setMode] = useState<UtilityMode>('clock');
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState('00:00:00');
  
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  
  // Position state
  const position = useState(new Animated.ValueXY({ x: width - 80, y: 100 }))[0];
  
  // Format time for display
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Clock mode
  useEffect(() => {
    if (mode === 'clock') {
      const interval = setInterval(() => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        
        setTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [mode]);
  
  // Stopwatch mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (mode === 'stopwatch' && isRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isRunning]);
  
  // Timer mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (mode === 'timer' && timerIsRunning && timerTotalSeconds > 0) {
      interval = setInterval(() => {
        setTimerTotalSeconds(prev => {
          if (prev <= 1) {
            setTimerIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, timerIsRunning, timerTotalSeconds]);
  
  // Update display based on mode
  useEffect(() => {
    if (mode === 'stopwatch') {
      setTime(formatTime(stopwatchTime));
    } else if (mode === 'timer') {
      setTime(formatTime(timerTotalSeconds));
    }
  }, [mode, stopwatchTime, timerTotalSeconds]);
  
  // Handle mode switching
  const switchMode = () => {
    if (mode === 'clock') {
      setMode('stopwatch');
    } else if (mode === 'stopwatch') {
      setMode('timer');
      // Reset stopwatch when switching away
      setStopwatchTime(0);
      setIsRunning(false);
    } else {
      setMode('clock');
      // Reset timer when switching away
      setTimerTotalSeconds(0);
      setTimerIsRunning(false);
      setTimerMinutes(0);
      setTimerSeconds(0);
    }
  };
  
  // Handle start/stop for stopwatch and timer
  const handleStartStop = () => {
    if (mode === 'stopwatch') {
      setIsRunning(!isRunning);
    } else if (mode === 'timer') {
      if (!timerIsRunning && timerTotalSeconds === 0) {
        // Start a new timer
        const totalSeconds = timerMinutes * 60 + timerSeconds;
        if (totalSeconds > 0) {
          setTimerTotalSeconds(totalSeconds);
          setTimerIsRunning(true);
        }
      } else {
        // Toggle running state
        setTimerIsRunning(!timerIsRunning);
      }
    }
  };
  
  // Handle reset for stopwatch and timer
  const handleReset = () => {
    if (mode === 'stopwatch') {
      setStopwatchTime(0);
      setIsRunning(false);
    } else if (mode === 'timer') {
      setTimerTotalSeconds(0);
      setTimerIsRunning(false);
    }
  };
  
  // Increment timer settings
  const incrementTimer = (type: 'minutes' | 'seconds') => {
    if (type === 'minutes') {
      setTimerMinutes(prev => (prev < 59 ? prev + 1 : 0));
    } else {
      setTimerSeconds(prev => (prev < 59 ? prev + 1 : 0));
    }
  };
  
  // Decrement timer settings
  const decrementTimer = (type: 'minutes' | 'seconds') => {
    if (type === 'minutes') {
      setTimerMinutes(prev => (prev > 0 ? prev - 1 : 59));
    } else {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 59));
    }
  };
  
  // Create pan responder for dragging
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gesture) => {
      // Ensure the component stays within screen bounds
      let newX = gesture.moveX - 25;
      let newY = gesture.moveY - 25;
      
      if (newX < 0) newX = 0;
      if (newX > width - 80) newX = width - 80;
      if (newY < 50) newY = 50;
      if (newY > 600) newY = 600;
      
      position.setValue({ x: newX, y: newY });
    },
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y }
          ],
          width: expanded ? 200 : 60,
          height: expanded ? (mode === 'timer' && !timerIsRunning && timerTotalSeconds === 0 ? 180 : 120) : 60,
        },
      ]}
    >
      <View style={styles.handleContainer} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>
      
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Ionicons
          name={expanded ? 'chevron-down-outline' : 'chevron-up-outline'}
          size={16}
          color={COLORS.white}
        />
      </TouchableOpacity>
      
      {expanded ? (
        <View style={styles.expandedContent}>
          <TouchableOpacity style={styles.modeButton} onPress={switchMode}>
            <Text style={styles.modeButtonText}>
              {mode === 'clock' ? 'Clock' : mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.timeText}>{time}</Text>
          
          {mode !== 'clock' && (
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleStartStop}
              >
                <Ionicons
                  name={
                    (mode === 'stopwatch' && isRunning) ||
                    (mode === 'timer' && timerIsRunning)
                      ? 'pause'
                      : 'play'
                  }
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleReset}
              >
                <Ionicons name="refresh" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
          
          {mode === 'timer' && !timerIsRunning && timerTotalSeconds === 0 && (
            <View style={styles.timerSettings}>
              <View style={styles.timerControl}>
                <TouchableOpacity
                  onPress={() => incrementTimer('minutes')}
                >
                  <Ionicons name="chevron-up" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.timerValue}>
                  {timerMinutes.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity
                  onPress={() => decrementTimer('minutes')}
                >
                  <Ionicons name="chevron-down" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.timerSeparator}>:</Text>
              
              <View style={styles.timerControl}>
                <TouchableOpacity
                  onPress={() => incrementTimer('seconds')}
                >
                  <Ionicons name="chevron-up" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.timerValue}>
                  {timerSeconds.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity
                  onPress={() => decrementTimer('seconds')}
                >
                  <Ionicons name="chevron-down" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.timeText}>{time.substring(0, 5)}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusLg,
    ...SHADOWS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  },
  handleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  expandButton: {
    position: 'absolute',
    bottom: 5,
    width: 30,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  modeButton: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primaryDark,
    borderRadius: SIZES.borderRadiusSm,
    marginBottom: 5,
  },
  modeButtonText: {
    color: COLORS.white,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  timeText: {
    color: COLORS.white,
    fontSize: FONTS.h4,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  timerSettings: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerControl: {
    alignItems: 'center',
  },
  timerValue: {
    color: COLORS.white,
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  timerSeparator: {
    color: COLORS.white,
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
});

export default FloatingUtilityTool;
