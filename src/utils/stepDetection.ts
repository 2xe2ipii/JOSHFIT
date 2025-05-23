import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';
// Step detection parameters
const STEP_THRESHOLD = 1.2; // Minimum acceleration magnitude to count as a step
const STEP_DELAY = 1500; // Minimum time (ms) between steps to avoid counting bounces and reduce update frequency
const SAMPLE_RATE = 200; // Sample rate in milliseconds
// Interface for step detection callbacks
export interface StepDetectionCallbacks {
  onStepDetected: (steps: number) => void;
  onError: (error: any) => void;
}
// Class to handle step detection using accelerometer
export class StepDetector {
  private subscription: any = null;
  private lastStepTime: number = 0;
  private stepCount: number = 0;
  private lastMagnitude: number = 0;
  private isMonitoring: boolean = false;
  private callbacks: StepDetectionCallbacks;
  constructor(callbacks: StepDetectionCallbacks) {
    this.callbacks = callbacks;
  }
  // Start monitoring for steps
  public startMonitoring(initialSteps: number = 0): void {
    if (this.isMonitoring) return;
    this.stepCount = initialSteps;
    this.lastStepTime = Date.now();
    this.isMonitoring = true;
    // Configure accelerometer
    Accelerometer.setUpdateInterval(SAMPLE_RATE);
    // Subscribe to accelerometer updates
    this.subscription = Accelerometer.addListener(accelerometerData => {
      this.processAccelerometerData(accelerometerData);
    });
    console.log('Step detector started monitoring');
  }
  // Stop monitoring for steps
  public stopMonitoring(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isMonitoring = false;
    console.log('Step detector stopped monitoring');
  }
  // Process accelerometer data to detect steps
  private processAccelerometerData(data: { x: number; y: number; z: number }): void {
    try {
      // Calculate magnitude of acceleration vector (removing gravity)
      const magnitude = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
      );
      // Detect step using peak detection algorithm
      const currentTime = Date.now();
      const timeDiff = currentTime - this.lastStepTime;
      // Check if we have a peak that exceeds the threshold
      if (magnitude > STEP_THRESHOLD && 
          magnitude > this.lastMagnitude && 
          timeDiff > STEP_DELAY) {
        // Increment step count
        this.stepCount++;
        this.lastStepTime = currentTime;
        // Notify callback
        this.callbacks.onStepDetected(1); // We detected 1 new step
        console.log(`Step detected! Total: ${this.stepCount}`);
      }
      // Store current magnitude for next comparison
      this.lastMagnitude = magnitude;
    } catch (error) {
      this.callbacks.onError(error);
    }
  }
  // Get current step count
  public getStepCount(): number {
    return this.stepCount;
  }
  // Reset step count
  public resetStepCount(newCount: number = 0): void {
    this.stepCount = newCount;
  }
  // Check if the step detector is currently monitoring
  public isActive(): boolean {
    return this.isMonitoring;
  }
}
// Factory function to create the appropriate step detector for the platform
export const createStepDetector = (callbacks: StepDetectionCallbacks): StepDetector => {
  return new StepDetector(callbacks);
};

