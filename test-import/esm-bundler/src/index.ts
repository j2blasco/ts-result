import { resultSuccess, resultError, Result } from '@j2blasco/ts-result';

console.log('=== ESM Test ===\n');

// Test basic import
const success = resultSuccess(42);
console.log('[ESM] Success result created:', success);

// Test error
const error = resultError.unknown('Something went wrong');
console.log('[ESM] Error result created:', error);

// Test with custom type
interface User {
  name: string;
  age: number;
}

const userResult: Result<User, never> = resultSuccess({
  name: 'John (ESM)',
  age: 30
});

console.log('[ESM] User result:', userResult);

// Test andThen
const doubled = userResult.andThen((user: User) => 
  resultSuccess({ ...user, age: user.age * 2 })
);

console.log('[ESM] Doubled age:', doubled);
