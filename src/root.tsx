import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'
import InvestmentsPage from './pages/InvestmentsPage'
import { Provider } from 'react-redux'
import { store } from './store'

const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ padding: 16, color: 'red' }}>
    <h2>Erro ao carregar microfrontend</h2>
    <pre>{error.message}</pre>
    <pre>{error.stack}</pre>
  </div>
)

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: () => (
    <Provider store={store}>
      <InvestmentsPage />
    </Provider>
  ),
  errorBoundary(err, info, props) {
    return <ErrorFallback error={err} />
  },
})

export const bootstrap = lifecycles.bootstrap
export const mount = lifecycles.mount
export const unmount = lifecycles.unmount

// 👇 ESSENCIAL para SystemJS funcionar corretamente
export default {
  bootstrap,
  mount,
  unmount,
}
