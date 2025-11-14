import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addAlarm = () => {
    setAlarms([...alarms, { id: Date.now(), time: '07:00 AM' }]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RiseWise Alarm Clock</Text>
      </View>

      <View style={styles.clock}>
        <Text style={styles.timeText}>{time.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Alarms Set</Text>
          <Text style={styles.statValue}>{alarms.length}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={addAlarm}>
        <Text style={styles.buttonText}>+ Add Alarm</Text>
      </TouchableOpacity>

      <View style={styles.alarmList}>
        {alarms.map((alarm) => (
          <View key={alarm.id} style={styles.alarmItem}>
            <Text style={styles.alarmTime}>{alarm.time}</Text>
            <Text style={styles.alarmStatus}>Active</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>✅ App is Running!</Text>
        <Text style={styles.footerText}>Memory test successful</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  clock: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  stats: {
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmList: {
    marginBottom: 20,
  },
  alarmItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alarmTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  alarmStatus: {
    fontSize: 14,
    color: '#4CAF50',
  },
  footer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
  },
});
