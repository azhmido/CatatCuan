import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button, Input, Card, CardContent, EmptyState, InvoiceSkeleton, Pagination } from '../../components/ui'
import clientsApi from './clientsApi'

export function ClientsPage() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Pagination state
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await clientsApi.getClients({
          search: submittedSearch || undefined,
          sort: sortOrder,
          page,
          size: pageSize,
        })
        if (!ignore) {
          setClients(Array.isArray(data) ? data : [])
          setTotalPages(data.totalPages ?? 1)
          setTotalElements(data.totalElements ?? (Array.isArray(data) ? data.length : 0))
          setIsLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Gagal memuat data kontak klien dari server.')
          setClients([])
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [submittedSearch, sortOrder, page, pageSize, refreshKey])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(0)
    setSubmittedSearch(search)
  }

  const handleSortChange = (newSort) => {
    setPage(0)
    setSortOrder(newSort)
  }

  const handleRetry = () => {
    setError(null)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="space-y-6 page-fade-in">
      <PageHeader
        title="Klien"
        action={
          <Link to="/clients/new">
            <Button variant="accent" size="sm">
              + Tambah Klien
            </Button>
          </Link>
        }
      />

      {/* Search and Sort Filter Bar */}
      <Card className="border-border">
        <CardContent className="p-3 sm:p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Cari klien..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefixIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                suffixIcon={
                  search ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setSubmittedSearch('')
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                      title="Hapus pencarian"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : null
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  id="client-sort-select"
                  aria-label="Urutkan Daftar Klien"
                  value={sortOrder}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="touch-target text-xs font-mono px-3 py-2 pr-8 rounded-base border border-border bg-surface text-text hover:bg-secondary transition-colors cursor-pointer focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="asc">Urutkan: Nama (A-Z)</option>
                  <option value="desc">Urutkan: Nama (Z-A)</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <Button type="submit" variant="primary" size="sm" className="shrink-0">
                Cari
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Clients List / Table with conditional rendering */}
      <Card className="border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5">
              <InvoiceSkeleton rows={3} />
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-text">Gagal Memuat Data Klien</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto font-sans">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Coba Lagi
              </Button>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title={search ? 'Klien Tidak Ditemukan' : 'Belum Ada Klien'}
                description={
                  search
                    ? 'Tidak ada catatan klien yang cocok.'
                    : 'Tambahkan kontak klien untuk mulai membuat invoice.'
                }
                action={
                  search ? (
                    <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                      Reset Pencarian
                    </Button>
                  ) : (
                    <Link to="/clients/new">
                      <Button variant="accent" size="sm">
                        + Tambah Klien
                      </Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sharp bg-secondary border border-border flex items-center justify-center text-text font-mono font-bold text-sm shrink-0">
                      {(client.name || 'K').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-text font-heading">
                        {client.name}
                      </h2>
                      <p className="text-xs text-text-muted mt-0.5 font-mono">
                        {client.contact || client.email || 'Tanpa email'} {client.address ? `• ${client.address}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <Link to={`/clients/${client.id}`}>
                      <Button variant="outline" size="sm">
                        Detail →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination control */}
          {!isLoading && !error && clients.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={(p) => { setPage(p); setIsLoading(true) }}
              onPageSizeChange={(s) => { setPageSize(s); setPage(0); setIsLoading(true) }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientsPage
