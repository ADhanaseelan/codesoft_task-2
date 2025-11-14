import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useTheme } from '../hooks/useAlarms';
import { useAlarmContext } from '../context/AlarmContext';
import { Button } from '../components/Common';
import { UserPreferences } from '../types/alarm';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { isDark, colors } = useTheme();
  const { preferences, updatePreferences } = useAlarmContext();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const isDarkMode = isDark || (colorScheme === 'dark');
  const currentColors = isDarkMode ? colors : colors;

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    const updated = { ...localPrefs, theme };
    setLocalPrefs(updated);
    await updatePreferences(updated);
  };

  const handleClockStyleChange = async (style: 'digital' | 'analog' | 'minimalist') => {
    const updated = { ...localPrefs, clockStyle: style };
    setLocalPrefs(updated);
    await updatePreferences(updated);
  };

  const handleSnoozeDurationChange = async (duration: number) => {
    const updated = { ...localPrefs, snoozeDuration: duration };
    setLocalPrefs(updated);
    await updatePreferences(updated);
  };

  const handleToggleFeature = async (feature: keyof UserPreferences, value: boolean) => {
    const updated = { ...localPrefs, [feature]: value };
    setLocalPrefs(updated);
    await updatePreferences(updated);
  };

  const SettingSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>{title}</Text>
      {children}
    </View>
  );

  const OptionButton = ({ label, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        {
          backgroundColor: isActive ? currentColors.primary : currentColors.surface,
          borderColor: currentColors.border,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionButtonText,
          {
            color: isActive ? '#ffffff' : currentColors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerButton, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Theme Settings */}
        <SettingSection title="Theme">
          <View style={styles.optionsRow}>
            <OptionButton
              label="Light"
              isActive={localPrefs.theme === 'light'}
              onPress={() => handleThemeChange('light')}
            />
            <OptionButton
              label="Dark"
              isActive={localPrefs.theme === 'dark'}
              onPress={() => handleThemeChange('dark')}
            />
            <OptionButton
              label="Auto"
              isActive={localPrefs.theme === 'auto'}
              onPress={() => handleThemeChange('auto')}
            />
          </View>
        </SettingSection>

        {/* Clock Style */}
        <SettingSection title="Clock Style">
          <View style={styles.optionsRow}>
            <OptionButton
              label="Digital"
              isActive={localPrefs.clockStyle === 'digital'}
              onPress={() => handleClockStyleChange('digital')}
            />
            <OptionButton
              label="Minimalist"
              isActive={localPrefs.clockStyle === 'minimalist'}
              onPress={() => handleClockStyleChange('minimalist')}
            />
          </View>
        </SettingSection>

        {/* Snooze Duration */}
        <SettingSection title="Default Snooze Duration">
          <View style={styles.optionsRow}>
            {[5, 10, 15].map((duration) => (
              <OptionButton
                key={duration}
                label={`${duration}m`}
                isActive={localPrefs.snoozeDuration === duration}
                onPress={() => handleSnoozeDurationChange(duration)}
              />
            ))}
          </View>
        </SettingSection>

        {/* Features */}
        <SettingSection title="Features">
          <View
            style={[
              styles.featureToggle,
              { backgroundColor: currentColors.surface, borderColor: currentColors.border },
            ]}
          >
            <Text style={[styles.featureLabel, { color: currentColors.text }]}>
              Adaptive Wake Mode
            </Text>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: localPrefs.enableAdaptiveWake ? '#51cf66' : currentColors.border,
                },
              ]}
              onPress={() =>
                handleToggleFeature('enableAdaptiveWake', !localPrefs.enableAdaptiveWake)
              }
            >
              <View
                style={[
                  styles.switchThumb,
                  {
                    alignSelf: localPrefs.enableAdaptiveWake ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.featureToggle,
              { backgroundColor: currentColors.surface, borderColor: currentColors.border },
            ]}
          >
            <Text style={[styles.featureLabel, { color: currentColors.text }]}>
              Motivational Quotes
            </Text>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: localPrefs.enableMotivationalQuotes
                    ? '#51cf66'
                    : currentColors.border,
                },
              ]}
              onPress={() =>
                handleToggleFeature(
                  'enableMotivationalQuotes',
                  !localPrefs.enableMotivationalQuotes
                )
              }
            >
              <View
                style={[
                  styles.switchThumb,
                  {
                    alignSelf: localPrefs.enableMotivationalQuotes ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.featureToggle,
              { backgroundColor: currentColors.surface, borderColor: currentColors.border },
            ]}
          >
            <Text style={[styles.featureLabel, { color: currentColors.text }]}>
              Weather Display
            </Text>
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: localPrefs.enableWeatherDisplay ? '#51cf66' : currentColors.border,
                },
              ]}
              onPress={() =>
                handleToggleFeature('enableWeatherDisplay', !localPrefs.enableWeatherDisplay)
              }
            >
              <View
                style={[
                  styles.switchThumb,
                  {
                    alignSelf: localPrefs.enableWeatherDisplay ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: currentColors.surface, borderColor: currentColors.border },
            ]}
          >
            <Text style={[styles.aboutTitle, { color: currentColors.text }]}>RiseWise</Text>
            <Text style={[styles.aboutVersion, { color: currentColors.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.aboutDescription, { color: currentColors.textSecondary }]}>
              Smart Alarm Clock with Adaptive Wake Features
            </Text>
            <Text style={[styles.aboutCopyright, { color: currentColors.textSecondary }]}>
              © 2025 RiseWise. All rights reserved.
            </Text>
          </View>
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featureToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleSwitch: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  aboutCard: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 12,
    marginBottom: 8,
  },
  aboutDescription: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  aboutCopyright: {
    fontSize: 11,
  },
});
