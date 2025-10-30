import { resultSuccess, resultError, Result } from '@j2blasco/ts-result';

// Test basic import
const success = resultSuccess(42);
console.log('Success result created:', success);

// Test error
const error = resultError.unknown('Something went wrong');
console.log('Error result created:', error);

// Test with custom type
interface User {
  name: string;
  age: number;
}

const userResult: Result<User, never> = resultSuccess({
  name: 'John',
  age: 30
});

console.log('User result:', userResult);

// Test andThen
const doubled = userResult.andThen((user: User) => 
  resultSuccess({ ...user, age: user.age * 2 })
);

console.log('Doubled age:', doubled);
