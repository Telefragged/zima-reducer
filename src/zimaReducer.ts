import { useReducer } from 'react';

type GetArguments<F extends Function> = F extends (...args: infer A) => any ? A : never;

type CheckDispatchSignature<T, S> = T extends (state: S, ...args: any[]) => S ? T : never;

type WithDispatchSignature<T, S> = { [P in keyof T]: T[P] extends (state: S, ...args: infer A) => unknown ? (...args: A) => void : never; }

type ActionReducer<S> = {
    reduce: (state: S) => S
}

function zimaReducer<
    S,
    T extends {
        [P in keyof T]: CheckDispatchSignature<T[P], S>
    }>(obj: T, initialState: S): [S, WithDispatchSignature<T, S>] {
    const reducerFunction = (state: S, action: ActionReducer<S>) => action.reduce(state);

    const [state, dispatch] = useReducer(reducerFunction, initialState);

    const actionDispatcher: any = {};

    for (const k in obj) {
        if(!obj.hasOwnProperty(k)) {
            continue;
        }
        const reduceFn = (obj as any)[k] as T[keyof T];
        type arguments = GetArguments<typeof reduceFn>;
        actionDispatcher[k] = (...args: arguments) => {
            const reducerObject = {
                reduce: (state: S) => reduceFn(state, ...args)
            }

            dispatch(reducerObject);
        }
    }

    return [state, actionDispatcher] as [S, WithDispatchSignature<T, S>];
}

export default zimaReducer;