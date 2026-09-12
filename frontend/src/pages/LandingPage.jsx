import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Car, 
  Gauge, 
  Cpu, 
  Droplet, 
  BatteryCharging,
  Disc,
  Wind
} from 'lucide-react';
import { mechanicService } from '../services/mechanicService';
import { MechanicCard } from '../components/MechanicCard';
import { DemoCredentialsBanner } from '../components/DemoCredentialsBanner';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const LandingPage = () => {
  const [featuredMechanics, setFeaturedMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await mechanicService.getFeaturedMechanics();
        if (res.success && res.data?.mechanics) {
          setFeaturedMechanics(res.data.mechanics);
        }
      } catch (error) {
        console.error('Error fetching featured mechanics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedVehicleType) params.append('vehicleType', selectedVehicleType);
    navigate(`/find-mechanic?${params.toString()}`);
  };

  const servicesList = [
    { name: 'Periodic Full Service', icon: <Wrench size={22} />, desc: 'Engine oil, OEM filters, spark plugs & 40-point safety check' },
    { name: 'Computer Diagnostics', icon: <Cpu size={22} />, desc: 'OBD-II scanner reading, sensor checks, check engine light diagnosis' },
    { name: 'Brake Service & Pads', icon: <Disc size={22} />, desc: 'Ceramic pads, rotor resurfacing, caliper lubrication' },
    { name: 'Battery Testing & Swap', icon: <BatteryCharging size={22} />, desc: 'Voltage load test, alternator check, new battery installation' },
    { name: 'Tyre & 3D Alignment', icon: <Gauge size={22} />, desc: 'Laser 4-wheel alignment, wheel balancing, puncture repair' },
    { name: 'Express Synthetic Oil Change', icon: <Droplet size={22} />, desc: '5W-30 / 5W-40 full synthetic oil and filter change in 45 mins' },
    { name: 'AC Gas Refill & Service', icon: <Wind size={22} />, desc: 'Cooling leak test, R134a refrigerant recharge, cabin duct cleaning' },
    { name: '24/7 Roadside Rescue', icon: <Zap size={22} />, desc: 'On-site dead battery jump starts, flat tyre assistance, towing' },
  ];

  const steps = [
    {
      num: '1',
      title: 'Find local workshops',
      desc: 'Search independent garages near your location. Filter by distance, vehicle type, and ratings.',
    },
    {
      num: '2',
      title: 'See prices & services',
      desc: 'Browse upfront service pricing, estimated turnaround times, and verified customer feedback.',
    },
    {
      num: '3',
      title: 'Book a drop-off time',
      desc: 'Select your vehicle, describe symptoms, and reserve an appointment slot.',
    },
    {
      num: '4',
      title: 'Get live repair updates',
      desc: 'Track your car or bike through inspection, parts replacement, and ready status.',
    },
    {
      num: '5',
      title: 'Pick up with clear billing',
      desc: 'Collect your vehicle with an itemized breakdown of parts and labor.',
    },
  ];

  const genuineReviews = [
    {
      name: 'Alex Rivera',
      vehicle: '2022 Honda City ZX',
      garage: 'Apex AutoCare & Diagnostics',
      comment: 'Took my car in for a loud front brake screech. Marcus showed me the worn 2mm pads before putting on new ceramic ones and resurfacing the rotors. Ready by 3:30 PM with zero brake noise.',
      rating: 5,
    },
    {
      name: 'Sarah Jenkins',
      vehicle: '2023 Hyundai i20 Turbo',
      garage: 'Apex AutoCare & Diagnostics',
      comment: 'AC was blowing warm air in afternoon traffic. They vacuum-tested the system, topped up R134a gas, and cleaned the cabin filter. Clean workshop and upfront quote.',
      rating: 5,
    },
    {
      name: 'Vikram Menon',
      vehicle: '2021 Toyota Fortuner',
      garage: 'ProGarage 24/7 Roadside Assist',
      comment: 'Battery died in my apartment parking lot at 7:30 AM before an important meeting. ProGarage arrived in 25 minutes with a jump pack and tested my alternator charging voltage on the spot.',
      rating: 5,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '4rem 0 2rem',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            maxWidth: '820px',
            margin: '0 auto 1rem',
          }}>
            Find a reliable mechanic near you.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'var(--text-muted)',
            maxWidth: '640px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.55,
          }}>
            Search local workshops, compare upfront repair pricing, and get live updates while your vehicle is being serviced.
          </p>

          {/* Search Form */}
          <div style={{
            maxWidth: '840px',
            margin: '0 auto 2rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.65rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <form onSubmit={handleSearch} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
              gap: '0.65rem',
              alignItems: 'center',
            }}>
              {/* Search keywords */}
              <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Service or symptom (e.g. brakes, oil, AC)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {/* City or Area */}
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="City or neighborhood (e.g. Bangalore)"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                >
                  <option value="">All Vehicles</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Motorcycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', height: '100%' }}
              >
                Find Mechanics
              </button>
            </form>
          </div>

          {/* Demo Banner */}
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <DemoCredentialsBanner />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>How FixNear Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            A transparent way to get your vehicle serviced without unexpected surprises.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {steps.map((step) => (
            <div
              key={step.num}
              className="card"
              style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services Section */}
      <section id="services" className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Common Vehicle Services</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Compare workshops that specialize in the exact repair your vehicle needs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {servicesList.map((svc) => (
            <Link
              key={svc.name}
              to={`/find-mechanic?service=${encodeURIComponent(svc.name)}`}
              className="card card-hover"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1.25rem',
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {svc.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {svc.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {svc.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <ShieldCheck size={18} /> Verified Local Workshops
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
                Clear estimates. Live tracking. No hidden extras.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Vehicle owners shouldn't have to guess when their car will be ready or wonder what parts were installed. FixNear keeps you informed every step of the way.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  'Itemized service pricing before work begins',
                  'Live status updates as your vehicle moves through diagnosis to ready',
                  'Direct contact with the workshop technician handling your car',
                  'Track maintenance history across all your family vehicles',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--primary)" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Status Demo Box */}
            <div style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Example Repair Status Tracker
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderLeft: '3px solid var(--primary)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>2022 Honda City ZX</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Front Ceramic Brake Pad Replacement</div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '2px' }}>
                    ● In Progress: Resurfacing disc rotors on lathe machine
                  </div>
                </div>

                <div style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderLeft: '3px solid var(--success)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>2023 Yamaha YZF-R15</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Scheduled Periodic Service</div>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '2px' }}>
                    ✓ Ready for pickup: Test ride completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Mechanics Section */}
      <section className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Service Centers</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Top rated independent garages with certified technicians.
            </p>
          </div>
          <Link to="/find-mechanic" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            View All Workshops <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {featuredMechanics.map((mech) => (
              <MechanicCard key={mech._id} mechanic={mech} />
            ))}
          </div>
        )}
      </section>

      {/* Genuine Customer Reviews Section */}
      <section className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recent Verified Customer Reviews</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Feedback from vehicle owners after completed repairs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {genuineReviews.map((rev, i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Verified Booking</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{rev.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{rev.vehicle} • {rev.garage}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Need vehicle servicing or a breakdown repair?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.75rem' }}>
            Find trusted nearby garages or list your auto workshop on FixNear.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to="/find-mechanic" className="btn btn-primary">
              <Search size={16} /> Find a Mechanic
            </Link>
            <Link to="/register" className="btn btn-outline">
              <Wrench size={16} /> Register as a Service Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
