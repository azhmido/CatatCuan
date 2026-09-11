import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardContent, Button, Input, InvoiceSkeleton, Modal } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import clientsApi from './clientsApi'

export function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const data = await clientsApi.getClientById(id)
        if (!ignore && data) {
          setName(data.name || '')
          setContact(data.contact || data.email || '')
          setAddress(data.address || '')
          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          setName(`Klien #${id}`)
          setContact('kontak@klien.com')
          setAddress('Jakarta, Indonesia')
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')

    const errors = {}
    if (!name.trim() || name.trim().length < 3) {
      errors.name = 'Nama klien minimal 3 karakter.'
    }
    if (!contact.trim() || contact.trim().length < 5) {
      errors.contact = 'Kontak minimal 5 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('Mohon lengkapi data klien.')
      return
    }

    setIsSaving(true)
    try {
      await clientsApi.updateClient(id, { name, contact, address })
      toast.success('Data klien berhasil diperbarui!')
      navigate('/clients')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui klien.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await clientsApi.deleteClient(id)
      toast.info('Klien berhasil dihapus.')
      navigate('/clients')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus klien.')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <InvoiceSkeleton rows={3} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title={name || 'Detail Klien'}
        action={
          <div className="flex items-center gap-2">
            <Link to="/clients">
              <Button variant="ghost" size="sm">
                ← Kembali
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Hapus
            </Button>
          </div>
        }
      />

      <Card className="border-border">
        <CardContent className="p-5 sm:p-6">
          {error && (
            <div className="p-3 mb-5 rounded-sharp bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-medium">
              ! {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4" noValidate>
            <Input
              label="Nama Klien"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (validationErrors.name) {
                  setValidationErrors((prev) => ({ ...prev, name: '' }))
                }
              }}
              error={validationErrors.name}
            />

            <Input
              label="Email / No. HP"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value)
                if (validationErrors.contact) {
                  setValidationErrors((prev) => ({ ...prev, contact: '' }))
                }
              }}
              error={validationErrors.contact}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="client-address-edit"
                className="text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Alamat (Opsional)
              </label>
              <textarea
                id="client-address-edit"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-dashed border-border-dashed flex items-center justify-end gap-3">
              <Link to="/clients">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Klien"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-sm text-text font-sans">
          Hapus data klien <strong className="font-mono text-primary">{name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  )
}

export default ClientDetailPage
