import { useState } from 'react'
import { Form, Input, Button, message as antdMessage, Typography, Card } from 'antd'

const { Title } = Typography

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.status === 'success') {
        antdMessage.success('Message sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      } else {
        antdMessage.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      antdMessage.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
      <Card style={{ width: 500, padding: 20 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Contact Us</Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" required>
            <Input
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Message" required>
            <Input.TextArea
              name="message"
              placeholder="Enter your message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default App
