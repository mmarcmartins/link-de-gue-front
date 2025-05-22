import { useCallback, useEffect, useRef, useState } from "react";

export function useControlledState<T,C = T>({
    value,
    defaultValue,
    onChange
} : {
    value: Exclude<T, undefined>,
    defaultValue?: T,
    onChange?: (v: C, ...args: unknown[]) => void
}): [T, (value: T) => void];

export function useControlledState<T,C = T>({
    value,
    defaultValue,
    onChange
} : {
    value?: T,
    defaultValue: Exclude<T, undefined>,
    onChange?: (v: C, ...args: unknown[]) => void
}): [T, (value: T) => void];

export function useControlledState<T,C = T>({
    value,
    defaultValue,
    onChange
}: {
    value?: T,
    defaultValue?: T,
    onChange?: (v: C, ...args: unknown[]) => void
}): [T, (value: T) => void] {
    if (defaultValue === undefined && value === undefined) {
        throw new Error('Either value or defaultValue must be provided');
    }

    const initialValue = value ?? defaultValue;
    if (initialValue === undefined) {
        throw new Error('Either value or defaultValue must be provided');
    }

    const [stateValue, setStateValue] = useState<T>(initialValue);
    const isControlledRef = useRef(value !== undefined);
    const isControlled = value !== undefined;
    const currentValueRef = useRef<T>(isControlled ? value! : stateValue);

    useEffect(() => {
        const wasControlled = isControlledRef.current;
        if(wasControlled !== isControlled){
            console.warn(`WARN: A component changed from ${wasControlled ? 'controlled' : 'uncontrolled'} to 
            ${isControlled ? 'controlled': 'uncontrolled'}.`)
        }
        isControlledRef.current = isControlled;
        currentValueRef.current = isControlled ? value! : stateValue;
    }, [isControlled, value, stateValue])

    const setValue = useCallback((newValue: T, ...args: unknown[]) => {
        const onChangeCaller = (v: T, ...onChangeArgs: unknown[]) => {
            if(onChange){
                if(!Object.is(currentValueRef.current, v)){                    
                    onChange(v as unknown as C, ...onChangeArgs);
                }

                if(!isControlled){
                    currentValueRef.current = v;
                }
            }
            
            if(!isControlled){
                setStateValue(v);
            }
        }

        onChangeCaller(newValue, ...args)
        
    }, [isControlled, onChange])

    return [currentValueRef.current, setValue]
}