import { describe, it, expect } from 'vitest';
import { normalizePriority, normalizeStatus, normalizeUuid } from './validation';

describe('validation utils', () => {
  it('normalizeUuid returns undefined for empty/meaningless values', () => {
    expect(normalizeUuid(undefined)).toBeUndefined();
    expect(normalizeUuid('')).toBeUndefined();
    expect(normalizeUuid('null')).toBeUndefined();
    expect(normalizeUuid('all')).toBeUndefined();
  });

  it('normalizeUuid returns __invalid__ for non-uuid', () => {
    expect(normalizeUuid('u_demo')).toBe('__invalid__');
    expect(normalizeUuid('123')).toBe('__invalid__');
  });

  it('normalizeUuid returns uuid if valid', () => {
    const id = '1035904b-ebdc-43af-bb8c-9c99710315ff';
    expect(normalizeUuid(id)).toBe(id);
  });

  it('normalizeStatus maps inProgress -> in_progress', () => {
    expect(normalizeStatus('inProgress')).toBe('in_progress');
    expect(normalizeStatus('IN_PROGRESS')).toBe('in_progress');
    expect(normalizeStatus('planned')).toBe('planned');
  });

  it('normalizeStatus returns undefined for invalid', () => {
    expect(normalizeStatus('bad')).toBeUndefined();
  });

  it('normalizePriority lowercases and validates', () => {
    expect(normalizePriority('HIGH')).toBe('high');
    expect(normalizePriority('medium')).toBe('medium');
    expect(normalizePriority('wrong')).toBeUndefined();
  });
});
