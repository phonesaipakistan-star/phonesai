/**
 * PhonesAI — Full Test Suite
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockPhones = [
  {
    id: 'phone-1',
    model: 'iPhone 16 Pro Max',
    storage: '256GB',
    color: 'Desert Titanium',
    category: 'JV',
    brand: 'Apple',
    condition: 'New',
    price: 285000,
    discount_price: null,
    battery_health: 100,
    physical_condition: '10/10',
    five_g: true,
    face_id: true,
    true_tone: true,
    in_stock: true,
    featured: true,
    badge: 'New Arrival',
    images: [],
    free_case: false,
    description: 'Pin-pack sealed unit',
    sim_status: 'SIM Locked',
    accessories_included: 'Cable Only',
    region: 'LLA',
    ios_version: 'iOS 18.4',
    condition_video: null,
    battery_screenshot: null,
    model_number: null,
    pta_tax_estimate: null,
  },
  {
    id: 'phone-2',
    model: 'iPhone 15 Pro',
    storage: '128GB',
    color: 'Black Titanium',
    category: 'Non-PTA',
    brand: 'Apple',
    condition: 'Used',
    price: 185000,
    discount_price: 175000,
    battery_health: 89,
    physical_condition: '9/10',
    five_g: true,
    face_id: true,
    true_tone: true,
    in_stock: true,
    featured: false,
    badge: null,
    images: [],
    free_case: true,
    description: null,
    sim_status: 'Works 2 months',
    accessories_included: 'Nothing',
    region: 'ZPA',
    ios_version: 'iOS 18.2',
    condition_video: null,
    battery_screenshot: null,
    model_number: null,
    pta_tax_estimate: null,
  },
]

const mockReviews = [
  {
    id: 'review-1',
    customer_name: 'Ahmed Khan',
    customer_city: 'Islamabad',
    rating: 5,
    review_text: 'Zabardast experience!',
    product_model: 'iPhone 16 Pro Max',
    review_type: 'product',
    verified_buyer: true,
    approved: true,
    created_at: '2026-05-01',
  },
]

// ─── Mock Supabase ────────────────────────────────────────────────────────────
const mockSingle = jest.fn().mockResolvedValue({ data: mockPhones[0], error: null })
const mockLimit = jest.fn().mockResolvedValue({ data: mockReviews, error: null })
const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null })
const mockOrder = jest.fn().mockResolvedValue({ data: mockPhones, error: null })
const mockEq = jest.fn()
const mockSelect = jest.fn()
const mockFrom = jest.fn()

mockEq.mockReturnValue({ single: mockSingle, eq: mockEq, order: mockOrder })
mockSelect.mockReturnValue({ eq: mockEq, order: mockOrder })
mockOrder.mockReturnValue({ order: mockOrder, limit: mockLimit, eq: mockEq })
mockFrom.mockReturnValue({ select: mockSelect, insert: mockInsert })

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args) => mockFrom(...args),
  },
}))

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'phone-1' }),
  useSearchParams: () => ({ get: () => null }),
  useRouter: () => ({ push: jest.fn() }),
}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn().mockReturnValue('true'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
})

// ─── 1. Homepage Tests ────────────────────────────────────────────────────────
describe('Homepage', () => {
  test('renders PhonesAI brand name', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    expect(screen.getAllByText('PhonesAI').length).toBeGreaterThan(0)
  })

  test('renders slogan', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    expect(screen.getByText('Premium Shopping, Reinvented.')).toBeInTheDocument()
  })

  test('renders all 4 category cards', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    expect(screen.getByText('iPhones')).toBeInTheDocument()
    expect(screen.getByText('Samsung Flagships')).toBeInTheDocument()
    expect(screen.getByText('iPads')).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
  })

  test('renders trust strip', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    expect(screen.getByText('Ustaad Ji Verified')).toBeInTheDocument()
    expect(screen.getByText('7-Day Warranty')).toBeInTheDocument()
    expect(screen.getByText('All Pakistan Delivery')).toBeInTheDocument()
  })

  test('Talk to AI Shopkeeper button exists', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    expect(screen.getByText('Talk to AI Shopkeeper')).toBeInTheDocument()
  })

  test('Browse All button links to shop', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    const browseBtn = screen.getByText('Browse All →')
    expect(browseBtn.closest('a')).toHaveAttribute('href', '/shop')
  })

  test('email popup hidden when already dismissed', async () => {
    const Home = (await import('@/app/page')).default
    await act(async () => { render(<Home />) })
    expect(screen.queryByText('Get 5% Off Your First Order')).not.toBeInTheDocument()
  })
})

// ─── 2. Product Page Tests ────────────────────────────────────────────────────
describe('Product Page', () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockPhones[0], error: null })
    mockOrder.mockResolvedValue({ data: [], error: null })
  })

  test('shows loading state initially', async () => {
    mockSingle.mockImplementation(() => new Promise(() => {}))
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders phone model after load', async () => {
    mockSingle.mockResolvedValue({ data: mockPhones[0], error: null })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('iPhone 16 Pro Max')).toBeInTheDocument()
    })
  })

  test('renders Ustaad Ji Verified badge', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Ustaad Ji Verified')).toBeInTheDocument()
    })
  })

  test('renders WhatsApp CTA', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('WhatsApp Boss')).toBeInTheDocument()
    })
  })

  test('renders Buy Now Checkout button', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Buy Now — Checkout →')).toBeInTheDocument()
    })
  })

  test('renders review form', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Leave a Review')).toBeInTheDocument()
    })
  })

  test('shows free case badge for used phones', async () => {
    mockSingle.mockResolvedValue({ data: mockPhones[1], error: null })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Free Case + Screen Protector!')).toBeInTheDocument()
    })
  })

  test('shows phone not found when no data', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Phone not found')).toBeInTheDocument()
    })
  })
})

// ─── 3. Comparison Tool Tests ─────────────────────────────────────────────────
describe('CompareTool', () => {
  test('does not render when no phones selected', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    const { container } = render(
      <CompareTool selectedPhones={[]} onRemove={jest.fn()} onClear={jest.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  test('shows hint when one phone selected', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool selectedPhones={[mockPhones[0]]} onRemove={jest.fn()} onClear={jest.fn()} />
    )
    expect(screen.getByText('Select one more to compare')).toBeInTheDocument()
  })

  test('shows Compare button when two phones selected', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool selectedPhones={mockPhones} onRemove={jest.fn()} onClear={jest.fn()} />
    )
    expect(screen.getByText('Compare →')).toBeInTheDocument()
  })

  test('opens popup on Compare click', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool selectedPhones={mockPhones} onRemove={jest.fn()} onClear={jest.fn()} />
    )
    fireEvent.click(screen.getByText('Compare →'))
    expect(screen.getByText('Compare Phones')).toBeInTheDocument()
  })

  test('calls onClear when Clear clicked', async () => {
    const onClear = jest.fn()
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool selectedPhones={[mockPhones[0]]} onRemove={jest.fn()} onClear={onClear} />
    )
    fireEvent.click(screen.getByText('Clear'))
    expect(onClear).toHaveBeenCalled()
  })
})

// ─── 4. Admin Panel Tests ─────────────────────────────────────────────────────
describe('Admin Panel', () => {
  test('shows login screen initially', async () => {
    const AdminPage = (await import('@/app/admin/page')).default
    render(<AdminPage />)
    expect(screen.getByPlaceholderText('Enter admin password')).toBeInTheDocument()
  })

  test('shows error on wrong password', async () => {
    const AdminPage = (await import('@/app/admin/page')).default
    render(<AdminPage />)
    fireEvent.change(screen.getByPlaceholderText('Enter admin password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByText('Login →'))
    expect(screen.getByText('Wrong password. Try again.')).toBeInTheDocument()
  })

  test('shows inventory after correct password', async () => {
    mockOrder.mockResolvedValue({ data: mockPhones, error: null })
    const AdminPage = (await import('@/app/admin/page')).default
    await act(async () => { render(<AdminPage />) })
    const input = screen.getByPlaceholderText('Enter admin password')
    fireEvent.change(input, { target: { value: 'PhonesAI321@' } })
    await act(async () => { fireEvent.click(screen.getByText('Login →')) })
    await waitFor(() => {
        expect(screen.getAllByText(/Phones/).length).toBeGreaterThan(0)
      })
  })
})

// ─── 5. 404 Page Tests ────────────────────────────────────────────────────────
describe('404 Page', () => {
  test('renders 404 heading', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  test('renders Go to Homepage button', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument()
  })

  test('renders Browse iPhones button', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('Browse iPhones →')).toBeInTheDocument()
  })

  test('404 number visible', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})

// ─── 6. Checkout Page Tests ───────────────────────────────────────────────────
describe('Checkout Page', () => {
  test('renders checkout page', async () => {
    const CheckoutPage = (await import('@/app/checkout/page')).default
    await act(async () => { render(<CheckoutPage />) })
    expect(screen.getAllByText('Your Details').length).toBeGreaterThan(0)
  })

  test('renders name input field', async () => {
    const CheckoutPage = (await import('@/app/checkout/page')).default
    await act(async () => { render(<CheckoutPage />) })
    expect(screen.getByPlaceholderText('Ahmed Khan')).toBeInTheDocument()
  })

  test('renders Continue to Payment button', async () => {
    const CheckoutPage = (await import('@/app/checkout/page')).default
    await act(async () => { render(<CheckoutPage />) })
    expect(screen.getByText('Continue to Payment →')).toBeInTheDocument()
  })
})

// ─── 7. Review Submission Tests ───────────────────────────────────────────────
describe('Review Submission', () => {
  test('review form exists on product page', async () => {
    mockSingle.mockResolvedValue({ data: mockPhones[0], error: null })
    mockOrder.mockResolvedValue({ data: [], error: null })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Leave a Review')).toBeInTheDocument()
    })
  })

  test('submit button exists', async () => {
    mockSingle.mockResolvedValue({ data: mockPhones[0], error: null })
    mockOrder.mockResolvedValue({ data: [], error: null })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    await act(async () => { render(<ProductPage />) })
    await waitFor(() => {
      expect(screen.getByText('Submit Review →')).toBeInTheDocument()
    })
  })
})