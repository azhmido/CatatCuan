import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardContent, Button, Input } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import clientsApi from './clientsApi'

export function NewClientPage() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
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
      toast.error('Mohon lengkapi formulir klien.')
      return
    }

    setIsLoading(true)

    try {
      await clientsApi.createClient({ name, contact, address })
      toast.success('Klien berhasil ditambahkan!')
      navigate('/clients')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal menyimpan data klien.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Tambah Klien"
        action={
          <Link to="/clients">
            <Button variant="ghost" size="sm">
              ← Kembali
            </Button>
          </Link>
        }
      />

      <Card className="border-border">
        <CardContent className="p-5 sm:p-6">
          {error && (
            <div className="p-3 mb-5 rounded-sharp bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-medium">
              ! {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                htmlFor="client-address"
                className="text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Alamat (Opsional)
              </label>
              <textarea
                id="client-address"
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
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewClientPage
