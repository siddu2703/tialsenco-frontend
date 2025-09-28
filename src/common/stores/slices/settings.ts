/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsLevel = 'company' | 'group' | 'client';

interface ActiveSettings {
  name: string;
  level: SettingsLevel;
}

interface SettingsState {
  colors: {
    primary: string;
    secondary?: string;
  };
  darkMode: boolean;
  activeSettings: ActiveSettings;
}

const initialState: SettingsState = {
  colors: {
    primary: '#117DC0',
  },
  darkMode: false,
  activeSettings: {
    name: '',
    level: 'company',
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updatePrimaryColor: (state, action: PayloadAction<{ color: string }>) => {
      state.colors.primary = action.payload.color;
    },
    setDarkMode: (state, action: PayloadAction<{ status: boolean }>) => {
      state.darkMode = action.payload.status;
    },
    setActiveSettings: (
      state,
      action: PayloadAction<{ status: ActiveSettings }>
    ) => {
      state.activeSettings = action.payload.status;
    },
  },
});

export const { updatePrimaryColor, setDarkMode, setActiveSettings } =
  settingsSlice.actions;
