import * as React from 'react';
import '@testing-library/jest-dom';

// Polyfill TextEncoder for Node.js environment
import { TextEncoder } from 'util';

// Polyfill TextEncoder for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// Polyfill TextDecoder for Node.js environment
if (typeof global.TextDecoder === 'undefined') {
  // Use a minimal shim for TextDecoder to avoid type errors
  class TextDecoderShim {
    decode(input?: BufferSource) {
      if (input instanceof Uint8Array) {
        return Buffer.from(input).toString('utf-8');
      }
      if (input instanceof ArrayBuffer) {
        return Buffer.from(new Uint8Array(input)).toString('utf-8');
      }
      return '';
    }
  }
  // Use a type-safe cast instead of 'as any'
  global.TextDecoder = TextDecoderShim as unknown as typeof TextDecoder;
}

// Polyfill Request for Node.js environment
global.Request = class Request {
  constructor() {
    return {};
  }
} as unknown as typeof Request;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'ref'> & {
      priority?: boolean;
    }
  ) => {
    // Omit 'priority' prop if present, pass the rest to <img>
    // This avoids type errors since 'priority' is not in ImgHTMLAttributes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...imgProps } = props || {};
    return React.createElement('img', imgProps);
  },
}));
// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: React.PropsWithChildren<
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >) => {
    return React.createElement('a', props, children);
  },
}));

// Mock auth
jest.mock('@/auth', () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock query-string to avoid ES module issues
jest.mock('query-string', () => ({
  parse: jest.fn(),
  stringify: jest.fn(),
}));

// Mock bcrypt-ts-edge to avoid ES module issues
jest.mock('bcrypt-ts-edge', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

// Mock your custom Prisma client
jest.mock('@/db/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    cart: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// Global test environment setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
