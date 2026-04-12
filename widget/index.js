import React from 'react';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { TodoWidget } from './TodoWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_app_data';

async function getTodos() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
}

export async function widgetTaskHandler(props) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      try {
        const todos = await getTodos();
        props.renderWidget(<TodoWidget todos={todos} />);
      } catch (e) {
        props.renderWidget(<TodoWidget todos={[]} />);
      }
      break;

    case 'OPEN_APP':
      props.clickActionProps.openApp();
      break;

    case 'ADD_TASK':
      props.clickActionProps.openApp({
        uri: 'remi-todo:///new-task'
      });
      break;

    default:
      break;
  }
}

registerWidgetTaskHandler(widgetTaskHandler);
