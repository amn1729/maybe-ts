# Maybe monad for TS
Inspired from Haskell's Maybe and Rust's Option type

## Upstream URL
https://codeberg.org/anhsirk0/maybe-ts

## Types and functions
### type Just`<T>`
  - value: T
  - _type: "just"

### type Nothing
  - _type: "nothing"

### type Maybe`<T>`
  - value: Just`<T>` | Nothing
  - run: RunOnMaybe`<T>`
  - get: GetOnMaybe`<T>`
  - unwrap: () => T
  - unwrapExpect: (msg: string) => T
  - unwrapOr: (fallback: T) => T
  - isJust: () => boolean
  - isNothing: () => boolean

### Maybe.value
can be `Just<T>` or `Nothing`

### Maybe.run `<U>(fn: (val: T) => U) => Maybe<NonNullable<U>>`
run / transform function on Maybe  
A function to run on the `value` of the `Maybe`  
Returns Maybe of the returned value type from the function
Example:
```ts
type User = { name: string; age: number; };
let ben: Maybe<User> = toMaybe<User>({ name: "Ben" age: 10 });
let benWithDoubleAge: Maybe<User> = ben.run(b => { ...b, age: b.age * 2 });
let finalAge: Maybe<number> = benWithDoubleAge.run(b => b.age);
let finalAgeValue: number = finalAge.unwrapOr(0); //=> 20 or 0;
```

### Maybe.get `<U extends NonNullable<T[K]>, K extends keyof T>(key: K) => Maybe<U>`
get function on Maybe (for the Record type)  
get a Property of the `value` of `Maybe`  
Returns Maybe of the returned prop type of the key
Example:
```ts
type User = { name: string; age: number; };
let ben: Maybe<User> = toMaybe<User>({ name: "Ben" age: 10 });
let benWithDoubleAge: Maybe<User> = ben.run(b => { ...b, age: b.age * 2 });
let finalAge: Maybe<number> = benWithDoubleAge.get("age");
let finalAgeValue: number = finalAge.unwrapOr(0); //=> 20 or 0;
```

### Maybe.unwrap `() => T`
unwrap the value of the `Maybe`  
throws Error if the Maybe is of type Nothing (no value to unwrap)

### Maybe.unwrapExpect `(msg: string) => T`
unwrap the value of the `Maybe`  
throws Error with provided `msg` if the Maybe is of type Nothing (no value to unwrap)

### Maybe.unwrapOr `(fallback: T) => T`
unwrap the value of the `Maybe` also providing a fallback value  
Returns fallback value if there is no value to unwrap

### Maybe.isJust `() => boolean`
Returns `true` if `Maybe.value` is of type `Just`

### Maybe.isNothing `() => boolean`
Returns `true` if `Maybe.value` is of type `Nothing`

### toMaybe `<T>(val?: T | undefined | null) => Maybe<T>`
Returns the `Maybe` of type `T`  
Example: 
```ts
let num: Maybe<number> = toMaybe<number>(); // Maybe of variant Nothing;
let num2: Maybe<number> = toMaybe<number>(1); // Maybe of variant Just(1);
let arrayOfNums: Array<number> = [1, 2, 3];
let numAtIndex4: Maybe<number> = toMaybe(arrayOfNums.at(4));
```


### handling optional props
```ts
type User = { name: string; age: number; address?: string };
let ben: Maybe<User> = toMaybe<User>({ name: "Ben" age: 10 });
let address: Maybe<string> = ben.get("address");
// let addressValue: string = address.unwrap(); //=> throws Error("No value to unwrap");
let addressValue: string = address.unwrapOr("Not found"); //=> "Not found"
```

### getting deeply nested props
```ts
type Email = { usermail: string; domain: string };
type Info = { phone?: number; email?: Email }
type User = { name: string; info?: Info };

let peter: Maybe<User> = toMaybe<User>({ name: "Peter Griffin" }); // No info
let emailDomain: Maybe<string> = peter.get("info").get("email").get("domain");
emailDomain.isNothing() //=> true;

let email: Email = { usermail: "stew", domain: "griffins.com" };
let stewie: Maybe<User> = toMaybe<User>({ name: "Stewie Griffin", info: { email } });
emailDomain: Maybe<string> = stewie.get("info").get("email").get("domain");
emailDomain.isJust() //=> true;
emailDomain.unwrap() //=> "griffins.com"
```
