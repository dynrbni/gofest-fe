// LocalStorage persistent state manager for GoFest Frontend

const STORAGE_KEYS = {
  USERS: 'gofest_users_v1',
  EVENTS: 'gofest_events_v1',
  ORDERS: 'gofest_orders_v1',
  TICKETS: 'gofest_tickets_v1',
  CURRENT_USER: 'gofest_current_user_v1',
  CHECKIN_LOGS: 'gofest_checkin_logs_v1',
};

// Initial Seed Data
const INITIAL_USERS = [
  {
    id: 'usr-admin',
    name: 'Super Admin GoFest',
    email: 'admin@gofest.id',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'usr-eo-1',
    name: 'Dimas Satria',
    organization: 'Remember Musik Fest Indo',
    email: 'eo@rememberfest.id',
    password: 'eo123',
    role: 'eo',
    phone: '081234567890',
    status: 'approved', // 'pending' | 'approved' | 'rejected'
    description: 'Promotor festival musik indie dan konser terbesar di Jabodetabek.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'usr-eo-2',
    name: 'Siti Rahma',
    organization: 'Nusantara Creative Hub',
    email: 'eo@nusantara.id',
    password: 'eo123',
    role: 'eo',
    phone: '081987654321',
    status: 'pending', // Pending approval for Admin Demo!
    description: 'Komunitas kreatif penyelenggara konferensi inovasi dan workshop digital.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-08T09:30:00Z',
  },
  {
    id: 'usr-staff-1',
    name: 'Rian Verifikator Lapangan',
    email: 'staff@gofest.id',
    password: 'staff123',
    role: 'staff',
    phone: '082233445566',
    eoId: 'usr-eo-1',
    assignedEventIds: ['ev-1', 'ev-2', 'ev-3'],
    createdAt: '2026-08-20T14:00:00Z',
  },
];

const INITIAL_EVENTS = [
  {
    id: 'ev-1',
    eoId: 'usr-eo-1',
    eoName: 'Remember Musik Fest Indo',
    title: 'Remember Fest 2026: The Nostalgic Sound',
    slug: 'remember-fest-2026',
    category: 'Musik',
    description: 'Festival musik nostalgia terbesar tahun ini yang mempertemukan musisi legendaris tanah air dalam perayaan akbar 2 hari berturut-turut di Open Space Gambir Expo.',
    location: 'Gambir Expo Kemayoran, Jakarta Pusat',
    city: 'Jakarta Pusat',
    date: '2026-11-07',
    endDate: '2026-11-08',
    time: '15:00 - 23:00 WIB',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    trending: true,
    status: 'published', // 'draft' | 'pending_review' | 'published' | 'rejected'
    ticketTypes: [
      { id: 'tt-1', name: 'One Day Pass Regular', price: 135000, quota: 500, sold: 320, description: 'Akses festival hari pertama' },
      { id: 'tt-2', name: 'Two Day Pass Bundling', price: 225000, quota: 300, sold: 245, description: 'Akses penuh selama 2 hari' },
      { id: 'tt-3', name: 'Standing VIP Area (Front Row)', price: 250000, quota: 150, sold: 130, description: 'Zona terdekat panggung + antrean khusus' },
    ],
    createdAt: '2026-08-15T08:00:00Z',
  },
  {
    id: 'ev-2',
    eoId: 'usr-eo-1',
    eoName: 'Saint Johns Creative',
    title: "SYNC 2026 'Luminaria' feat. Adrian Khalif",
    slug: 'sync-2026-luminaria',
    category: 'Konser',
    description: 'Malam spektakuler perpaduan tata cahaya visual futuristik dan lantunan vokal hangat Adrian Khalif bersama bintang tamu istimewa lainnya.',
    location: 'Grand Studio Hall, BSD City',
    city: 'Tangerang',
    date: '2026-10-17',
    time: '18:30 - 22:30 WIB',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    trending: false,
    status: 'published',
    ticketTypes: [
      { id: 'tt-4', name: 'Early Bird Festival', price: 80000, quota: 200, sold: 200, description: 'Tiket masuk area festival kuota terbatas' },
      { id: 'tt-5', name: 'Presale Reguler', price: 100000, quota: 400, sold: 215, description: 'Akses masuk standard' },
      { id: 'tt-6', name: 'VIP Seated', price: 180000, quota: 100, sold: 75, description: 'Tempat duduk bernomor + merchandise pack' },
    ],
    createdAt: '2026-08-18T11:00:00Z',
  },
  {
    id: 'ev-3',
    eoId: 'usr-eo-1',
    eoName: 'Ayofest Creative',
    title: 'Ayo Fest 2026: Jogja Youth Celebration',
    slug: 'ayo-fest-2026',
    category: 'Festival',
    description: 'Panggung ekspresi kreativitas anak muda dengan parade musik indie, kuliner viral, pameran zine dan karya seni visual di jantung kota Yogyakarta.',
    location: 'Stadion Kridosono, Kotabaru',
    city: 'Yogyakarta',
    date: '2026-09-20',
    time: '14:00 - 23:00 WIB',
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    trending: true,
    status: 'published',
    ticketTypes: [
      { id: 'tt-7', name: 'Festival Entrance Pass', price: 125000, quota: 800, sold: 650, description: 'Tiket masuk festival all areas' },
      { id: 'tt-8', name: 'Squad Pack (4 Orang)', price: 440000, quota: 50, sold: 42, description: 'Paket hemat masuk 4 orang sekaligus' },
    ],
    createdAt: '2026-08-22T09:15:00Z',
  },
  {
    id: 'ev-4',
    eoId: 'usr-eo-1',
    eoName: 'MLDSPOT Fresh Sound',
    title: 'Fresh Wheels 2026 - Yogyakarta Chapter',
    slug: 'fresh-wheels-2026',
    category: 'Musik',
    description: 'Kolaborasi otomotif custom, street food, dan panggung musik intim bersama Juicy Luicy dan Lomba Sihir di venue ikonik JNM Bloc.',
    location: 'JNM Bloc, Wirobrajan',
    city: 'Yogyakarta',
    date: '2026-09-12',
    time: '16:00 - 22:30 WIB',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    trending: true,
    status: 'published',
    ticketTypes: [
      { id: 'tt-9', name: 'Presale Tiket Masuk', price: 80000, quota: 400, sold: 340, description: 'Tiket masuk konser & area pameran' },
    ],
    createdAt: '2026-08-25T13:00:00Z',
  },
  {
    id: 'ev-5',
    eoId: 'usr-eo-1',
    eoName: 'Three Mountains Entertainment',
    title: '2026 GONG YOO ASIA FANMEETING TOUR <THE LONG TAKE>',
    slug: 'gong-yoo-fanmeeting-jakarta',
    category: 'Fanmeeting',
    description: 'Kesempatan eksklusif berjumpa langsung dengan aktor legendaris Gong Yoo dalam intimate session di Istora Senayan Jakarta!',
    location: 'Istora Senayan, GBK',
    city: 'Jakarta Pusat',
    date: '2026-10-17',
    time: '19:00 - 21:30 WIB',
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    trending: true,
    status: 'published',
    ticketTypes: [
      { id: 'tt-10', name: 'Cat 3 Tribune Seated', price: 1750000, quota: 500, sold: 490, description: 'Tempat duduk tribune nomor urut' },
      { id: 'tt-11', name: 'Cat 1 VIP + Hi-Touch Session', price: 3500000, quota: 200, sold: 198, description: 'Kursi VIP depan panggung + sesi Hi-Touch' },
    ],
    createdAt: '2026-08-26T15:00:00Z',
  },
  {
    id: 'ev-6',
    eoId: 'usr-eo-1',
    eoName: 'VINDES Media',
    title: 'FAM - Fan And Makers Vol. 2',
    slug: 'fam-fan-and-makers-vol-2',
    category: 'Pameran',
    description: 'Ruang temu para kreator, seniman grafis, pembuat kerajinan independen, dan talkshow inspiratif dari industri kreatif lokal.',
    location: 'The Brickhall at Fatmawati',
    city: 'Jakarta Selatan',
    date: '2026-09-15',
    time: '10:00 - 21:00 WIB',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    trending: false,
    status: 'published',
    ticketTypes: [
      { id: 'tt-12', name: 'General Daily Pass', price: 30000, quota: 1000, sold: 620, description: 'Akses masuk pameran 1 hari penuh' },
    ],
    createdAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'ev-7',
    eoId: 'usr-eo-2',
    eoName: 'Nusantara Creative Hub',
    title: 'Indonesia AI & Future Tech Summit 2026',
    slug: 'indonesia-ai-future-tech-summit',
    category: 'Seminar',
    description: 'Konferensi teknologi terbesar membahas adopsi AI generatif, cybersecurity, dan inovasi web modern bersama 20+ pembicara kelas dunia.',
    location: 'Jakarta Convention Center (JCC)',
    city: 'Jakarta Pusat',
    date: '2026-11-28',
    time: '09:00 - 17:30 WIB',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    trending: false,
    status: 'pending_review', // Demo for Admin to Review & Approve!
    ticketTypes: [
      { id: 'tt-13', name: 'Conference Pass', price: 450000, quota: 300, sold: 0, description: 'Akses ke semua keynote stage' },
      { id: 'tt-14', name: 'Executive Masterclass', price: 1200000, quota: 50, sold: 0, description: 'Keynote + Hands-on Lab + Networking Lunch' },
    ],
    createdAt: '2026-09-08T10:00:00Z',
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'GF-2026-88912',
    eventId: 'ev-1',
    eventTitle: 'Remember Fest 2026: The Nostalgic Sound',
    eventDate: '2026-11-07',
    eventLocation: 'Gambir Expo Kemayoran, Jakarta Pusat',
    buyerName: 'Ahmad Fauzi',
    buyerEmail: 'fauzi.ahmad@example.com',
    buyerPhone: '081234567891',
    totalAmount: 270000,
    paymentMethod: 'BCA Virtual Account',
    paymentStatus: 'paid', // 'pending' | 'paid' | 'expired'
    paidAt: '2026-09-01T14:20:00Z',
    items: [
      { ticketTypeId: 'tt-1', ticketName: 'One Day Pass Regular', price: 135000, quantity: 2, subtotal: 270000 }
    ],
    ticketCodes: ['GF-TIX-1001A', 'GF-TIX-1001B'],
    createdAt: '2026-09-01T14:15:00Z',
  }
];

const INITIAL_TICKETS = [
  {
    id: 'tix-1',
    ticketCode: 'GF-TIX-1001A',
    orderNumber: 'GF-2026-88912',
    eventId: 'ev-1',
    eventTitle: 'Remember Fest 2026: The Nostalgic Sound',
    ticketTypeName: 'One Day Pass Regular',
    buyerName: 'Ahmad Fauzi',
    buyerEmail: 'fauzi.ahmad@example.com',
    price: 135000,
    status: 'unused', // 'unused' | 'used'
    usedAt: null,
    usedByStaffName: null,
    createdAt: '2026-09-01T14:20:00Z',
  },
  {
    id: 'tix-2',
    ticketCode: 'GF-TIX-1001B',
    orderNumber: 'GF-2026-88912',
    eventId: 'ev-1',
    eventTitle: 'Remember Fest 2026: The Nostalgic Sound',
    ticketTypeName: 'One Day Pass Regular',
    buyerName: 'Ahmad Fauzi',
    buyerEmail: 'fauzi.ahmad@example.com',
    price: 135000,
    status: 'used', // Pre-marked used for Staff testing
    usedAt: '2026-09-02T16:45:00Z',
    usedByStaffName: 'Rian Verifikator Lapangan',
    createdAt: '2026-09-01T14:20:00Z',
  }
];

const INITIAL_CHECKIN_LOGS = [
  {
    id: 'chk-1',
    ticketCode: 'GF-TIX-1001B',
    eventId: 'ev-1',
    eventTitle: 'Remember Fest 2026: The Nostalgic Sound',
    ticketTypeName: 'One Day Pass Regular',
    buyerName: 'Ahmad Fauzi',
    staffName: 'Rian Verifikator Lapangan',
    timestamp: '2026-09-02T16:45:00Z',
    status: 'success',
  }
];

// Helper to safely access and seed localStorage
function getFromStorage(key, initialFallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initialFallback));
      return initialFallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return initialFallback;
  }
}

function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Reset all to default
  resetData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(INITIAL_CHECKIN_LOGS));
  },

  // USERS & AUTH
  getUsers() {
    return getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  saveUsers(users) {
    setToStorage(STORAGE_KEYS.USERS, users);
  },

  getCurrentUser() {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user) {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  registerEO(data) {
    const users = this.getUsers();
    const newUser = {
      id: `usr-eo-${Date.now()}`,
      name: data.name,
      organization: data.organization,
      email: data.email,
      password: data.password,
      role: 'eo',
      phone: data.phone,
      description: data.description || '',
      status: 'pending', // Requires admin approval
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  },

  addStaff(eoId, staffData) {
    const users = this.getUsers();
    const newStaff = {
      id: `usr-staff-${Date.now()}`,
      name: staffData.name,
      email: staffData.email,
      password: staffData.password || 'staff123',
      role: 'staff',
      phone: staffData.phone || '',
      eoId: eoId,
      assignedEventIds: staffData.assignedEventIds || [],
      createdAt: new Date().toISOString(),
    };
    users.push(newStaff);
    this.saveUsers(users);
    return newStaff;
  },

  updateUserStatus(userId, status) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].status = status;
      this.saveUsers(users);
      return users[index];
    }
    return null;
  },

  // EVENTS
  getEvents() {
    return getFromStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  getPublishedEvents() {
    return this.getEvents().filter(e => e.status === 'published');
  },

  getEventById(id) {
    return this.getEvents().find(e => e.id === id);
  },

  getEventBySlug(slug) {
    return this.getEvents().find(e => e.slug === slug);
  },

  saveEvents(events) {
    setToStorage(STORAGE_KEYS.EVENTS, events);
  },

  createEvent(eventData, eoUser) {
    const events = this.getEvents();
    const slug = (eventData.title || 'event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const newEvent = {
      ...eventData,
      id: `ev-${Date.now()}`,
      eoId: eoUser.id,
      eoName: eoUser.organization || eoUser.name,
      slug: slug,
      status: 'pending_review', // Submitted for admin approval
      createdAt: new Date().toISOString(),
      ticketTypes: (eventData.ticketTypes || []).map((tt, idx) => ({
        ...tt,
        id: `tt-${Date.now()}-${idx}`,
        sold: 0,
        quota: Number(tt.quota),
        price: Number(tt.price),
      }))
    };

    events.unshift(newEvent);
    this.saveEvents(events);
    return newEvent;
  },

  updateEvent(id, updates) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveEvents(events);
      return events[index];
    }
    return null;
  },

  updateEventStatus(id, status, notes = '') {
    return this.updateEvent(id, { status, adminNotes: notes });
  },

  // ORDERS & GUEST CHECKOUT
  getOrders() {
    return getFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  saveOrders(orders) {
    setToStorage(STORAGE_KEYS.ORDERS, orders);
  },

  createOrder({ event, items, buyer, paymentMethod }) {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === event.id);
    if (eventIndex === -1) throw new Error('Event tidak ditemukan');

    // Reduce ticket quota atomically
    const currentEvent = events[eventIndex];
    items.forEach(item => {
      const tt = currentEvent.ticketTypes.find(t => t.id === item.ticketTypeId);
      if (!tt) throw new Error(`Jenis tiket ${item.ticketName} tidak valid`);
      if (tt.sold + item.quantity > tt.quota) {
        throw new Error(`Sisa kuota untuk tiket "${tt.name}" tidak mencukupi`);
      }
      tt.sold += item.quantity;
    });
    this.saveEvents(events);

    const orderNumber = `GF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalAmount = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    const ticketCodes = [];
    const newTickets = [];
    const allTickets = this.getTickets();

    items.forEach((item, itemIdx) => {
      for (let q = 0; q < item.quantity; q++) {
        const ticketCode = `GF-TIX-${orderNumber.slice(-5)}-${itemIdx + 1}${String.fromCharCode(65 + q)}`;
        ticketCodes.push(ticketCode);

        newTickets.push({
          id: `tix-${Date.now()}-${itemIdx}-${q}`,
          ticketCode,
          orderNumber,
          eventId: event.id,
          eventTitle: event.title,
          eventLocation: event.location,
          eventDate: event.date,
          ticketTypeName: item.ticketName,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          buyerPhone: buyer.phone,
          price: item.price,
          status: 'unused',
          usedAt: null,
          usedByStaffName: null,
          createdAt: new Date().toISOString(),
        });
      }
    });

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      totalAmount,
      paymentMethod,
      paymentStatus: 'paid', // Instant confirmation in sandbox
      paidAt: new Date().toISOString(),
      items,
      ticketCodes,
      tickets: newTickets,
      createdAt: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    allTickets.unshift(...newTickets);
    this.saveTickets(allTickets);

    return newOrder;
  },

  // Resolve the full ticket list of an order. Newly created orders embed
  // `tickets`, while seeded/legacy orders only carry `ticketCodes`.
  getOrderTickets(order) {
    if (!order) return [];
    if (order.tickets?.length) return order.tickets;

    const allTickets = this.getTickets();
    const firstItem = order.items?.[0];

    return (order.ticketCodes || []).map((code) => {
      const found = allTickets.find((t) => t.ticketCode === code);
      return {
        id: `tixref-${code}`,
        ticketCode: code,
        orderNumber: order.orderNumber,
        eventId: order.eventId,
        eventTitle: order.eventTitle,
        eventLocation: order.eventLocation,
        eventDate: order.eventDate,
        ticketTypeName: found?.ticketTypeName || firstItem?.ticketName || 'Tiket',
        buyerName: order.buyerName,
        price: found?.price ?? firstItem?.price ?? 0,
        status: found?.status || 'unused',
        usedAt: found?.usedAt || null,
        usedByStaffName: found?.usedByStaffName || null,
        createdAt: found?.createdAt || order.createdAt,
      };
    });
  },

  // TICKETS & QR CHECK-IN
  getTickets() {
    return getFromStorage(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  },

  saveTickets(tickets) {
    setToStorage(STORAGE_KEYS.TICKETS, tickets);
  },

  getCheckinLogs() {
    return getFromStorage(STORAGE_KEYS.CHECKIN_LOGS, INITIAL_CHECKIN_LOGS);
  },

  saveCheckinLogs(logs) {
    setToStorage(STORAGE_KEYS.CHECKIN_LOGS, logs);
  },

  validateAndCheckinTicket(ticketCode, staffUser) {
    const tickets = this.getTickets();
    const cleanCode = (ticketCode || '').trim().toUpperCase();
    const ticket = tickets.find(t => t.ticketCode.toUpperCase() === cleanCode);

    if (!ticket) {
      return {
        success: false,
        status: 'not_found',
        message: `Tiket dengan kode "${cleanCode}" tidak ditemukan di sistem.`,
      };
    }

    // Check if staff has authorization for this event
    if (staffUser?.assignedEventIds && !staffUser.assignedEventIds.includes(ticket.eventId)) {
      return {
        success: false,
        status: 'unauthorized_event',
        ticket,
        message: `Tiket terdaftar untuk event "${ticket.eventTitle}", namun Anda tidak ditugaskan di event ini.`,
      };
    }

    if (ticket.status === 'used') {
      return {
        success: false,
        status: 'already_used',
        ticket,
        message: `PERINGATAN: Tiket sudah digunakan pada ${new Date(ticket.usedAt).toLocaleString('id-ID')} oleh staf ${ticket.usedByStaffName || '-'}.`,
      };
    }

    // Mark as used
    const now = new Date().toISOString();
    ticket.status = 'used';
    ticket.usedAt = now;
    ticket.usedByStaffName = staffUser?.name || 'Staff Lapangan';
    this.saveTickets(tickets);

    // Record check-in log
    const logs = this.getCheckinLogs();
    const newLog = {
      id: `chk-${Date.now()}`,
      ticketCode: ticket.ticketCode,
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      ticketTypeName: ticket.ticketTypeName,
      buyerName: ticket.buyerName,
      staffName: ticket.usedByStaffName,
      timestamp: now,
      status: 'success',
    };
    logs.unshift(newLog);
    this.saveCheckinLogs(logs);

    return {
      success: true,
      status: 'valid',
      ticket,
      message: 'Tiket VALID! Silakan persilakan pengunjung masuk.',
    };
  }
};
