'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const profileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.string().min(1, 'Please select a business type'),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  industry: z.string().min(1, 'Please select an industry'),
  employeeCount: z.string().min(1, 'Please select employee count'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Phone must be in format +91XXXXXXXXXX'),
  alternativeEmail: z.string().email().optional().or(z.literal('')),
  whatsappNumber: z.string().regex(/^\+91[0-9]{10}$/, 'WhatsApp number must be in format +91XXXXXXXXXX'),
  sameAsPhone: z.boolean(),
  streetAddress: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'PIN code must be 6 digits'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSection() {
  const { toast } = useToast()
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: 'Kumar Enterprises',
      businessType: 'retail',
      gstin: '29ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      industry: 'retail',
      employeeCount: '11-50',
      email: 'raj@business.com',
      phone: '+919876543210',
      alternativeEmail: '',
      whatsappNumber: '+919876543210',
      sameAsPhone: true,
      streetAddress: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560001',
    },
  })

  const sameAsPhone = watch('sameAsPhone')
  const phoneValue = watch('phone')

  const onSubmit = (data: ProfileFormValues) => {
    console.log('[v0] Profile form submitted:', data)
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your business profile and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  RK
                </AvatarFallback>
              </Avatar>
              {profileImage && (
                <button
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Upload className="h-4 w-4" />
                  Change Photo
                </div>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </Label>
              {profileImage && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setProfileImage(null)}
                  className="h-auto p-0 text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input id="businessName" {...register('businessName')} />
                {errors.businessName && (
                  <p className="text-sm text-destructive">{errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">
                  Business Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  defaultValue="retail"
                  onValueChange={(value) => setValue('businessType', value, { shouldDirty: true })}
                >
                  <SelectTrigger id="businessType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="text-sm text-destructive">{errors.businessType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstin">
                  GSTIN <span className="text-destructive">*</span>
                </Label>
                <Input id="gstin" {...register('gstin')} placeholder="29ABCDE1234F1Z5" />
                {errors.gstin && <p className="text-sm text-destructive">{errors.gstin.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan">
                  PAN <span className="text-destructive">*</span>
                </Label>
                <Input id="pan" {...register('pan')} placeholder="ABCDE1234F" />
                {errors.pan && <p className="text-sm text-destructive">{errors.pan.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry <span className="text-destructive">*</span>
                </Label>
                <Select
                  defaultValue="retail"
                  onValueChange={(value) => setValue('industry', value, { shouldDirty: true })}
                >
                  <SelectTrigger id="industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">
                  Employee Count <span className="text-destructive">*</span>
                </Label>
                <Select
                  defaultValue="11-50"
                  onValueChange={(value) => setValue('employeeCount', value, { shouldDirty: true })}
                >
                  <SelectTrigger id="employeeCount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="200+">200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input id="email" type="email" {...register('email')} disabled />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input id="phone" {...register('phone')} placeholder="+919876543210" />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternativeEmail">Alternative Email</Label>
                <Input id="alternativeEmail" type="email" {...register('alternativeEmail')} />
                {errors.alternativeEmail && (
                  <p className="text-sm text-destructive">{errors.alternativeEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">
                  WhatsApp Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="whatsappNumber"
                  {...register('whatsappNumber')}
                  placeholder="+919876543210"
                  disabled={sameAsPhone}
                  value={sameAsPhone ? phoneValue : undefined}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sameAsPhone"
                    checked={sameAsPhone}
                    onCheckedChange={(checked) => {
                      setValue('sameAsPhone', checked as boolean, { shouldDirty: true })
                      if (checked) {
                        setValue('whatsappNumber', phoneValue, { shouldDirty: true })
                      }
                    }}
                  />
                  <Label htmlFor="sameAsPhone" className="text-sm font-normal">
                    Same as phone
                  </Label>
                </div>
                {errors.whatsappNumber && (
                  <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streetAddress">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Textarea id="streetAddress" {...register('streetAddress')} rows={3} />
                {errors.streetAddress && (
                  <p className="text-sm text-destructive">{errors.streetAddress.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input id="state" {...register('state')} />
                  {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinCode">
                    PIN Code <span className="text-destructive">*</span>
                  </Label>
                  <Input id="pinCode" {...register('pinCode')} placeholder="560001" />
                  {errors.pinCode && (
                    <p className="text-sm text-destructive">{errors.pinCode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
