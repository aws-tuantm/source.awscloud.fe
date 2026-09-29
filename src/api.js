const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://yba8kgabs7.execute-api.ap-southeast-1.amazonaws.com';

export const api = {
  // 1. Events CRUD
  async getEvents() {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error('Không thể tải danh sách sự kiện.');
    return res.json();
  },

  async getEventById(eventId) {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!res.ok) throw new Error('Không tìm thấy sự kiện.');
    return res.json();
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Tạo sự kiện thất bại.');
    return data;
  },

  async updateEvent(eventId, eventData) {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Cập nhật sự kiện thất bại.');
    return data;
  },

  async deleteEvent(eventId) {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Xóa sự kiện thất bại.');
    return data;
  },

  async getEventStats(eventId) {
    const res = await fetch(`${API_BASE_URL}/stats/${eventId}`);
    if (!res.ok) throw new Error('Không thể tải thống kê.');
    return res.json();
  },

  // 2. Direct File Upload to S3 (Banner / Avatar)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Upload ảnh lên S3 thất bại.');
    return data; // { message, url, key }
  },

  // 3. Attendees
  async getAttendees(eventId, responseFilter = '') {
    const url = responseFilter 
      ? `${API_BASE_URL}/attendees/${eventId}?response=${responseFilter}`
      : `${API_BASE_URL}/attendees/${eventId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Không thể tải danh sách người tham gia.');
    return res.json();
  },

  // 4. Submit Registration (Hỗ trợ FormData kèm File Avatar)
  async submitRsvp(formData) {
    const res = await fetch(`${API_BASE_URL}/rsvp`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Gửi đăng ký thất bại.');
    }
    return data;
  },

  // 5. Send Email via AWS SES (Hỗ trợ gửi 1 hoặc nhiều email)
  async sendEmail(eventId, emails, eventDetails = null) {
    const res = await fetch(`${API_BASE_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event_id: eventId, 
        emails: emails,
        email: typeof emails === 'string' ? emails : undefined,
        eventDetails 
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Gửi email thất bại.');
    }
    return data;
  },

  // 6. AWS Cognito Authentication
  async signUp(email, password, name) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Đăng ký thất bại.');
    }
    return data;
  },

  async confirmSignUp(email, code) {
    const res = await fetch(`${API_BASE_URL}/auth/confirm-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Xác thực OTP thất bại.');
    }
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Đăng nhập thất bại.');
    }
    return data;
  },

  async resendCode(email) {
    const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Gửi lại mã thất bại.');
    }
    return data;
  },
};
