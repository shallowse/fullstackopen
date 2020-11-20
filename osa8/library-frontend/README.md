# Some notes

## Client error handling 

For some reason in error handling the ```error.graphQLErrors``` array is empty.
So I resorted to just use ```String(error)```.

## About Exercices 8.24 using window.alert()

Don't be confused when the ```window.alert()``` is displayed twice when a new book subcription
is received. This is because I am using [Strict Mode](https://reactjs.org/docs/strict-mode.html) and
run the app in development mode. 
Check e.g. the explanation found from the above link:
```
Strict mode can’t automatically detect side effects for you, but it can help you spot them by making them a little more deterministic. This is done by intentionally double-invoking the following functions:

* Class component constructor, render, and shouldComponentUpdate methods
* Class component static getDerivedStateFromProps method
* Function component bodies
* State updater functions (the first argument to setState)
* Functions passed to useState, useMemo, or useReducer
```
