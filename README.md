# zima-reducer

zima-reducer extends React's `useReducer` hook by uniting the action types with the reduce function whilst providing an intuitive interface to call the dispatch method.

# Example

Consider the following component:

```typescript
import * as React from 'react';

type State = {
    value: number;
    enabled: boolean;
}

type ChangeValueAction = {
    kind: 'changeValue';
    value?: number;
}

type ToggleAction = {
    kind: 'toggle';
}

type Action = ChangeValueAction | ToggleAction;

function reducer(state: State, action: Action) {
    switch (action.kind) {
        case 'changeValue':
            return { ...state, value: action.value || 0 };
        case 'toggle':
            return { ...state, enabled: !state.enabled };
        default:
            return state;
    }
}

export const ExampleComponent: React.FunctionComponent = () => {
    const [state, dispatch] = React.useReducer(reducer, { value: 1, enabled: false } as State);

    return (<>
        <input
            disabled={!state.enabled}
            type='number'
            value={state.value}
            onChange={(evt) => dispatch({ kind: 'changeValue', value: evt.target.valueAsNumber })} />
        <button onClick={() => dispatch({ kind: 'toggle' })}>{state.enabled ? 'Disable' : 'Enable'}</button>
    </>)
};
```

Using zima-reducer this can be rewritten:

```typescript
import * as React from 'react';
import zimaReducer from 'zima-reducer';

type State = {
    value: number;
    enabled: boolean;
}

const actions = {
    changeValue: (state: State, value?: number) => ({ ...state, value: value || 0 }),
    toggle: (state: State) => ({ ...state, enabled: !state.enabled })
}

export const ExampleComponent: React.FunctionComponent = () => {
    const [state, dispatch] = zimaReducer(actions, { value: 1, enabled: false } as State);

    return (<>
        <input
            disabled={!state.enabled}
            type='number'
            value={state.value}
            onChange={(evt) => dispatch.changeValue(evt.target.valueAsNumber)} />
        <button onClick={() => dispatch.toggle()}>{state.enabled ? 'Disable' : 'Enable'}</button>
    </>)
};
```

The zima-reducer variant improves legibility and maintainability, reduces boilerplate and eliminates the possibility of forgetting cases in the switch-clause.
