/**
 * PhonesAI — Full Test Suite
 * Run with: npx jest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'

// ─── Mock Supabase ────────────────────────────────────────────────────────────
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
  {
    id: 'review-2',
    customer_name: 'Sara Malik',
    customer_city: 'Lahore',
    rating: 5,
    review_text: 'Delivery was super fast.',
    product_model: null,
    review_type: 'store',
    verified_buyer: true,
    approved: true,
    created_at: '2026-05-02',
  },
]

const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockPhones[0], error: null }),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data: mockReviews, error: null }),
  insert: jest.fn().mockResolvedValue({ data: null, error: null }),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'phone-1' }),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn() }),
}))

// ─── 1. Homepage Tests ────────────────────────────────────────────────────────
describe('Homepage', () => {
  beforeEach(() => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.order.mockReturnThis()
    mockSupabase.limit.mockResolvedValue({ data: mockReviews, error: null })
  })

  test('renders PhonesAI brand name', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    expect(screen.getAllByText('PhonesAI').length).toBeGreaterThan(0)
  })

  test('renders slogan', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    expect(screen.getByText('Premium Shopping, Reinvented.')).toBeInTheDocument()
  })

  test('renders all 4 category cards', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    expect(screen.getByText('iPhones')).toBeInTheDocument()
    expect(screen.getByText('Samsung Flagships')).toBeInTheDocument()
    expect(screen.getByText('iPads')).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
  })

  test('renders trust strip', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    expect(screen.getByText('Ustaad Ji Verified')).toBeInTheDocument()
    expect(screen.getByText('7-Day Warranty')).toBeInTheDocument()
    expect(screen.getByText('All Pakistan Delivery')).toBeInTheDocument()
  })

  test('Talk to AI Shopkeeper button exists', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    expect(screen.getByText('Talk to AI Shopkeeper')).toBeInTheDocument()
  })

  test('Browse All button links to shop', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    const browseBtn = screen.getByText('Browse All →')
    expect(browseBtn.closest('a')).toHaveAttribute('href', '/shop')
  })

  test('email popup does not show immediately', async () => {
    const Home = (await import('@/app/page')).default
    render(<Home />)
    expect(screen.queryByText('Get 5% Off Your First Order')).not.toBeInTheDocument()
  })
})

// ─── 2. Product Page Tests ────────────────────────────────────────────────────
describe('Product Page', () => {
  beforeEach(() => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: mockPhones[0], error: null })
    mockSupabase.order.mockResolvedValue({ data: mockReviews.filter(r => r.product_model === 'iPhone 16 Pro Max'), error: null })
  })

  test('shows loading state initially', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders phone model after load', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('iPhone 16 Pro Max')).toBeInTheDocument()
    })
  })

  test('renders price correctly', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('Rs. 285,000')).toBeInTheDocument()
    })
  })

  test('renders Ustaad Ji Verified badge', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('Ustaad Ji Verified')).toBeInTheDocument()
    })
  })

  test('renders WhatsApp CTA button', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('WhatsApp Boss')).toBeInTheDocument()
    })
  })

  test('renders Buy Now Checkout button', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('Buy Now — Checkout →')).toBeInTheDocument()
    })
  })

  test('renders review submission form', async () => {
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('Leave a Review')).toBeInTheDocument()
    })
  })

  test('shows free case badge for used phones with free_case true', async () => {
    mockSupabase.single.mockResolvedValue({ data: mockPhones[1], error: null })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('Free Case + Screen Protector!')).toBeInTheDocument()
    })
  })

  test('shows phone not found when no data', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })
    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)
    await waitFor(() => {
      expect(screen.getByText('Phone not found')).toBeInTheDocument()
    })
  })
})

// ─── 3. Shop Page Tests ───────────────────────────────────────────────────────
describe('Shop Page', () => {
  beforeEach(() => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.order.mockReturnThis()
    // Return phones for first call, accessories for second
    let callCount = 0
    mockSupabase.order.mockImplementation(() => {
      callCount++
      if (callCount === 1) return Promise.resolve({ data: mockPhones, error: null })
      return Promise.resolve({ data: [], error: null })
    })
  })

  test('renders shop heading', async () => {
    const ShopPage = (await import('@/app/shop/page')).default
    render(<ShopPage />)
    await waitFor(() => {
      expect(screen.getByText('All Products')).toBeInTheDocument()
    })
  })

  test('renders brand filters', async () => {
    const ShopPage = (await import('@/app/shop/page')).default
    render(<ShopPage />)
    expect(screen.getByText('All Products')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Samsung')).toBeInTheDocument()
    expect(screen.getByText('iPad')).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
  })

  test('compare hint is shown', async () => {
    const ShopPage = (await import('@/app/shop/page')).default
    render(<ShopPage />)
    await waitFor(() => {
      expect(screen.getByText(/Click "Compare" on any two phones/)).toBeInTheDocument()
    })
  })
})

// ─── 4. Comparison Tool Tests ─────────────────────────────────────────────────
describe('CompareTool', () => {
  test('does not render when no phones selected', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    const { container } = render(
      <CompareTool selectedPhones={[]} onRemove={jest.fn()} onClear={jest.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  test('renders floating bar when one phone selected', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool
        selectedPhones={[mockPhones[0] as any]}
        onRemove={jest.fn()}
        onClear={jest.fn()}
      />
    )
    expect(screen.getByText('Select one more to compare')).toBeInTheDocument()
  })

  test('renders Compare button when two phones selected', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool
        selectedPhones={mockPhones as any}
        onRemove={jest.fn()}
        onClear={jest.fn()}
      />
    )
    expect(screen.getByText('Compare →')).toBeInTheDocument()
  })

  test('opens comparison popup on Compare click', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool
        selectedPhones={mockPhones as any}
        onRemove={jest.fn()}
        onClear={jest.fn()}
      />
    )
    fireEvent.click(screen.getByText('Compare →'))
    expect(screen.getByText('Compare Phones')).toBeInTheDocument()
  })

  test('shows price difference in comparison popup', async () => {
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool
        selectedPhones={mockPhones as any}
        onRemove={jest.fn()}
        onClear={jest.fn()}
      />
    )
    fireEvent.click(screen.getByText('Compare →'))
    await waitFor(() => {
      expect(screen.getByText(/cheaper/)).toBeInTheDocument()
    })
  })

  test('calls onClear when Clear is clicked', async () => {
    const onClear = jest.fn()
    const CompareTool = (await import('@/app/components/CompareTool')).default
    render(
      <CompareTool
        selectedPhones={[mockPhones[0] as any]}
        onRemove={jest.fn()}
        onClear={onClear}
      />
    )
    fireEvent.click(screen.getByText('Clear'))
    expect(onClear).toHaveBeenCalled()
  })
})

// ─── 5. Admin Panel Tests ─────────────────────────────────────────────────────
describe('Admin Panel', () => {
  test('shows login screen when not authenticated', async () => {
    const AdminPage = (await import('@/app/admin/page')).default
    render(<AdminPage />)
    expect(screen.getByPlaceholderText('Enter admin password')).toBeInTheDocument()
  })

  test('shows wrong password message on incorrect password', async () => {
    const AdminPage = (await import('@/app/admin/page')).default
    render(<AdminPage />)
    const input = screen.getByPlaceholderText('Enter admin password')
    fireEvent.change(input, { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByText('Login →'))
    expect(screen.getByText('Wrong password. Try again.')).toBeInTheDocument()
  })

  test('shows inventory after correct password', async () => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.order.mockResolvedValue({ data: mockPhones, error: null })

    const AdminPage = (await import('@/app/admin/page')).default
    render(<AdminPage />)
    const input = screen.getByPlaceholderText('Enter admin password')
    fireEvent.change(input, { target: { value: 'PhonesAI321@' } })
    fireEvent.click(screen.getByText('Login →'))
    await waitFor(() => {
      expect(screen.getByText(/Phones/)).toBeInTheDocument()
    })
  })
})

// ─── 6. Review Submission Tests ───────────────────────────────────────────────
describe('Review Submission', () => {
  test('review form validates required fields', async () => {
    mockSupabase.single.mockResolvedValue({ data: mockPhones[0], error: null })
    mockSupabase.order.mockResolvedValue({ data: [], error: null })

    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)

    await waitFor(() => {
      expect(screen.getByText('Leave a Review')).toBeInTheDocument()
    })

    const submitBtn = screen.getByText('Submit Review →')
    fireEvent.click(submitBtn)
    // Form should not submit without required fields — name and review text
    expect(screen.queryByText('Shukriya Janab!')).not.toBeInTheDocument()
  })

  test('review insert is called with correct data', async () => {
    mockSupabase.single.mockResolvedValue({ data: mockPhones[0], error: null })
    mockSupabase.order.mockResolvedValue({ data: [], error: null })
    mockSupabase.insert.mockResolvedValue({ data: null, error: null })

    const ProductPage = (await import('@/app/shop/[id]/page')).default
    render(<ProductPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ahmed Khan')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Ahmed Khan'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('Aapka experience kaisa tha?'), { target: { value: 'Great phone!' } })
    fireEvent.click(screen.getByText('Submit Review →'))

    await waitFor(() => {
      expect(mockSupabase.insert).toHaveBeenCalled()
    })
  })
})

// ─── 7. 404 Page Tests ────────────────────────────────────────────────────────
describe('404 Page', () => {
  test('renders 404 heading', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  test('renders go to homepage button', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument()
  })

  test('renders browse iPhones button', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('Browse iPhones →')).toBeInTheDocument()
  })

  test('404 number is visible', async () => {
    const NotFound = (await import('@/app/not-found')).default
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})

// ─── 8. Ustaad Ji API Tests ───────────────────────────────────────────────────
describe('Ustaad Ji API', () => {
  test('returns 400 when no messages provided', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  test('returns 400 when messages array is empty', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

// ─── 9. Checkout Page Tests ───────────────────────────────────────────────────
describe('Checkout Page', () => {
  test('renders step 1 details form', async () => {
    const CheckoutPage = (await import('@/app/checkout/page')).default
    render(<CheckoutPage />)
    await waitFor(() => {
      expect(screen.getByText('Your Details')).toBeInTheDocument()
    })
  })

  test('renders full name field', async () => {
    const CheckoutPage = (await import('@/app/checkout/page')).default
    render(<CheckoutPage />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ahmed Khan')).toBeInTheDocument()
    })
  })

  test('renders Continue to Payment button', async () => {
    const CheckoutPage = (await import('@/app/checkout/page')).default
    render(<CheckoutPage />)
    await waitFor(() => {
      expect(screen.getByText('Continue to Payment →')).toBeInTheDocument()
    })
  })
})