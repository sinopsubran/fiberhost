import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Customer = {
  id: number
  name: string
  phone: string
  email: string
  address: string
  amount: number
  dueDate: string
  status: 'Paid' | 'Pending'
}

function App() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Arun Kumar',
      phone: '9876543210',
      email: 'arun@example.com',
      address: 'Thrissur',
      amount: 799,
      dueDate: '2026-08-10',
      status: 'Paid',
    },
    {
      id: 2,
      name: 'Rahul P',
      phone: '9847123456',
      email: 'rahul@example.com',
      address: 'Pattikkad',
      amount: 999,
      dueDate: '2026-08-12',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Suresh B',
      phone: '9605123456',
      email: 'suresh@example.com',
      address: 'Kunnamkulam',
      amount: 799,
      dueDate: '2026-08-15',
      status: 'Paid',
    },
  ])

  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    amount: '',
    dueDate: '',
  })

  const sendOtp = () => {
    if (mobile.length === 10) {
      setStep('otp')
    }
  }

  const verifyOtp = () => {
    if (otp.length === 6) {
      setLoggedIn(true)
    }
  }

  const logout = () => {
    setLoggedIn(false)
    setStep('mobile')
    setMobile('')
    setOtp('')
  }

  const addCustomer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newCustomer: Customer = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      status: 'Pending',
    }

    setCustomers((current) => [...current, newCustomer])

    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      amount: '',
      dueDate: '',
    })

    setShowAddCustomer(false)
  }

  const togglePaymentStatus = (id: number) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status:
                customer.status === 'Paid'
                  ? 'Pending'
                  : 'Paid',
            }
          : customer,
      ),
    )
  }

  const deleteCustomer = (id: number) => {
    setCustomers((current) =>
      current.filter((customer) => customer.id !== id),
    )
  }

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase()

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.email.toLowerCase().includes(query)
    )
  })

  const totalMonthly = useMemo(
    () =>
      customers.reduce(
        (total, customer) => total + customer.amount,
        0,
      ),
    [customers],
  )

  const totalCollected = useMemo(
    () =>
      customers
        .filter((customer) => customer.status === 'Paid')
        .reduce(
          (total, customer) => total + customer.amount,
          0,
        ),
    [customers],
  )

  const totalPending = useMemo(
    () =>
      customers
        .filter((customer) => customer.status === 'Pending')
        .reduce(
          (total, customer) => total + customer.amount,
          0,
        ),
    [customers],
  )

  const paidCustomers = customers.filter(
    (customer) => customer.status === 'Paid',
  ).length

  const pendingCustomers = customers.filter(
    (customer) => customer.status === 'Pending',
  ).length

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <div className="login-layout">
          <section className="brand-section">
            <div className="brand large-brand">
              <div className="brand-logo">F</div>

              <span>
                FIBER<span>HOST</span>
              </span>
            </div>

            <div className="hero-content">
              <div className="live-pill">
                <span></span>
                FIBER NETWORK
              </div>

              <h1>
                Your connection.
                <br />
                <strong>Your control.</strong>
              </h1>

              <p>
                Manage customers, monthly collections,
                payments and internet connections from one
                secure place.
              </p>
            </div>

            <div className="feature-row">
              <div>
                <strong>99.9%</strong>
                <span>Network uptime</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Customer support</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Secure access</span>
              </div>
            </div>
          </section>

          <section className="login-section">
            <div className="glass-card">
              <div className="card-top">
                <div className="mobile-logo">F</div>

                <span className="secure-label">
                  🔒 SECURE LOGIN
                </span>
              </div>

              {step === 'mobile' ? (
                <>
                  <h2>Welcome back</h2>

                  <p className="login-description">
                    Enter your registered mobile number to
                    continue.
                  </p>

                  <label>Mobile Number</label>

                  <div className="phone-input">
                    <span>+91</span>

                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(event) =>
                        setMobile(
                          event.target.value.replace(
                            /\D/g,
                            '',
                          ),
                        )
                      }
                    />
                  </div>

                  <button
                    className="primary-button"
                    onClick={sendOtp}
                    disabled={mobile.length !== 10}
                  >
                    Send OTP
                    <span>→</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="back-button"
                    onClick={() => setStep('mobile')}
                  >
                    ← Change number
                  </button>

                  <h2>Verify your number</h2>

                  <p className="login-description">
                    Enter the 6-digit OTP sent to
                    <strong> +91 {mobile}</strong>
                  </p>

                  <label>Enter OTP</label>

                  <input
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(
                          /\D/g,
                          '',
                        ),
                      )
                    }
                  />

                  <button
                    className="primary-button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 6}
                  >
                    Verify & Continue
                    <span>→</span>
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-logo">F</div>

          <span>
            FIBER<span>HOST</span>
          </span>
        </div>

        <div className="header-actions">
          <button
            className="add-customer-btn"
            onClick={() => setShowAddCustomer(true)}
          >
            + Add Customer
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-title">
          <div>
            <span className="small-label">
              FIBERHOST MANAGEMENT
            </span>

            <h1>Monthly Collection</h1>

            <p>
              Manage your customers and monthly payments.
            </p>
          </div>

          <div className="month-badge">
            August 2026
          </div>
        </div>

        <section className="stats-grid">
          <div className="stat-card monthly">
            <div className="stat-top">
              <span className="stat-icon">₹</span>

              <span className="stat-trend">MONTHLY</span>
            </div>

            <p>Total Monthly Collection</p>

            <h2>
              ₹{totalMonthly.toLocaleString('en-IN')}
            </h2>

            <span>
              {customers.length} active customers
            </span>
          </div>

          <div className="stat-card collected">
            <div className="stat-top">
              <span className="stat-icon">✓</span>

              <span className="stat-trend">PAID</span>
            </div>

            <p>Total Collected</p>

            <h2>
              ₹{totalCollected.toLocaleString('en-IN')}
            </h2>

            <span>{paidCustomers} customers paid</span>
          </div>

          <div className="stat-card pending">
            <div className="stat-top">
              <span className="stat-icon">!</span>

              <span className="stat-trend">PENDING</span>
            </div>

            <p>Total Pending</p>

            <h2>
              ₹{totalPending.toLocaleString('en-IN')}
            </h2>

            <span>
              {pendingCustomers} customers pending
            </span>
          </div>
        </section>

        <section className="collection-card">
          <div className="table-header">
            <div>
              <span className="small-label">
                CUSTOMER COLLECTION
              </span>

              <h2>Customers</h2>
            </div>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Monthly</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info">
                        <div className="avatar">
                          {customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {customer.name}
                          </strong>

                          <span>
                            {customer.address}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-info">
                        <strong>
                          +91 {customer.phone}
                        </strong>

                        <span>{customer.email}</span>
                      </div>
                    </td>

                    <td>
                      <strong>
                        ₹
                        {customer.amount.toLocaleString(
                          'en-IN',
                        )}
                      </strong>
                    </td>

                    <td>
                      {new Date(
                        customer.dueDate,
                      ).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td>
                      <button
                        className={`status-badge ${customer.status.toLowerCase()}`}
                        onClick={() =>
                          togglePaymentStatus(
                            customer.id,
                          )
                        }
                      >
                        <span></span>
                        {customer.status}
                      </button>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteCustomer(customer.id)
                        }
                        title="Delete customer"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <div className="empty-state">
                <div>⌕</div>
                <h3>No customers found</h3>
                <p>
                  Try another search or add a new customer.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {showAddCustomer && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddCustomer(false)}
        >
          <div
            className="customer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="small-label">
                  CUSTOMER MANAGEMENT
                </span>

                <h2>Add Customer</h2>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowAddCustomer(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={addCustomer}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Customer Name</label>

                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        phone: event.target.value.replace(
                          /\D/g,
                          '',
                        ),
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email</label>

                  <input
                    type="email"
                    placeholder="customer@email.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Monthly Amount</label>

                  <input
                    type="number"
                    placeholder="799"
                    min="0"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        amount: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field full">
                  <label>Address</label>

                  <input
                    type="text"
                    placeholder="Enter customer address"
                    value={form.address}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        address: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Due Date</label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        dueDate: event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowAddCustomer(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
