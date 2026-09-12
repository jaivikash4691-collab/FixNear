import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';

export const CustomerNotificationsPage = () => {
  const { setUnreadNotifsCount } = useSocket();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getMyNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadNotifsCount(res.data.unreadCount || 0);
      }
    } catch (error) {
      showToast('Error loading notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        showToast('All notifications marked as read', 'success');
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        setUnreadNotifsCount(0);
      }
    } catch (error) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotifsCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time updates about your service requests and vehicle status.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="btn btn-outline btn-sm">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonLoader type="table-row" count={5} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={32} />}
          title="No notifications yet"
          description="When your vehicle repair advances or a mechanic updates status, alerts will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className="card"
              style={{
                padding: '1.25rem',
                backgroundColor: n.isRead ? 'var(--bg-card)' : 'rgba(6, 182, 212, 0.08)',
                borderLeft: n.isRead ? '1px solid var(--border-subtle)' : '4px solid var(--primary)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {n.message}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                  {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {n.data?.serviceRequestId && (
                <Link
                  to={`/customer/services/${n.data.serviceRequestId}`}
                  className="btn btn-outline btn-sm"
                  style={{ flexShrink: 0, fontSize: '0.8rem' }}
                >
                  View Details <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
