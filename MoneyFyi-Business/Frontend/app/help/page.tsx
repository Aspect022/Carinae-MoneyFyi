'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MessageCircle, Mail, Phone, BookOpen, Video, HelpCircle, FileText, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'How do I upload financial documents?',
    answer:
      'Navigate to the Upload section from the sidebar, then drag and drop your files or click to browse. We support PDF, Excel, and CSV formats up to 10MB.',
  },
  {
    question: 'What triggers a fraud alert?',
    answer:
      'Our AI analyzes transaction patterns, vendor behaviors, and amounts. Alerts are triggered for unusual transactions, suspicious vendor activities, or amounts exceeding your defined thresholds.',
  },
  {
    question: 'How is the Financial Health Score calculated?',
    answer:
      'The score is based on multiple factors including cashflow stability, debt-to-income ratio, payment history, compliance status, and vendor risk levels. It updates daily.',
  },
  {
    question: 'Can I integrate with accounting software?',
    answer:
      'Yes! We support integrations with popular accounting tools like Zoho Books, Tally, and Google Drive. Check the Integrations section in Settings to connect your accounts.',
  },
  {
    question: 'How do I export my data?',
    answer:
      'You can export data from any table using the Export button. For complete data download, visit Settings > Preferences > Data & Privacy and click "Download my data".',
  },
  {
    question: 'What happens after my trial ends?',
    answer:
      'Your account will automatically switch to the Free plan with limited features. You can upgrade anytime from Settings > Billing to continue using premium features.',
  },
]

const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    link: '#',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video walkthroughs',
    link: '#',
  },
  {
    icon: FileText,
    title: 'Blog & Updates',
    description: 'Latest features and best practices',
    link: '#',
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground text-lg">
          We're here to help you get the most out of MoneyFyi
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs, or features..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                  <CardDescription>Get instant help</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Chat with our support team in real-time
              </p>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Email Support</CardTitle>
                  <CardDescription>Response in 24 hours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Send us a detailed message
              </p>
              <Button variant="outline" className="w-full">
                support@moneyfyi.com
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Phone Support</CardTitle>
                  <CardDescription>Mon-Fri, 9AM-6PM IST</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Speak directly with our team
              </p>
              <Button variant="outline" className="w-full">
                +91-1800-123-4567
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Resources</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                      <Button variant="link" className="p-0">
                        Learn more →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Can't find what you're looking for? We'll get back to you within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What do you need help with?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue or question in detail..."
              rows={5}
            />
          </div>
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
