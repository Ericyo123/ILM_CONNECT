'use client';

import { useId } from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import styles from './tuition-select.module.css';

export interface TuitionOption {
  value: string;
  label: string;
  description: string;
}

export function TuitionSelect({ label, value, options, onValueChange, fullWidth = false }: {
  label: string;
  value: string;
  options: TuitionOption[];
  onValueChange: (value: string) => void;
  fullWidth?: boolean;
}) {
  const id = useId();
  const selected = options.find(option => option.value === value);

  return <div className={`${styles.field} ${fullWidth ? styles.fullWidth : ''}`}>
    <label id={`${id}-label`} htmlFor={id} className={styles.label}>{label}</label>
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger id={id} aria-labelledby={`${id}-label ${id}-value`} aria-describedby={`${id}-description`} className={styles.trigger}>
        <Select.Value className={styles.value}>
          <span className={styles.valueText}>
            <span id={`${id}-value`} className={styles.valueTitle}>{selected?.label}</span>
            <span id={`${id}-description`} className={styles.description}>{selected?.description}</span>
          </span>
        </Select.Value>
        <Select.Icon className={styles.chevron}><ChevronDown aria-hidden="true" size={20} strokeWidth={1.8} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content aria-labelledby={`${id}-label`} className={styles.menu} position="popper" sideOffset={8} collisionPadding={16}>
          <Select.Viewport className={styles.viewport}>
            {options.map((option, index) => <Select.Item key={option.value} value={option.value} textValue={option.label} aria-describedby={`${id}-option-${index}`} className={styles.option}>
              <span className={styles.optionText}>
                <Select.ItemText><span className={styles.optionTitle}>{option.label}</span></Select.ItemText>
                <span id={`${id}-option-${index}`} className={styles.description}>{option.description}</span>
              </span>
              <Select.ItemIndicator className={styles.check}><Check aria-hidden="true" size={18} strokeWidth={2} /></Select.ItemIndicator>
            </Select.Item>)}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>;
}
