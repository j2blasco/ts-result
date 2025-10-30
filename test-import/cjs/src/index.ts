import { resultSuccess, resultError, Result } from '@j2blasco/ts-result';

console.log('=== CommonJS Test ===\n');

// Test basic import
const success = resultSuccess(42);
console.log('[CJS] Success result created:', success);

// Test error
const error = resultError.unknown('Something went wrong');
console.log('[CJS] Error result created:', error);

// Test with custom type
interface User {
  name: string;
  age: number;
}

const userResult: Result<User, never> = resultSuccess({
  name: 'Jane (CJS)',
  age: 25
});

console.log('[CJS] User result:', userResult);

// Test andThen
const doubled = userResult.andThen((user: User) => 
  resultSuccess({ ...user, age: user.age * 2 })
);

console.log('[CJS] Doubled age:', doubled);
