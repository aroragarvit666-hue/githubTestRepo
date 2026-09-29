import React, { useState } from 'react'
import {
  Provider,
  defaultTheme,
  View,
  Flex,
  Heading,
  Content,
  Form,
  TextField,
  Button,
  InlineAlert,
  ProgressCircle,
  Well,
} from '@adobe/react-spectrum'
import actions from '../config.json'

export default function App({ runtime, ims }) {
  // Do NOT call runtime.done() here — index.js calls it in the ready handler
  const helloUrl = actions['hello'] // exact action name from app.config.yaml

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!helloUrl) {
      // config.json is empty until deploy/preview fills in action URLs
      setError('Action URL is not available yet. Deploy the app (or start the preview) to enable it.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(helloUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ims.token}`,
          'x-gw-ims-org-id': ims.org,
        },
        body: JSON.stringify({ name: name || undefined }),
      })
      if (!res.ok) throw new Error(`Action failed: ${res.status}`)
      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <View padding="size-400" backgroundColor="green-400" minHeight="100vh">
        <Flex direction="column" alignItems="center" justifyContent="center" minHeight="size-6000" gap="size-300">
          <View
            backgroundColor="gray-50"
            borderWidth="thin"
            borderColor="gray-300"
            borderRadius="medium"
            padding="size-400"
            width="size-4600"
          >
            <Flex direction="column" gap="size-200">
              <Heading level={1}>Hello World</Heading>
              <Content>
                Enter a name and greet it through the <code>hello</code> web action. Leave it blank to greet the world.
              </Content>

              <Form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder="World"
                />
                <Button variant="accent" type="submit" isPending={isLoading} marginTop="size-200">
                  Say hello
                </Button>
              </Form>

              {isLoading && (
                <Flex alignItems="center" justifyContent="center" height="size-800">
                  <ProgressCircle aria-label="Calling action" isIndeterminate size="M" />
                </Flex>
              )}

              {message && !isLoading && (
                <Well>
                  <Heading level={3} margin={0}>
                    {message}
                  </Heading>
                </Well>
              )}

              {error && (
                <InlineAlert variant="negative">
                  <Heading>Error</Heading>
                  <Content>{error}</Content>
                </InlineAlert>
              )}
            </Flex>
          </View>
        </Flex>
      </View>
    </Provider>
  )
}
