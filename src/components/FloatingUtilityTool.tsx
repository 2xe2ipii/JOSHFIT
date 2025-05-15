import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';
import DraggableView from './DraggableView';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type UtilityMode = 'clock' | 'timer' | 'stopwatch';

const { width, height } = Dimensions.get('window');

const FloatingUtilityTool: React.FC = () => {
  const [mode, setMode] = useState<UtilityMode>('clock');
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState('00:00:00');
    // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  // Format time for display
  const formatTime = (totalSeconds: number, ms: number = 0, includeMs: boolean = false): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const baseTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return includeMs ? `${baseTime}.${ms.toString().padStart(3, '0')}` : baseTime;
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
  useEffect(() => {
    let intervalMs: NodeJS.Timeout;
    let intervalSec: NodeJS.Timeout;
    
    if (mode === 'stopwatch' && isRunning) {
      intervalMs = setInterval(() => {
        setMilliseconds(prev => {
          if (prev >= 999) {
            return 0;
          }
          return prev + 10;
        });
      }, 10);

      intervalSec = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalMs) clearInterval(intervalMs);
      if (intervalSec) clearInterval(intervalSec);
    };
  }, [mode, isRunning]);

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
  useEffect(() => {
    if (mode === 'stopwatch') {
      setTime(formatTime(stopwatchTime, milliseconds, true));
    } else if (mode === 'timer') {
      setTime(formatTime(timerTotalSeconds));
    }
  }, [mode, stopwatchTime, milliseconds, timerTotalSeconds]);

  // Handle mode switching
  const switchMode = () => {
    if (mode === 'clock') {
      setMode('stopwatch');
    } else if (mode === 'stopwatch') {
      setMode('timer');
      setStopwatchTime(0);
      setIsRunning(false);
    } else {
      setMode('clock');
      setTimerTotalSeconds(0);
      setTimerIsRunning(false);
      setTimerMinutes(0);
      setTimerSeconds(0);
    }
  };

  const handleStartStop = () => {
    if (mode === 'stopwatch') {
      setIsRunning(!isRunning);
    } else if (mode === 'timer') {
      if (!timerIsRunning && timerTotalSeconds === 0) {
        const totalSeconds = timerMinutes * 60 + timerSeconds;
        if (totalSeconds > 0) {
          setTimerTotalSeconds(totalSeconds);
          setTimerIsRunning(true);
        }
      } else {
        setTimerIsRunning(!timerIsRunning);
      }
    }
  };
  const handleReset = () => {
    if (mode === 'stopwatch') {
      setStopwatchTime(0);
      setMilliseconds(0);
      setIsRunning(false);
    } else if (mode === 'timer') {
      setTimerTotalSeconds(0);
      setTimerIsRunning(false);
    }
  };

  const incrementTimer = (type: 'minutes' | 'seconds') => {
    if (type === 'minutes') {
      setTimerMinutes(prev => (prev < 59 ? prev + 1 : 0));
    } else {
      setTimerSeconds(prev => (prev < 59 ? prev + 1 : 0));
    }
  };

  const decrementTimer = (type: 'minutes' | 'seconds') => {
    if (type === 'minutes') {
      setTimerMinutes(prev => (prev > 0 ? prev - 1 : 59));
    } else {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 59));
    }
  };

  const handleExpand = () => {
    LayoutAnimation.configureNext({
      duration: 200,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
    });
    setExpanded(!expanded);
  };

  return (    <DraggableView
      initialPosition={{ x: width - 100, y: 100 }}
      maxX={width}
      maxY={height - 100}      style={{
        ...styles.container,
        width: expanded ? 240 : 80,
        height: expanded ? (mode === 'timer' && !timerIsRunning && timerTotalSeconds === 0 ? 280 : 160) : 80,
      }}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handleExpand}
        activeOpacity={0.9}
      >
        {expanded ? (
          <>
            <TouchableOpacity style={styles.modeButton} onPress={switchMode}>
              <Ionicons 
                name={
                  mode === 'clock' 
                    ? 'time-outline' 
                    : mode === 'stopwatch' 
                    ? 'stopwatch-outline' 
                    : 'timer-outline'
                } 
                size={24} 
                color={COLORS.white} 
              />
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
                    size={24}
                    color={COLORS.white}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleReset}
                >
                  <Ionicons name="refresh" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            )}

            {mode === 'timer' && !timerIsRunning && timerTotalSeconds === 0 && (
              <View style={styles.timerSettings}>
                <View style={styles.timerControl}>
                  <TouchableOpacity onPress={() => incrementTimer('minutes')}>
                    <Ionicons name="chevron-up" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <Text style={styles.timerValue}>
                    {timerMinutes.toString().padStart(2, '0')}
                  </Text>
                  <TouchableOpacity onPress={() => decrementTimer('minutes')}>
                    <Ionicons name="chevron-down" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.timerSeparator}>:</Text>

                <View style={styles.timerControl}>
                  <TouchableOpacity onPress={() => incrementTimer('seconds')}>
                    <Ionicons name="chevron-up" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <Text style={styles.timerValue}>
                    {timerSeconds.toString().padStart(2, '0')}
                  </Text>
                  <TouchableOpacity onPress={() => decrementTimer('seconds')}>
                    <Ionicons name="chevron-down" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (          <View style={styles.collapsedContent}>
            <Ionicons 
              name={
                mode === 'clock' 
                  ? 'time-outline' 
                  : mode === 'stopwatch' 
                  ? 'stopwatch-outline' 
                  : 'timer-outline'
              } 
              size={24} 
              color={COLORS.white} 
            />
            <Text style={styles.collapsedTimeText}>
              {mode === 'stopwatch' 
                ? `${String(Math.floor(stopwatchTime / 60)).padStart(2, '0')}:${String(stopwatchTime % 60).padStart(2, '0')}`
                : time.substring(0, 5)}
            </Text>
            {mode === 'stopwatch' && isRunning && (
              <Text style={styles.collapsedMilliseconds}>
                .{milliseconds.toString().padStart(3, '0')}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </DraggableView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    ...SHADOWS.large,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.md,
  },
  collapsedContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modeButtonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: '600',
    marginLeft: 8,
  },
  timeText: {
    color: COLORS.white,
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },  collapsedTimeText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: 'bold',
    marginTop: 4,
  },
  collapsedMilliseconds: {
    color: COLORS.white,
    fontSize: FONTS.small,
    fontWeight: '500',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    padding: 12,
  },
  timerControl: {
    alignItems: 'center',
  },
  timerValue: {
    color: COLORS.white,
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  timerSeparator: {
    color: COLORS.white,
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default FloatingUtilityTool;
