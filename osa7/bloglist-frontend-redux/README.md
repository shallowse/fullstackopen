# Comment about the state implementation

I decided to use [Redux Toolkit](https://redux-toolkit.js.org/) for implementing the application 
state management as it was recommended by the Redux team ([see](https://redux.js.org/introduction/getting-started#redux-toolkit)).

The implementation for reducers follows the example implementation from the Redux tutorial which is
found from [Redux example GitHub repository](https://github.com/reduxjs/redux-essentials-example-app/tree/checkpoint-3-postRequests/src) and from the [Tutorial](https://redux.js.org/tutorials/essentials/part-3-data-flow).

## To run cypress tests

1. Remember to start the ```bloglist-backend``` server with command ```$ npm run start:test```