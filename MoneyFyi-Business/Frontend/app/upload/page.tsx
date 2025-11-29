'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUp, FileText, File, ImageIcon, X, Trash2, Eye, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'failed'
}

interface UploadHistoryItem {
  id: string
  name: string
  date: string
  status: 'processing' | 'completed' | 'failed'
  size: string
  type: 'pdf' | 'csv' | 'image'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'text/csv': ['.csv'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const FILE_TYPE_BADGES = [
  { icon: FileText, label: 'PDF', desc: 'Bank statements, invoices' },
  { icon: File, label: 'CSV', desc: 'Transaction logs' },
  { icon: ImageIcon, label: 'JPG/PNG', desc: 'Receipt photos' },
]

export default function UploadPage() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadFile[]>([])
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([
    {
      id: '1',
      name: 'Bank_Statement_Oct2025.pdf',
      date: 'Nov 15, 2:34 PM',
      status: 'completed',
      size: '2.4 MB',
      type: 'pdf',
    },
    {
      id: '2',
      name: 'UPI_Transactions.csv',
      date: 'Nov 15, 1:20 PM',
      status: 'completed',
      size: '845 KB',
      type: 'csv',
    },
  ])

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return FileText
    if (type === 'csv') return File
    return ImageIcon
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const uploadToBackend = async (file: File) => {
    const id = Math.random().toString(36).substring(7)
    const uploadFile: UploadFile = {
      id,
      file,
      progress: 0,
      status: 'uploading',
    }

    setUploadingFiles((prev) => [...prev, uploadFile])

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', file.type.includes('pdf') ? 'bank_statement' : 'invoice')

      // Import API client dynamically
      const { apiClient } = await import('@/lib/api/client')

      // Upload with progress simulation
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 30 } : f))
      )

      // Call backend API
      const result = await apiClient.uploadDocument(formData)

      // Update to processing
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 60, status: 'processing' } : f))
      )

      // Simulate processing wait (backend will process in background)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update to analyzing
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 90, status: 'analyzing' } : f))
      )

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mark as completed
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 100, status: 'completed' } : f))
      )

      // Move to history after completion
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== id))

        const fileType = file.type.includes('pdf') ? 'pdf' : file.type.includes('csv') ? 'csv' : 'image'

        setUploadHistory((prev) => [
          {
            id: result.id || id,
            name: file.name,
            date: new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            status: 'completed',
            size: formatFileSize(file.size),
            type: fileType,
          },
          ...prev,
        ])
      }, 1000)

    } catch (error) {
      console.error('Upload failed:', error)

      // Mark as failed
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'failed', progress: 0 } : f))
      )

      // Remove from uploading after showing error
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== id))
      }, 3000)

      alert(`Failed to upload ${file.name}. Please try again.`)
    }
  }

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejection) => {
        const error = rejection.errors[0]
        if (error.code === 'file-too-large') {
          alert(`File ${rejection.file.name} is too large. Max size is 10MB.`)
        } else if (error.code === 'file-invalid-type') {
          alert(`File ${rejection.file.name} has an unsupported format.`)
        }
      })
    }

    // Process accepted files
    acceptedFiles.forEach((file) => {
      uploadToBackend(file)
    })
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  })

  const cancelUpload = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const deleteHistoryItem = (id: string) => {
    setUploadHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Upload Documents</h1>
        <p className="mt-2 text-muted-foreground">
          Upload bank statements, invoices, receipts, and transaction logs for analysis
        </p>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          {...getRootProps()}
          className={cn(
            'relative cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-300',
            isDragActive || isDragAccept
              ? 'scale-[1.02] border-primary bg-primary/5 shadow-lg'
              : 'border-border hover:border-primary hover:bg-accent/50 hover:shadow-md'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center sm:min-h-[320px]">
            <motion.div
              animate={{
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <FileUp className="h-12 w-12 text-primary sm:h-16 sm:w-16" />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold sm:text-2xl">
                {isDragActive ? 'Drop your files here' : 'Drag & Drop Your Files Here'}
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                or click to browse
              </p>
            </div>

            <p className="text-xs text-muted-foreground sm:text-sm">
              Accepted formats: PDF, CSV, JPG, PNG (max 10MB each)
            </p>
          </div>
        </Card>

        {/* Accepted File Types Badges */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
          {FILE_TYPE_BADGES.map((badge) => (
            <Badge
              key={badge.label}
              variant="outline"
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm"
            >
              <badge.icon className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{badge.label}</span>
                <span className="hidden text-[10px] text-muted-foreground sm:inline">
                  {badge.desc}
                </span>
              </div>
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Uploading Files */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold">Uploading Files</h3>
            {uploadingFiles.map((uploadFile) => {
              const Icon = getFileIcon(
                uploadFile.file.type.includes('pdf') ? 'pdf' :
                  uploadFile.file.type.includes('csv') ? 'csv' : 'image'
              )

              return (
                <motion.div
                  key={uploadFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="h-10 w-10 shrink-0 text-primary" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                              {uploadFile.file.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(uploadFile.file.size)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => cancelUpload(uploadFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              {uploadFile.status === 'uploading' && (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Uploading...
                                </>
                              )}
                              {uploadFile.status === 'processing' && (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Processing...
                                </>
                              )}
                              {uploadFile.status === 'analyzing' && (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Analyzing...
                                </>
                              )}
                              {uploadFile.status === 'completed' && (
                                <>
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  Completed
                                </>
                              )}
                            </span>
                            <span className="font-medium">{uploadFile.progress}%</span>
                          </div>
                          <Progress value={uploadFile.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload History</h3>
          {uploadHistory.length > 0 && (
            <Button variant="outline" size="sm">
              Process All
            </Button>
          )}
        </div>

        {uploadHistory.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <FileUp className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No files uploaded yet</p>
              <p className="text-sm text-muted-foreground">
                Upload your first document to get started
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <Card className="hidden overflow-hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">File Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Upload Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {uploadHistory.map((item, index) => {
                      const Icon = getFileIcon(item.type)
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-accent/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-primary" />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {item.date}
                          </td>
                          <td className="px-4 py-3">
                            {item.status === 'completed' && (
                              <Badge variant="outline" className="gap-1 border-green-600 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            {item.status === 'processing' && (
                              <Badge variant="outline" className="gap-1 border-blue-600 text-blue-600">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Processing
                              </Badge>
                            )}
                            {item.status === 'failed' && (
                              <Badge variant="outline" className="gap-1 border-red-600 text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                Failed
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {item.size}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => deleteHistoryItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
              {uploadHistory.map((item, index) => {
                const Icon = getFileIcon(item.type)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-10 w-10 shrink-0 text-primary" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="space-y-1">
                            <p className="font-medium leading-tight">{item.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{item.date}</span>
                              <span>•</span>
                              <span>{item.size}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            {item.status === 'completed' && (
                              <Badge variant="outline" className="gap-1 border-green-600 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            {item.status === 'processing' && (
                              <Badge variant="outline" className="gap-1 border-blue-600 text-blue-600">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Processing
                              </Badge>
                            )}

                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => deleteHistoryItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
