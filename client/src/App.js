import React, { Component } from 'react'
import yoga from './yoga.png'
import './App.css'
import Item from './Item'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

class App extends Component {
  render() {
    const { counter, items, loading } = this.props

    if (loading) {
      return <div>Loading</div>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={yoga} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to <code>graphql-yoga</code>
          </h1>
        </header>
        <div className="App-intro">
          <ul>
            {items &&
              items.map((item, index) => {
                return (
                  <li key={index}>
                    <Item name={item.name} />
                  </li>
                )
              })}
          </ul>
        </div>
        <div className="App-intro">{counter.countStr}</div>
      </div>
    )
  }
}

const ITEMS_QUERY = gql`
  query ItemsQuery {
    items {
      name
    }
  }
`
const COUNTER_SUBSCRIPTION = gql`
  subscription Counter {
    counter {
      count
      countStr
    }
  }
`

const mapItemsProps = ({ ItemsQuery: { items = [] }, ownProps }) => {
  return {
    items
  }
}

const mapCounterProps = ({ CounterSubscription: { loading, counter }, ownProps }) => {
  return {
    counter,
    loading
  }
}

const withData = compose(
  graphql(ITEMS_QUERY, { name: 'ItemsQuery', props: mapItemsProps }),
  graphql(COUNTER_SUBSCRIPTION, { name: 'CounterSubscription', props: mapCounterProps })
)

export default withData(App)
