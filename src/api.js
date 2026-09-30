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
    if (!file) throw new Error('Vui lòng chọn file cần tải lên.');

    // 1. Thử gửi file qua Backend endpoint /upload (Backend đẩy trực tiếp lên S3, tránh lỗi S3 CORS trên trình duyệt)
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          message: data.message || 'Upload ảnh lên S3 thành công!',
          url: data.url,
          fileUrl: data.url,
          key: data.key,
        };
      }
    } catch {
      // Fallback sang luồng Presigned URL nếu /upload không khả dụng
    }

    // 2. Luồng Presigned URL dự phòng
    const urlRes = await fetch(`${API_BASE_URL}/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || 'image/jpeg',
      }),
    });

    const urlData = await urlRes.json();
    if (!urlRes.ok) {
      throw new Error(urlData.message || urlData.error || 'Không thể lấy đường dẫn tải ảnh lên S3.');
    }

    const { uploadUrl, fileUrl, key } = urlData;

    const s3UploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
      },
      body: file,
    });

    if (!s3UploadRes.ok) {
      throw new Error('Tải ảnh trực tiếp lên Amazon S3 thất bại. (Vui lòng kiểm tra CORS trên S3 Bucket)');
    }

    return {
      message: 'Upload ảnh lên S3 thành công!',
      url: fileUrl,
      fileUrl: fileUrl,
      key: key,
    };
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

  // 4. Submit Registration (Hỗ trợ JSON hoặc FormData kèm File Avatar)
  async submitRsvp(inputData) {
    let payload = inputData;

    // Nếu truyền vào FormData, tự động upload file avatar trước (nếu có) rồi chuyển thành JSON
    if (typeof FormData !== 'undefined' && inputData instanceof FormData) {
      let avatarUrl = '';
      const avatarFile = inputData.get('avatar');
      if (avatarFile instanceof File && avatarFile.size > 0) {
        const uploadRes = await this.uploadFile(avatarFile);
        avatarUrl = uploadRes.url || uploadRes.fileUrl;
      }

      payload = {
        event_id: inputData.get('event_id'),
        full_name: inputData.get('full_name'),
        email: inputData.get('email'),
        response: inputData.get('response') || 'Yes',
        avatar_url: avatarUrl || undefined,
      };
    }

    const res = await fetch(`${API_BASE_URL}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
