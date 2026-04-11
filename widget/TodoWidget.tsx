import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { Todo } from '../types/todo';

export function TodoWidget({ todos }: { todos: Todo[] }) {
  const activeTodos = todos.filter((t: Todo) => !t.completed && !t.isArchived).slice(0, 3);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'column',
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TextWidget
          text="🎯 Remi Todo"
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#006EAF',
          }}
        />
      </FlexWidget>

      {activeTodos.length === 0 ? (
        <TextWidget
          text="All missions completed! ✨"
          style={{ fontSize: 14, color: '#666666', marginTop: 10 }}
        />
      ) : (
        activeTodos.map((todo, index) => (
          <FlexWidget 
            key={todo.id} 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingVertical: 8,
              borderBottomWidth: index === activeTodos.length -1 ? 0 : 1,
              borderBottomColor: '#EEEEEE'
            }}
          >
            <TextWidget
              text={`• ${todo.task}`}
              style={{ fontSize: 14, color: '#333333' }}
              maxLines={1}
            />
          </FlexWidget>
        ))
      )}

      {todos.length > 3 && (
        <TextWidget
          text={`+ ${todos.length - 3} more missions...`}
          style={{ fontSize: 12, color: '#006EAF', marginTop: 8, fontWeight: 'bold' }}
        />
      )}
      
      <FlexWidget style={{ flex: 1 }} />
      
      <FlexWidget style={{ flexDirection: 'row' }}>
        <FlexWidget 
          style={{ 
            flex: 1,
            backgroundColor: '#E6F4FE', 
            padding: 8, 
            borderRadius: 8,
            alignItems: 'center',
            marginRight: 8
          }}
          clickAction="ADD_TASK"
        >
          <TextWidget text="+ Add" style={{ color: '#006EAF', fontSize: 12, fontWeight: 'bold' }} />
        </FlexWidget>

        <FlexWidget 
          style={{ 
            flex: 2,
            backgroundColor: '#006EAF', 
            padding: 8, 
            borderRadius: 8,
            alignItems: 'center'
          }}
          clickAction="OPEN_APP"
        >
          <TextWidget text="Open App" style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }} />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
