import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Vibration,
} from 'react-native';
import { useTheme } from '../hooks/useAlarms';
import { useAlarmContext } from '../context/AlarmContext';
import { Button, MinimalistClock } from '../components/Common';
import { MOTIVATIONAL_QUOTES } from '../types/constants';
import { mathUtils } from '../utils/helpers';

interface AlarmRingingScreenProps {
  navigation: any;
  route?: any;
}

interface MathChallenge {
  problem: string;
  answer: number;
}

export const AlarmRingingScreen: React.FC<AlarmRingingScreenProps> = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const { isDark, colors } = useTheme();
  const { alarms, dismissAlarm, snoozeAlarm, ringingAlarmId } = useAlarmContext();
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [opacityAnim] = useState(new Animated.Value(0.5));
  const [selectedSnooze, setSelectedSnooze] = useState<number | null>(null);
  const [dismissChallenge, setDismissChallenge] = useState<'none' | 'math' | 'shake'>('none');
  const [mathProblem, setMathProblem] = useState<MathChallenge | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [shakeCount, setShakeCount] = useState(0);
  const [quote, setQuote] = useState(
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );

  const isDarkMode = isDark || (colorScheme === 'dark');
  const currentColors = isDarkMode ? colors : colors;

  const currentAlarm = alarms.find((a) => a.id === ringingAlarmId);

  // Animate bell ringing
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Vibration
    if (currentAlarm?.vibrationEnabled) {
      Vibration.vibrate([0, 200, 100, 200], true);
    }

    return () => {
      Vibration.cancel();
    };
  }, [scaleAnim, opacityAnim, currentAlarm]);

  const handleDismiss = async () => {
    if (dismissChallenge === 'math' && mathProblem) {
      if (parseInt(mathAnswer) === mathProblem.answer) {
        dismissAlarm();
        navigation.goBack();
      } else {
        alert('Incorrect answer! Try again.');
        setMathAnswer('');
      }
      return;
    }

    if (dismissChallenge === 'shake') {
      if (shakeCount >= 10) {
        dismissAlarm();
        navigation.goBack();
      } else {
        alert(`Keep shaking! ${shakeCount}/10`);
      }
      return;
    }

    dismissAlarm();
    navigation.goBack();
  };

  const handleSnooze = async (minutes: number) => {
    if (ringingAlarmId) {
      await snoozeAlarm(ringingAlarmId, minutes);
      navigation.goBack();
    }
  };

  const startMathChallenge = () => {
    setDismissChallenge('math');
    setMathProblem(mathUtils.generateSimpleMathProblem());
    setMathAnswer('');
  };

  const startShakeChallenge = () => {
    setDismissChallenge('shake');
    setShakeCount(0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.content}>
        {/* Bell Animation */}
        <Animated.View
          style={[
            styles.bellContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.bell}>🔔</Text>
        </Animated.View>

        {/* Alarm Label */}
        {currentAlarm && (
          <Text style={[styles.alarmLabel, { color: currentColors.text }]}>
            {currentAlarm.label}
          </Text>
        )}

        {/* Time Display */}
        <View style={[styles.timeSection, { backgroundColor: currentColors.surface }]}>
          <MinimalistClock
            hours={new Date().getHours()}
            minutes={new Date().getMinutes()}
            seconds={new Date().getSeconds()}
            isDark={isDarkMode}
            format="12h"
          />
        </View>

        {/* Dismissal Challenge Options */}
        {dismissChallenge === 'none' && (
          <View style={styles.challengeOptions}>
            <Text style={[styles.optionsLabel, { color: currentColors.textSecondary }]}>
              Choose dismiss method:
            </Text>
            <Button
              title="Quick Dismiss"
              onPress={() => setDismissChallenge('none')}
              variant="primary"
              size="medium"
            />
            <Button
              title="Math Challenge"
              onPress={startMathChallenge}
              variant="secondary"
              size="medium"
            />
            <Button
              title="Shake Challenge"
              onPress={startShakeChallenge}
              variant="secondary"
              size="medium"
            />
          </View>
        )}

        {/* Math Challenge */}
        {dismissChallenge === 'math' && mathProblem && (
          <View style={[styles.challengeContainer, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.challengeTitle, { color: currentColors.text }]}>
              Solve this to dismiss:
            </Text>
            <Text style={[styles.mathProblem, { color: currentColors.primary }]}>
              {mathProblem.problem}
            </Text>
            <View
              style={[
                styles.mathInput,
                {
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.border,
                },
              ]}
            >
              <Text style={[styles.mathInputText, { color: currentColors.text }]}>
                {mathAnswer || 'Enter answer...'}
              </Text>
            </View>
            <View style={styles.numberPad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numberButton, { backgroundColor: currentColors.surface }]}
                  onPress={() => setMathAnswer((prev) => prev + num.toString())}
                >
                  <Text style={[styles.numberButtonText, { color: currentColors.primary }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.numberButton, { backgroundColor: '#FF4444' }]}
                onPress={() => setMathAnswer((prev) => prev.slice(0, -1))}
              >
                <Text style={styles.numberButtonText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Shake Challenge */}
        {dismissChallenge === 'shake' && (
          <View style={[styles.challengeContainer, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.challengeTitle, { color: currentColors.text }]}>
              Shake Your Phone!
            </Text>
            <Text style={[styles.shakeCount, { color: currentColors.primary }]}>
              {shakeCount}/10
            </Text>
            <View style={styles.shakeProgressBar}>
              <View
                style={[
                  styles.shakeProgressFill,
                  {
                    width: `${(shakeCount / 10) * 100}%`,
                    backgroundColor: currentColors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.shakeInstruction, { color: currentColors.textSecondary }]}>
              Keep shaking to reach 10! 📱
            </Text>
          </View>
        )}

        {/* Quote Display */}
        {dismissChallenge === 'none' && (
          <View style={[styles.quoteContainer, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.quoteText, { color: currentColors.text }]}>
              "{quote.text}"
            </Text>
            <Text style={[styles.quoteAuthor, { color: currentColors.textSecondary }]}>
              — {quote.author}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {dismissChallenge === 'none' && (
            <>
              {[5, 10, 15].map((minutes) => (
                <Button
                  key={minutes}
                  title={`Snooze ${minutes}m`}
                  onPress={() => handleSnooze(minutes)}
                  variant="secondary"
                  size="large"
                />
              ))}
            </>
          )}

          <Button
            title={
              dismissChallenge === 'math'
                ? 'Check Answer'
                : dismissChallenge === 'shake'
                  ? 'Stop & Dismiss'
                  : 'Dismiss'
            }
            onPress={handleDismiss}
            variant={dismissChallenge === 'none' ? 'danger' : 'primary'}
            size="large"
          />

          {dismissChallenge !== 'none' && (
            <Button
              title="Go Back"
              onPress={() => {
                setDismissChallenge('none');
                setMathAnswer('');
                setShakeCount(0);
              }}
              variant="secondary"
              size="large"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  bellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  bell: {
    fontSize: 120,
  },
  alarmLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  timeSection: {
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  challengeOptions: {
    marginVertical: 16,
    gap: 10,
  },
  optionsLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  challengeContainer: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  mathProblem: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  mathInput: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  mathInputText: {
    fontSize: 18,
    textAlign: 'center',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  shakeCount: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  shakeProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  shakeProgressFill: {
    height: '100%',
  },
  shakeInstruction: {
    fontSize: 16,
    textAlign: 'center',
  },
  quoteContainer: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
});
