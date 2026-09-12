import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Car, Calendar, Search } from 'lucide-react';
import { requestService } from '../../services/requestService';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const MechanicCustomersPage = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await requestService.getMechanicRequests({ tab: 'all' });
        if (res.success && res.data?.requests) {
          setRequests(res.data.requests);
        }
      } catch (error) {
        showToast('Error loading customer list', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Aggregate unique customers
  const customerMap = {};
  requests.forEach((req) => {
    if (req.customer) {
      const cId = req.customer._id;
      if (!customerMap[cId]) {
        customerMap[cId] = {
          customer: req.customer,
          vehicles: [],
          totalServices: 0,
          totalSpend: 0,
          lastServiceDate: req.createdAt,
        };
      }
      customerMap[cId].totalServices += 1;
      customerMap[cId].totalSpend += req.finalCost || req.estimatedCost || 0;
      if (req.vehicle && !customerMap[cId].vehicles.some((v) => v._id === req.vehicle._id)) {
        customerMap[cId].vehicles.push(req.vehicle);
      }
    }
  });

  const customerList = Object.values(customerMap).filter((item) => {
    if (!search) return true;
    const name = item.customer?.name?.toLowerCase() || '';
    const phone = item.customer?.phone?.toLowerCase() || '';
    const email = item.customer?.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || phone.includes(q) || email.includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Customer History Directory ({customerList.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Overview of vehicle owners who have booked repairs or maintenance at your workshop.
        </p>
      </div>

      {/* Search Filter */}
      <div style={{
        maxWidth: '450px',
        position: 'relative',
      }}>
        <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search customer by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Customers List */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : customerList.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="No customer records found"
          description="Customer logs will populate automatically as clients book services at your center."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {customerList.map((item) => (
            <div
              key={item.customer?._id}
              className="card card-hover"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}>
                    {item.customer?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.customer?.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Joined {new Date(item.customer?.createdAt || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={15} color="var(--success)" />
                    {item.customer?.phone || 'N/A'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={15} color="var(--primary)" />
                    {item.customer?.email}
                  </div>
                </div>

                {/* Vehicles Serviced */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Vehicles Serviced ({item.vehicles.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {item.vehicles.map((v) => (
                      <span
                        key={v._id}
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          color: 'var(--text-main)',
                        }}
                      >
                        🚗 {v.brand} {v.model} ({v.registrationNumber})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
              }}>
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>TOTAL BOOKINGS</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.totalServices} services</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>TOTAL BILLED</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>${item.totalSpend}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
