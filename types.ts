import React from 'react';

export enum LessonType {
  INTRO = 'INTRO',
  HELLO_WORLD = 'HELLO_WORLD',
  SELECTORS = 'SELECTORS',
  VARIABLES = 'VARIABLES',
  SYNTAX = 'SYNTAX',
  CHURCH_NUMERALS = 'CHURCH_NUMERALS',
  PAIRS = 'PAIRS',
  LOGIC = 'LOGIC',
  RECURSION = 'RECURSION',
  HISTORY = 'HISTORY',
  PLAYGROUND = 'PLAYGROUND',
}

export interface LessonStep {
  id: string;
  expression: string;
  explanation: string;
  steps: {
    before: string;
    action: string;
    after: string;
  }[];
}

export interface LessonContent {
  title: string;
  type: LessonType;
  content: React.ReactNode;
  interactive?: LessonStep;
}