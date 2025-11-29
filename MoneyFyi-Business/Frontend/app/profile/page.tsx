'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, X, Building2, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { ProfileSection } from '@/components/settings/profile-section'

export default function ProfilePage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [sameAsPhone, setSameAsPhone] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoUrl(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your business profile and contact information
        </p>
      </div>

      <ProfileSection />

      {/* Business Information */}
      {/* Replaced with the better profile section from settings */}
      {/* <ProfileSection /> */}

      {/* Contact Information */}
      {/* Replaced with the better profile section from settings */}
      {/* <ProfileSection /> */}

      {/* Address */}
      {/* Replaced with the better profile section from settings */}
      {/* <ProfileSection /> */}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
