import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from './api';
import { isValidEmail } from './components/EmailChipInput';

// Modular UI Components
import Header from './components/common/Header';
import Toast from './components/common/Toast';
import ConfirmModal from './components/common/ConfirmModal';
import AuthModal from './components/auth/AuthModal';
import EventListTab from './components/events/EventListTab';
import EventManageTab from './components/events/EventManageTab';
import EventModal from './components/events/EventModal';
import AttendeesTab from './components/attendees/AttendeesTab';
import RegisterModal from './components/attendees/RegisterModal';
import EmailTab from './components/email/EmailTab';

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab from URL
  const activeTab = location.pathname.startsWith('/manage')
    ? 'manage'
    : location.pathname.startsWith('/attendees')
      ? 'attendees'
      : location.pathname.startsWith('/email')
        ? 'email'
        : 'events';

  const navigateTab = (tab) => {
    navigate(`/${tab}`);
  };

  // Main State
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [attendeeFilter, setAttendeeFilter] = useState('');
  const [stats, setStats] = useState({ Yes: 0, No: 0 });
  const [loading, setLoading] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // User Auth State (Cognito)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cognito_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals and Popups
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'confirm'
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', code: '' });
  const [authLoading, setAuthLoading] = useState(false);

  // Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    event_id: '',
    full_name: '',
    email: '',
    response: 'Yes',
    avatarFile: null,
    avatarPreview: null,
  });
  const [registerSubmitting, setRegisterSubmitting] = useState(false);

  // Event Manage Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventModalMode, setEventModalMode] = useState('create'); // 'create' | 'edit'
  const [eventForm, setEventForm] = useState({
    event_id: '',
    title: '',
    description: '',
    start_at: '',
    venue: '',
    banner_url: '',
    bannerFile: null,
    bannerPreview: null,
  });
  const [eventSubmitting, setEventSubmitting] = useState(false);

  // Email Form State
  const [emailForm, setEmailForm] = useState({ event_id: '', emails: ['devblue404@gmail.com'] });
  const [emailSending, setEmailSending] = useState(false);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => setToast(null), 4000);
  };

  // 1. Fetch Events
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0].event_id);
      }
    } catch (err) {
      if (events.length === 0) {
        const sampleEvents = [
          {
            event_id: 'aws-buildercards-tournament-2026',
            title: 'AWS BuilderCards Tournament 2026',
            description: 'Giải đấu AWS BuilderCards hấp dẫn dành cho các Cloud Developers & Architects.',
            venue: 'AWS Singapore Office & Virtual',
            start_at: '2026-11-20T09:00:00.000Z',
            banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
          },
          {
            event_id: 'aws-community-day-vietnam',
            title: 'AWS Community Day Vietnam',
            description: 'Sự kiện chia sẻ kiến trúc Cloud, Serverless và AI thực chiến từ AWS Community.',
            venue: 'TP. Hồ Chí Minh & Live Stream',
            start_at: '2026-12-15T08:30:00.000Z',
            banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
          },
        ];
        setEvents(sampleEvents);
        if (!selectedEventId) setSelectedEventId(sampleEvents[0].event_id);
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Attendees and Stats
  const loadAttendeesAndStats = async (eventId, filter = '') => {
    if (!eventId) return;
    try {
      setAttendeesLoading(true);
      const [attendeeList, statData] = await Promise.all([
        api.getAttendees(eventId, filter),
        api.getEventStats(eventId).catch(() => ({ Yes: 0, No: 0 })),
      ]);
      setAttendees(attendeeList);
      setStats(statData);
    } catch (err) {
      console.warn('Lỗi tải danh sách người tham gia:', err.message);
    } finally {
      setAttendeesLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadAttendeesAndStats(selectedEventId, attendeeFilter);
      if (!emailForm.event_id) {
        setEmailForm((prev) => ({ ...prev, event_id: selectedEventId }));
      }
    }
  }, [selectedEventId, attendeeFilter]);

  // Auth Operations (Cognito)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const res = await api.login(authForm.email, authForm.password);
      const userObj = {
        email: authForm.email,
        tokens: res.tokens,
      };
      setCurrentUser(userObj);
      localStorage.setItem('cognito_user', JSON.stringify(userObj));
      setShowAuthModal(false);
      showToast(`Chào mừng bạn trở lại, ${authForm.email}!`);
      setAuthForm({ email: '', password: '', name: '', code: '' });
    } catch (err) {
      if (err.message?.includes('UserNotConfirmedException') || err.message?.includes('chưa xác thực')) {
        setAuthMode('confirm');
        showToast('Tài khoản chưa xác thực OTP. Vui lòng kiểm tra email và nhập mã!', 'info');
      } else {
        showToast(err.message, 'error');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isValidEmail(authForm.email)) {
      showToast('Địa chỉ email không đúng định dạng.', 'error');
      return;
    }
    if (authForm.password.length < 8) {
      showToast('Mật khẩu phải có tối thiểu 8 ký tự.', 'error');
      return;
    }
    try {
      setAuthLoading(true);
      await api.signUp(authForm.email, authForm.password, authForm.name);
      setAuthMode('confirm');
      showToast('Đăng ký thành công! Vui lòng kiểm tra email lấy mã OTP.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      await api.confirmSignUp(authForm.email, authForm.code);
      showToast('Xác thực OTP thành công! Đang tự động đăng nhập...');
      const loginRes = await api.login(authForm.email, authForm.password);
      const userObj = {
        email: authForm.email,
        tokens: loginRes.tokens,
      };
      setCurrentUser(userObj);
      localStorage.setItem('cognito_user', JSON.stringify(userObj));
      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', name: '', code: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const confirmLogoutAction = () => {
    setCurrentUser(null);
    localStorage.removeItem('cognito_user');
    setShowLogoutConfirm(false);
    showToast('Đã đăng xuất tài khoản thành công!');
  };

  // Image Upload Validation Helper
  const validateUploadedImage = (file) => {
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const isExtensionValid = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
    const isMimeValid = ALLOWED_IMAGE_MIME_TYPES.includes(file.type?.toLowerCase());

    if (!isExtensionValid && !isMimeValid) {
      showToast('Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP.', 'error');
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      showToast(`Kích thước file (${sizeMB}MB) vượt quá giới hạn cho phép tối đa 2MB.`, 'error');
      return false;
    }

    return true;
  };

  // Event Banner Handling
  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateUploadedImage(file)) {
      e.target.value = '';
      return;
    }
    setEventForm((prev) => ({
      ...prev,
      bannerFile: file,
      bannerPreview: URL.createObjectURL(file),
    }));
  };

  // Avatar Handling
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateUploadedImage(file)) {
      e.target.value = '';
      return;
    }
    setRegisterForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  // Event Modal Actions
  const openCreateEventModal = () => {
    setEventModalMode('create');
    setEventForm({
      event_id: `event-${Date.now()}`,
      title: '',
      description: '',
      start_at: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
      venue: '',
      banner_url: '',
      bannerFile: null,
      bannerPreview: null,
    });
    setShowEventModal(true);
  };

  const openEditEventModal = (event) => {
    setEventModalMode('edit');
    setEventForm({
      event_id: event.event_id,
      title: event.title || '',
      description: event.description || '',
      start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
      venue: event.venue || '',
      banner_url: event.banner_url || '',
      bannerFile: null,
      bannerPreview: event.banner_url || null,
    });
    setShowEventModal(true);
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      showToast('Vui lòng nhập tiêu đề sự kiện!', 'error');
      return;
    }

    try {
      setEventSubmitting(true);
      let finalBannerUrl = eventForm.banner_url;

      if (eventForm.bannerFile) {
        showToast('Đang tải ảnh bìa sự kiện lên Amazon S3...', 'info');
        const uploadRes = await api.uploadFile(eventForm.bannerFile);
        finalBannerUrl = uploadRes.url;
      }

      const eventPayload = {
        event_id: eventForm.event_id,
        title: eventForm.title.trim(),
        description: eventForm.description,
        start_at: eventForm.start_at || new Date().toISOString(),
        venue: eventForm.venue,
        banner_url: finalBannerUrl,
      };

      if (eventModalMode === 'create') {
        await api.createEvent(eventPayload);
        showToast('Tạo sự kiện mới thành công!');
      } else {
        await api.updateEvent(eventForm.event_id, eventPayload);
        showToast('Cập nhật sự kiện thành công!');
      }

      setShowEventModal(false);
      await loadEvents();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEventSubmitting(false);
    }
  };

  const executeDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await api.deleteEvent(eventToDelete.event_id);
      showToast(`Đã xóa sự kiện "${eventToDelete.title}" thành công!`);
      setEventToDelete(null);
      await loadEvents();
    } catch (err) {
      showToast('Xóa sự kiện thất bại: ' + err.message, 'error');
    }
  };

  // Registration RSVP Flow
  const handlePreSubmitRegister = (e) => {
    e.preventDefault();
    if (!isValidEmail(registerForm.email)) {
      showToast('Địa chỉ email không đúng định dạng (VD: name@domain.com)', 'error');
      return;
    }
    if (!registerForm.full_name.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn', 'error');
      return;
    }
    setShowRegisterConfirm(true);
  };

  const executeRegisterSubmit = async () => {
    try {
      setRegisterSubmitting(true);
      const formData = new FormData();
      formData.append('event_id', registerForm.event_id);
      formData.append('full_name', registerForm.full_name.trim());
      formData.append('email', registerForm.email.trim().toLowerCase());
      formData.append('response', registerForm.response);

      if (registerForm.avatarFile) {
        formData.append('avatar', registerForm.avatarFile);
      }

      const res = await api.submitRsvp(formData);
      showToast(res.message || 'Đăng ký thành công! Email xác nhận đã được gửi qua SES.');
      setShowRegisterConfirm(false);
      setShowRegisterModal(false);

      if (selectedEventId === registerForm.event_id) {
        loadAttendeesAndStats(selectedEventId, attendeeFilter);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRegisterSubmitting(false);
    }
  };

  // Email Flow
  const handleFillAllYesAttendees = async () => {
    if (!emailForm.event_id) {
      showToast('Vui lòng chọn một sự kiện trước khi lấy danh sách email!', 'error');
      return;
    }
    try {
      const data = await api.getAttendees(emailForm.event_id, 'Yes');
      const yesEmails = data.map((a) => a.email?.trim().toLowerCase()).filter(isValidEmail);
      if (yesEmails.length === 0) {
        showToast('Chưa có người tham gia (Yes) nào có email hợp lệ cho sự kiện này.', 'info');
        return;
      }
      setEmailForm((prev) => ({
        ...prev,
        emails: [...new Set([...prev.emails, ...yesEmails])],
      }));
      showToast(`Đã tự động thêm ${yesEmails.length} email người tham gia (Yes) vào danh sách chip!`);
    } catch (err) {
      showToast('Không thể lấy danh sách người tham gia: ' + err.message, 'error');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.event_id) {
      showToast('Vui lòng chọn một sự kiện trước khi gửi email!', 'error');
      return;
    }

    const validEmails = (emailForm.emails || []).map((e) => e.trim().toLowerCase()).filter(isValidEmail);

    if (validEmails.length === 0) {
      showToast('Vui lòng thêm ít nhất một địa chỉ email người nhận hợp lệ!', 'error');
      return;
    }

    try {
      setEmailSending(true);
      const targetEvent = events.find((ev) => ev.event_id === emailForm.event_id);
      const res = await api.sendEmail(emailForm.event_id, validEmails, targetEvent);
      showToast(res.message || `Đã gửi email thông tin sự kiện thành công tới ${validEmails.length} người nhận!`);
    } catch (err) {
      showToast('Gửi email thất bại: ' + err.message, 'error');
    } finally {
      setEmailSending(false);
    }
  };

  const openRegisterForEvent = (event) => {
    setRegisterForm((prev) => ({
      ...prev,
      event_id: event.event_id,
      email: currentUser?.email || prev.email,
      full_name: currentUser ? prev.full_name || currentUser.email.split('@')[0] : prev.full_name,
    }));
    setShowRegisterModal(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased font-sans">
      {/* 1. Header */}
      <Header
        activeTab={activeTab}
        navigateTab={navigateTab}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />

      {/* 2. Main Content Tabs */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3.5 sm:py-8">
        {activeTab === 'events' && (
          <EventListTab
            events={events}
            loading={loading}
            onRefresh={loadEvents}
            onOpenRegister={openRegisterForEvent}
            onViewAttendees={(eventId) => {
              setSelectedEventId(eventId);
              navigateTab('attendees');
            }}
          />
        )}

        {activeTab === 'manage' && (
          <EventManageTab
            events={events}
            loading={loading}
            onOpenCreate={openCreateEventModal}
            onOpenEdit={openEditEventModal}
            onOpenDelete={(ev) => setEventToDelete(ev)}
          />
        )}

        {activeTab === 'attendees' && (
          <AttendeesTab
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={(val) => setSelectedEventId(val)}
            attendees={attendees}
            attendeesLoading={attendeesLoading}
            attendeeFilter={attendeeFilter}
            setAttendeeFilter={setAttendeeFilter}
            stats={stats}
            onRefresh={() => loadAttendeesAndStats(selectedEventId, attendeeFilter)}
          />
        )}

        {activeTab === 'email' && (
          <EmailTab
            events={events}
            emailForm={emailForm}
            setEmailForm={setEmailForm}
            emailSending={emailSending}
            onSendEmail={handleSendEmail}
            onFillYesAttendees={handleFillAllYesAttendees}
          />
        )}
      </main>

      {/* 3. Modals */}
      <EventModal
        isOpen={showEventModal}
        mode={eventModalMode}
        onClose={() => setShowEventModal(false)}
        eventForm={eventForm}
        setEventForm={setEventForm}
        submitting={eventSubmitting}
        onSubmit={handleEventFormSubmit}
        onBannerChange={handleBannerFileChange}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        submitting={registerSubmitting}
        onSubmit={handlePreSubmitRegister}
        onAvatarChange={handleAvatarChange}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        authLoading={authLoading}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onConfirmSignUp={handleConfirmSignUp}
      />

      {/* 4. Confirmation Popups */}
      <ConfirmModal
        isOpen={!!eventToDelete}
        title="Xác nhận xóa sự kiện"
        subtitle="Hành động này sẽ xóa vĩnh viễn sự kiện."
        confirmText="Xóa sự kiện"
        confirmVariant="danger"
        onCancel={() => setEventToDelete(null)}
        onConfirm={executeDeleteEvent}
      >
        <div className="p-2.5 sm:p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-300">
          Bạn có chắc muốn xóa: <strong className="text-white block mt-0.5 truncate">"{eventToDelete?.title}"</strong>
        </div>
      </ConfirmModal>

      <ConfirmModal
        isOpen={showRegisterConfirm}
        title="Xác nhận đăng ký sự kiện"
        subtitle="Vui lòng kiểm tra lại thông tin trước khi gửi."
        confirmText="Xác nhận gửi"
        cancelText="Chỉnh sửa lại"
        confirmVariant="primary"
        loading={registerSubmitting}
        onCancel={() => setShowRegisterConfirm(false)}
        onConfirm={executeRegisterSubmit}
      >
        <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 sm:p-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Họ và tên:</span>
            <span className="font-semibold text-zinc-200 truncate ml-2">{registerForm.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Email:</span>
            <span className="font-semibold text-zinc-200 truncate ml-2">{registerForm.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Trạng thái:</span>
            <span className={`font-bold ${registerForm.response === 'Yes' ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {registerForm.response === 'Yes' ? 'Có tham gia' : 'Không tham gia'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Ảnh đại diện:</span>
            <span className="text-zinc-300 truncate ml-2">
              {registerForm.avatarFile ? registerForm.avatarFile.name : 'Không đính kèm'}
            </span>
          </div>
        </div>
      </ConfirmModal>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        subtitle="Bạn có chắc chắn muốn đăng xuất tài khoản này?"
        confirmText="Đăng xuất"
        confirmVariant="danger"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogoutAction}
      />

      {/* 5. Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
