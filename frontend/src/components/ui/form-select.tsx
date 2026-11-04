'use client';

import { Children, Fragment, isValidElement, useEffect, useId, useRef, useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import styles from './tuition-select.module.css';

type FormSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'multiple' | 'size'>;
type Option = { value: string; label: ReactNode; text: string; disabled: boolean };

function optionText(node: ReactNode): string {
  return Children.toArray(node).map(child => isValidElement<{ children?: ReactNode }>(child)
    ? optionText(child.props.children) : String(child)).join('');
}

function readOptions(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>(child)) return [];
    if (child.type === Fragment) return readOptions(child.props.children);
    if (child.type !== 'option') return [];
    const text = optionText(child.props.children);
    return [{ value: String(child.props.value ?? text), label: child.props.children, text, disabled: !!child.props.disabled }];
  });
}

export function FormSelect({ children, value, defaultValue, onChange, className, id: suppliedId, disabled, required, name, autoComplete, onInvalid, ...props }: FormSelectProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const options = readOptions(children);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue === undefined ? undefined : String(defaultValue));
  const [invalid, setInvalid] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement>();
  const nativeRef = useRef<HTMLSelectElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedValue = String(value ?? uncontrolledValue ?? options[0]?.value ?? '');
  const placeholder = options.find(option => option.value === '')?.label ?? 'Choose an option';
  const errorId = `${id}-error`;

  useEffect(() => {
    const form = nativeRef.current?.form;
    const reset = () => { setUncontrolledValue(defaultValue === undefined ? undefined : String(defaultValue)); setInvalid(false); };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [defaultValue]);

  return <span className={styles.formField}>
    <select
      {...props}
      ref={nativeRef}
      id={`${id}-native`}
      name={name}
      autoComplete={autoComplete}
      value={selectedValue}
      disabled={disabled}
      required={required}
      aria-hidden="true"
      tabIndex={-1}
      className={styles.nativeSelect}
      onChange={event => onChange?.(event)}
      onInvalid={event => {
        onInvalid?.(event);
        event.preventDefault();
        setInvalid(true);
        triggerRef.current?.focus();
      }}
    >{children}</select>
    <Select.Root value={selectedValue} disabled={disabled} onOpenChange={open => {
      if (open) setPortalContainer(triggerRef.current?.closest('dialog') ?? undefined);
    }} onValueChange={nextValue => {
      setUncontrolledValue(nextValue);
      setInvalid(false);
      const native = nativeRef.current;
      if (native) {
        native.value = nextValue;
        native.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }}>
      <Select.Trigger
        ref={triggerRef}
        id={id}
        className={`${className ?? ''} ${styles.trigger} ${styles.compact}`}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        aria-describedby={[props['aria-describedby'], invalid ? errorId : ''].filter(Boolean).join(' ') || undefined}
        aria-invalid={invalid || props['aria-invalid']}
        aria-required={required}
        data-form-select=""
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.chevron}><ChevronDown aria-hidden="true" size={20} strokeWidth={1.8} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal container={portalContainer}>
        <Select.Content className={`${styles.menu} ${styles.compactMenu}`} position="popper" sideOffset={8} collisionPadding={12}>
          <Select.Viewport className={styles.viewport}>
            {options.filter(option => option.value !== '').map(option => <Select.Item key={option.value} value={option.value} textValue={option.text} disabled={option.disabled} className={`${styles.option} ${styles.compactOption}`}>
              <Select.ItemText><span className={styles.optionTitle}>{option.label}</span></Select.ItemText>
              <Select.ItemIndicator className={styles.check}><Check aria-hidden="true" size={18} strokeWidth={2} /></Select.ItemIndicator>
            </Select.Item>)}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    {invalid && <span id={errorId} role="alert" className={styles.validationError}>Choose an option.</span>}
  </span>;
}
