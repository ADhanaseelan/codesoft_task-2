import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { useCurrentTime, useTheme } from '../hooks/useAlarms';
import { useAlarmContext } from '../context/AlarmContext';
import { DigitalClock, MinimalistClock, FloatingButton, AlarmCard } from '../components/Common';
import { timeUtils, alarmUtils } from '../utils/helpers';
import { useFocusEffect } from '@react-navigation/native';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { time, hours, minutes, seconds, date } = useCurrentTime();
  const { isDark, colors } = useTheme();
  const { alarms, preferences, currentQuote, getRandomQuote } = useAlarmContext();
  const [nextAlarm, setNextAlarm] = useState<any>(null);
  const [activeAlarmsCount, setActiveAlarmsCount] = useState(0);

  // Update every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      updateAlarmInfo();
      getRandomQuote();
    }, [alarms])
  );

  useEffect(() => {
    updateAlarmInfo();
  }, [alarms]);

  const updateAlarmInfo = () => {
    const nextAl = timeUtils.getNextAlarmTime(alarms);
    setNextAlarm(nextAl);
    setActiveAlarmsCount(alarmUtils.getActiveAlarmsCount(alarms));
  };

  const handleAddAlarm = () => {
    navigation.navigate('AlarmCreation');
  };

  const handleEditAlarm = (alarm: any) => {
    navigation.navigate('AlarmCreation', { alarm });
  };

  const handleDeleteAlarm = (alarmId: string) => {
    const { deleteAlarm } = useAlarmContext();
    deleteAlarm(alarmId);
  };

  const handleToggleAlarm = (alarmId: string, newStatus: boolean) => {
    const { toggleAlarmStatus } = useAlarmContext();
    toggleAlarmStatus(alarmId, newStatus);
  };

  const isDarkMode = isDark || (colorScheme === 'dark');
  const currentColors = isDarkMode ? colors : colors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>RiseWise</Text>
          <Text style={[styles.headerSubtitle, { color: currentColors.textSecondary }]}>
            Smart Alarm Clock
          </Text>
        </View>

        {/* Current Time Display */}
        {preferences.clockStyle === 'digital' && (
          <DigitalClock hours={hours} minutes={minutes} seconds={seconds} isDark={isDarkMode} />
        )}
        {preferences.clockStyle === 'minimalist' && (
          <MinimalistClock hours={hours} minutes={minutes} seconds={seconds} isDark={isDarkMode} format="12h" />
        )}

        {/* Date */}
        <Text style={[styles.dateText, { color: currentColors.textSecondary }]}>{date}</Text>

        {/* Next Alarm Card */}
        {nextAlarm && (
          <View style={[styles.nextAlarmCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
            <View style={styles.nextAlarmIcon}>
              <Text style={styles.nextAlarmIconText}>🔔</Text>
            </View>
            <View style={styles.nextAlarmInfo}>
              <Text style={[styles.nextAlarmLabel, { color: currentColors.textSecondary }]}>
                Next Alarm
              </Text>
              <Text style={[styles.nextAlarmTime, { color: currentColors.text }]}>
                {nextAlarm.time} • {nextAlarm.label || 'No Label'}
              </Text>
            </View>
          </View>
        )}

        {/* Motivational Quote */}
        {preferences.enableMotivationalQuotes && (
          <View style={[styles.quoteCard, { backgroundColor: currentColors.surface, borderColor: currentColors.primary }]}>
            <Text style={[styles.quoteText, { color: currentColors.text }]}>
              "{currentQuote.text}"
            </Text>
            <Text style={[styles.quoteAuthor, { color: currentColors.textSecondary }]}>
              — {currentQuote.author}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.statNumber, { color: currentColors.primary }]}>
              {activeAlarmsCount}
            </Text>
            <Text style={[styles.statLabel, { color: currentColors.textSecondary }]}>
              Active Alarms
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: currentColors.surface }]}>
            <Text style={[styles.statNumber, { color: currentColors.success }]}>
              {alarms.length}
            </Text>
            <Text style={[styles.statLabel, { color: currentColors.textSecondary }]}>
              Total Alarms
            </Text>
          </View>
        </View>

        {/* Upcoming Alarms Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            Upcoming Alarms
          </Text>

          {alarms.length === 0 ? (
            <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>
              No alarms yet. Create your first alarm! ✨
            </Text>
          ) : (
            <FlatList
              data={alarmUtils.sortAlarmsByTime(alarms)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <AlarmCard
                  time={item.time}
                  label={item.label}
                  isActive={item.isActive}
                  repeatDays={item.repeatDays}
                  onToggle={(newStatus) => handleToggleAlarm(item.id, newStatus)}
                  onEdit={() => handleEditAlarm(item)}
                  onDelete={() => handleDeleteAlarm(item.id)}
                  isDark={isDarkMode}
                />
              )}
            />
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingButton onPress={handleAddAlarm} icon="+" color={currentColors.primary} size="large" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  nextAlarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  nextAlarmIcon: {
    marginRight: 12,
  },
  nextAlarmIconText: {
    fontSize: 32,
  },
  nextAlarmInfo: {
    flex: 1,
  },
  nextAlarmLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  nextAlarmTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  quoteCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  quoteAuthor: {
    fontSize: 12,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
  bottomPadding: {
    height: 80,
  },
});
